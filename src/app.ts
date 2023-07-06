import express from "express";
import 'express-async-errors'
import {json} from 'body-parser';



import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import { newFunctionStructureRouter } from "./routes/function-structure/new";
import { executeFunctionRouter } from "./routes/function-executor/execute";

const app = express();
app.use(json());

app.use(newFunctionStructureRouter);
app.use(executeFunctionRouter);


app.all('*',async (req,res,next)=>{
    throw new NotFoundError()
});
app.use(errorHandler)


export {app};

