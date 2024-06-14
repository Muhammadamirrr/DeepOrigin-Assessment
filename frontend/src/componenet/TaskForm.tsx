import React, { useState } from 'react'
import axios from 'axios'
import { Task } from '../types'

interface TaskFormProps {
  onTaskAdded: () => void
}

export const TaskForm: React.FC<TaskFormProps> = ({ onTaskAdded }) => {
  const [name, setName] = useState('')
  const [type, setType] = useState('one-time')
  const [schedule, setSchedule] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const taskData: Partial<Task> = {
        name,
        type,
        email,
      }
      if (type === 'one-time') {
        taskData.schedule = schedule
      } else if (type === 'recurring') {
        taskData.startDate = startDate
        taskData.schedule = startDate
        taskData.endDate = endDate
      }
      await axios.post('http://localhost:5000/api/tasks', taskData)
      setName('')
      setType('one-time')
      setSchedule('')
      setStartDate('')
      setEndDate('')
      setEmail('')
      onTaskAdded()
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <label htmlFor='name'>Task Name</label>
        <input
          type='text'
          className='form-control'
          id='name'
          name='name'
          placeholder='Enter Task name'
          onChange={(e) => setName(e.target.value)}
          value={name}
          required
        />
      </div>

      <div className='form-group'>
        <label htmlFor='type'>Task Type:</label>
        <select
          id='type'
          className='form-control'
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value='one-time'>One-Time</option>
          <option value='recurring'>Recurring</option>
        </select>
      </div>

      {type === 'one-time' && (
        <div className='form-group'>
          <label htmlFor='schedule'>Task Schedule</label>
          <input
            type='datetime-local'
            className='form-control'
            id='schedule'
            name='schedule'
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            required
          />
        </div>
      )}

      {type === 'recurring' && (
        <>
          <div className='form-group'>
            <label htmlFor='startDate'>Start Date</label>
            <input
              type='datetime-local'
              className='form-control'
              id='startDate'
              name='startDate'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='endDate'>End Date</label>
            <input
              type='datetime-local'
              className='form-control'
              id='endDate'
              name='endDate'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </>
      )}

      <div className='form-group'>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          className='form-control'
          id='email'
          name='email'
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <button type='submit' className='btn btn-primary'>
        Create Task
      </button>
    </form>
  )
}
