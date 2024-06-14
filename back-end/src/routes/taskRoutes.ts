import express from 'express'
import {
  createTask,
  getTasks,
  updateTaskSchedule,
  deleteTask,
  getExecutedTasks,
} from '../controllers/taskControllers'

const router = express.Router()

router.post('/tasks', createTask)
router.get('/tasks', getTasks)
router.put('/tasks/:id/schedule', updateTaskSchedule)
router.delete('/tasks/:id', deleteTask)
router.get('/executedTasks', getExecutedTasks)

export default router
