function customError(errors, key) {
    errors.forEach(err => {
        // console.log(err);
        // console.log(key);
        // console.log(err.context.key);
        switch (err.type) {
            case 'any.empty':
                err.message = `'${key}' לא יכול להיות ריק`;
                break;
            case 'any.required':
                err.message = `'${key}' נדרש`;
                break;
            case 'string.min':
                err.message = `'${key}' נדרש להכיל לפחות ${err.context.limit} תוים`;
                break;
            case 'string.max':
                err.message = `'${key}' נדרש להכיל עד${err.context.limit} תוים`;
                break;
            case 'string.regex.base':
                err.message = `${key}: ` + 'נדרש שם המכיל אותיות בשפה העברית';
                break;
            default:
                break;
        }
    });
    return errors;
}

exports.customError = customError;