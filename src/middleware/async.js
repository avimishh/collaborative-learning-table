// Async implementation wrap http request handlers with try-catch blocks

module.exports = function (handler) {
    return async (req, res, next) => {
        try{
            await handler(req,res);
        }
        catch(ex){
            next(ex);
        }
    }
}