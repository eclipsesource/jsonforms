import { Tool } from "./tool.class";
import { ToolType } from "./tree.interface";

export abstract class ControlTool extends Tool {

  constructor() {
    super(ToolType.CONTROL);
  }

  abstract override build: (groupData?: any) => any;

}




export class SomeTool implements ControlTool {
  constructor(public readonly type: ToolType) { }

  build(groupData?: any): any {
    // Implement the build logic here
    return {};
  }
}
