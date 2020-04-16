const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  author: authorSchema
}));

async function createCourse(name, author) {
  const course = new Course({
    name, 
    author
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(courseId){
  // const course = await Course.findById(courseId);
  const course = await Course.update({ _id: courseId }, {
  //   $set: {
  //     'author.name': 'John Smith'
  //   }
  // });
    $unset: {
      'author': ''
    }
  });
  // course.author.name = 'Mosh Hamedani';
  // course.save();
}

// createCourse('Node Course', new Author({ name: 'Mosh' }));
updateAuthor('5e8c638c5847f0a2545043ea');