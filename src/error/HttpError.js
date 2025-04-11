module.exports = class HttpError extends Error {
    constructor(status, message){
        super(message)
        this.message = status
    }
}