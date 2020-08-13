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

var notes = [];

async function createParent(firstName, lastName, id, password, phone) {
    const { error } = validateParent({ firstName, lastName, id, password, phone });
    // Assert validation
    if (error) {
        notes.push(error.details[0].message);
        return console.log(error.details[0].message);
    }
    // Check if the parent exist
    let parent = await Parent.findOne({ id });
    // Response 400 Bad Request if the parent exist
    if (parent) {
        notes.push(`הורה בעל ת"ז "${id}" כבר קיים במערכת.`);
        return console.log(`הורה בעל ת"ז "${id}" כבר קיים במערכת.`);
    }
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
    notes.push(`הורה "${firstName} ${lastName}" נוצר בDB.`);
}

async function createTeacher(firstName, lastName, id, password, phone) {
    const { error } = validateTeacher({ firstName, lastName, id, password, phone });
    // Assert validation
    if (error) {
        notes.push(error.details[0].message);
        return console.log(error.details[0].message);
    }
    // Check if the teacher exist
    let teacher = await Teacher.findOne({ id });
    // Response 400 Bad Request if the teacher exist
    if (teacher) {
        notes.push(`מורה בעל ת"ז "${id}" כבר קיים במערכת.`);
        return console.log(`מורה בעל ת"ז "${id}" כבר קיים במערכת.`);
    }
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
    notes.push(`מורה "${firstName} ${lastName}" נוצר בDB.`);
}

async function createChild(firstName, lastName, id, birth, gender, gamesPassword,
    address, phone, level) {
    // Validate client input
    const { error } = validateChild({
        firstName, lastName, id, birth, gender, gamesPassword,
        address, phone, level
    });
    // Assert validation
    if (error) {
        notes.push(error.details[0].message);
        return console.log(error.details[0].message);
    }
    // Check if the child exist
    let child = await Child.findOne({ id });
    // Response 400 Bad Request if the child exist
    if (child) {
        notes.push(`ילד בעל ת"ז "${id}" כבר קיים במערכת.`);
        return console.log(`ילד בעל ת"ז "${id}" כבר קיים במערכת.`);
    }
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
    notes.push(`ילד "${firstName} ${lastName}" נוצר בDB.`);
}

async function createField(name, description) {
    // validate input
    const { error } = validateField({ name, description });
    if (error) {
        notes.push(error.details[0].message);
        return console.log(error.details[0].message);
    }
    // Check if the child exist
    let field = await Field.findOne({ name });
    // Response 400 Bad Request if the child exist
    if (field) {
        notes.push(`תחום בשם "${name}" כבר קיים במערכת.`);
        return console.log(`תחום בשם "${name}" כבר קיים במערכת.`);
    }
    field = new Field({
        name,
        description
    });

    field = await field.save();
    notes.push(`תחום "${name}" נוצר בDB.`);
}

async function createGame(title, description, fieldName, icon, link) {
    // Validate field
    const field = await Field.findOne({ name: fieldName });
    if (!field) return console.log(`תחום הלימודים "${fieldName}" אינו קיים במערכת.`);
    // Validate client input
    const { error } = validateGame({ title, description, field, icon, link });
    // Assert validation
    if (error) {
        notes.push(error.details[0].message);
        return console.log(error.details[0].message);
    }
    // Check if the child exist
    let game = await Game.findOne({ title });
    // Response 400 Bad Request if the child exist
    if (game) {
        notes.push(`משחק בשם "${title}" כבר קיים במערכת.`);
        return console.log(`משחק בשם "${title}" כבר קיים במערכת.`);
    }
    // Create new document
    game = new Game({
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
    notes.push(`משחק "${title}" נוצר בDB.`);
}

async function addChild(parentId, childId){
    const child = await Child.findOne({ id: childId });
    // Assert Child data
    if (!child) return console.log(`ילד בעל ת"ז "${childId}" אינו קיים במערכת.`);
    // Try to update the selected document
    try {
        // res.status(200).send(user);
        const parent = await Parent.findOneAndUpdate({ id: parentId }, {
            "$addToSet": { children: child._id }
        }, {
            new: true, useFindAndModify: false
        }).populate('children', 'id firstName lastName');
        // await parent.save();
        // Assert update completed successfully
        if (!parent) {
            notes.push(`Parent ${parentId} was not found.`);
            return console.log(`Parent ${parentId} was not found.`);
        }
        // Send response to client
        notes.push(`ילד בעל ת"ז "${childId}" נוסף להורה.`);
    } catch (ex) {
        notes.push(`Failed to update.`);
        return console.log(`Failed to update.`);
    }
}

async function initDB() {
    await createParent('משה', 'פרץ', '100', '12345', '0521111111');
    await createParent('אביב', 'גפן', '101', '12345', '0522222222');

    await createTeacher('עליזה', 'שמשוני', '10', '12345', '0523333333');

    await createChild('יזהר', 'גפן', '1001', new Date(2010, 5, 1), 'זכר', '12', 'נתניה', '0522222233', 'ג');
    await createChild('יונית', 'פרץ', '1002', new Date(2012, 10, 1), 'נקבה', '12', 'הרצליה', '0522222233', 'א');

    await createField('חשבון', 'תרגול פעולות חשבון בסיסיות: חיבור, חיסור וכפל');
    await createField('אנגלית', 'תרגול אותיות ומילים בשפה האנגלית');
    await createField('צבעים', 'תרגול הכרת צבעים');
    await createField('זכרון', 'תרגול ואימון הזכרון');


    await createGame('תרגילי חשבון', 'שחק בפעולות חשבון עם חברך!', 'חשבון', 'icons/math.png', './math/math.html');
    await createGame('התאמת תמונות למילים', 'התאם תמונות למילים באנגלית', 'אנגלית', 'icons/english.png', './english/english.html');
    await createGame('שילוב צבעים', 'תרגלו שילובי צבעים ולימדו צבעים חדשים', 'צבעים', 'icons/color.png', './ColorGame/ColorGame2.html');
    await createGame('כרטיסיות זכרון', 'שחקו להנאתכם משחק הזכרון ופיתחו יכולות חדשות!', 'זכרון', 'icons/memory.png', './memoryCard/memoryGame2/memoryGame2.html');

    return notes;
}


async function addChildren() {
    await addChild('100', '1001');
    await addChild('100', '1002');
    return notes;
}

exports.initDB = initDB;
exports.addChildren = addChildren;