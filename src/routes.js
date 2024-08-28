import { completeTask, createTask, deleteTask, getTasks, updateTask } from './controller/tasks-controller.js';
import { buildRoutePath } from './utils/build-route-path.js';

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: getTasks
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: createTask
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:taskId'),
    handler: updateTask
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:taskId/complete'),
    handler: completeTask
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:taskId'),
    handler: deleteTask
  },
]
