### Synapse — Cloud Project Management System

Synapse is a cloud-based project management platform designed specifically for coordinating student teams. It provides a streamlined workspace to visualize workflows and manage tasks efficiently using the Kanban methodology.
🚀 Key Features

    Interactive Kanban Board: A dynamic interface where tasks are represented as cards and moved through different lifecycle stages.

    Deadline Management: Built-in operational control to track and meet project deadlines.

    Responsive Design: A UI optimized for both desktop and mobile devices to ensure accessibility anywhere.

    Notification System: Integrated module for real-time team updates and task tracking.

    Zero-Config Deployment: The system works "out of the box" via a dedicated cloud URL.

🛠 Tech Stack
Backend

    FastAPI: High-performance asynchronous Python framework used for the server-side API.

    Pydantic: Used for strict data validation and type control of task parameters.

    PostgreSQL: Reliable relational database for storing project data and task statuses.

Frontend

    React: Modern library for building a high-performance, interactive user interface.

    TypeScript: Ensures type safety across all UI components, reducing logical errors during state management.

DevOps & Deployment

    GitHub: Centralized version control for code synchronization and collaboration.

    Railway: Cloud platform hosting the application with automated CI/CD pipelines.

🏗 Architecture & DevOps

The project follows a modern decoupled architecture:

    Server API: Focused on reliable data transmission, routing logic into separate endpoints for cards and statuses.

    Frontend Client: Implements the Kanban logic and responsive UI.

    CI/CD Pipeline: Integration between GitHub and Railway ensures that every push to the main repository triggers an automatic build and deployment.

💻 Getting Started
Prerequisites

    Python 3.9+

    Node.js & npm

    PostgreSQL instance

Installation

    Clone the repository:
    Bash

    git clone https://github.com/yam1kage/Synapse_fullproject.git

    Backend Setup:
    Bash

    cd backend
    pip install -r requirements.txt
    uvicorn main:app --reload

    Frontend Setup:
    Bash

    cd frontend
    npm install
    npm start
