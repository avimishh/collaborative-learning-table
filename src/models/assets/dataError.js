const errText = {
    failedToUpdate: "העדכון נכשל.",
    passwordInvalid: "הסיסמה חייבת להכיל לפחות 2 תווים.",
    passwordNotMatch: "הסיסמה שגויה.",
    gamesPasswordNotMatch: "סיסמת המשחקים שגויה.",
    childsNotExist: "לא קיימים ילדים במערכת.",
    parentsNotExist: "לא קיימים הורים במערכת.",
    teachersNotExist: "לא קיימים מורים במערכת.",
    gamesNotExist: "לא קיימים משחקים במערכת.",
    childByIdNotExist: "ילד בעל ת.ז. {0} לא קיים במערכת.",
    parentByIdNotExist: "הורה בעל ת.ז. {0} לא קיים במערכת.",
    teacherByIdNotExist: "מורה בעל ת.ז. {0} לא קיים במערכת.",
    fieldByIdNotExist: "תחום לימודי בעל ת.ז. {0} לא קיים במערכת.",
    gameByIdNotExist: "משחק בעל ת.ז. {0} לא קיים במערכת.",
    noteByIdNotExist: "הערה {0} לא קיים במערכת.",
    gamesByFieldNotExist: "לא קיימים משחקי '{0}' במערכת.",
    fieldByNameNotExist: "תחום לימודי בשם '{0}' לא קיים במערכת.",
    statByChildIdNotExist: "סטטיסטיקה עבור הילד בעל ת.ז. {0} לא קיימת במערכת.",
    childByIdAlreadyExist: "ילד בעל ת.ז. {0} כבר קיים במערכת.",
    parentByIdAlreadyExist: "הורה בעל ת.ז. {0} כבר קיים במערכת.",
    teacherByIdAlreadyExist: "מורה בעל ת.ז. {0} כבר קיים במערכת.",
    fieldByNameAlreadyExist: "תחום לימודי בשם '{0}' כבר קיים במערכת.",
    gameByNameAlreadyExist: "משחק בשם '{0}' כבר קיים במערכת."
}


const StringFormat = (str, ...args) =>
    str.replace(/{(\d+)}/g, (match, index) => args[index] || '');


module.exports.errText = errText;
module.exports.StringFormat = StringFormat;