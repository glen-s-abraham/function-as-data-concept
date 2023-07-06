import { CustomError } from "./custom-error";

export class ValidationError extends CustomError{
    statusCode = 400;
    constructor(public message:string){
        super(message);
        Object.setPrototypeOf(this,ValidationError.prototype);  
    }
    serializeErrors(){ 
        return [{
            message:this.message
        }]
    }
}