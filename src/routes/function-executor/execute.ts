import express, { Request, Response } from "express";
import { body } from "express-validator";
import { ValidationError } from "../../errors/validation-error";
import { validateRequest } from "../../middlewares/validate-request";
import { FunctionStructure } from "../../models/function-structure";
import { Vm2FunctionBuilder } from "../../services/vm2";

const router = express.Router();

interface FunctionParams {
  functionId: string;
  arguements?: Array<string>;
}

router.post(
  "/api/function/execute",
  [body("functionId").not().isEmpty().withMessage("functionId is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const result = await _executeFunction(req.body);
      res.status(201).send({result});
    } catch (error) {
      console.error(error);
    }
  }
);

const _executeFunction = async (functionParams: FunctionParams) => {
  const { functionId } = functionParams;
  const functionStructure = await _fetchFunctionStructure(functionId);
  if (!_isValidFunction(functionStructure))
    throw new ValidationError("Invalid functionId");
  _validateFunctionParams({ ...functionParams, functionStructure });
  const vm2Function: any = new Vm2FunctionBuilder()
    .setFunctionName(functionStructure.name)
    .setScript(functionStructure.code)
    .setInputArgs(functionParams.arguements)
    .build();
    return vm2Function.execute();
};

const _fetchFunctionStructure = async (functionId: string) =>
  FunctionStructure.findById(functionId);

const _isValidFunction = (functionStructure: any) => functionStructure !== null;

const _validateFunctionParams = (
  functionParams: FunctionParams & { functionStructure: any }
) => {
  const { arguements, functionStructure } = functionParams;
  if (!_hasParams(functionStructure)) return;
  if (!_areAllArgsPresentInRequest(functionStructure.parameters, arguements))
    throw new ValidationError(
      "some required fields are not present in args list"
    );
};

const _hasParams = (functionStructure: any) => {
  const { parameters } = functionStructure;
  return parameters.length > 0;
};

const _areAllArgsPresentInRequest = (parameters, arguements) => {
  return parameters.every((field) => Object.keys(arguements).includes(field));
};

export { router as executeFunctionRouter };
