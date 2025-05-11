export enum ToolType {
  CONTROL = 'control',
  LAYOUT = 'layout',
}


export interface Tool {
  name: string;
  icon: string;
}



export interface ToolCategory {
  name: string;
  category: string;
  tools: Tool[];
}
