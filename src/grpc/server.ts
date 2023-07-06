import grpc,{Server,ServerCredentials} from "@grpc/grpc-js";
import dotenv from 'dotenv';


dotenv.config();

const startGrpcServer = async () => {
  const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  };
  const server = new Server();

  server.bindAsync(
    `${process.env.GRPC_HOST}:${process.env.GRPC_PORT}`,
    ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.log(error);
        throw error;
      }
      console.log(`Grpc Service listening on ${process.env.GRPC_PORT}`);
      server.start();
    }
  );
};

export default startGrpcServer;