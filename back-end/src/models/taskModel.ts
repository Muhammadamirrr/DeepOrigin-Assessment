import { Schema, model, Document } from 'mongoose'

export interface ITask extends Document {
  _id: string
  name: string
  type: 'one-time' | 'recurring'
  schedule?: Date
  startDate?: Date
  endDate?: Date
  status: 'pending' | 'queued' | 'executed'
  email: string
  createdAt?: Date
  updatedAt?: Date
  executedAt?: Date
  lastExecutionDate?: Date
}

const taskSchema = new Schema<ITask>({
  name: { type: String, required: true },
  type: { type: String, enum: ['one-time', 'recurring'], required: true },
  schedule: { type: Date },
  startDate: { type: Date },
  endDate: { type: Date },
  status: {
    type: String,
    enum: ['pending', 'queued', 'executed'],
    default: 'pending',
  },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  executedAt: { type: Date },
  lastExecutionDate: { type: Date },
})

const Task = model<ITask>('Task', taskSchema)

export default Task
