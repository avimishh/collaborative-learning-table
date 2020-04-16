const mongoose = require('mongoose');


// Connect DB
// hard coding connection string
mongoose.connect('mongodb://localhost/playground',{useNewUrlParser: true, useUnifiedTopology:true})
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.err('Could not connect to MongoDB...', err));


/* _Comparion Operators_
    eq (equal)
    ne (not equal)
    gt (greater than)
    gte (greater than or equal to)
    lt (less than)
    lte (less than or equal to)
    in
    nin (not in)         
    
    Example:
    const courses = await Course
        .find({ author:'Mosh', isPublished: true})
        .find({ price: { $gte: 10, $lte: 20 } })
        .find({ price: { $in: [10, 15, 20] } })
        .limit(10)
        .sort({ name: 1 })      // 1 Ascending -1 Descending
        .select({ name: 1, tags: 1 });
********************************* */

/* Logical Query Operators
    or
    and

    Example:
    const courses = await Course
        .or([{ author:'Mosh'}, {isPublished: true}])
        .and([])
        .limit(10)
        .sort({ name: 1 })      // 1 Ascending -1 Descending
        .select({ name: 1, tags: 1 });
*/

/* Regular Expressions

    syntax: /pattern/

    Example:
    const courses = await Course

        // Starts with Mosh
        .find({ author: /^Mosh/ })  
        
        // Ends with Hamedani. i - case insesitive
        .find({ author: /Hamedani$/i })   

        // Contains Mosh
        .find({ author: /.*Mosh.*'/i })   

*/

/* Counting
    const courses = await Course
        .find({ author:'Mosh', isPublished: true})
         .count();

    Return: count of objecs/documents
*/

/* Pagination
    const pageNumber = 2;
    const pageSize = 10;

    const courses = await Course
        .skip((pageNumber -1)* pageSize)
        .limit(pageSize)
*/

async function getCourses(){

    const courses = await Course
        // .find({ author:'Mosh', isPublished: true})
        .or([{ author:'Mosh'}, {isPublished: true}])
        .and([])
        .find({ price: { $gte: 10, $lte: 20 } })
        .find({ price: { $in: [10, 15, 20] } })
        .limit(10)
        .sort({ name: 1 })      // 1 Ascending -1 Descending
        .select({ name: 1, tags: 1 });
    
    courses.forEach(c => {
        console.log(c.name);   
    });

    console.log(courses);   
}

getCourses();