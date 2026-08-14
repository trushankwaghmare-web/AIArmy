// shared types for tasks
export type Task = {
  id: string
  title: string
  description?: string
  agentId?: string
  completed: boolean
  success: boolean
  runAt?: string
  progress?: number
}
