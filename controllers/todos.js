const todosRouter = require('express').Router()
const Todo = require('../models/todo')

todosRouter.get('/', (request, response) => {
  Todo.find({}).then((todos) => {
    response.json(todos)
  })
})

todosRouter.get('/:id', (request, response, next) => {
  Todo.findById(request.params.id)
    .then((todo) => {
      todo ? response.json(todo) : response.status(404).end()
    })
    .catch((error) => next(error))
})

todosRouter.post('/', (request, response, next) => {
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

todosRouter.put('/:id', (request, response, next) => {
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

todosRouter.delete('/:id', (request, response, next) => {
  Todo.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).json(result)
    })
    .catch((error) => next(error))
})

module.exports = todosRouter
