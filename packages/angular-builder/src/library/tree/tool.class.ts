import { ToolType } from "./tree.interface";

export abstract class Tool {


  build!:(groupData?: any) => any

  constructor(public readonly type: ToolType) { }


}

