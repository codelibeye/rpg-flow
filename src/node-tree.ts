import { TreeNode, NodeTreeOptions, NodeTreeStats, NodeTreeEvent, NodeTreeEventListener } from './types';
import { loadWasmModule, getWasmModule } from './wasm-loader';

export class NodeTree {
  private wasmInstance: any = null;
  private options: NodeTreeOptions;
  private eventListeners: NodeTreeEventListener[] = [];
  private nodeCounter: number = 0;

  constructor(options: NodeTreeOptions = {}) {
    this.options = {
      autoId: true,
      maxDepth: 100,
      allowCycles: false,
      ...options
    };
  }

  async initialize(): Promise<void> {
    if (!this.wasmInstance) {
      const WasmNodeTree = await loadWasmModule();
      this.wasmInstance = new WasmNodeTree();
    }
  }

  private generateId(): string {
    return `node_${++this.nodeCounter}_${Date.now()}`;
  }

  private emitEvent(event: Omit<NodeTreeEvent, 'timestamp'>): void {
    const fullEvent: NodeTreeEvent = {
      ...event,
      timestamp: Date.now()
    };
    this.eventListeners.forEach(listener => listener(fullEvent));
  }

  async createNode(data: string, id?: string): Promise<TreeNode> {
    await this.initialize();
    
    const nodeId = id || (this.options.autoId ? this.generateId() : '');
    if (!nodeId) {
      throw new Error('Node ID is required when autoId is disabled');
    }

    const node = this.wasmInstance.create_node(nodeId, data);
    this.emitEvent({
      type: 'node_added',
      nodeId,
      data
    });

    return node;
  }

  async setRoot(data: string, id?: string): Promise<void> {
    await this.initialize();
    
    const nodeId = id || (this.options.autoId ? this.generateId() : '');
    if (!nodeId) {
      throw new Error('Node ID is required when autoId is disabled');
    }

    this.wasmInstance.set_root(nodeId, data);
    this.emitEvent({
      type: 'node_added',
      nodeId,
      data
    });
  }

  async addChild(parentId: string, data: string, childId?: string): Promise<boolean> {
    await this.initialize();
    
    const nodeId = childId || (this.options.autoId ? this.generateId() : '');
    if (!nodeId) {
      throw new Error('Node ID is required when autoId is disabled');
    }

    const success = this.wasmInstance.add_child(parentId, nodeId, data);
    
    if (success) {
      this.emitEvent({
        type: 'node_added',
        nodeId,
        parentId,
        data
      });
    }

    return success;
  }

  async findNode(id: string): Promise<TreeNode | null> {
    await this.initialize();
    
    const node = this.wasmInstance.find_node(id);
    return node || null;
  }

  async removeNode(id: string): Promise<boolean> {
    await this.initialize();
    
    const success = this.wasmInstance.remove_node(id);
    
    if (success) {
      this.emitEvent({
        type: 'node_removed',
        nodeId: id
      });
    }

    return success;
  }

  async getTree(): Promise<TreeNode | null> {
    await this.initialize();
    
    const tree = this.wasmInstance.get_tree();
    return tree || null;
  }

  async getStats(): Promise<NodeTreeStats> {
    const tree = await this.getTree();
    if (!tree) {
      return {
        totalNodes: 0,
        maxDepth: 0,
        averageChildren: 0,
        leafNodes: 0
      };
    }

    const stats = this.calculateStats(tree);
    return stats;
  }

  private calculateStats(node: TreeNode, depth: number = 0): NodeTreeStats {
    let totalNodes = 1;
    let maxDepth = depth;
    let totalChildren = node.children.length;
    let leafNodes = node.children.length === 0 ? 1 : 0;

    for (const child of node.children) {
      const childStats = this.calculateStats(child, depth + 1);
      totalNodes += childStats.totalNodes;
      maxDepth = Math.max(maxDepth, childStats.maxDepth);
      totalChildren += childStats.totalNodes - 1; // Subtract 1 to avoid counting the node itself
      leafNodes += childStats.leafNodes;
    }

    return {
      totalNodes,
      maxDepth,
      averageChildren: totalNodes > 1 ? totalChildren / (totalNodes - 1) : 0,
      leafNodes
    };
  }

  on(event: string, listener: NodeTreeEventListener): void {
    this.eventListeners.push(listener);
  }

  off(event: string, listener: NodeTreeEventListener): void {
    const index = this.eventListeners.indexOf(listener);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  clear(): void {
    this.wasmInstance = null;
    this.nodeCounter = 0;
    this.emitEvent({ type: 'tree_cleared' });
  }
}
