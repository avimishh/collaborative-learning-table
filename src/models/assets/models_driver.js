const mongoose = require('mongoose');
const config = require('config');
const { Parent, validateParent } = require('../parent');
const { Teacher, validateTeacher } = require('../teacher');
const { Child, validateChild } = require('../child');
const { Field, createField } = require('../field');
const { Game, validateGame } = require('../game');
const { Stat } = require('../stat');
const { createClassroom } = require('../classroom');

const save_Data_DB = require('./../../public/games/StatsSaver');

const bcrypt = require('bcrypt'); // Password Hash

var notes = [];

async function createParent(firstName, lastName, id, password, phone) {
    const { error } = validateParent({ firstName, lastName, id, password, phone });
    // Assert validation
    if (error) {
        notes.push(error.details[0].message);
        return console.log(reverseString(error.details[0].message));
    }
    // Check if the parent exist
    let parent = await Parent.findOne({ id });
    // Response 400 Bad Request if the parent exist
    if (parent) {
        notes.push(`הורה בעל ת"ז "${id}" כבר קיים במערכת.`);
        return console.log(reverseString(`הורה בעל ת"ז "${id}" כבר קיים במערכת.`));
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
        return console.log(reverseString(error.details[0].message));
    }
    // Check if the teacher exist
    let teacher = await Teacher.findOne({ id });
    // Response 400 Bad Request if the teacher exist
    if (teacher) {
        notes.push(`מורה בעל ת"ז "${id}" כבר קיים במערכת.`);
        return console.log(reverseString(`מורה בעל ת"ז "${id}" כבר קיים במערכת.`));
    }
    // Create new document
    teacher = new Teacher({
        firstName,
        lastName,
        id,
        password,
        phone
    });
    teacher.assignToClassroom(req.body.classroomCode);
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
        return console.log(reverseString(error.details[0].message));
    }
    // Check if the child exist
    let child = await Child.findOne({ id });
    // Response 400 Bad Request if the child exist
    if (child) {
        notes.push(`ילד בעל ת"ז "${id}" כבר קיים במערכת.`);
        return console.log(reverseString(`ילד בעל ת"ז "${id}" כבר קיים במערכת.`));
    }
    let stat = await Stat.findOne({ child_id: id });
    if (!stat) {
        stat = new Stat({
            child_id: id,
            sheets: {
                math: [],
                english: [],
                memory: [],
                color: [],
            }
        });
        stat = await stat.save();
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
        level,
        stats: stat._id
    });
    // child.stat = stat._id;
    // Save to DataBase
    child = await child.save();
    notes.push(`ילד "${firstName} ${lastName}" נוצר בDB.`);
}

async function createGame(title, description, fieldName, icon, link) {
    // Validate field
    const field = await Field.findOne({ name: fieldName });
    if (!field) return console.log(reverseString(`תחום הלימודים "${fieldName}" אינו קיים במערכת.`));
    // Validate client input
    const { error } = validateGame({ title, description, field, icon, link });
    // Assert validation
    if (error) {
        notes.push(error.details[0].message);
        return console.log(reverseString(error.details[0].message));
    }
    // Check if the child exist
    let game = await Game.findOne({ title });
    // Response 400 Bad Request if the child exist
    if (game) {
        notes.push(`משחק בשם "${title}" כבר קיים במערכת.`);
        return console.log(reverseString(`משחק בשם "${title}" כבר קיים במערכת.`));
    }
    // Create new document
    game = new Game({
        title,
        description,
        field: {
            _id: field._id,
            name: field.name,
            nameEng: field.nameEng,
            description: field.description
        },
        icon,
        link
    });
    // Save to DataBase
    await game.save();
    notes.push(`משחק "${title}" נוצר בDB.`);
}

async function addChild(parentId, childId) {
    const child = await Child.findOne({ id: childId });
    // Assert Child data
    if (!child) return console.log(reverseString(`ילד בעל ת"ז "${childId}" אינו קיים במערכת.`));
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
            return console.log(reverseString(`Parent ${parentId} was not found.`));
        }
        // Send response to client
        notes.push(`ילד בעל ת"ז "${childId}" נוסף להורה.`);
    } catch (ex) {
        notes.push(`Failed to update.`);
        return console.log(reverseString(`Failed to update.`));
    }
}

async function addStat(child_id, stats, game_id) {

    await save_Data_DB(child_id, stats, game_id);

    const child = await Child.findOne({ id: childId });
    // Assert Child data
    if (!child) return console.log(reverseString(`ילד בעל ת"ז "${childId}" אינו קיים במערכת.`));
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
            return console.log(reverseString(`Parent ${parentId} was not found.`));
        }
        // Send response to client
        notes.push(`ילד בעל ת"ז "${childId}" נוסף להורה.`);
    } catch (ex) {
        notes.push(`Failed to update.`);
        return console.log(reverseString(`Failed to update.`));
    }
}

async function addFields() {
    await createField(
        'חשבון',
         'תרגול פעולות חשבון בסיסיות: חיבור, חיסור וכפל',
         'math'
         );
    await createField('אנגלית', 'תרגול אותיות ומילים בשפה האנגלית', 'english');
    await createField('צבעים', 'תרגול הכרת צבעים', 'colors');
    await createField('זכרון', 'תרגול ואימון הזכרון', 'memory');
}


async function initDB() {
    notes = [];
    // await Classroom.createClassroom("כיתת המצטיינים של עליזה");
    // await createTeacher('עליזה', 'שמשוני', '10', '12345', '0523333333');


    // await Classroom.createClassroom("כיתת היפים והאמיצים של דפנה");
    // await Classroom.createClassroom("כיתה ב'2");


    await createParent('משה', 'פרץ', '100', '12345', '0521111111');
    await createParent('אביב', 'גפן', '101', '12345', '0522222222');

    await createTeacher('עליזה', 'שמשוני', '10', '12345', '0523333333');

    await createChild('יותם', 'גפן', '1001', new Date(2010, 5, 1), 'זכר', '12', 'נתניה', '0522222233', 'ג');
    await createChild('ליאור', 'גפן', '1002', new Date(2012, 10, 1), 'נקבה', '12', 'הרצליה', '0522222233', 'א');

    await createField(
        'חשבון',
         'תרגול פעולות חשבון בסיסיות: חיבור, חיסור וכפל',
         'math'
         );
    await createField('אנגלית', 'תרגול אותיות ומילים בשפה האנגלית', 'english');
    await createField('צבעים', 'תרגול הכרת צבעים', 'colors');
    await createField('זכרון', 'תרגול ואימון הזכרון', 'memory');


    await createGame('תרגילי חשבון', 'שחק בפעולות חשבון עם חברך!', 'חשבון', 'icons/math.png', './math/math.html');
    await createGame('התאמת תמונות למילים', 'התאם תמונות למילים באנגלית', 'אנגלית', 'icons/english.png', './english/english.html');
    await createGame('שילוב צבעים', 'תרגלו שילובי צבעים ולימדו צבעים חדשים', 'צבעים', 'icons/color.png', './ColorGame/ColorGame2.html');
    await createGame('כרטיסיות זכרון', 'שחקו להנאתכם משחק הזכרון ופיתחו יכולות חדשות!', 'זכרון', 'icons/memory.png', './memoryCard/memoryGame2/memoryGame2.html');
    await createGame('חשבון עם דרגון בול', 'התאמנו על כללי החשבון ושחקו עם הדמויות האהובות עליכן', 'חשבון', 'icons/dbz.png', './dbz/dbz.html');
    await createGame('תרגול צבעים בשפה האנגלית', 'למדנו את הצבע וקלעו את הכדורים בצבע המתאים לתוך הסל', 'צבעים', 'icons/color2.png', './ColorGame2/ColorGame2.html');
    await createGame('גלגל המזל בשפה האנגלית', 'אייתו את שמות החיות באנגלית', 'אנגלית', 'icons/english2.png', './english2/english2.html');

    return notes;
}


async function belongChildrenToParent() {
    notes = [];
    await addChild('100', '1001');
    await addChild('100', '1002');
    return notes;
}

async function addStats() {
    notes = [];

    const date = [new Date(2020, 05, 03), new Date(2020, 05, 04), new Date(2020, 05, 12),
    new Date(2020, 05, 14), new Date(2020, 05, 18),
    new Date(2020, 05, 21), new Date(2020, 06, 02),
    new Date(2020, 06, 04), new Date(2020, 06, 06)];
    // const p_NoQ = [10, 8, 15, 12, 14, 8, 12, 10, 15];
    // const p_NoC = [3, 3, 9, 9, 10, 4, 10, 3, 10];
    // const p_Plus_a = [5, 3, 6, 7, 6, 4, 6, 5, 8];
    // const p_Plus_c = [2, 2, 4, 6, 5, 2, 6, 2, 7];
    // const p_Minus_a = [3, 3, 5, 3, 4, 2, 3, 4, 4];
    // const p_Minus_c = [1, 0, 3, 2, 3, 1, 2, 1, 2];
    // const p_Multi_a = [2, 2, 4, 1, 4, 2, 3, 1, 3];
    // const p_Multi_c = [0, 1, 2, 1, 2, 1, 2, 0, 1];

    for (let i = 0; i < date.length; i++) {
        if (Math.random > 0.5)
            await addMathStat('1001', '5f2c39eb0a7d2569742bb278', date[i]);
        else
            await addMathStat('1001', '5f37ce4b11602061b06218d6', date[i]);
    }

    for (let i = 0; i < date.length; i++) {
        if (Math.random > 0.5)
        await addMathStat('1002', '5f2c39eb0a7d2569742bb278', date[i]);
    else
        await addMathStat('1002', '5f37ce4b11602061b06218d6', date[i]);
    }


    for (let i = 0; i < date.length; i++) {
        if (Math.random > 0.5)
        await addMathStat('1001', '5f2c39eb0a7d2569742bb27a', date[i]);
    else
        await addMathStat('1001', '5f37ce4b11602061b06218da', date[i]);
    }

    for (let i = 0; i < date.length; i++) {
        if (Math.random > 0.5)
        await addMathStat('1002', '5f2c39eb0a7d2569742bb27a', date[i]);
    else
        await addMathStat('1002', '5f37ce4b11602061b06218da', date[i]);
    }

    notes.push('success');
    return notes;
}

async function addMathStat(child_id, game_id, date) {
    let p_Plus_a = getRandNum();
    let p_Plus_c = p_Plus_a > 0 ? getRandNum(p_Plus_a + 1) : 0;
    let p_Minus_a = getRandNum();
    let p_Minus_c = p_Minus_a > 0 ? getRandNum(p_Minus_a + 1) : 0;
    let p_Multi_a = getRandNum();
    let p_Multi_c = p_Multi_a > 0 ? getRandNum(p_Multi_a + 1) : 0;
    let p_NoQ = p_Plus_a + p_Minus_a + p_Multi_a;
    let p_NoC = p_Plus_c + p_Minus_c + p_Multi_c;

    let mathStat = {
        numOfQuestions: p_NoQ,
        numOfCorrectAnswers: p_NoC,
        _stats: [{
            operator: 'plus',
            asked: p_Plus_a,
            correct: p_Plus_c
        },
        {
            operator: 'minus',
            asked: p_Minus_a,
            correct: p_Minus_c
        },
        {
            operator: 'multi',
            asked: p_Multi_a,
            correct: p_Multi_c
        }]
    }

    await save_Data_DB(child_id, mathStat, game_id, date);
}

async function addEngStat(child_id, game_id, date) {
    let p_engToHeb_a = getRandNum();
    let p_engToHeb_c = p_engToHeb_a > 0 ? getRandNum(p_engToHeb_a + 1) : 0;
    let p_hebToEng_a = getRandNum();
    let p_hebToEng_c = p_hebToEng_a > 0 ? getRandNum(p_hebToEng_a + 1) : 0;
    let p_picToEng_a = getRandNum();
    let p_picToEng_c = p_picToEng_a > 0 ? getRandNum(p_picToEng_a + 1) : 0;
    let p_NoQ = p_engToHeb_a + p_hebToEng_a + p_picToEng_a;
    let p_NoC = p_engToHeb_c + p_hebToEng_c + p_picToEng_c;

    let englishStat = {
        numOfQuestions: p_NoQ,
        numOfCorrectAnswers: p_NoC,
        _stats: [{
            operator: 'engToHeb',
            asked: p_engToHeb_a,
            correct: p_engToHeb_c
        },
        {
            operator: 'hebToEng',
            asked: p_hebToEng_a,
            correct: p_hebToEng_c
        },
        {
            operator: 'picToEng',
            asked: p_picToEng_a,
            correct: p_picToEng_c
        }]
    }

    await save_Data_DB(child_id, englishStat, game_id, date);
}

function getRandNum(to = 10) {
    return Math.floor((Math.random() * to) + 0);
}

function reverseString(str) {
    return str.split('').reverse().join('');
}

exports.initDB = initDB;
exports.addFields = addFields;
exports.belongChildrenToParent = belongChildrenToParent;
exports.addStats = addStats;