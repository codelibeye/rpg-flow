use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct TreeNode {
    pub id: String,
    pub data: String,
    pub children: Vec<TreeNode>,
}

#[wasm_bindgen]
pub struct NodeTree {
    root: Option<TreeNode>,
}

#[wasm_bindgen]
impl NodeTree {
    #[wasm_bindgen(constructor)]
    pub fn new() -> NodeTree {
        NodeTree { root: None }
    }

    pub fn create_node(&mut self, id: &str, data: &str) -> JsValue {
        let node = TreeNode {
            id: id.to_string(),
            data: data.to_string(),
            children: Vec::new(),
        };
        serde_wasm_bindgen::to_value(&node).unwrap()
    }

    pub fn add_child(&mut self, parent_id: &str, child_id: &str, child_data: &str) -> bool {
        if let Some(ref mut root) = self.root {
            Self::add_child_recursive(root, parent_id, child_id, child_data)
        } else {
            false
        }
    }

    fn add_child_recursive(node: &mut TreeNode, parent_id: &str, child_id: &str, child_data: &str) -> bool {
        if node.id == parent_id {
            let child = TreeNode {
                id: child_id.to_string(),
                data: child_data.to_string(),
                children: Vec::new(),
            };
            node.children.push(child);
            return true;
        }

        for child in &mut node.children {
            if Self::add_child_recursive(child, parent_id, child_id, child_data) {
                return true;
            }
        }
        false
    }

    pub fn set_root(&mut self, id: &str, data: &str) {
        self.root = Some(TreeNode {
            id: id.to_string(),
            data: data.to_string(),
            children: Vec::new(),
        });
    }

    pub fn get_tree(&self) -> JsValue {
        if let Some(ref root) = self.root {
            serde_wasm_bindgen::to_value(root).unwrap()
        } else {
            JsValue::NULL
        }
    }

    pub fn find_node(&self, id: &str) -> JsValue {
        if let Some(ref root) = self.root {
            if let Some(node) = Self::find_node_recursive(root, id) {
                serde_wasm_bindgen::to_value(&node).unwrap()
            } else {
                JsValue::NULL
            }
        } else {
            JsValue::NULL
        }
    }

    fn find_node_recursive<'a>(node: &'a TreeNode, id: &str) -> Option<&'a TreeNode> {
        if node.id == id {
            return Some(node);
        }

        for child in &node.children {
            if let Some(found) = Self::find_node_recursive(child, id) {
                return Some(found);
            }
        }
        None
    }

    pub fn remove_node(&mut self, id: &str) -> bool {
        if let Some(ref mut root) = self.root {
            if root.id == id {
                self.root = None;
                return true;
            }
            Self::remove_node_recursive(root, id)
        } else {
            false
        }
    }

    fn remove_node_recursive(node: &mut TreeNode, id: &str) -> bool {
        // Check if any direct child matches the ID
        let mut found = false;
        node.children.retain_mut(|child| {
            if child.id == id {
                found = true;
                return false; // Remove this child
            }
            // Recursively check children
            if Self::remove_node_recursive(child, id) {
                found = true;
            }
            true // Keep this child
        });
        found
    }
}
