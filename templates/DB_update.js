const mongoose = require('mongoose');


// Connect DB
// hard coding connection string
mongoose.connect('mongodb://localhost/playground',{useNewUrlParser: true, useUnifiedTopology:true})
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.err('Could not connect to MongoDB...', err));


async function updateCourse(id){
    // two approaches: query first, update first
    // query first
    const course = await updateCourse.findById(id);
    if(!course) return;

    course.isPublished = true;
    course.author = 'Another Author';

    course.set({
        isPublished: true,
        author: 'Another Author'
    });

    const result = await course.save();
    console.log(result);
}