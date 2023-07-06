const { join } = require("path");
const { execSync } = require("child_process");
const { rimrafSync } = require("rimraf");
const glob = require("glob");

const PROTO_DIR = join(__dirname, "../protos");
const MODEL_DIR = join(__dirname, "../grpc/models");
const PROTOC_PATH = join(__dirname, "../../node_modules/grpc-tools/bin/protoc");
const PLUGIN_PATH = join(
  __dirname,
  "../../node_modules/.bin/protoc-gen-ts_proto.cmd"
);

rimrafSync(`${MODEL_DIR}/*`, {
  glob: { ignore: `${MODEL_DIR}/tsconfig.json` },
});

const protoFiles = glob.sync(`${PROTO_DIR}/**/*.proto`);
const protoConfig = [
  `--plugin=${PLUGIN_PATH}`,
  "--ts_proto_opt=outputServices=grpc-js,env=node,useOptionals=messages,exportCommonSymbols=false,esModuleInterop=true",
  `--ts_proto_out=${MODEL_DIR}`,
];

protoFiles.forEach((protoFile) => {
  protoConfig.push(`--proto_path=${PROTO_DIR}`, protoFile);
});

execSync(`${PROTOC_PATH} ${protoConfig.join(" ")}`);
console.log(`> Proto models created: ${MODEL_DIR}`);
