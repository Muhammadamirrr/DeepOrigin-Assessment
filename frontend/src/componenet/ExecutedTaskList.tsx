import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Task } from '../types'

export const ExecutedTaskList: React.FC = () => {
  const [executedTasks, setExecutedTasks] = useState<Task[]>([])

  const fetchExecutedTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/executedTasks')
      if (Array.isArray(response.data)) {
        setExecutedTasks(response.data)
      } else {
        console.error('Fetched data is not an array:', response.data)
      }
    } catch (error) {
      console.error('Error fetching executed tasks:', error)
    }
  }

  useEffect(() => {
    fetchExecutedTasks()
  }, [])

  return (
    <div className='container'>
      <h2>Executed Tasks</h2>
      <table className='table'>
        <thead className='thead-dark'>
          <tr>
            <th scope='col'>#</th>
            <th scope='col'>Name</th>
            <th scope='col'>Type</th>
            <th scope='col'>Schedule</th>
            <th scope='col'>Executed At</th>
          </tr>
        </thead>
        <tbody>
          {executedTasks.map((task, index) => (
            <tr key={task._id}>
              <th scope='row'>{index + 1}</th>
              <td>{task.name}</td>
              <td>{task.type}</td>
              <td>{task.schedule || `${task.startDate} - ${task.endDate}`}</td>
              <td>{task.executedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ExecutedTaskList
