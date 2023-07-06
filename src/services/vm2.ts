import { NodeVM } from "vm2";

//enhance for third party library updates
class VM2Function {
  private _scriptName: string;
  private _script: string;
  private _vm2Instance: NodeVM;
  private _returnValues: any;
  constructor(
    functionName: string,
    inputArgs: { [key: string]: any } | null,
    script: string
  ) {
    this._scriptName = `${functionName ? functionName : "script"}.js`;
    this._script = script;
    this._returnValues = {};
    this._vm2Instance = new NodeVM({
      sandbox: {
        input: inputArgs,
        output: this._returnValues,
      },
      require: {
        external: true,
      },
    });
  }

  execute() {
    this._vm2Instance.run(this._script, this._scriptName);
    return this._returnValues;
  }
}

class Vm2FunctionBuilder {
  private _functionName: string;
  private _inputArgs: { [key: string]: any } | null;
  private _script: string;

  public setFunctionName(functionName: string) {
    this._functionName = functionName;
    return this;
  }

  public setInputArgs(inputArgs: { [key: string]: any } | null) {
    this._inputArgs = inputArgs;
    return this;
  }

  public setScript(script: string) {
    this._script = script;
    return this;
  }

  build() {
    return new VM2Function(
      this._functionName ? this._functionName : "sample-function",
      this._inputArgs ? this._inputArgs : null,
      this._script
    );
  }
}

export { Vm2FunctionBuilder };
