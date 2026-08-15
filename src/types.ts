// shared types for tasks and app views
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

export type Page = 'Dashboard' | 'Activity' | 'Schedule' | 'Chat' | 'Settings'
