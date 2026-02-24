<!-- IEEE-style report -->

<div align="center">

**Disk Scheduling Algorithm Simulator**

Gangadhar Yadav, Samyak Mittal, Ayush Dev

*Rishihood University, Delhi NCR, India*

*Course: Operating Systems | Project: Disk Management*

*February 2026*

</div>

---

**Abstract—** This project implements a Disk Scheduling Algorithm Simulator to demonstrate how an operating system schedules disk I/O requests to minimize seek time and improve performance. The system includes eight algorithms—FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK, N-Step SCAN, and FSCAN—with a web-based interface for input, simulation, and comparison. The backend is built with Django (Python), and the frontend with React, including charts for head movement, seek distance, and performance comparison.

**Index Terms—** Disk scheduling, FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK, N-Step SCAN, FSCAN, seek time, operating systems, I/O management.

---

## I. INTRODUCTION

In a multi-process environment, several processes may request disk access at the same time. The operating system must decide the order in which to serve these requests. Disk scheduling is the technique used to order and service these requests so that total head movement (seek time) is reduced and throughput is improved [1].

The motivation for this project is to understand how the OS manages disk I/O, to compare different scheduling policies (fairness vs. performance), and to visualize head movement and seek time for each algorithm. The scope includes implementing eight disk scheduling algorithms (FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK, N-Step SCAN, FSCAN), providing a web UI to enter requests and parameters, and visualizing sequence, seek distance, and comparison of all algorithms.

## II. PROBLEM STATEMENT AND OBJECTIVES

### A. Problem Statement

Design and implement a simulator that: (1) accepts a list of track requests and initial head position, (2) simulates FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK, N-Step SCAN, and FSCAN, (3) computes total seek time, average seek time, and other metrics, and (4) allows comparison of all algorithms and highlights the best one for the given input.

### B. Objectives

The objectives are to implement the eight disk scheduling algorithms correctly, to build a REST API for simulation and comparison, to create an interactive frontend with charts and result tables, and to compare algorithms and interpret results (fairness, starvation, performance).

## III. METHODOLOGY AND SYSTEM DESIGN

### A. Architecture

The system uses a two-tier architecture. The backend is implemented with Django and Django REST Framework (Python); it handles request validation, runs the chosen algorithm, and returns sequence and metrics. The frontend is implemented with React and provides an input form, charts (Recharts), and results and comparison panels. Communication is via REST API (JSON); the frontend calls `/api/simulate/` and `/api/compare/` [2], [3].

### B. Algorithms Implemented

| Algorithm | Description |
|-----------|-------------|
| FCFS | First Come First Served – requests served in arrival order. |
| SSTF | Shortest Seek Time First – always serves the closest request. |
| SCAN | Head moves to one end of the disk, then reverses (elevator). |
| C-SCAN | Like SCAN but jumps from end to start (circular). |
| LOOK | Like SCAN but only up to the last request in that direction. |
| C-LOOK | Like C-SCAN but only up to the last request, then jump. |
| N-Step SCAN | Splits requests into batches of N; each batch is serviced with SCAN. |
| FSCAN | Two queues: one is serviced with SCAN while the other collects new requests (simulated as two batches). |

### C. Technology Stack

Backend: Python, Django 4.2, Django REST Framework. Frontend: React 18, Recharts. API: REST (JSON).

## IV. IMPLEMENTATION DETAILS

### A. Backend

The project structure includes the Django project `disk_scheduler`, the app `api`, and the module `app.algorithms` for scheduling logic. Endpoints include GET `/api/`, GET `/api/algorithms/`, POST `/api/simulate/`, and POST `/api/compare/`. Input parameters are: requests (list of track numbers), initial_position, algorithm, disk_size, direction (for SCAN, C-SCAN, LOOK, C-LOOK, N-Step SCAN, FSCAN), and n_step (batch size for N-Step SCAN).

### B. Frontend

Components include Header, InputPanel (requests, position, algorithm, direction, n_step for N-Step SCAN), VisualizationPanel (head movement, seek distance, track pattern), ResultsPanel (sequence, metrics), and ComparisonPanel (bar charts, best algorithm). Features include preset examples and env-based API URL.

### C. Performance Metrics

The system computes total seek time (sum of seek distances), average seek time, throughput and efficiency, and identifies the best algorithm (minimum total seek time) for the given input.

## V. RESULTS AND DISCUSSION

### A. Sample Input

Requests: 98, 183, 37, 122, 14, 124, 65, 67. Initial head position: 53. Disk size: 200 tracks.

### B. Observations

FCFS is simple and fair but often gives higher total seek time. SSTF usually reduces seek time but can cause starvation for distant requests. SCAN, C-SCAN, LOOK, and C-LOOK balance performance and fairness; LOOK and C-LOOK avoid unnecessary movement to disk ends. N-Step SCAN and FSCAN reduce starvation by batching requests.

### C. Screenshots

*(Add screenshots here: input form, simulation result with charts, comparison view with bar chart and best algorithm.)*

## VI. CONCLUSION

The Disk Scheduling Algorithm Simulator successfully implements eight disk scheduling algorithms (FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK, N-Step SCAN, FSCAN) and provides a web-based interface to simulate and compare them. The project demonstrates the trade-offs between fairness (e.g., FCFS) and performance (e.g., SSTF, SCAN-family) and helps in understanding how the OS can optimize disk I/O. Future work could include more algorithms, animations, or export of results.

---

## REFERENCES

[1] A. Silberschatz, P. B. Galvin, and G. Gagne, *Operating System Concepts*, 10th ed. Hoboken, NJ, USA: Wiley, 2018.

[2] Django REST Framework. [Online]. Available: https://www.django-rest-framework.org/

[3] React. [Online]. Available: https://react.dev/

[4] Recharts. [Online]. Available: https://recharts.org/

---

## APPENDIX A
### How to Run the Project

**Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

Open http://localhost:3000 and use the UI to simulate and compare algorithms.

## APPENDIX B
### Repository

Project repository: https://github.com/aryan7081/Disk-Scheduler
