# Quad Pulse EMS - User Portal

**Quad Pulse EMS** is a user-friendly, employee management system designed to handle essential HR functions within IT companies. This project consists of three major modules:

- **User Portal (Frontend)**: Developed using **React**, **Reactstrap**, and **Material-UI (MUI)**.
- **Backend**: The server-side logic powered by **Laravel**.
- **Admin Portal**: The admin interface for managing employees, tasks, attendance, and more.

This README focuses on setting up and using the **User Portal** frontend.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation](#installation)
5. [API Documentation](#api-documentation)
6. [Frontend Project Structure](#frontend-project-structure)
7. [Usage](#usage)
8. [Contributing](#contributing)
9. [License](#license)

---

## Project Overview

Quad Pulse EMS is designed to simplify employee management for IT companies. The **User Portal** enables employees to interact with essential features like:

- **Attendance Management**: Employees can clock in/out and track their attendance.
- **Leave Management**: Employees can request leaves and check their approval status.
- **Task Management**: Employees can view their assigned tasks and update task statuses.
- **Salary Management**: Employees can view their salary details and download salary slips.

The **User Portal** is developed using **React**, **Reactstrap**, and **Material-UI (MUI)** to provide a seamless and responsive user experience.

---

## Features

- **Login/Logout**: Employees can securely log in to the portal.
- **Dashboard**: Overview of attendance, tasks, and leave balances.
- **Attendance**: Track daily attendance, view clock-in/clock-out times.
- **Leave Requests**: Apply for leave, view leave history, and check approval status.
- **Tasks**: View assigned tasks, mark tasks as completed, and track deadlines.
- **Salary Details**: View salary details, download salary slips.
- **Notifications**: Receive notifications for task assignments, leave approvals, etc.

---

## Tech Stack

- **Frontend**: React, Reactstrap, Material-UI (MUI), Axios, React Router
- **Backend**: Laravel (PHP)
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens) for secure API communication

---

## Installation

To set up the **User Portal** locally, follow these steps:

### Prerequisites

- Node.js and npm
- PHP (for backend setup, if you want to set up the complete system)
- MySQL or MariaDB (for backend database)

### Steps to Run the Project

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/quadcode-shivam/quad-pulse-ems-frontend.git
    ```

2. **Navigate to the frontend directory:**

    ```bash
    cd quad-pulse-ems-frontend
    ```

3. **Install the required npm packages:**

    ```bash
    npm install
    ```

4. **Start the React development server:**

    ```bash
    npm start
    ```

    This will start the frontend on `http://localhost:3000`.

---

## API Documentation

The **User Portal** communicates with the backend via RESTful APIs. Below are the main API endpoints the frontend interacts with.

### Authentication

- **POST** `/api/login`: Logs in a user and returns a JWT token.
- **POST** `/api/register`: Registers a new employee (for demo purposes, this endpoint may not be used in the portal).

### Attendance Management

- **GET** `/api/attendance`: Fetches the attendance records for the logged-in employee.
- **POST** `/api/attendance`: Marks the employee’s attendance (clock-in).
- **PUT** `/api/attendance/{id}`: Updates the attendance status (clock-out).

### Leave Management

- **GET** `/api/leaves`: Fetches the employee’s leave records.
- **POST** `/api/leaves`: Submits a new leave request.
- **PUT** `/api/leaves/{id}`: Updates leave request status (approved/rejected).

### Task Management

- **GET** `/api/tasks`: Retrieves all tasks assigned to the logged-in employee.
- **POST** `/api/tasks`: Marks a task as completed or updates its status.

### Salary Management

- **GET** `/api/salaries`: Retrieves the employee's salary details and past salary slips.

---

## Frontend Project Structure

The **frontend** project is organized as follows:


### Key Folders

- **/components**: Contains reusable components like buttons, forms, modals, etc.
- **/pages**: Contains the different page views like the Dashboard, Attendance, Leave Requests, etc.
- **/services**: Contains functions to call backend APIs using Axios.

---

## Usage

Once the **frontend** is set up, employees can:

1. **Log in**: Use valid credentials to access the portal.
2. **Dashboard**: View the summary of attendance, leave balances, and task statuses.
3. **Attendance**: Track and mark attendance, view attendance history.
4. **Leave Management**: Apply for leave and check its approval status.
5. **Task Management**: View, update, and track assigned tasks.
6. **Salary Management**: Check and download salary details.

The application automatically syncs with the **backend** via the provided APIs.

---

## Contributing

We welcome contributions to improve **Quad Pulse EMS**. To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Implement your feature/fix.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature/your-feature`).
6. Create a pull request.

---

## License

This project does not have a formal license. Feel free to use and modify it as per your needs, but please credit the original work and contributors.

---

**Quad Pulse EMS** helps IT companies streamline employee management by offering features like attendance tracking, leave requests, task management, and salary details all in one place.
