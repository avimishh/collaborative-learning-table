const mongoose = require('mongoose');
const config = require('config');
const { Parent, validateParent } = require('../parent');
const { Teacher, validateTeacher } = require('../teacher');
const { Child, validateChild } = require('../child');
const { Field, validateField } = require('../field');
const { Game, validateGame } = require('../game');


const bcrypt = require('bcrypt'); // Password Hash

// mongoose.connect(config.get('db'))
//   .then(() => console.log('Connected to MongoDB...'))
//   .catch(err => console.error('Could not connect to MongoDB...', err));


async function createParent(firstName, lastName, id, password, phone) {
    const { error } = validateParent({ firstName, lastName, id, password, phone });
    // Assert validation
    if (error)
        return console.log(error.details[0].message);
    // Check if the parent exist
    let parent = await Parent.findOne({ id });
    // Response 400 Bad Request if the parent exist
    if (parent) return console.log(`הורה בעל ת"ז ${id} כבר קיים במערכת.`);
    // Create new document
    parent = new Parent({
        firstName,
        lastName,
        id,
        password,
        phone
    });
    // Password Hash
    const salt = await bcrypt.genSalt(10);
    parent.password = await bcrypt.hash(parent.password, salt);
    // Save to DataBase
    parent = await parent.save();
}

async function createTeacher(firstName, lastName, id, password, phone) {
    const { error } = validateTeacher({ firstName, lastName, id, password, phone });
    // Assert validation
    if (error)
        return console.log(error.details[0].message);
    // Check if the teacher exist
    let teacher = await Teacher.findOne({ id });
    // Response 400 Bad Request if the teacher exist
    if (teacher) return console.log(`מורה בעל ת"ז ${id} כבר קיים במערכת.`);
    // Create new document
    teacher = new Teacher({
        firstName,
        lastName,
        id,
        password,
        phone
    });
    // Password Hash
    const salt = await bcrypt.genSalt(10);
    teacher.password = await bcrypt.hash(teacher.password, salt);
    // Save to DataBase
    teacher = await teacher.save();
}

async function createChild(firstName, lastName, id, birth, gender, gamesPassword,
    address, phone, level) {
    // Validate client input
    const { error } = validateChild({
        firstName, lastName, id, birth, gender, gamesPassword,
        address, phone, level
    });
    // Assert validation
    if (error)
        return console.log(error.details[0].message);
    // Check if the child exist
    let child = await Child.findOne({ id });
    // Response 400 Bad Request if the child exist
    if (child) return console.log(`ילד בעל ת"ז ${id} כבר קיים במערכת.`);
    // Create new document
    child = new Child({
        firstName,
        lastName,
        id,
        birth,
        gender,
        gamesPassword,
        address,
        phone,
        level
    });
    // Save to DataBase
    child = await child.save();
}

async function createField(name, description) {
    // validate input
    const { error } = validateField({ name, description });
    if (error) return console.log(error.details[0].message);

    let field = new Field({
        name,
        description
    });

    field = await field.save();
}

async function createGame(title, description, fieldName, icon, link) {
    // Validate field
    const field = await Field.findOne({ name: fieldName });
    if (!field) return console.log(`תחום הלימודים ${fieldName} אינו קיים במערכת.`);
    // Validate client input
    const { error } = validateGame({ title, description, field, icon, link });
    // Assert validation
    if (error)
        return console.log(error.details[0].message);
    // Create new document
    let game = new Game({
        title,
        description,
        field: {
            _id: field._id,
            name: field.name,
            description: field.description
        },
        icon,
        link
    });
    // Save to DataBase
    await game.save();
}

createParent('משה', 'פרץ', '100', '12345', '0521111111');
createParent('אביב', 'גפן', '101', '12345', '0522222222');

createTeacher('עליזה', 'שמשוני', '10', '12345', '0523333333');

createChild('יזהר', 'גפן', '1001', new Date(2010, 5, 1), 'זכר', '12', 'נתניה', '0522222233', 'ג');
createChild('יונית', 'פרץ', '1002', new Date(2012, 10, 1), 'נקבה', '12', 'הרצליה', '0522222233', 'א');

createField('חשבון', 'תרגול פעולות חשבון בסיסיות: חיבור, חיסור וכפל');
createField('אנגלית', 'תרגול אותיות ומילים בשפה האנגלית');
createField('צבעים', 'תרגול הכרת צבעים');

createGame('תרגילי חשבון', 'שחק בפעולות חשבון עם חברך!', 'חשבון', 'icons/math_icon.jpg', './math.html' );
createGame('התאמת תמונות למילים', 'התאם תמונות למילים באנגלית', 'אנגלית', 'icons/english_icon.jpg', './english.html' );
