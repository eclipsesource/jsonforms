import { ToolType } from "../interfaces/tools.interface";
import { Tool } from "./tool.class";

export class ToolTreeNode {

  private _children: ToolTreeNode[] = [];
  private _canHaveChildren: boolean;

  constructor(private readonly tool: Tool) {
    this._canHaveChildren = tool.type === ToolType.LAYOUT;
  }

  // Add a child node if allowed
  addChild(child: ToolTreeNode): void {
    if (!this._canHaveChildren) {
      throw new Error(`${this.constructor.name} cannot have children.`);
    }
    this.children.push(child);
  }
  // Retrieve children
  get children(): ToolTreeNode[] {
    return this._children;
  }

  build(): any {

    if(!this._canHaveChildren){
      return this.tool.build();
    }

    let output = []
    for (let i = 0; i < this._children.length; i++) {
      const child = this._children[i];
      output.push(child.build());
    }

    return this.tool.build(output);

  }


}
