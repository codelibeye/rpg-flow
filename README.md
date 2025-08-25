# RPG Flow - TypeScript + WebAssembly Node Tree Library

A high-performance Node Tree library built with TypeScript and WebAssembly, designed for RPG game development and complex tree structure management.

## Features

- 🚀 **High Performance**: WebAssembly-powered tree operations
- 🎯 **TypeScript First**: Full TypeScript support with type safety
- 🌳 **Flexible Tree Structure**: Support for complex hierarchical data
- 📊 **Statistics & Analytics**: Built-in tree statistics and metrics
- 🎮 **Event System**: Real-time event handling for tree changes
- 🔧 **Configurable**: Customizable options for different use cases
- 🧪 **Tested**: Comprehensive test suite with Jest

## Installation

```bash
npm install
```

## Prerequisites

- Node.js 16+
- Rust (for WebAssembly compilation)
- wasm-pack

### Install Rust and wasm-pack

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install wasm-pack
cargo install wasm-pack
```

## Build

```bash
# Build TypeScript and WebAssembly
npm run build

# Build only TypeScript
npm run build:ts

# Build only WebAssembly
npm run build:wasm
```

## Usage

### Basic Example

```typescript
import { NodeTree } from './src/index';

async function example() {
  // Create a new tree
  const tree = new NodeTree({
    autoId: true,
    maxDepth: 10
  });

  // Set up event listeners
  tree.on('node_added', (event) => {
    console.log(`Node added: ${event.nodeId}`);
  });

  // Initialize and set root
  await tree.initialize();
  await tree.setRoot('Game World', 'world');

  // Add children
  await tree.addChild('world', 'Forest Area', 'forest');
  await tree.addChild('world', 'City Area', 'city');

  // Get tree statistics
  const stats = await tree.getStats();
  console.log(`Total nodes: ${stats.totalNodes}`);

  // Find a node
  const node = await tree.findNode('forest');
  console.log(`Found: ${node?.data}`);

  // Remove a node
  await tree.removeNode('city');
}
```

### Advanced Example

```typescript
import { NodeTree } from './src/index';

async function rpgWorldExample() {
  const world = new NodeTree();

  // Set up the game world structure
  await world.initialize();
  await world.setRoot('RPG World', 'world');

  // Create area hierarchy
  await world.addChild('world', 'Kingdom of Eldoria', 'eldoria');
  await world.addChild('eldoria', 'Capital City', 'capital');
  await world.addChild('eldoria', 'Dark Forest', 'forest');
  await world.addChild('eldoria', 'Mystic Mountains', 'mountains');

  // Add locations within areas
  await world.addChild('capital', 'Royal Palace', 'palace');
  await world.addChild('capital', 'Market Square', 'market');
  await world.addChild('forest', 'Ancient Ruins', 'ruins');
  await world.addChild('mountains', 'Dragon Cave', 'cave');

  // Get comprehensive statistics
  const stats = await world.getStats();
  console.log('World Statistics:', stats);

  // Traverse the tree
  const treeData = await world.getTree();
  printWorldMap(treeData);
}

function printWorldMap(node: any, depth = 0) {
  const indent = '  '.repeat(depth);
  console.log(`${indent}📍 ${node.data}`);
  
  for (const child of node.children) {
    printWorldMap(child, depth + 1);
  }
}
```

## API Reference

### NodeTree Class

#### Constructor
```typescript
new NodeTree(options?: NodeTreeOptions)
```

#### Methods

- `initialize(): Promise<void>` - Initialize the WebAssembly module
- `setRoot(data: string, id?: string): Promise<void>` - Set the root node
- `createNode(data: string, id?: string): Promise<TreeNode>` - Create a new node
- `addChild(parentId: string, data: string, childId?: string): Promise<boolean>` - Add a child node
- `findNode(id: string): Promise<TreeNode | null>` - Find a node by ID
- `removeNode(id: string): Promise<boolean>` - Remove a node
- `getTree(): Promise<TreeNode | null>` - Get the entire tree structure
- `getStats(): Promise<NodeTreeStats>` - Get tree statistics
- `on(event: string, listener: NodeTreeEventListener): void` - Add event listener
- `off(event: string, listener: NodeTreeEventListener): void` - Remove event listener
- `clear(): void` - Clear the tree

### Types

```typescript
interface TreeNode {
  id: string;
  data: string;
  children: TreeNode[];
}

interface NodeTreeOptions {
  autoId?: boolean;
  maxDepth?: number;
  allowCycles?: boolean;
}

interface NodeTreeStats {
  totalNodes: number;
  maxDepth: number;
  averageChildren: number;
  leafNodes: number;
}
```

## Events

The library emits the following events:

- `node_added` - When a new node is added
- `node_removed` - When a node is removed
- `node_updated` - When a node is updated
- `tree_cleared` - When the tree is cleared

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Development Mode

```bash
# Watch TypeScript files
npm run dev
```

### Example

```bash
# Run the basic example
npx ts-node examples/basic-usage.ts
```

## Project Structure

```
rpg-flow/
├── src/
│   ├── wasm/                 # Rust WebAssembly code
│   │   ├── src/
│   │   │   └── lib.rs       # Rust implementation
│   │   └── Cargo.toml       # Rust dependencies
│   ├── types.ts             # TypeScript type definitions
│   ├── wasm-loader.ts       # WebAssembly module loader
│   ├── node-tree.ts         # Main NodeTree class
│   └── index.ts             # Public API exports
├── examples/
│   └── basic-usage.ts       # Usage examples
├── src/__tests__/
│   └── node-tree.test.ts    # Test suite
├── dist/                    # Compiled output
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Performance

The WebAssembly implementation provides significant performance improvements for:

- Tree traversal operations
- Node search and retrieval
- Large tree structure management
- Real-time game world updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Roadmap

- [ ] Graph visualization tools
- [ ] Serialization/deserialization
- [ ] Tree diffing algorithms
- [ ] Performance benchmarking tools
- [ ] Browser compatibility layer
- [ ] Plugin system for custom node types
