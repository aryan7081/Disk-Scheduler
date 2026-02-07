"""
Django REST Framework views for Disk Scheduling Algorithm Simulator API
"""

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from app.algorithms.disk_scheduling import DiskScheduler
from typing import List


def _calculate_fairness_index(seek_operations: List[tuple]) -> float:
    """Calculate fairness index based on variance of seek distances"""
    if not seek_operations:
        return 0.0
    
    seek_distances = [abs(to - from_pos) for from_pos, to in seek_operations]
    if not seek_distances:
        return 0.0
    
    mean = sum(seek_distances) / len(seek_distances)
    if mean == 0:
        return 1.0
    
    variance = sum((d - mean) ** 2 for d in seek_distances) / len(seek_distances)
    std_dev = variance ** 0.5
    
    # Fairness index: lower variance = higher fairness
    # Normalize to 0-1 scale
    fairness = max(0, 1 - (std_dev / mean)) if mean > 0 else 1.0
    return round(fairness, 2)


@api_view(['GET'])
def root(request):
    """Root endpoint"""
    return Response({
        "message": "Disk Scheduling Algorithm Simulator API",
        "version": "1.0.0",
        "endpoints": {
            "simulate": "/api/simulate",
            "compare": "/api/compare",
            "algorithms": "/api/algorithms"
        }
    })


@api_view(['GET'])
def get_algorithms(request):
    """Get list of available algorithms"""
    return Response({
        "algorithms": [
            {
                "name": "FCFS",
                "full_name": "First Come First Served",
                "description": "Services requests in the order they arrive",
                "requires_direction": False
            },
            {
                "name": "SSTF",
                "full_name": "Shortest Seek Time First",
                "description": "Always services the request closest to the current head position",
                "requires_direction": False
            },
            {
                "name": "SCAN",
                "full_name": "SCAN (Elevator Algorithm)",
                "description": "Moves the head in one direction until the end, then reverses",
                "requires_direction": True
            },
            {
                "name": "C-SCAN",
                "full_name": "Circular SCAN",
                "description": "Moves the head in one direction until the end, then jumps to the beginning",
                "requires_direction": True
            },
            {
                "name": "LOOK",
                "full_name": "LOOK Algorithm",
                "description": "Similar to SCAN but only goes to the last request in that direction",
                "requires_direction": True
            },
            {
                "name": "C-LOOK",
                "full_name": "Circular LOOK",
                "description": "Similar to C-SCAN but only goes to the last request",
                "requires_direction": True
            }
        ]
    })


@api_view(['POST'])
def simulate(request):
    try:
        requests_list = request.data.get('requests', [])
        initial_position = request.data.get('initial_position')
        algorithm = request.data.get('algorithm')
        disk_size = request.data.get('disk_size', 200)
        direction = request.data.get('direction', 'right')
        
        # Validate required fields
        if not requests_list:
            return Response(
                {"detail": "requests field is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if initial_position is None:
            return Response(
                {"detail": "initial_position field is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not algorithm:
            return Response(
                {"detail": "algorithm field is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate algorithm
        valid_algorithms = ["FCFS", "SSTF", "SCAN", "C-SCAN", "LOOK", "C-LOOK"]
        if algorithm.upper() not in valid_algorithms:
            return Response(
                {"detail": f"Unknown algorithm '{algorithm}'. Available: {', '.join(valid_algorithms)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        scheduler = DiskScheduler(
            requests=requests_list,
            initial_position=initial_position,
            disk_size=disk_size
        )
        
        result = scheduler.simulate(
            algorithm=algorithm,
            direction=direction
        )
        
        # Calculate additional performance metrics
        performance_metrics = {
            "efficiency": round((1 - result["total_seek_time"] / (disk_size * len(requests_list))) * 100, 2) if requests_list else 0,
            "throughput": round(len(requests_list) / result["total_seek_time"] * 100, 2) if result["total_seek_time"] > 0 else 0,
            "fairness_index": _calculate_fairness_index(result["seek_operations"]),
            "max_seek_distance": max([abs(to - from_pos) for from_pos, to in result["seek_operations"]], default=0)
        }
        
        response_data = {
            "request": {
                "requests": requests_list,
                "initial_position": initial_position,
                "algorithm": algorithm,
                "disk_size": disk_size,
                "direction": direction
            },
            "result": {
                "algorithm": result["algorithm"],
                "sequence": result["sequence"],
                "total_seek_time": result["total_seek_time"],
                "average_seek_time": result["average_seek_time"],
                "seek_operations": result["seek_operations"]
            },
            "performance_metrics": performance_metrics
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
    
    except ValueError as e:
        return Response(
            {"detail": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"detail": f"Internal server error: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def compare_algorithms(request):
    """
    Compare all algorithms for the given request set
    
    Expected JSON body:
    {
        "requests": [98, 183, 37, 122],
        "initial_position": 53,
        "disk_size": 200,
        "direction": "right"
    }
    """
    try:
        requests_list = request.data.get('requests', [])
        initial_position = request.data.get('initial_position')
        disk_size = request.data.get('disk_size', 200)
        direction = request.data.get('direction', 'right')
        
        # Validate required fields
        if not requests_list:
            return Response(
                {"detail": "requests field is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if initial_position is None:
            return Response(
                {"detail": "initial_position field is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        scheduler = DiskScheduler(
            requests=requests_list,
            initial_position=initial_position,
            disk_size=disk_size
        )
        
        algorithms = ["FCFS", "SSTF", "SCAN", "C-SCAN", "LOOK", "C-LOOK"]
        results = []
        
        for algo in algorithms:
            try:
                result = scheduler.simulate(
                    algorithm=algo,
                    direction=direction
                )
                results.append(result)
            except Exception as e:
                results.append({
                    "algorithm": algo,
                    "error": str(e)
                })
        
        # Sort by total seek time to find the best algorithm
        valid_results = [r for r in results if "error" not in r]
        if valid_results:
            best_algorithm = min(valid_results, key=lambda x: x["total_seek_time"])
        else:
            best_algorithm = None
        
        response_data = {
            "request": {
                "requests": requests_list,
                "initial_position": initial_position,
                "disk_size": disk_size,
                "direction": direction
            },
            "results": results,
            "best_algorithm": best_algorithm["algorithm"] if best_algorithm else None,
            "comparison": {
                "best_total_seek_time": best_algorithm["total_seek_time"] if best_algorithm else None,
                "worst_total_seek_time": max([r["total_seek_time"] for r in valid_results], default=None),
                "average_total_seek_time": sum([r["total_seek_time"] for r in valid_results]) / len(valid_results) if valid_results else None
            }
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
    
    except ValueError as e:
        return Response(
            {"detail": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"detail": f"Internal server error: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
