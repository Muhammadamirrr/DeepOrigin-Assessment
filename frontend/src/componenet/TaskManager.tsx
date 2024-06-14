import React, { useState, useEffect } from 'react'
import axios from 'axios'
import io from 'socket.io-client';

import { TaskForm } from './TaskForm'
import { TaskList } from './TaskList'
import { Task } from '../types'

const socket = io('http://localhost:5000');

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks')
      if (Array.isArray(response.data)) {
        setTasks(response.data)
      } else {
        console.error('Fetched data is not an array:', response.data)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  useEffect(() => {
    socket.on('taskUpdate', () => {
      fetchTasks()
    });

    return () => {
      socket.off('taskUpdate');
    };
  }, []);

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className='container'>
      <h1>Distributed Task Scheduler</h1>
      <TaskForm onTaskAdded={fetchTasks} />
      <TaskList tasks={tasks} onTaskUpdated={fetchTasks} />
    </div>
  )
}

export default TaskManager
