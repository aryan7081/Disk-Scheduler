# Project Report  
## Disk Scheduling Algorithm Simulator

**Course:** Operating Systems  
**Project:** Disk Management – Simulate how disks prioritize read/write operations for efficiency  

---

## 1. Title Page

**Title:** Disk Scheduling Algorithm Simulator  

**Team Members:**

| S. No. | Name              | Role / Contribution   |
|--------|-------------------|------------------------|
| 1      | Gangadhar Yadav   | Backend, Algorithms   |
| 2      | Samyak Mittal     | Frontend, UI           |
| 3      | Ayush Dev         | Integration, Testing  |

**Date:** February 2026  

**Institution:** [Your College/University Name]  

---

## 2. Abstract / Summary

This project implements a **Disk Scheduling Algorithm Simulator** to demonstrate how an operating system schedules disk I/O requests to minimize seek time and improve performance. The system includes six standard algorithms—FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK—with a web-based interface for input, simulation, and comparison. The backend is built with Django (Python), and the frontend with React, including charts for head movement, seek distance, and performance comparison.

---

## 3. Introduction

### 3.1 Background

In a multi-process environment, several processes may request disk access at the same time. The OS must decide the order in which to serve these requests. **Disk scheduling** is the technique used to order and service these requests so that total head movement (seek time) is reduced and throughput is improved.

### 3.2 Motivation

- To understand how OS manages disk I/O.
- To compare different scheduling policies (fairness vs performance).
- To visualize head movement and seek time for each algorithm.

### 3.3 Scope

- Implement six disk scheduling algorithms.
- Provide a web UI to enter requests, initial head position, and disk size.
- Support direction (left/right) for SCAN, C-SCAN, LOOK, and C-LOOK.
- Visualize sequence, seek distance, and compare all algorithms.

---

## 4. Problem Statement

Design and implement a simulator that:

1. Accepts a list of track requests and initial head position.
2. Simulates FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK.
3. Computes total seek time, average seek time, and other metrics.
4. Allows comparison of all algorithms and highlights the best one for the given input.

---

## 5. Objectives

- To implement the six disk scheduling algorithms correctly.
- To build a REST API for simulation and comparison.
- To create an interactive frontend with charts and result tables.
- To compare algorithms and interpret results (fairness, starvation, performance).

---

## 6. Methodology / System Design

### 6.1 Architecture

- **Backend:** Django + Django REST Framework (Python).  
  - Handles request validation, runs the chosen algorithm, returns sequence and metrics.
- **Frontend:** React.  
  - Input form, charts (Recharts), results and comparison panels.
- **Communication:** REST API (JSON). Frontend calls `/api/simulate/` and `/api/compare/`.

### 6.2 Algorithms Implemented

| Algorithm | Description |
|-----------|-------------|
| **FCFS** | First Come First Served – requests served in arrival order. |
| **SSTF** | Shortest Seek Time First – always serves the closest request. |
| **SCAN** | Head moves to one end of the disk, then reverses (elevator). |
| **C-SCAN** | Like SCAN but jumps from end to start (circular). |
| **LOOK** | Like SCAN but only up to the last request in that direction. |
| **C-LOOK** | Like C-SCAN but only up to the last request, then jump. |

### 6.3 Technology Stack

| Layer    | Technology        |
|----------|-------------------|
| Backend  | Python, Django 4.2, Django REST Framework |
| Frontend | React 18, Recharts |
| API      | REST (JSON)       |

---

## 7. Implementation Details

### 7.1 Backend

- **Project structure:** `backend/` – Django project `disk_scheduler`, app `api`, and module `app.algorithms` for scheduling logic.
- **Endpoints:**
  - `GET /api/` – API info  
  - `GET /api/algorithms/` – List of algorithms  
  - `POST /api/simulate/` – Run one algorithm  
  - `POST /api/compare/` – Run all six and return comparison  
- **Input:** `requests` (list of track numbers), `initial_position`, `algorithm`, `disk_size`, `direction` (for SCAN, C-SCAN, LOOK, C-LOOK).

### 7.2 Frontend

- **Components:** Header, InputPanel (requests, position, algorithm, direction), VisualizationPanel (head movement, seek distance, track pattern), ResultsPanel (sequence, metrics), ComparisonPanel (bar charts, best algorithm).
- **Features:** Preset examples, env-based API URL, responsive layout.

### 7.3 Performance Metrics

- Total seek time (sum of seek distances)
- Average seek time
- Throughput and efficiency (as defined in the backend)
- Best algorithm for the given input (minimum total seek time)

---

## 8. Results and Discussion

### 8.1 Sample Input

- **Requests:** 98, 183, 37, 122, 14, 124, 65, 67  
- **Initial head position:** 53  
- **Disk size:** 200 tracks  

### 8.2 Observations

- **FCFS** is simple and fair but often gives higher total seek time.
- **SSTF** usually reduces seek time but can cause starvation for distant requests.
- **SCAN / C-SCAN / LOOK / C-LOOK** balance performance and fairness; LOOK and C-LOOK avoid unnecessary movement to disk ends.

### 8.3 Screenshots / Output

*(Add screenshots here: input form, simulation result with charts, comparison view with bar chart and best algorithm.)*

- Screenshot 1: Input panel with sample requests and algorithm selection  
- Screenshot 2: Visualization – disk head movement and seek distance  
- Screenshot 3: Comparison of all six algorithms (bar chart and table)  

---

## 9. Conclusion

The Disk Scheduling Algorithm Simulator successfully implements six standard OS disk scheduling algorithms and provides a web-based interface to simulate and compare them. The project demonstrates the trade-offs between fairness (e.g. FCFS) and performance (e.g. SSTF, SCAN-family) and helps in understanding how the OS can optimize disk I/O. Future work could include more algorithms, animations, or export of results.

---

## 10. References

1. Silberschatz, A., Galvin, P. B., & Gagne, G. (2018). *Operating System Concepts*. Wiley.  
2. Django REST Framework. https://www.django-rest-framework.org/  
3. React. https://react.dev/  
4. Recharts. https://recharts.org/  

---

## 11. Appendix (Optional)

### A. How to Run the Project

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

### B. Repository

Project repository: [https://github.com/aryan7081/Disk-Scheduler](https://github.com/aryan7081/Disk-Scheduler)

---

*End of Report*
