import 'express-async-errors'
import mongoose from "mongoose";
import { app } from './app';
import startGrpcServer from './grpc/server';

const start = async()=>{
    if (!process.env.REST_PORT) {
        throw new Error("env variable REST_PORT missing");
      }
      if (!process.env.DB_URI) {
        throw new Error("env variable DB_URI missing");
      }
      if (!process.env.GRPC_HOST) {
        throw new Error("env variable GRPC_HOST missing");
      }
      if (!process.env.GRPC_PORT) {
        throw new Error("env variable GRPC_PORT missing");
      }
      try {
        await mongoose.connect(process.env.DB_URI);
        console.log(`Connected to db ${process.env.DB_URI}`);
        await startGrpcServer();
      } catch (err) {
        console.error(err);
        throw err;
      }
      app.listen(parseInt(process.env.REST_PORT), () => {
        console.log(`Rest Service listening on ${process.env.REST_PORT}`);
      });
    };

start();
