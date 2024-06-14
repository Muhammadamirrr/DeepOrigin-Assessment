import express from 'express'
import cron from 'node-cron'
import cors from 'cors'
import taskRoutes from './routes/taskRoutes'
import connectDB from './DbConfig/dbConnection'
import './taskExecuter'
import { scheduleTaskExecution, executeRecurringTasks } from './taskScheduler'
import { initIo } from './socket'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

app.use(express.json())

app.use('/api', taskRoutes)

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  console.log('Task Scheduler started')
  cron.schedule('* * * * *', scheduleTaskExecution)
  executeRecurringTasks()
})

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

initIo(server);
