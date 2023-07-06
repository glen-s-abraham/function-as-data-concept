import express, { Request, Response } from "express";
import { body } from "express-validator";
import { ValidationError } from "../../errors/validation-error";
import { validateRequest } from "../../middlewares/validate-request";
import { FunctionStructure } from "../../models/function-structure";

const router = express.Router();

router.post(
  "/api/function-structure",
  [
    body("name").not().isEmpty().withMessage("name is required"),
    body("code").not().isEmpty().withMessage("code is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const functionStructure = await _saveFunctionStructure(req.body);
      res.status(201).send(functionStructure);
    } catch (error) {
      console.error(error);
    }
  }
);

const _saveFunctionStructure = async (functionParams: {
  name: string;
  code: string;
  dependencies: Array<string>;
}) => {
  _validateFunctionParams(functionParams);
  const functionStructure = FunctionStructure.build(functionParams);
  return functionStructure.save();
};

const _validateFunctionParams = (functionParams: any) => {
  const { name, code } = functionParams;
  if (!_isValidString(name)) throw new ValidationError("Invalid name");
  if (!_isValidString(code)) throw new ValidationError("Invalid code");
  return;
};

const _isValidString = (str: string) => str.trim().length !== 0;

export { router as newFunctionStructureRouter };
