
// import { LayoutTool } from './tree-layout-node.class';

// describe('Tree', () => {
//   let tree: Tree;

//   beforeEach(() => {
//     tree = new Tree();
//   });

//   it('should add a child node', () => {
//     const node = new LayoutTool("a");
//     tree.addChild(node);

//     expect(tree.getChildren()).toContain(node);
//   });

//   it('should retrieve all children', () => {
//     const node1 = new LayoutTool("a");
//     const node2 = new LayoutTool("a");

//     tree.addChild(node1);
//     tree.addChild(node2);

//     const children = tree.getChildren();
//     expect(children.length).toBe(2);
//     expect(children).toEqual([node1, node2]);
//   });

//   it('should return an empty array if no children are added', () => {
//     expect(tree.getChildren()).toEqual([]);
//   });

//   it('should handle getSchema method (placeholder test)', () => {
//     const value = {};
//     const result = tree.getSchema(value);

//     expect(result).toBeUndefined(); // Update this test when getSchema is implemented
//   });

//   it('should handle setSchema method (placeholder test)', () => {
//     const value = { key: 'value' };
//     tree.setSchema(value);

//     // Add assertions when setSchema is implemented
//     expect(true).toBeTrue(); // Placeholder assertion
//   });
// });
