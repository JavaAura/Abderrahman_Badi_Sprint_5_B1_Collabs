# Collabs

An efficient and customizable ToDoList application built using Angular 17, providing task and category management, real-time search, and an interactive statistics dashboard.

## Table of Contents

- [Project Overview](#project-overview)
- [Installation](#installation)
- [Structure](#structure)
- [Features](#features)
- [Technologies](#technologies)

## Project Overview

### Context
This project aims to deliver a user-friendly and responsive ToDoList application that allows an individual to efficiently manage their tasks and categories. The application integrates modern frontend development practices and is tailored to provide a seamless user experience.

### Objectives
- Enable users to create, modify, and delete tasks and categories.
- Implement real-time search for tasks based on titles or descriptions.
- Provide an intuitive statistics dashboard to track task completion and overdue statuses.
- Ensure data persistence using localStorage to retain information even after browser closure.

## Installation

### Prerequisites
- Node.js (v16 or higher)
- Angular CLI (v17)

### Steps

1. **Clone the repository:**
   ```bash
   git clone git@github.com:Yorften/Collabs.git
   cd collabs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the application:**
   ```bash
   ng build
   ```

4. **Run the application:**
   ```bash
   ng serve
   ```
   The application will be available at `http://localhost:4200`.

## Structure

The project follows a modular and component-based architecture:

```
project-folder/
|-- src/
    |-- app/
    |   |-- components/
    |   |   |-- task-card/      // Task listing and management
    |   |   |-- task-container/      // Tasks container
    |   |   |-- search-bar/  // Search bar component
    |   |   |-- forms/      // Statistics dashboard
    |   |   |   |-- category-form/      // Form for adding/editing categories
    |   |   |   |-- task-form/      // Form for adding/editing tasks
    |   |   |-- statistics/      // Statistics dashboard
    |   |   |-- statistics/      // Statistics dashboard
    |   |-- services/
    |   |   |-- task.service.ts // Manages task-related operations
    |   |   |-- category.service.ts // Handles category operations
    |   |   |-- notofication.service.ts // Handles notification operations
    |   |   |-- task-popup.service.ts // Handles task form popup globally for creationg and editing (details) operations
    |   |-- shared/
    |   |   |-- navbar.component.ts 
    |   |   |-- footer.component.ts
    |   |-- models/
    |       |-- category.model.ts // Category interface
    |       |-- task.model.ts // Task interface
    |-- assets/
    |-- styles.css
```

## Features

- **Task Management**:
  - Add, modify, and delete tasks with detailed information:
    - Title (validated for maximum length)
    - Optional description (validated for maximum length)
    - Due date and time (validated to prevent past dates)
    - Priority levels (High, Medium, Low)
    - Completion status (Not Started, In Progress, Completed)

- **Category Management**:
  - Create custom categories.
  - Prevent duplicate category names.

- **Real-Time Search**:
  - Search tasks dynamically by title or description.

- **Statistics Dashboard**:
  - Percentage of tasks completed vs. not completed.
  - Count of overdue tasks.
  - Interactive charts using Chart.js.

- **Responsive Design**:
  - Adapted for both desktop and mobile devices using TailwindCSS.

- **Data Persistence**:
  - Store tasks and categories in `localStorage` as JSON.

## Technologies

- **Framework**: Angular 17
- **Styling**: CSS, TailwindCSS
- **Charts**: Chart.js
- **Data Storage**: localStorage
- **Development Tools**:
  - Node.js
  - Angular CLI
