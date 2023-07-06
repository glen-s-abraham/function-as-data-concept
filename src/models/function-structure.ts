import mongoose from "mongoose";


interface FunctionStructureAttrs {
  name:string;
  code:string;
  dependencies?:Array<string>;
  metadata?:Array<string>;
  parameters?:Array<string>;
  returnValues?:Array<string>;
}

interface FunctionStructureModel extends mongoose.Model<FunctionStructureDoc> {
  build(attrs: FunctionStructureAttrs): FunctionStructureDoc;
}

interface FunctionStructureDoc extends mongoose.Document {
    name:string;
    code:string;
    dependencies?:Array<string>;
    metadata?:Array<string>;
    parameters?:Array<string>;
    returnValues?:Array<string>;
}

const FunctionStructureSchema = new mongoose.Schema(
  {
    name:{type:String,required:true},
    code:{type:String,required:true},
    dependencies:{type:[String]},
    metadata:{type:[String]},
    parameters:{type:[String]},
    returnValues:{type:[String]},
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

FunctionStructureSchema.statics.build = (attrs: FunctionStructureAttrs) => new FunctionStructure(attrs);

const FunctionStructure = mongoose.model<FunctionStructureDoc, FunctionStructureModel>(
  "FunctionStructure",
  FunctionStructureSchema
);

export { FunctionStructure };
