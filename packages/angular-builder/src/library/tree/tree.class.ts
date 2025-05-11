import { ToolTreeNode } from "./tree-node.class";

export class ToolTree {

  private _rootNode?: ToolTreeNode;

  build?: () => any;

  constructor(tool: ToolTreeNode) {
    this._rootNode = tool;
    this.build = () => {
      return this._rootNode?.build();
    }
  }


}




