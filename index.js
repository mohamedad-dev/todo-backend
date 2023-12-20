require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Todo = require('./models/todo')
const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

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
  Todo.find({}).then((todos) => {
    response.json(todos)
  })
})
app.get('/api/todos/:id', (request, response, next) => {
  Todo.findById(request.params.id)
    .then((todo) => {
      todo ? response.json(todo) : response.status(404).end()
    })
    .catch((error) => next(error))
})

app.post('/api/todos', (request, response, next) => {
  const body = request.body

  const todo = new Todo({
    content: body.content,
    completed: false,
  })

  todo
    .save()
    .then((savedTodo) => {
      response.json(savedTodo)
    })
    .catch((error) => next(error))
})

app.put('/api/todos/:id', (request, response, next) => {
  const body = request.body
  const todo = {
    content: body.content,
    completed: body.completed,
  }
  Todo.findByIdAndUpdate(request.params.id, todo, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedTodo) => {
      response.json(updatedTodo)
    })
    .catch((error) => next(error))
})

app.delete('/api/todos/:id', (request, response, next) => {
  Todo.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).json(result)
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
