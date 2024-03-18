const mongoose = require('mongoose')

if (process.argv.length<5) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://anttonitornikoski:${password}@cluster0.786v6tk.mongodb.net/peopleApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Boolean,
})

const People = mongoose.model('People', personSchema)

const person = new People({
  name: name,
  number: number,
})

person.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})

person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })