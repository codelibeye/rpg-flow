import { NodeTree } from '../node-tree';
import { TreeNode } from '../types';

describe('NodeTree', () => {
  let nodeTree: NodeTree;

  beforeEach(() => {
    nodeTree = new NodeTree();
  });

  afterEach(() => {
    nodeTree.clear();
  });

  describe('initialization', () => {
    it('should create a new NodeTree instance', () => {
      expect(nodeTree).toBeInstanceOf(NodeTree);
    });

    it('should initialize with default options', async () => {
      await nodeTree.initialize();
      expect(nodeTree).toBeDefined();
    });
  });

  describe('root operations', () => {
    it('should set root node', async () => {
      await nodeTree.setRoot('Root Data', 'root1');
      const tree = await nodeTree.getTree();
      expect(tree).toBeDefined();
      expect(tree?.id).toBe('root1');
      expect(tree?.data).toBe('Root Data');
    });

    it('should generate auto ID when not provided', async () => {
      await nodeTree.setRoot('Root Data');
      const tree = await nodeTree.getTree();
      expect(tree).toBeDefined();
      expect(tree?.id).toMatch(/^node_\d+_\d+$/);
    });
  });

  describe('node operations', () => {
    beforeEach(async () => {
      await nodeTree.setRoot('Root', 'root');
    });

    it('should create a node', async () => {
      const node = await nodeTree.createNode('Test Data', 'test1');
      expect(node.id).toBe('test1');
      expect(node.data).toBe('Test Data');
      expect(node.children).toEqual([]);
    });

    it('should add child to parent', async () => {
      const success = await nodeTree.addChild('root', 'Child Data', 'child1');
      expect(success).toBe(true);

      const child = await nodeTree.findNode('child1');
      expect(child).toBeDefined();
      expect(child?.data).toBe('Child Data');
    });

    it('should find existing node', async () => {
      await nodeTree.addChild('root', 'Child Data', 'child1');
      const found = await nodeTree.findNode('child1');
      expect(found).toBeDefined();
      expect(found?.id).toBe('child1');
    });

    it('should return null for non-existent node', async () => {
      const found = await nodeTree.findNode('non-existent');
      expect(found).toBeNull();
    });

    it('should remove node', async () => {
      await nodeTree.addChild('root', 'Child Data', 'child1');
      const success = await nodeTree.removeNode('child1');
      expect(success).toBe(true);

      const found = await nodeTree.findNode('child1');
      expect(found).toBeNull();
    });
  });

  describe('tree statistics', () => {
    beforeEach(async () => {
      await nodeTree.setRoot('Root', 'root');
      await nodeTree.addChild('root', 'Child 1', 'child1');
      await nodeTree.addChild('root', 'Child 2', 'child2');
      await nodeTree.addChild('child1', 'Grandchild', 'grandchild1');
    });

    it('should calculate correct statistics', async () => {
      const stats = await nodeTree.getStats();
      expect(stats.totalNodes).toBe(4);
      expect(stats.maxDepth).toBe(2);
      expect(stats.leafNodes).toBe(2); // child2 and grandchild1
    });
  });

  describe('event handling', () => {
    it('should emit events when nodes are added', async () => {
      const events: any[] = [];
      nodeTree.on('node_added', (event) => {
        events.push(event);
      });

      await nodeTree.setRoot('Root Data', 'root');
      await nodeTree.addChild('root', 'Child Data', 'child1');

      expect(events).toHaveLength(2);
      expect(events[0].type).toBe('node_added');
      expect(events[0].nodeId).toBe('root');
      expect(events[1].type).toBe('node_added');
      expect(events[1].nodeId).toBe('child1');
      expect(events[1].parentId).toBe('root');
    });

    it('should emit events when nodes are removed', async () => {
      await nodeTree.setRoot('Root', 'root');
      await nodeTree.addChild('root', 'Child', 'child1');

      const events: any[] = [];
      nodeTree.on('node_removed', (event) => {
        events.push(event);
      });

      await nodeTree.removeNode('child1');

      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('node_removed');
      expect(events[0].nodeId).toBe('child1');
    });
  });
});
