import type { Agent, Session, Task, AuditLog, Schedule, Tool } from './supabase'

// Demo Agents
export const demoAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Atlas CEO',
    role: 'Strategic Director',
    description: 'High-level planning and decision-making agent.',
    avatarColor: '#00b4d7',
    status: 'online',
    tasksDone: 124,
    successRate: 92,
    favorite: false,
  },
  {
    id: 'agent-2',
    name: 'Scout Research',
    role: 'Data & Research',
    description: 'Gathers intelligence and market research.',
    avatarColor: '#33c3df',
    status: 'online',
    tasksDone: 98,
    successRate: 89,
    favorite: false,
  },
  {
    id: 'agent-3',
    name: 'Forge Execution',
    role: 'Task Executor',
    description: 'Runs and orchestrates execution pipelines.',
    avatarColor: '#0094b0',
    status: 'idle',
    tasksDone: 210,
    successRate: 95,
    favorite: false,
  },
  {
    id: 'agent-4',
    name: 'Sentinel QA',
    role: 'Quality Assurance',
    description: 'Validates outputs and checks quality.',
    avatarColor: '#00738a',
    status: 'online',
    tasksDone: 76,
    successRate: 87,
    favorite: false,
  },
  {
    id: 'agent-5',
    name: 'Link Tool Integrator',
    role: 'Integration',
    description: 'Connects external tools and APIs.',
    avatarColor: '#66d1e7',
    status: 'offline',
    tasksDone: 44,
    successRate: 82,
    favorite: false,
  },
  {
    id: 'agent-6',
    name: 'Chronos Scheduler',
    role: 'Scheduler',
    description: 'Manages background jobs and timing.',
    avatarColor: '#005263',
    status: 'online',
    tasksDone: 158,
    successRate: 90,
    favorite: false,
  },
]

// Demo Tasks
export const demoTasks: Task[] = [
  { id: 'task-1', title: 'Init campaign strategy', completed: true, success: true, agentId: 'agent-1' },
  { id: 'task-2', title: 'Collect competitor data', completed: true, success: true, agentId: 'agent-2' },
  { id: 'task-3', title: 'Deploy model v2', completed: false, success: false, agentId: 'agent-3' },
  { id: 'task-4', title: 'Run QA suite', completed: true, success: true, agentId: 'agent-4' },
  { id: 'task-5', title: 'Sync tool connectors', completed: false, success: false, agentId: 'agent-5' },
]

// Demo Sessions
export const demoSessions: Session[] = [
  { id: 'sess-1', title: 'Morning brief', summary: 'Overview of daily objectives', agentIds: ['agent-1','agent-2'], tasksCount: 3, progress: 80, status: 'running' },
  { id: 'sess-2', title: 'Execution window', summary: 'Deploying changes to infra', agentIds: ['agent-3'], tasksCount: 5, progress: 45, status: 'running' },
  { id: 'sess-3', title: 'QA sweep', summary: 'Batch QA checks', agentIds: ['agent-4'], tasksCount: 4, progress: 100, status: 'completed' },
  { id: 'sess-4', title: 'Integration test', summary: 'Verify connectors', agentIds: ['agent-5'], tasksCount: 2, progress: 20, status: 'queued' },
  { id: 'sess-5', title: 'Scheduler run', summary: 'Nightly jobs executed', agentIds: ['agent-6'], tasksCount: 6, progress: 60, status: 'running' },
]

// Demo Audit Logs
export const demoAuditLogs: AuditLog[] = [
  { id: 'log-1', timestamp: new Date().toISOString(), agentName: 'Atlas CEO', action: 'Created plan', scope: 'Strategy', success: true },
  { id: 'log-2', timestamp: new Date().toISOString(), agentName: 'Scout Research', action: 'Fetched dataset', scope: 'Data', success: true },
  { id: 'log-3', timestamp: new Date().toISOString(), agentName: 'Forge Execution', action: 'Started deployment', scope: 'Infra', success: false },
  { id: 'log-4', timestamp: new Date().toISOString(), agentName: 'Sentinel QA', action: 'Completed QA', scope: 'Quality', success: true },
  { id: 'log-5', timestamp: new Date().toISOString(), agentName: 'Link Tool Integrator', action: 'Reconnected API', scope: 'Integrations', success: true },
  { id: 'log-6', timestamp: new Date().toISOString(), agentName: 'Chronos Scheduler', action: 'Scheduled job', scope: 'Scheduler', success: true },
  { id: 'log-7', timestamp: new Date().toISOString(), agentName: 'Forge Execution', action: 'Retry deployment', scope: 'Infra', success: true },
]

// Demo Schedules
export const demoSchedules: Schedule[] = [
  { id: 'sch-1', name: 'Daily report', interval: '0 8 * * *', constraints: 'weekday', nextRun: new Date(Date.now() + 3600*1000).toISOString(), enabled: true },
  { id: 'sch-2', name: 'Weekly sync', interval: '0 3 * * 1', constraints: 'low-traffic', nextRun: new Date(Date.now() + 24*3600*1000).toISOString(), enabled: true },
  { id: 'sch-3', name: 'Nightly jobs', interval: '0 2 * * *', constraints: 'off-peak', nextRun: new Date(Date.now() + 2*3600*1000).toISOString(), enabled: true },
  { id: 'sch-4', name: 'Monthly audit', interval: '0 5 1 * *', constraints: 'business-day', nextRun: new Date(Date.now() + 7*24*3600*1000).toISOString(), enabled: false },
]

// Demo Tools
export const demoTools: Tool[] = [
  { id: 'tool-1', name: 'VectorDB', category: 'Database', version: 'v1.2.3', active: true, description: 'Fast vector similarity store' },
  { id: 'tool-2', name: 'WebFetcher', category: 'Ingestion', version: 'v0.9.1', active: true, description: 'Crawls and normalizes web content' },
  { id: 'tool-3', name: 'LLM-Executor', category: 'Model', version: 'v2.0.0', active: true, description: 'Executes LLM-based tasks' },
  { id: 'tool-4', name: 'Notifier', category: 'Messaging', version: 'v1.0.0', active: false, description: 'Sends alerts and notifications' },
  { id: 'tool-5', name: 'Connector Hub', category: 'Integration', version: 'v1.4.0', active: true, description: 'Connects external APIs' },
]

// export aggregated demo data
export const demoData = {
  agents: demoAgents,
  tasks: demoTasks,
  sessions: demoSessions,
  auditLogs: demoAuditLogs,
  schedules: demoSchedules,
  tools: demoTools,
}
