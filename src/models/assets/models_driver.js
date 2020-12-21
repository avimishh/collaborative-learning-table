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
    // const {
    //     error
    // } = validateField({
    //     name,
    //     description,
    //     nameEng
    // });
    // if (error)
    //     return error.details[0].message;
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


//#region Add New Data To DB

async function addFields() {
    await createField('חשבון', 'תרגול פעולות חשבון בסיסיות: חיבור, חיסור וכפל', 'math');
    await createField('אנגלית', 'תרגול אותיות ומילים בשפה האנגלית', 'english');
    await createField('צבעים', 'תרגול הכרת צבעים', 'colors');
    await createField('זכרון', 'תרגול ואימון הזכרון', 'memory');
    await createField('עברית', 'תרגול מילים בשפה העברית', 'hebrew');
}

async function addParents() {

    // 1. יוסי אבוקסיס
    await createParent({
        firstName: "יוסי",
        lastName: "אבוקסיס",
        id: "206054874",
        password: "12345",
        phone: "05" + "278945"
    });
    // 2. משה פרץ
    await createParent({
        firstName: "משה",
        lastName: "פרץ",
        id: "206054100",
        password: "12345",
        phone: "05" + "111945"
    });
    // 3. אביב גפן
    await createParent({
        firstName: "אביב",
        lastName: "גפן",
        id: "206054101",
        password: "12345",
        phone: "05" + "221922"
    });
    // 4. אילנה גפן
    await createParent({
        firstName: "אילנה",
        lastName: "גפן",
        id: "206054102",
        password: "12345",
        phone: "05" + "221944"
    });
    // 5. שימי תבורי
    await createParent({
        firstName: "שימי",
        lastName: "תבורי",
        id: "206054133",
        password: "12345",
        phone: "05" + "221484"
    });
    // 6. איציק זוהר
    await createParent({
        firstName: "איציק",
        lastName: "זוהר",
        id: "208163427",
        password: "12345",
        phone: "05" + "775468"
    });
    // 7. מושיק עפיה
    await createParent({
        firstName: "מושיק",
        lastName: "עפיה",
        id: "208163741",
        password: "12345",
        phone: "05" + "111682"
    });
    // 8. אביבית אבוקסיס
    await createParent({
        firstName: "אביבית",
        lastName: "אבוקסיס",
        id: "208163432",
        password: "12345",
        phone: "05" + "221725"
    });
    // 9. גל גדות
    await createParent({
        firstName: "גל",
        lastName: "גדות",
        id: "208163284",
        password: "12345",
        phone: "05" + "221789"
    });
    // 10. בר רפאלי
    await createParent({
        firstName: "בר",
        lastName: "רפאלי",
        id: "208163358",
        password: "12345",
        phone: "05" + "221938"
    });
    // 11. אמנון אברמוביץ'
    await createParent({
        firstName: "אמנון",
        lastName: "אברמוביץ'",
        id: "208163518",
        password: "12345",
        phone: "05" + "221938"
    });
    // 11. צילה אברמוביץ'
    await createParent({
        firstName: "צילה",
        lastName: "אברמוביץ'",
        id: "208163528",
        password: "12345",
        phone: "05" + "221458"
    });
}

async function addTeachers() {

    // עליזה שמשוני
    await createTeacher({
        firstName: "עליזה",
        lastName: "שמשוני",
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
    // אברי גלעד'
    await createTeacher({
        firstName: "אברי",
        lastName: "גלעד",
        id: "208851202",
        password: "12345",
        phone: "05" + "657522"
    });
    // אדיר מילר
    await createTeacher({
        firstName: "אדיר",
        lastName: "מילר",
        id: "204564780",
        password: "12345",
        phone: "05" + "223564"
    });
}

async function addChildren() {

    // 1. אלחנן פרץ
    await createChild({
        firstName: "אלחנן",
        lastName: "פרץ",
        id: "10005",
        gamesPassword: "12",
        phone: "05" + "879412",
        address: "תל אביב, דיזינגוף 2",
        birth: new Date(2011, 10, 12),
        gender: "זכר",
        level: "רופין",
        parentId1: "206054100"
    });
    // 2. הילה אבוקסיס
    await createChild({
        firstName: "הילה",
        lastName: "אבוקסיס",
        id: "10006",
        gamesPassword: "12",
        phone: "05" + "879456",
        address: "חיפה, רוממה 42",
        birth: new Date(2013, 11, 7),
        gender: "נקבה",
        level: "רופין",
        parentId1: "206054874",
        parentId2: "208163432"
    });
    // 3. שמעון אבוקסיס
    await createChild({
        firstName: "שמעון",
        lastName: "אבוקסיס",
        id: "10007",
        gamesPassword: "12",
        phone: "05" + "879212",
        address: "חיפה, רוממה 42",
        birth: new Date(2013, 11, 7),
        gender: "נקבה",
        level: "רופין",
        parentId1: "206054874",
        parentId2: "208163432"
    });
    // 4. יעל אבוקסיס
    await createChild({
        firstName: "יעל",
        lastName: "אבוקסיס",
        id: "10008",
        gamesPassword: "12",
        phone: "05" + "879256",
        address: "חיפה, רוממה 42",
        birth: new Date(2015, 2, 5),
        gender: "נקבה",
        level: "רופין",
        parentId1: "206054874",
        parentId2: "208163432"
    });
    // 5. יותם גפן
    await createChild({
        firstName: "יותם",
        lastName: "גפן",
        id: "10001",
        gamesPassword: "12",
        phone: "05" + "879212",
        address: "נתניה, שלום חבר 94",
        birth: new Date(2012, 10, 12),
        gender: "זכר",
        level: "רופין",
        parentId1: "206054101",
        parentId2: "206054102"
    });
    // 6. ליאור גפן
    await createChild({
        firstName: "ליאור",
        lastName: "גפן",
        id: "10002",
        gamesPassword: "12",
        phone: "05" + "879256",
        address: "נתניה, שלום חבר 94",
        birth: new Date(2013, 3, 4),
        gender: "נקבה",
        level: "רופין",
        parentId1: "206054101",
        parentId2: "206054102"
    });
    // 7. אלרואי תבורי
    await createChild({
        firstName: "אלרואי",
        lastName: "תבורי",
        id: "10003",
        gamesPassword: "12",
        phone: "05" + "879312",
        address: "נתניה, המלאכה 55",
        birth: new Date(2013, 10, 31),
        gender: "זכר",
        level: "רופין",
        parentId1: "206054133"
    });
    // 8. בנאל תבורי
    await createChild({
        firstName: "בנאל",
        lastName: "תבורי",
        id: "10004",
        gamesPassword: "12",
        phone: "05" + "879356",
        address: "נתניה, המלאכה 55",
        birth: new Date(2015, 8, 5),
        gender: "זכר",
        level: "רופין",
        parentId1: "206054133"
    });
    // 9. יוחנן זוהר
    await createChild({
        firstName: "יוחנן",
        lastName: "זוהר",
        id: "10009",
        gamesPassword: "12",
        phone: "05" + "879512",
        address: "תל אביב, הגבעתון 88",
        birth: new Date(2011, 10, 22),
        gender: "זכר",
        level: "רופין",
        parentId1: "208163427"
    });
    // 10. שירי זוהר
    await createChild({
        firstName: "שירי",
        lastName: "זוהר",
        id: "10010",
        gamesPassword: "12",
        phone: "05" + "879556",
        address: "תל אביב, הגבעתון 88",
        birth: new Date(2013, 1, 27),
        gender: "נקבה",
        level: "רופין",
        parentId1: "208163427"
    });
    // 11. אלי עפיה
    await createChild({
        firstName: "אלי",
        lastName: "עפיה",
        id: "10011",
        gamesPassword: "12",
        phone: "05" + "879212",
        address: "חדרה, העמק 12",
        birth: new Date(2012, 12, 27),
        gender: "זכר",
        level: "רופין",
        parentId1: "208163741"
    });
    // 12. יעל עפיה
    await createChild({
        firstName: "יעל",
        lastName: "עפיה",
        id: "10012",
        gamesPassword: "12",
        phone: "05" + "879256",
        address: "חדרה, העמק 12",
        birth: new Date(2014, 2, 15),
        gender: "נקבה",
        level: "רופין",
        parentId1: "208163741"
    });
    // 13. פיני גדות
    await createChild({
        firstName: "פיני",
        lastName: "גדות",
        id: "10013",
        gamesPassword: "12",
        phone: "05" + "879612",
        address: "תל אביב, אחד העם 1",
        birth: new Date(2011, 10, 22),
        gender: "זכר",
        level: "רופין",
        parentId1: "208163284"
    });
    // 14. לינוי גדות
    await createChild({
        firstName: "לינוי",
        lastName: "גדות",
        id: "10014",
        gamesPassword: "12",
        phone: "05" + "879656",
        address: "תל אביב, אחד העם 1",
        birth: new Date(2012, 10, 27),
        gender: "נקבה",
        level: "רופין",
        parentId1: "208163284"
    });
    // 15. אבשלום גדות
    await createChild({
        firstName: "אבשלום",
        lastName: "גדות",
        id: "10015",
        gamesPassword: "12",
        phone: "05" + "879712",
        address: "תל אביב, אחד העם 1",
        birth: new Date(2013, 12, 27),
        gender: "זכר",
        level: "רופין",
        parentId1: "208163284"
    });
    // 16. ציפי רפאלי
    await createChild({
        firstName: "ציפי",
        lastName: "רפאלי",
        id: "10016",
        gamesPassword: "12",
        phone: "05" + "879116",
        address: "תל אביב, שלום העם 1",
        birth: new Date(2011, 2, 22),
        gender: "נקבה",
        level: "רופין",
        parentId1: "208163358"
    });
    // 17. ארנון רפאלי
    await createChild({
        firstName: "ארנון",
        lastName: "רפאלי",
        id: "10017",
        gamesPassword: "12",
        phone: "05" + "879856",
        address: "תל אביב, שלום העם 1",
        birth: new Date(2013, 6, 15),
        gender: "זכר",
        level: "רופין",
        parentId1: "208163358"
    });
    // 18. קובי רפאלי
    await createChild({
        firstName: "קובי",
        lastName: "רפאלי",
        id: "10018",
        gamesPassword: "12",
        phone: "05" + "879956",
        address: "תל אביב, שלום העם 1",
        birth: new Date(2014, 5, 15),
        gender: "זכר",
        level: "רופין",
        parentId1: "208163358"
    });
    // 19. יובל אברמוביץ'
    await createChild({
        firstName: "יובל",
        lastName: "אברמוביץ'",
        id: "10019",
        gamesPassword: "12",
        phone: "05" + "879222",
        address: "נתניה, שלום חבר 21",
        birth: new Date(2012, 10, 12),
        gender: "נקבה",
        level: "רופין",
        parentId1: "208163518",
        parentId2: "208163528"
    });
    // 20. אור אברמוביץ'
    await createChild({
        firstName: "אור",
        lastName: "אברמוביץ'",
        id: "10020",
        gamesPassword: "12",
        phone: "05" + "879226",
        address: "נתניה, שלום חבר 21",
        birth: new Date(2014, 1, 14),
        gender: "זכר",
        level: "רופין",
        parentId1: "208163518",
        parentId2: "208163528"
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
        description: "התאמנו על כללי החשבון ושחקו עם הדמויות האהובות עליכם",
        fieldName: "חשבון",
        icon: "icons/dbz.png",
        link: "./dbz/dbz.html"
    });
    await createGame({
        title: "תרגול צבעים בשפה האנגלית",
        description: "לימדו את הצבע וקלעו את הכדורים בצבע המתאים לתוך הסל",
        fieldName: "צבעים",
        icon: "icons/color2.png",
        link: "./ColorGame2/color2.html"
    });
    await createGame({
        title: "גלגל המזל בשפה העברית",
        description: "מצאו את המילה המתאימה לתמונה בעברית",
        fieldName: "עברית",
        icon: "icons/english2.png",
        link: "./hebrew/hebrew.html"
    });
}

async function addNotes() {
    let childId = 10000;;
    let teacher = await Teacher.findOne({
        id: "201132541"
    });

    const messageNote = [{
        date: new Date(2020, 10, 03),
        teacher: teacher._id,
        content: "נא לחזור על פעולות חיבור"
    }, {
        date: new Date(2020, 10, 04),
        teacher: teacher._id,
        content: "כל הכבוד, המשך כך!"
    }, {
        date: new Date(2020, 10, 04),
        teacher: teacher._id,
        content: "הסבלנות משתלמת!"
    }, {
        date: new Date(2020, 10, 12),
        teacher: teacher._id,
        content: "צריך לתרגל המון בבית באנגלית!"
    }, {
        date: new Date(2020, 11, 14),
        teacher: teacher._id,
        content: "רואים שיפור, הילד במגמת עלייה"
    }];

    const date = [
        new Date(2020, 10, 03), new Date(2020, 10, 04),
        new Date(2020, 10, 04), new Date(2020, 10, 12),
        new Date(2020, 11, 14)
    ];

    for (let i = 1; i < 20; i++) {
            childId = childId + 1;
            let child = await Child.findOne({
                id: childId.toString()
            });

        for (let indx = 0; indx < date.length; indx++) {
            // console.log(childId, child);
            if (child != null) {
                await child.notes.push(messageNote[indx]);
            }
        }

        // Save to DataBase
        await child.save();
    }

    console.log('success');
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
    await addNotes()

    return notes;
}


async function addStats() {
    notes = [];
    let str;

    const date = [
        new Date(2020, 10, 03), new Date(2020, 10, 04),
        new Date(2020, 10, 04), new Date(2020, 10, 12),
        new Date(2020, 11, 14), new Date(2020, 11, 18),
        new Date(2020, 11, 21), new Date(2020, 12, 02),
        new Date(2020, 12, 04), new Date(2020, 12, 06)
    ];

    for (let i = 1; i < 20; i++) {
        if (i >= 1 && i < 10) {
            str = '1000';
        } else {
            str = '100';
        }
        for (let indx = 0; indx < date.length; indx++) {
            await addMathStat(str + i, date[indx]);
            await addEnglishStat(str + i, date[indx]);
            await addColorStat(str + i, date[indx]);
        }
    }

    notes.push('success');
    console.log('success');
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

async function addColorStat(child_id, date) {
    const field = 'colors';
    const subFields = [{
        eng: 'objectColorToColor',
        heb: 'התאמת צבע לתמונה'
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


//#region Old Code
// async function addStat(child_id, stats, game_id) {

//     await save_Data_DB(child_id, stats, game_id);

//     const child = await Child.findOne({
//         id: childId
//     });
//     // Assert Child data
//     if (!child) return console.log(reverseString(`ילד בעל ת"ז "${childId}" אינו קיים במערכת.`));
//     // Try to update the selected document
//     try {
//         // res.status(200).send(user);
//         const parent = await Parent.findOneAndUpdate({
//             id: parentId
//         }, {
//             "$addToSet": {
//                 children: child._id
//             }
//         }, {
//             new: true,
//             useFindAndModify: false
//         }).populate('children', 'id firstName lastName');
//         // await parent.save();
//         // Assert update completed successfully
//         if (!parent) {
//             notes.push(`Parent ${parentId} was not found.`);
//             return console.log(reverseString(`Parent ${parentId} was not found.`));
//         }
//         // Send response to client
//         notes.push(`ילד בעל ת"ז "${childId}" נוסף להורה.`);
//     } catch (ex) {
//         notes.push(`Failed to update.`);
//         return console.log(reverseString(`Failed to update.`));
//     }
// }








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