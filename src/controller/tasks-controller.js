import { randomUUID } from 'node:crypto'
import { Database } from "../database/index.js"

const database = new Database()
const TABLE = 'tasks'

export function getTasks(req, res) {
  const { title } = req.query

  const tasks = database.select(TABLE,
    title ? { title } : null
  )

  return res.end(JSON.stringify(tasks))
}

export function createTask(req, res) {
  const { title, description } = req.body

  if (title === undefined || title.length <= 0) {
    return res.writeHead(400).end(JSON.stringify({ message: 'Title not found' }))
  }

  if (title === undefined || title.length <= 0) {
    return res.writeHead(400).end(JSON.stringify({ message: 'Description not found' }))
  }

  const task = {
    id: randomUUID(),
    title,
    description
  }

  database.insert(TABLE, task)

  return res.writeHead(201).end()
}

export function updateTask(req, res) {
  const { taskId } = req.params
  const { title, description } = req.body

  if (title === undefined || title.length <= 0) {
    return res.writeHead(400).end(JSON.stringify({ message: 'Title not found' }))
  }

  if (title === undefined || title.length <= 0) {
    return res.writeHead(400).end(JSON.stringify({ message: 'Description not found' }))
  }

  const task = database.selectById(TABLE, taskId)
  if (!task) {
    return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }))
  }

  const ok = database.update(TABLE, taskId, { title, description })

  if (!ok) {
    return res.writeHead(400).end()
  }

  return res.writeHead(204).end()
}

export function completeTask(req, res) {
  const { taskId } = req.params

  const task = database.selectById(TABLE, taskId)
  if (!task) {
    return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }))
  }
  if (task.completed_at) {
    return res.writeHead(400).end(JSON.stringify({ message: 'Task already completed' }))
  }

  task.completed_at = database.newDateTime()
  const ok = database.update(TABLE, taskId, task)

  if (!ok) {
    return res.writeHead(400).end()
  }

  return res.writeHead(204).end()
}

export function deleteTask(req, res) {
  const { taskId } = req.params
  const task = database.selectById(TABLE, taskId)
  if (!task) {
    return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }))
  }

  const ok = database.delete(TABLE, taskId)

  if (!ok) {
    return res.writeHead(400).end()
  }

  return res.writeHead(204).end()
}
