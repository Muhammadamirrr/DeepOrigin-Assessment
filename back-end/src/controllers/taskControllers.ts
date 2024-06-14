import { Request, Response } from 'express'
import ical from "ical-generator";

import Task from '../models/taskModel'
import { sendNotification } from '../taskScheduler'

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, type, schedule, startDate, endDate, email } = req.body

    const newTask = new Task({
      name,
      type,
      email,
    })

    if (type === 'one-time') {
      newTask.schedule = new Date(schedule)
    } else if (type === 'recurring') {
      newTask.startDate = new Date(startDate)
      newTask.endDate = new Date(endDate)
      newTask.schedule = newTask.startDate
    }

    await newTask.save()
    const cal = ical({ name: "Task Scheduler" });
      const now = newTask.schedule || new Date()
      const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000);

      cal.createEvent({
        start: newTask.schedule || new Date(),
        end: tenMinutesLater,
        summary: newTask.name,
        organizer: { name: "Task Scheduler", email: "aarondev500@gmail.com" },
        attendees: [{ email: newTask.email }],
      });

      sendNotification(newTask.email, newTask.name,  {
        filename: "invite.ics",
        method: "request",
        content: cal.toString(),
      });
    res.status(201).json(newTask)
  } catch (error) {
    res.status(500).json({ error: 'Error creating task' })
  }
}

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find({ status: { $ne: 'executed' } })
    res.status(200).json(tasks)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' })
  }
}

export const updateTaskSchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const { schedule, startDate, endDate, type } = req.body

    let updateData: any = { status: 'pending' }

    if (type === 'one-time') {
      updateData.schedule = new Date(schedule)
    } else if (type === 'recurring') {
      updateData.startDate = new Date(startDate)
      updateData.endDate = new Date(endDate)
      updateData.schedule = new Date(startDate)
    }

    const task = await Task.findByIdAndUpdate(id, updateData, { new: true })
    
    if(task){
      const cal = ical({ name: "Task Scheduler" });
      const now = task.schedule || new Date()
      const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000);

      cal.createEvent({
        start: task.schedule || new Date(),
        end: tenMinutesLater,
        summary: task.name,
        organizer: { name: "Task Scheduler", email: "aarondev500@gmail.com" },
        attendees: [{ email: task.email }],
      });

      sendNotification(task.email, task.name,  {
        filename: "invite.ics",
        method: "request",
        content: cal.toString(),
      });
    }

    res.status(200).json(task)
  } catch (error) {
    res.status(500).json({ error: 'Error updating task schedule' })
  }
}

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    await Task.findByIdAndDelete(id)
    res.status(200).json({ message: 'Task deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task' })
  }
}

export const getExecutedTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tasks = await Task.find({ status: 'executed' })
    res.status(200).json(tasks)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching executed tasks' })
  }
}

export const executeTask = async (
  taskId: string,
  notify: (email: string, taskName: string) => Promise<void>
): Promise<void> => {
  try {
    const task = await Task.findById(taskId)
    if (task && task.email) {
      const now = new Date()
      task.executedAt = now
      task.lastExecutionDate = now

      if (
        task.type === 'one-time' ||
        (task.type === 'recurring' && task.endDate && now >= task.endDate)
      ) {
        task.status = 'executed'
        await task.save()
      } else if (task.type === 'recurring') {
        if (task.schedule) {
          const nextSchedule = new Date(
            task.schedule.getTime() + 24 * 60 * 60 * 1000
          )
          if (task.endDate && nextSchedule <= task.endDate) {
            task.schedule = nextSchedule
            task.status = 'pending'
          } else {
            task.status = 'executed'
          }
          await task.save()
        } else {
          console.error('Task schedule is not defined')
        }
      }

      if (notify) {
        await notify(task.email, task.name)
      }
    } else {
      console.error('Task not found or email is missing')
    }
  } catch (error) {
    console.error('Error executing task:', error)
  }
}
