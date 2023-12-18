const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

let todos = [
  {
    id: 1,
    content: 'Complete online JavaScript course',
    completed: false,
  },
  {
    id: 2,
    content: 'Jog around the park 3x',
    completed: false,
  },
  {
    id: 3,
    content: 'Nekel',
    completed: false,
  },
  {
    id: 4,
    content: 'Na3ti safrout yekel',
    completed: true,
  },
]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

app.get('/', (request, response) => {
  response.send('<h1>Hello world!</h1>')
})
app.get('/api/todos', (request, response) => {
  response.json(todos)
})
app.get('/api/todos/:id', (request, response) => {
  const id = Number(request.params.id)
  const todo = todos.find((todo) => todo.id === id)
  todo ? response.json(todo) : response.status(404).end()
})
app.delete('/api/todos/:id', (request, response) => {
  const id = Number(request.params.id)
  todos = todos.filter((todo) => todo.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const maxId = todos.length > 0 ? Math.max(...todos.map((n) => n.id)) : 0
  return maxId + 1
}
app.post('/api/todos', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'missing content',
    })
  }

  const todo = {
    content: body.content,
    completed: false,
    id: generateId(),
  }

  todos = [...todos, todo]
  response.json(todo)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
