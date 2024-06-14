import React, { useState } from 'react'
import axios from 'axios'
import { Task } from '../types'

interface TaskListProps {
  tasks: Task[]
  onTaskUpdated: () => void
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskUpdated }) => {
  const [editTaskId, setEditTaskId] = useState<string | null>(null)
  const [newSchedule, setNewSchedule] = useState<string>('')
  const [newStartDate, setNewStartDate] = useState<string>('')
  const [newEndDate, setNewEndDate] = useState<string>('')

  const handleEditTask = async (taskId: string, type: string) => {
    try {
      const updateData: Partial<Task> = {}
      if (type === 'one-time') {
        updateData.schedule = newSchedule
        updateData.type = 'one-time'
      } else if (type === 'recurring') {
        updateData.startDate = newStartDate
        updateData.endDate = newEndDate
        updateData.type = 'recurring'
      }
      await axios.put(`http://localhost:5000/api/tasks/${taskId}/schedule`, updateData)
      setEditTaskId(null)
      setNewSchedule('')
      setNewStartDate('')
      setNewEndDate('')
      onTaskUpdated()
    } catch (error) {
      console.error('Error updating task schedule:', error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`)
      onTaskUpdated()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  return (
    <div className='container'>
      <div className='d-flex flex-column align-items-center mt-1'>
        <h2>Scheduled Tasks</h2>

        <table className='table'>
          <thead className='thead-dark'>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>Name</th>
              <th scope='col'>Type</th>
              <th scope='col'>Schedule/Start Date</th>
              <th scope='col'>End Date</th>
              <th scope='col'>Status</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task._id}>
                <th scope='row'>{index + 1}</th>
                <td>{task.name}</td>
                <td>{task.type}</td>
                <td>{task.schedule || task.startDate}</td>
                <td>{task.endDate || 'N/A'}</td>
                <td>{task.status}</td>
                <td>
                  {editTaskId === task._id ? (
                    <div>
                      {task.type === 'one-time' && (
                        <input
                          type='datetime-local'
                          value={newSchedule}
                          onChange={(e) => setNewSchedule(e.target.value)}
                        />
                      )}
                      {task.type === 'recurring' && (
                        <>
                          <input
                            type='datetime-local'
                            value={newStartDate}
                            onChange={(e) => setNewStartDate(e.target.value)}
                          />
                          <input
                            type='datetime-local'
                            value={newEndDate}
                            onChange={(e) => setNewEndDate(e.target.value)}
                          />
                        </>
                      )}
                      <button
                        onClick={() => handleEditTask(task._id, task.type)}
                      >
                        Save
                      </button>
                      <button onClick={() => setEditTaskId(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button onClick={() => setEditTaskId(task._id)}>
                        Edit Schedule
                      </button>
                      <button onClick={() => handleDeleteTask(task._id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TaskList
