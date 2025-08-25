import { NodeTree } from '../src/index';

async function basicExample() {
  console.log('🚀 Starting NodeTree Basic Example...\n');

  // Create a new NodeTree instance
  const tree = new NodeTree({
    autoId: true,
    maxDepth: 10
  });

  // Set up event listeners
  tree.on('node_added', (event) => {
    console.log(`📝 Node added: ${event.nodeId} (${event.data})`);
  });

  tree.on('node_removed', (event) => {
    console.log(`🗑️  Node removed: ${event.nodeId}`);
  });

  // Initialize the tree
  await tree.initialize();

  // Set root node
  await tree.setRoot('Game World', 'world');
  console.log('🌍 Root node set\n');

  // Add child nodes
  await tree.addChild('world', 'Forest Area', 'forest');
  await tree.addChild('world', 'City Area', 'city');
  await tree.addChild('world', 'Dungeon Area', 'dungeon');

  // Add nested children
  await tree.addChild('forest', 'Dark Forest', 'dark_forest');
  await tree.addChild('forest', 'Light Forest', 'light_forest');
  await tree.addChild('city', 'Market District', 'market');
  await tree.addChild('city', 'Residential District', 'residential');

  // Add deeper nested children
  await tree.addChild('dark_forest', 'Ancient Tree', 'ancient_tree');
  await tree.addChild('market', 'Blacksmith Shop', 'blacksmith');
  await tree.addChild('market', 'Magic Shop', 'magic_shop');

  console.log('\n📊 Tree Statistics:');
  const stats = await tree.getStats();
  console.log(`Total Nodes: ${stats.totalNodes}`);
  console.log(`Max Depth: ${stats.maxDepth}`);
  console.log(`Average Children: ${stats.averageChildren.toFixed(2)}`);
  console.log(`Leaf Nodes: ${stats.leafNodes}`);

  console.log('\n🌳 Current Tree Structure:');
  const treeData = await tree.getTree();
  printTree(treeData, 0);

  // Find a specific node
  console.log('\n🔍 Finding specific node:');
  const foundNode = await tree.findNode('blacksmith');
  if (foundNode) {
    console.log(`Found: ${foundNode.id} - ${foundNode.data}`);
  }

  // Remove a node
  console.log('\n🗑️  Removing node:');
  
  // Check if node exists before removing
  const nodeToRemove = await tree.findNode('light_forest');
  if (nodeToRemove) {
    console.log(`Found node to remove: ${nodeToRemove.id} - ${nodeToRemove.data}`);
    const removed = await tree.removeNode('light_forest');
    console.log(`Removed light_forest: ${removed}`);
  } else {
    console.log('Node light_forest not found');
  }

  console.log('\n🌳 Updated Tree Structure:');
  const updatedTree = await tree.getTree();
  printTree(updatedTree, 0);

  console.log('\n✅ Basic example completed!');
}

function printTree(node: any, depth: number) {
  if (!node) return;
  
  const indent = '  '.repeat(depth);
  console.log(`${indent}├─ ${node.id}: ${node.data}`);
  
  for (const child of node.children) {
    printTree(child, depth + 1);
  }
}

// Run the example
basicExample().catch(console.error);
