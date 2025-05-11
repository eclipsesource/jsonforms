import { Tool } from "../tree/tool.class";
import { ToolType } from "../tree/tree.interface";


export class ArrayTool extends Tool {

  public static readonly TYPE = 'array';

  constructor(){
    super(ToolType.ARRAY);

  }

  override build = (groupData?: any): any => {
    return groupData;
  }

}
