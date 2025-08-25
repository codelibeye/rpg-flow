import { NodeTree as WasmNodeTree } from './dist/wasm/rpg_flow_wasm';

let wasmModule: typeof WasmNodeTree | null = null;

export async function loadWasmModule(): Promise<typeof WasmNodeTree> {
  if (wasmModule) {
    return wasmModule;
  }

  try {
    // Import the WASM module
    const wasm = await import('./dist/wasm/rpg_flow_wasm');
    wasmModule = wasm.NodeTree;
    return wasmModule;
  } catch (error) {
    throw new Error(`Failed to load WASM module: ${error}`);
  }
}

export function getWasmModule(): typeof WasmNodeTree | null {
  return wasmModule;
}
