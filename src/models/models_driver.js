// const mongoose = require('mongoose');
// // const Movie = require('./movie').Movie;
// // const Genre = require('./genre').Genre;


// mongoose.connect('mongodb://localhost/vidly')
//   .then(() => console.log('Connected to MongoDB...'))
//   .catch(err => console.error('Could not connect to MongoDB...', err));


// async function createMovie(title, genre, numberInStock, dailyRentalRate) { 
//     const movie = new Movie({
//         title, 
//         genre, 
//         numberInStock,
//         dailyRentalRate
//     });
  
//     const result = await movie.save();
//     console.log(result);
// }
  
// // async function createCourse(name, author) {
// //     const course = new Course({
// //         name, 
// //         author
// //     }); 

// //     const result = await course.save();
// //     console.log(result);
// // }

// // async function listCourses() { 
// //     const courses = await Course
// //         .find()
// //         .select('name');
// //     console.log(courses);
// // }

// createMovie('Terminator', new Genre({ name: "Action" }), 0, 0);

// // createCourse('Node Course', 'authorId')

// // listCourses();