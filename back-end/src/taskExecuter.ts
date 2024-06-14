import Task from './models/taskModel'
import { executeTask } from './controllers/taskControllers'
import nodemailer from 'nodemailer'
import { getIo } from './socket'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aarondev500@gmail.com',
    pass: 'rpqu yylx mgnn ldoj',
  },
})

const sendNotification = async (
  to: string,
  taskName: string
): Promise<void> => {
  const mailOptions = {
    from: 'aarondev500@gmail.com',
    to: to,
    subject: 'Task Executed',
    text: `Your task "${taskName}" has been executed.`,
  }

  try {
    const io = getIo()
    await transporter.sendMail(mailOptions)
    console.log('Notification sent to:', to)
    io.emit('taskUpdate')
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}

const executeTasks = async (): Promise<void> => {
  try {
    const tasks = await Task.find({ status: 'queued' })
    tasks.forEach(async (task) => {
      await executeTask(task._id, sendNotification)
    })
  } catch (error) {
    console.error('Error executing tasks:', error)
  }
}

console.log('Task Executor started')
setInterval(executeTasks, 5000)
