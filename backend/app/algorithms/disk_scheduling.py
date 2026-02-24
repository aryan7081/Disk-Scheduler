"""
Disk Scheduling Algorithms Implementation
Implements various disk scheduling algorithms for efficient disk I/O operations.
"""

from typing import List, Tuple, Optional
from copy import deepcopy


class DiskScheduler:
    """Main class for disk scheduling algorithms"""
    
    def __init__(self, requests: List[int], initial_position: int, disk_size: int = 200):
        """
        Initialize the disk scheduler
        
        Args:
            requests: List of track requests
            initial_position: Initial head position
            disk_size: Total number of tracks on the disk
        """
        self.requests = deepcopy(requests)
        self.initial_position = initial_position
        self.disk_size = disk_size
        self.validate_requests()
    
    def validate_requests(self):
        """Validate that all requests are within disk bounds"""
        for req in self.requests:
            if req < 0 or req >= self.disk_size:
                raise ValueError(f"Request {req} is out of bounds (0-{self.disk_size-1})")
    
    def calculate_seek_time(self, sequence: List[int]) -> Tuple[int, List[Tuple[int, int]]]:
        """
        Calculate total seek time and individual seek operations
        
        Args:
            sequence: Sequence of track accesses
            
        Returns:
            Tuple of (total_seek_time, list of (from, to) operations)
        """
        if not sequence:
            return 0, []
        
        seek_operations = []
        total_seek_time = 0
        current = self.initial_position
        
        for track in sequence:
            seek_distance = abs(track - current)
            seek_operations.append((current, track))
            total_seek_time += seek_distance
            current = track
        
        return total_seek_time, seek_operations
    
    def fcfs(self) -> Tuple[List[int], int, List[Tuple[int, int]]]:
        """
        First Come First Served (FCFS) Algorithm
        Services requests in the order they arrive.
        
        Returns:
            Tuple of (sequence, total_seek_time, seek_operations)
        """
        sequence = self.requests.copy()
        total_seek_time, seek_operations = self.calculate_seek_time(sequence)
        return sequence, total_seek_time, seek_operations
    
    def sstf(self) -> Tuple[List[int], int, List[Tuple[int, int]]]:
        """
        Shortest Seek Time First (SSTF) Algorithm
        Always services the request closest to the current head position.
        
        Returns:
            Tuple of (sequence, total_seek_time, seek_operations)
        """
        sequence = []
        remaining_requests = self.requests.copy()
        current_position = self.initial_position
        
        while remaining_requests:
            # Find the closest request
            closest = min(remaining_requests, key=lambda x: abs(x - current_position))
            sequence.append(closest)
            remaining_requests.remove(closest)
            current_position = closest
        
        total_seek_time, seek_operations = self.calculate_seek_time(sequence)
        return sequence, total_seek_time, seek_operations
    
    def scan(self, direction: str = "right") -> Tuple[List[int], int, List[Tuple[int, int]]]:
        """
        SCAN Algorithm (Elevator Algorithm)
        Moves the head in one direction until the end, then reverses.
        """
        sequence = []
        remaining_requests = sorted(self.requests.copy())
        current_position = self.initial_position
        going_right = direction.lower() == "right"
        
        if going_right:
            right_side = [r for r in remaining_requests if r >= current_position]
            left_side = [r for r in remaining_requests if r < current_position]
            sequence.extend(sorted(right_side))
            if left_side:
                sequence.append(self.disk_size - 1)
                sequence.extend(sorted(left_side, reverse=True))
        else:
            left_side = [r for r in remaining_requests if r <= current_position]
            right_side = [r for r in remaining_requests if r > current_position]
            sequence.extend(sorted(left_side, reverse=True))
            if right_side:
                sequence.append(0)
                sequence.extend(sorted(right_side))
        
        total_seek_time, seek_operations = self.calculate_seek_time(sequence)
        return sequence, total_seek_time, seek_operations
    
    def c_scan(self, direction: str = "right") -> Tuple[List[int], int, List[Tuple[int, int]]]:
        """
        C-SCAN Algorithm (Circular SCAN)
        Moves the head in one direction until the end, then jumps to the beginning.
        """
        sequence = []
        remaining_requests = sorted(self.requests.copy())
        current_position = self.initial_position
        going_right = direction.lower() == "right"
        
        if going_right:
            right_side = [r for r in remaining_requests if r >= current_position]
            left_side = [r for r in remaining_requests if r < current_position]
            sequence.extend(sorted(right_side))
            if left_side:
                sequence.append(self.disk_size - 1)
                sequence.append(0)
                sequence.extend(sorted(left_side))
        else:
            left_side = [r for r in remaining_requests if r <= current_position]
            right_side = [r for r in remaining_requests if r > current_position]
            sequence.extend(sorted(left_side, reverse=True))
            if right_side:
                sequence.append(0)
                sequence.append(self.disk_size - 1)
                sequence.extend(sorted(right_side, reverse=True))
        
        total_seek_time, seek_operations = self.calculate_seek_time(sequence)
        return sequence, total_seek_time, seek_operations
    
    def look(self, direction: str = "right") -> Tuple[List[int], int, List[Tuple[int, int]]]:
        """
        LOOK Algorithm - like SCAN but only to last request in direction.
        """
        sequence = []
        remaining_requests = sorted(self.requests.copy())
        current_position = self.initial_position
        going_right = direction.lower() == "right"
        
        if not remaining_requests:
            return sequence, 0, []
        
        if going_right:
            right_side = [r for r in remaining_requests if r >= current_position]
            left_side = [r for r in remaining_requests if r < current_position]
            sequence.extend(sorted(right_side))
            if left_side:
                sequence.extend(sorted(left_side, reverse=True))
        else:
            left_side = [r for r in remaining_requests if r <= current_position]
            right_side = [r for r in remaining_requests if r > current_position]
            sequence.extend(sorted(left_side, reverse=True))
            if right_side:
                sequence.extend(sorted(right_side))
        
        total_seek_time, seek_operations = self.calculate_seek_time(sequence)
        return sequence, total_seek_time, seek_operations
    
    def c_look(self, direction: str = "right") -> Tuple[List[int], int, List[Tuple[int, int]]]:
        """
        C-LOOK Algorithm - like C-SCAN but only to last request.
        """
        sequence = []
        remaining_requests = sorted(self.requests.copy())
        current_position = self.initial_position
        going_right = direction.lower() == "right"
        
        if not remaining_requests:
            return sequence, 0, []
        
        if going_right:
            right_side = [r for r in remaining_requests if r >= current_position]
            left_side = [r for r in remaining_requests if r < current_position]
            sequence.extend(sorted(right_side))
            if left_side:
                sequence.extend(sorted(left_side))
        else:
            left_side = [r for r in remaining_requests if r <= current_position]
            right_side = [r for r in remaining_requests if r > current_position]
            sequence.extend(sorted(left_side, reverse=True))
            if right_side:
                sequence.extend(sorted(right_side, reverse=True))
        
        total_seek_time, seek_operations = self.calculate_seek_time(sequence)
        return sequence, total_seek_time, seek_operations

    def n_step_scan(self, n: int, direction: str = "right") -> Tuple[List[int], int, List[Tuple[int, int]]]:
        """
        N-Step SCAN Algorithm.
        Splits requests into segments of size N and processes each segment with SCAN.
        New requests (in next segment) are not serviced until the current segment is done.
        """
        if n < 1:
            raise ValueError("N must be at least 1")
        reqs = self.requests.copy()
        if not reqs:
            return [], 0, []
        full_sequence = []
        current_position = self.initial_position
        going_right = direction.lower() == "right"
        total_seek_time = 0
        all_seek_ops = []
        for i in range(0, len(reqs), n):
            batch = reqs[i : i + n]
            scheduler = DiskScheduler(batch, current_position, self.disk_size)
            seq, seek_time, seek_ops = scheduler.scan("right" if going_right else "left")
            full_sequence.extend(seq)
            total_seek_time += seek_time
            all_seek_ops.extend(seek_ops)
            if seq:
                current_position = seq[-1]
            going_right = not going_right  # alternate direction for next batch (common variant)
        return full_sequence, total_seek_time, all_seek_ops

    def fscan(self, direction: str = "right") -> Tuple[List[int], int, List[Tuple[int, int]]]:
        """
        FSCAN Algorithm.
        Uses two queues: while one queue is serviced with SCAN, new requests go to the other.
        For static input we split requests into two queues (first half / second half) and
        service queue 1 with SCAN, then queue 2 with SCAN from where we left off.
        """
        reqs = self.requests.copy()
        if not reqs:
            return [], 0, []
        mid = (len(reqs) + 1) // 2
        queue1, queue2 = reqs[:mid], reqs[mid:]
        full_sequence = []
        current_position = self.initial_position
        total_seek_time = 0
        all_seek_ops = []
        for batch in (queue1, queue2):
            if not batch:
                continue
            scheduler = DiskScheduler(batch, current_position, self.disk_size)
            seq, seek_time, seek_ops = scheduler.scan(direction)
            full_sequence.extend(seq)
            total_seek_time += seek_time
            all_seek_ops.extend(seek_ops)
            if seq:
                current_position = seq[-1]
        return full_sequence, total_seek_time, all_seek_ops

    def simulate(self, algorithm: str, direction: str = "right", n_step: Optional[int] = None) -> dict:
        """
        Run simulation for a specific algorithm

        Args:
            algorithm: Algorithm name (FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK, N-STEP SCAN, FSCAN)
            direction: Initial direction for directional algorithms
            n_step: Batch size for N-Step SCAN (required when algorithm is N-STEP SCAN)

        Returns:
            Dictionary with simulation results
        """
        algorithm_upper = algorithm.upper().strip()
        # Normalize display name for N-Step SCAN
        if algorithm_upper == "N-STEP SCAN" or algorithm_upper == "NSTEP SCAN":
            algorithm_upper = "N-STEP SCAN"
        if algorithm_upper == "FSCAN":
            pass  # keep as FSCAN

        if algorithm_upper == "FCFS":
            sequence, total_seek_time, seek_operations = self.fcfs()
        elif algorithm_upper == "SSTF":
            sequence, total_seek_time, seek_operations = self.sstf()
        elif algorithm_upper == "SCAN":
            sequence, total_seek_time, seek_operations = self.scan(direction)
        elif algorithm_upper in ("C-SCAN", "CSCAN"):
            sequence, total_seek_time, seek_operations = self.c_scan(direction)
        elif algorithm_upper == "LOOK":
            sequence, total_seek_time, seek_operations = self.look(direction)
        elif algorithm_upper in ("C-LOOK", "CLOOK"):
            sequence, total_seek_time, seek_operations = self.c_look(direction)
        elif algorithm_upper == "N-STEP SCAN":
            n = n_step if n_step is not None and n_step >= 1 else 4
            sequence, total_seek_time, seek_operations = self.n_step_scan(n, direction)
        elif algorithm_upper == "FSCAN":
            sequence, total_seek_time, seek_operations = self.fscan(direction)
        else:
            raise ValueError(f"Unknown algorithm: {algorithm}")
        
        average_seek_time = total_seek_time / len(sequence) if sequence else 0

        return {
            "algorithm": algorithm_upper,
            "sequence": sequence,
            "total_seek_time": total_seek_time,
            "average_seek_time": round(average_seek_time, 2),
            "seek_operations": seek_operations,
            "total_requests": len(self.requests),
            "initial_position": self.initial_position
        }
