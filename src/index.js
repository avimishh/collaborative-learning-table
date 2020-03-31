const Joi = require('joi');
const express = require('express');
const app = express(); // The server object

app.use(express.json());    // a piece of middleware

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' }
];


// GET
app.get('/', (req,res) => {
    console.log('inside "/"');      // DEBUG
    res.send('Hello World');
});

app.get('/api/courses', (req,res) => {
    console.log('inside "/api/courses"');      // DEBUG
    res.send(courses);
});

app.get('/api/courses/:id', (req,res) => {
    console.log('inside "/api/courses/:id"');      // DEBUG
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found'); // 404 Not Found
    res.send(course);
});

app.get('/api/posts/:year/:month', (req,res) => {
    console.log('inside "/api/posts/:year/:month"');      // DEBUG
    res.send(req.params);   /* api/posts/2018/1 */
    // res.send(req.query);    /* api/posts/2018/1?sortBy=name */
});



// POST
app.post('/api/courses', (req,res) => {
    console.log('inside -post- "/api/courses"');      // DEBUG
    
    const { error } = validateCourse(req.body);     // validate input
    // if invalid, return 400
    if(error) return res.status(400).send(error.details[0].message);  // check validation result // fail, send back the error

    const course = {            // create new object
        id: courses.length + 1,
        name: req.body.name     // read from body sent in the request
    };
    courses.push(course);       // add the new course to data array
    res.send(course);           // send back the course
});


// PUT
app.put('/api/courses/:id', (req,res) => {
    console.log('inside -put- "/api/courses/:id"');      // DEBUG
    // look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    // if not existing, return 404
    if(!course){
        res.status(404).send('The course with the given ID was not found');
        return;
    } 

    // validate
    // const result = validateCourse(req.body);
    const { error } = validateCourse(req.body);
    // if invalid, return 400
    if(error) return res.status(400).send(error.details[0].message);  // fail, send back the error // check validation result
        
    // update course
    course.name = req.body.name;
    // return the updated course
    res.status(200).send(course);
});


// DELETE
app.delete('/api/courses/:id', (req,res) => {
    console.log('inside -delete- "/api/courses/:id"');      // DEBUG
    // look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    // if not existing, return 404
    if(!course) return res.status(404).send('The course with the given ID was not found');

    const indexOfCourse = courses.indexOf(course);
    courses.splice(indexOfCourse, 1);

    res.send(course);
});


function validateCourse(course){
    const schema = {                                // declare schema form for the input
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);   // validate and return
}

const port = process.env.PORT || 3000;
console.log(process.env.PORT);
app.listen(port, () => console.log(`Listening on port ${port}...`));