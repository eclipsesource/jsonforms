import { Tool } from "../tree/tool.class";
import { ToolType } from "../tree/tree.interface";

export class ControlTool extends Tool {



  constructor() {
    super(ToolType.CONTROL);
  }

  override build = (): any => {
    return groupData;
  }



}
