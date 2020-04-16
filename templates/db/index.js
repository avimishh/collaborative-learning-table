const mongoose = require('mongoose');


// Connect DB
// hard coding connection string
mongoose.connect('mongodb://localhost/playground',{useNewUrlParser: true, useUnifiedTopology:true})
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.err('Could not connect to MongoDB...', err));


// New Schema
const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: { type:Date, default: Date.now },
    isPublished: Boolean
});


// New Model of the above Schema
const Course = mongoose.model('Course', courseSchema);


// creating new object and storing it inside the DB collection
async function createCourse(){
    const course = new Course({
        name: 'Angular Course',
        author: 'Mosh',
        tags: ['angular', 'frontend'],
        isPublished: true
    });

    const result = await course.save();
    console.log(result);
}

// createCourse();


// Querying objects from the DB
async function getCourses(){
    
    /* Comparion Operators
    // eq (equal)
    // ne (not equal)
    // gt (greater than)
    // gte (greater than or equal to)
    // lt (less than)
    // lte (less than or equal to)
    // in
    // nin (not in)                 */



    const courses = await Course
        .find({ author:'Mosh', isPublished: true})
        // .find({ price: { $gte: 10, $lte: 20 } })
        // .find({ price: { $in: [10, 15, 20] } })
        .limit(10)
        .sort({ name: 1 })      // 1 Ascending -1 Descending
        .select({ name: 1, tags: 1 });
    
    courses.forEach(c => {
        console.log(c.name);   
    });

    console.log(courses);   
}

getCourses();