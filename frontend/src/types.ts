export interface Task {
  _id: string
  name: string
  type: string
  schedule?: string
  startDate?: string
  endDate?: string
  status: string
  email: string
  executedAt?: string
  lastExecutionDate?: string
}
