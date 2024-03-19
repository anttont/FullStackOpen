const mongoose = require('mongoose');


if (process.argv.length < 3) {
  console.log('Give password as argument');
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];


const url =
  `mongodb+srv://anttonitornikoski:${password}@cluster0.786v6tk.mongodb.net/peopleApp?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const People = mongoose.model('People', personSchema);


if (process.argv.length === 3) {
  
  People.find({}).then(result => {
    console.log("Phonebook:");
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  
  const person = new People({
    name: name,
    number: number,
  });

  person.save().then(result => {
    console.log(`Added ${name} ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  
  console.log('Incorrect number of arguments');
  mongoose.connection.close();
}
