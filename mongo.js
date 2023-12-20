const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://mohamedaminedammak98:${password}@cluster0.yypntoc.mongodb.net/todoApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const todoSchema = new mongoose.Schema({
  content: String,
  completed: Boolean,
})

todoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Todo = mongoose.model('Todo', todoSchema)

// const todo = new Todo({
//   content: 'Jogging',
//   completed: false,
// })

// todo.save().then((result) => {
//   console.log(result)
//   console.log('todo saved!')
//   mongoose.connection.close()
// })

Todo.find({}).then((todos) => {
  todos.forEach((todo) => {
    console.log(todo)
  })
  mongoose.connection.close()
})
