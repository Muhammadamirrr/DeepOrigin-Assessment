# Project Name: Task Scheduler with Email Notification

## Description 

This project is a task scheduler application built using React TypeScript for the frontend, Node.ts for the backend, and MongoDB for data storage. The application allows users to enter both recurring and one-time tasks. A task scheduler is implemented to send notification emails to users as the time entered for the task approaches.

## Features:

* Users can enter recurring tasks with specified intervals or one-time tasks with a specific date and time.
* Tasks are initially marked as pending upon user entry.
* Task scheduler manages a queue (array) of tasks to be executed.
* When a task is added to the queue, its status changes to queued.
* As the time for a task approaches, notification emails are sent to the respective users.
* Upon successful email delivery, the task status is updated to executed.

## Technologies Used:

* **Frontend:** React with TypeScript
* **Backend:** Node.ts
* **Database:** MongoDB

## Prerequisites:

* Node.js and npm installed on your system.
* MongoDB installed and running locally or on a remote server.
* SMTP server credentials for sending emails.

## Setup Instructions:

* Clone the repository.

## Docker Setup:
* Build
    ``` docker compose build```

* Up:

    ```docker compose up```
    
* Frontend and Backend will start on:
    [Frontend Link](http://localhost)
    [Backend Link](http://localhost:5000)

## Local Setup:

#### Front-end Setup

* Switch to frontend directory using
    ``` cd frontend```

* Install dependencies for frontend using following command:

    ```npm install```

* Start the front end using following command:
 
    ```npm run dev```

* front end start on:
 
    [Frontend Link](http://localhost:5173/)

#### Back-end Setup

 Switch to backend directory using
    ``` cd backend```

* Install dependencies for backend using following command:

    ```npm install```

* Start the back end using following command:
 
    ```npm run dev```

* Access the application in your browser.
 
    [Backend Link](http://localhost:5000)

## API endpoints:

**POST** /api/tasks - Create task of the user.

**GET** /api/tasks - Retrieve all tasks of the user.

**PUT** /api/tasks/:id/schedule - Update task status.

**DELETE** /api/tasks/:id - Delete task of the user.

**GET** /api/executedTasks - Retrieve executed tasks of the user.

**GET** /api/tasks/:id/execute' - Get executed task of the user.


## Access the Application:
Once both servers are running, you can access the application by navigating to http://localhost:5173 in your web browser.

## Contributing:
Contributions are welcome! Please fork the repository, make your changes, and submit a pull request.
