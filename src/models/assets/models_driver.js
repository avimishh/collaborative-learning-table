const mongoose = require('mongoose');
const config = require('config');
const {
    Parent,
    validateParent
} = require('../parent');
const {
    Teacher,
    validateTeacher
} = require('../teacher');
const {
    Child,
    validateChild
} = require('../child');
const {
    Field
} = require('../field');
const {
    Note
} = require('../note');
const {
    Game,
    validateGame
} = require('../game');
const {
    Stat
} = require('../stat');
const {
    Stats
} = require('./stats');
// const { createClassroom } = require('../classroom');

const save_Data_DB = require('./../../public/games/StatsSaver');

const bcrypt = require('bcrypt'); // Password Hash

var notes = [];

//#region Functions For creating new Objects

async function createField(name, description, nameEng) {
    // validate input
    const {
        error
    } = validateField({
        name,
        description,
        nameEng
    });
    if (error)
        return error.details[0].message;
    // Check if the field already exist
    if (await Field.findOne({
            name
        }))
        return `תחום בשם "${name}" כבר קיים במערכת.`;
    let field = new Field({
        name,
        description,
        nameEng
    });
    return await field.save();
}

async function createParent({
    firstName,
    lastName,
    id,
    password,
    phone
}) {
    const {
        error
    } = validateParent({
        firstName,
        lastName,
        id,
        password,
        phone
    });
    if (error) { // Assert validation
        notes.push(error.details[0].message);
        return console.log(reverseString(error.details[0].message));
    }
    // Check if the parent exist
    let parent = await Parent.findOne({
        id
    });
    if (parent) {
        notes.push(`הורה בעל ת"ז "${id}" כבר קיים במערכת.`);
        return console.log(reverseString(`הורה בעל ת"ז "${id}" כבר קיים במערכת.`));
    }
    let children = await getChildrenOfParent(id);
    let childrenId = [];
    (children).forEach(child => {
        childrenId.push(child._id);
    });
    // Create new document
    parent = new Parent({
        firstName,
        lastName,
        id,
        password,
        phone,
        children: childrenId
    }).populate('children', 'id firstName lastName');
    // Password Hash
    const salt = await bcrypt.genSalt(10);
    parent.password = await bcrypt.hash(parent.password, salt);
    // Save to DataBase
    parent = await parent.save();
    notes.push(`הורה "${firstName} ${lastName}" נוצר בDB.`);
}

async function getChildrenOfParent(parentId) {
    let children = await Child.find({
        parentsId: parentId
    }); //.select("_id");
    return children;
}

async function createTeacher({
    firstName,
    lastName,
    id,
    password,
    phone
}) {
    const {
        error
    } = validateTeacher({
        firstName,
        lastName,
        id,
        password,
        phone
    });
    if (error) { // Assert validation
        notes.push(error.details[0].message);
        return console.log(reverseString(error.details[0].message));
    }
    // Check if the teacher exist
    let teacher = await Teacher.findOne({
        id
    });
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
    // teacher.assignToClassroom(req.body.classroomCode);
    // Password Hash
    const salt = await bcrypt.genSalt(10);
    teacher.password = await bcrypt.hash(teacher.password, salt);
    // Save to DataBase
    teacher = await teacher.save();
    notes.push(`מורה "${firstName} ${lastName}" נוצר בDB.`);
}

async function createChild({
    firstName,
    lastName,
    id,
    birth,
    gender,
    gamesPassword,
    address,
    phone,
    level,
    parentId1,
    parentId2
}) {
    const {
        error
    } = validateChild({ // Validate client input
        firstName,
        lastName,
        id,
        birth,
        gender,
        gamesPassword,
        address,
        phone
    });
    if (error) { // Assert validation
        notes.push(error.details[0].message);
        return console.log(reverseString(error.details[0].message));
    }
    // Check if the child exist
    let child = await Child.findOne({
        id
    });
    if (child) {
        notes.push(`ילד בעל ת"ז "${id}" כבר קיים במערכת.`);
        return console.log(reverseString(`ילד בעל ת"ז "${id}" כבר קיים במערכת.`));
    }
    let stat = await Stat.findOne({
        child_id: id
    });
    if (!stat) {
        stat = new Stat({
            childId: id,
            childName: `${firstName} ${lastName}`,
            sheets: {
                math: [],
                english: [],
                memory: [],
                colors: [],
                hebrew: [],
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
        // level:"רופין",
        stats: stat._id,
        parentsId: [parentId1, parentId2]
    });
    // Save to DataBase
    child = await child.save();
    notes.push(`ילד "${firstName} ${lastName}" נוצר בDB.`);
}

async function createGame({
    title,
    description,
    fieldName,
    icon,
    link
}) {
    // Validate field
    const field = await Field.findOne({
        name: fieldName
    });
    if (!field) return console.log(reverseString(`תחום הלימודים "${fieldName}" אינו קיים במערכת.`));
    // Validate client input
    const {
        error
    } = validateGame({
        title,
        description,
        field,
        icon,
        link
    });
    if (error) { // Assert validation
        notes.push(error.details[0].message);
        return console.log(reverseString(error.details[0].message));
    }
    // Check if the game exist
    let game = await Game.findOne({
        title
    });
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
//#endregion

async function addStat(child_id, stats, game_id) {

    await save_Data_DB(child_id, stats, game_id);

    const child = await Child.findOne({
        id: childId
    });
    // Assert Child data
    if (!child) return console.log(reverseString(`ילד בעל ת"ז "${childId}" אינו קיים במערכת.`));
    // Try to update the selected document
    try {
        // res.status(200).send(user);
        const parent = await Parent.findOneAndUpdate({
            id: parentId
        }, {
            "$addToSet": {
                children: child._id
            }
        }, {
            new: true,
            useFindAndModify: false
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

//#region Add New Data To DB

async function addFields() {
    await createField(
        'חשבון',
        'תרגול פעולות חשבון בסיסיות: חיבור, חיסור וכפל',
        'math'
    );
    await createField('אנגלית', 'תרגול אותיות ומילים בשפה האנגלית', 'english');
    await createField('צבעים', 'תרגול הכרת צבעים', 'colors');
    await createField('זכרון', 'תרגול ואימון הזכרון', 'memory');
    await createField('עברית', 'תרגול מילים בשפה העברית', 'hebrew');
}

async function addParents() {

    // יוסי אבוקסיס
    await createParent({
        firstName: "יוסי",
        lastName: "אבוקסיס",
        id: "206054874",
        password: "12345",
        phone: "05" + "278945"
    });
    // משה פרץ
    await createParent({
        firstName: "משה",
        lastName: "פרץ",
        id: "206054100",
        password: "12345",
        phone: "05" + "111945"
    });
    // אביב גפן
    await createParent({
        firstName: "אביב",
        lastName: "גפן",
        id: "206054101",
        password: "12345",
        phone: "05" + "221922"
    });
    // אילנה גפן
    await createParent({
        firstName: "אילנה",
        lastName: "גפן",
        id: "206054102",
        password: "12345",
        phone: "05" + "221944"
    });
    // שימי תבורי
    await createParent({
        firstName: "שימי",
        lastName: "תבורי",
        id: "206054133",
        password: "12345",
        phone: "05" + "221944"
    });
}

async function addTeachers() {

    // שולה זקן
    await createTeacher({
        firstName: "שולה",
        lastName: "זקן",
        id: "201132541",
        password: "12345",
        phone: "05" + "7698745"
    });
    // זהבה בן
    await createTeacher({
        firstName: "זהבה",
        lastName: "בן",
        id: "201345600",
        password: "12345",
        phone: "05" + "8768645"
    });
    // אייל ברקוביץ'
    await createTeacher({
        firstName: "אייל",
        lastName: "ברקוביץ'",
        id: "208851202",
        password: "12345",
        phone: "05" + "657522"
    });
    // אלון מזרחי
    await createTeacher({
        firstName: "אלון",
        lastName: "מזרחי",
        id: "204564780",
        password: "12345",
        phone: "05" + "223564"
    });
}

async function addChildren() {

    // יותם גפן
    await createChild({
        firstName: "יותם",
        lastName: "גפן",
        id: "10011",
        gamesPassword: "12",
        phone: "05" + "879212",
        address: "נתניה, שלום חבר 94",
        birth: new Date(2011, 10, 12),
        gender: "זכר",
        level: "רופין",
        parentId1: "206054101",
        parentId2: "206054102"
    });
    // ליאור גפן
    await createChild({
        firstName: "ליאור",
        lastName: "גפן",
        id: "10022",
        gamesPassword: "12",
        phone: "05" + "879256",
        address: "נתניה, שלום חבר 94",
        birth: new Date(2013, 3, 4),
        gender: "נקבה",
        level: "רופין",
        parentId1: "206054101",
        parentId2: "206054102"
    });
    // אלרואי תבורי
    await createChild({
        firstName: "אלרואי",
        lastName: "תבורי",
        id: "10033",
        gamesPassword: "12",
        phone: "05" + "879212",
        address: "נתניה, שלום חבר 94",
        birth: new Date(2011, 10, 12),
        gender: "זכר",
        level: "רופין",
        parentId1: "206054133"
    });
    // בנאל תבורי
    await createChild({
        firstName: "בנאל",
        lastName: "תבורי",
        id: "10044",
        gamesPassword: "12",
        phone: "05" + "879256",
        address: "נתניה, שלום חבר 94",
        birth: new Date(2013, 3, 4),
        gender: "נקבה",
        level: "רופין",
        parentId1: "206054133"
    });
}

async function addGames() {
    await createGame({
        title: "תרגול פעולות חשבון",
        description: "פתרו יחד תרגילי חשבון וציברו ניקוד!",
        fieldName: "חשבון",
        icon: "icons/math.png",
        link: "./math/math.html"
    });
    await createGame({
        title: "התאמת תמונות למילים באנגלית",
        description: "זמן לתרגל אנגלית - התאימו תמונות למילים המתאימות בשפה האנגלית ",
        fieldName: "אנגלית",
        icon: "icons/english.png",
        link: "./english/english.html"
    });
    await createGame({
        title: "שילוב צבעים",
        description: "תרגלו שילובי צבעים ולימדו צבעים חדשים",
        fieldName: "צבעים",
        icon: "icons/color.png",
        link: "./ColorGame/ColorGame2.html"
    });
    await createGame({
        title: "כרטיסיות זיכרון",
        description: "שחקו ותהנו ממשחק זכרון שיפתח לכם יכולות חדשות!",
        fieldName: "זכרון",
        icon: "icons/memory.png",
        link: "./memoryCard/memoryGame2/memoryGame2.html"
    });
    await createGame({
        title: "חשבון עם דרגון בול",
        description: "התאמנו על כללי החשבון ושחקו עם הדמויות האהובות עליכן",
        fieldName: "חשבון",
        icon: "icons/dbz.png",
        link: "./dbz/dbz.html"
    });
    await createGame({
        title: "תרגול צבעים בשפה האנגלית",
        description: "לימדו את הצבע וקלעו את הכדורים בצבע המתאים לתוך הסל",
        fieldName: "צבעים",
        icon: "icons/color2.png",
        link: "./ColorGame2/ColorGame2.html"
    });
    await createGame({
        title: "גלגל המזל בשפה העברית",
        description: "אייתו את שמות החיות בעברית",
        fieldName: "עברית",
        icon: "icons/english2.png",
        link: "./hebrew/hebrew.html"
    });
}

//#endregion


async function check() {
    await addStats();
}

async function initDB() {
    notes = [];

    await addChildren();

    await addParents();
    await addTeachers();
    await addFields();
    await addGames();

    return notes;
}


async function addStats() {
    notes = [];

    const date = [new Date(2020, 05, 03), new Date(2020, 05, 04),
        new Date(2020, 05, 04), new Date(2020, 05, 12),
        new Date(2020, 05, 14), new Date(2020, 05, 18),
        new Date(2020, 05, 21), new Date(2020, 06, 02),
        new Date(2020, 06, 04), new Date(2020, 06, 06)
    ];

    for (let i = 0; i < date.length; i++) {
        await addMathStat('123456', date[i]);
        await addEnglishStat('123456', date[i]);
    }

    notes.push('success');
    return notes;
}

async function addMathStat(child_id, date) {
    let field = 'math';
    let subFields = [{
            eng: 'plus',
            heb: 'חיבור'
        },
        {
            eng: 'minus',
            heb: 'חיסור'
        },
        {
            eng: 'multi',
            heb: 'כפל'
        }
    ];

    addStat(child_id, date, field, subFields)
}

async function addEnglishStat(child_id, date) {
    const field = 'english';
    const subFields = [{
        eng: 'wordMatchToPicture',
        heb: 'התאמת מילה לתמונה'
    }];

    addStat(child_id, date, field, subFields)
}

async function addStat(child_id, date, field, subFields) {
    let player_stat = new Stats(field, subFields)
    player_stat.subFields.forEach(subField => {
        subField.asked = getRandNum();
        subField.correct = subField.asked > 0 ? getRandNum(subField.asked + 1) : 0;
    });

    // Select random game
    let games = await Game.find({
        "field.nameEng": field
    });
    let randomIndex = getRandNum(games.length);
    let randomGame = games[randomIndex]._id;
    await save_Data_DB(child_id, player_stat, randomGame, date);
}


function getRandNum(to = 10) {
    return Math.floor((Math.random() * to) + 0);
}

function reverseString(str) {
    return str.split('').reverse().join('');
}

//#region Old Code
async function addChild(parentId, childId) {
    const child = await Child.findOne({
        id: childId
    });
    // Assert Child data
    if (!child) return console.log(reverseString(`ילד בעל ת"ז "${childId}" אינו קיים במערכת.`));
    // Try to update the selected document
    try {
        // res.status(200).send(user);
        const parent = await Parent.findOneAndUpdate({
            id: parentId
        }, {
            "$addToSet": {
                children: child._id
            }
        }, {
            new: true,
            useFindAndModify: false
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

async function belongChildrenToParent() {
    notes = [];
    await addChild('100', '1001');
    await addChild('100', '1002');
    return notes;
}
// let p_Plus_a = getRandNum();
// let p_Plus_c = p_Plus_a > 0 ? getRandNum(p_Plus_a + 1) : 0;
// let p_Minus_a = getRandNum();
// let p_Minus_c = p_Minus_a > 0 ? getRandNum(p_Minus_a + 1) : 0;
// let p_Multi_a = getRandNum();
// let p_Multi_c = p_Multi_a > 0 ? getRandNum(p_Multi_a + 1) : 0;
// let p_NoQ = p_Plus_a + p_Minus_a + p_Multi_a;
// let p_NoC = p_Plus_c + p_Minus_c + p_Multi_c;

// let mathStat = {
//     numOfQuestions: p_NoQ,
//     numOfCorrectAnswers: p_NoC,
//     _stats: [{
//         operator: 'plus',
//         asked: p_Plus_a,
//         correct: p_Plus_c
//     },
//     {
//         operator: 'minus',
//         asked: p_Minus_a,
//         correct: p_Minus_c
//     },
//     {
//         operator: 'multi',
//         asked: p_Multi_a,
//         correct: p_Multi_c
//     }]
// }

// const p_NoQ = [10, 8, 15, 12, 14, 8, 12, 10, 15];
// const p_NoC = [3, 3, 9, 9, 10, 4, 10, 3, 10];
// const p_Plus_a = [5, 3, 6, 7, 6, 4, 6, 5, 8];
// const p_Plus_c = [2, 2, 4, 6, 5, 2, 6, 2, 7];
// const p_Minus_a = [3, 3, 5, 3, 4, 2, 3, 4, 4];
// const p_Minus_c = [1, 0, 3, 2, 3, 1, 2, 1, 2];
// const p_Multi_a = [2, 2, 4, 1, 4, 2, 3, 1, 3];
// const p_Multi_c = [0, 1, 2, 1, 2, 1, 2, 0, 1];

// await Classroom.createClassroom("כיתת המצטיינים של עליזה");
// await createTeacher('עליזה', 'שמשוני', '10', '12345', '0523333333');

// await Classroom.createClassroom("כיתת היפים והאמיצים של דפנה");
// await Classroom.createClassroom("כיתה ב'2");

//#endregion

exports.check = check;
exports.initDB = initDB;
exports.belongChildrenToParent = belongChildrenToParent;
exports.addStats = addStats;