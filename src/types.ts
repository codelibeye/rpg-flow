export interface TreeNode {
  id: string;
  data: string;
  children: TreeNode[];
}

export interface NodeTreeOptions {
  autoId?: boolean;
  maxDepth?: number;
  allowCycles?: boolean;
}

export interface NodeTreeStats {
  totalNodes: number;
  maxDepth: number;
  averageChildren: number;
  leafNodes: number;
}

export interface NodeTreeEvent {
  type: 'node_added' | 'node_removed' | 'node_updated' | 'tree_cleared';
  nodeId?: string;
  parentId?: string;
  data?: any;
  timestamp: number;
}

export type NodeTreeEventListener = (event: NodeTreeEvent) => void;
