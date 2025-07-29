/// High-performance Merkle Tree implementation for Velocity Trust Protocol
/// 
/// Optimized for large-scale compliance verification and blockchain operations
/// Supports parallel construction and efficient proof generation

use crate::{CryptoError, Result};
use crate::hash_engine::{HashAlgorithm, HashEngine};
use rayon::prelude::*;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MerkleTree {
    /// The root hash of the tree
    root: Vec<u8>,
    /// All levels of the tree (level 0 = leaves)
    levels: Vec<Vec<Vec<u8>>>,
    /// Hash algorithm used
    algorithm: HashAlgorithm,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MerkleProof {
    /// The leaf value being proved
    pub leaf: Vec<u8>,
    /// The leaf index in the tree
    pub leaf_index: usize,
    /// The sibling hashes needed to reconstruct the root
    pub siblings: Vec<Vec<u8>>,
    /// Directions for traversing the tree (true = right, false = left)
    pub directions: Vec<bool>,
}

impl MerkleTree {
    /// Create a new Merkle tree from leaf data
    pub fn new(leaves: Vec<Vec<u8>>, algorithm: HashAlgorithm) -> Result<Self> {
        if leaves.is_empty() {
            return Err(CryptoError::InvalidInput("Cannot create Merkle tree with no leaves".to_string()));
        }

        let engine = HashEngine::new(algorithm);
        let mut levels = vec![leaves];

        // Build tree level by level
        while levels.last().unwrap().len() > 1 {
            let current_level = levels.last().unwrap();
            let next_level = Self::build_level(&engine, current_level)?;
            levels.push(next_level);
        }

        let root = levels.last().unwrap()[0].clone();

        Ok(Self {
            root,
            levels,
            algorithm,
        })
    }

    /// Create a Merkle tree with parallel construction for large datasets
    pub fn new_parallel(leaves: Vec<Vec<u8>>, algorithm: HashAlgorithm) -> Result<Self> {
        if leaves.is_empty() {
            return Err(CryptoError::InvalidInput("Cannot create Merkle tree with no leaves".to_string()));
        }

        let engine = Arc::new(HashEngine::new(algorithm));
        let mut levels = vec![leaves];

        // Build tree level by level with parallelization
        while levels.last().unwrap().len() > 1 {
            let current_level = levels.last().unwrap();
            let next_level = Self::build_level_parallel(&engine, current_level)?;
            levels.push(next_level);
        }

        let root = levels.last().unwrap()[0].clone();

        Ok(Self {
            root,
            levels,
            algorithm,
        })
    }

    /// Build a single level of the tree
    fn build_level(engine: &HashEngine, current_level: &[Vec<u8>]) -> Result<Vec<Vec<u8>>> {
        let mut next_level = Vec::new();

        for i in (0..current_level.len()).step_by(2) {
            let left = &current_level[i];
            let right = if i + 1 < current_level.len() {
                &current_level[i + 1]
            } else {
                left // Duplicate last node if odd number
            };

            let combined = [left.as_slice(), right.as_slice()].concat();
            let hash = engine.hash(&combined)?;
            next_level.push(hash);
        }

        Ok(next_level)
    }

    /// Build a level with parallel processing
    fn build_level_parallel(engine: &Arc<HashEngine>, current_level: &[Vec<u8>]) -> Result<Vec<Vec<u8>>> {
        let pairs: Vec<_> = (0..current_level.len())
            .step_by(2)
            .map(|i| {
                let left = &current_level[i];
                let right = if i + 1 < current_level.len() {
                    &current_level[i + 1]
                } else {
                    left
                };
                (left.clone(), right.clone())
            })
            .collect();

        pairs
            .par_iter()
            .map(|(left, right)| {
                let combined = [left.as_slice(), right.as_slice()].concat();
                engine.hash(&combined)
            })
            .collect()
    }

    /// Get the root hash of the tree
    pub fn root(&self) -> &[u8] {
        &self.root
    }

    /// Get the number of leaves in the tree
    pub fn leaf_count(&self) -> usize {
        self.levels[0].len()
    }

    /// Generate a proof for a specific leaf
    pub fn generate_proof(&self, leaf_index: usize) -> Result<MerkleProof> {
        if leaf_index >= self.leaf_count() {
            return Err(CryptoError::InvalidInput(format!(
                "Leaf index {} out of bounds (tree has {} leaves)",
                leaf_index,
                self.leaf_count()
            )));
        }

        let mut siblings = Vec::new();
        let mut directions = Vec::new();
        let mut current_index = leaf_index;

        // Traverse up the tree collecting siblings
        for level in 0..self.levels.len() - 1 {
            let is_right_node = current_index % 2 == 1;
            directions.push(is_right_node);

            let sibling_index = if is_right_node {
                current_index - 1
            } else {
                // Handle case where current node is the last in level
                if current_index + 1 < self.levels[level].len() {
                    current_index + 1
                } else {
                    current_index
                }
            };

            siblings.push(self.levels[level][sibling_index].clone());
            current_index /= 2;
        }

        Ok(MerkleProof {
            leaf: self.levels[0][leaf_index].clone(),
            leaf_index,
            siblings,
            directions,
        })
    }

    /// Verify a Merkle proof
    pub fn verify_proof(&self, proof: &MerkleProof) -> Result<bool> {
        let engine = HashEngine::new(self.algorithm);
        let computed_root = Self::compute_root_from_proof(&engine, proof)?;
        Ok(computed_root == self.root)
    }

    /// Compute root from a proof
    pub fn compute_root_from_proof(engine: &HashEngine, proof: &MerkleProof) -> Result<Vec<u8>> {
        let mut current_hash = proof.leaf.clone();

        for (i, sibling) in proof.siblings.iter().enumerate() {
            let combined = if proof.directions[i] {
                // Current node is on the right
                [sibling.as_slice(), current_hash.as_slice()].concat()
            } else {
                // Current node is on the left
                [current_hash.as_slice(), sibling.as_slice()].concat()
            };
            current_hash = engine.hash(&combined)?;
        }

        Ok(current_hash)
    }

    /// Create an incremental Merkle tree that can be updated efficiently
    pub fn incremental(initial_capacity: usize, algorithm: HashAlgorithm) -> IncrementalMerkleTree {
        IncrementalMerkleTree::new(initial_capacity, algorithm)
    }

    /// Get tree depth
    pub fn depth(&self) -> usize {
        self.levels.len()
    }

    /// Get a specific level of the tree
    pub fn get_level(&self, level: usize) -> Option<&Vec<Vec<u8>>> {
        self.levels.get(level)
    }
}

/// Incremental Merkle tree that supports efficient updates
pub struct IncrementalMerkleTree {
    leaves: Vec<Vec<u8>>,
    tree: Option<MerkleTree>,
    algorithm: HashAlgorithm,
    capacity: usize,
}

impl IncrementalMerkleTree {
    pub fn new(capacity: usize, algorithm: HashAlgorithm) -> Self {
        Self {
            leaves: Vec::with_capacity(capacity),
            tree: None,
            algorithm,
            capacity,
        }
    }

    /// Add a leaf to the tree
    pub fn add_leaf(&mut self, leaf: Vec<u8>) -> Result<()> {
        if self.leaves.len() >= self.capacity {
            return Err(CryptoError::InvalidInput("Tree capacity exceeded".to_string()));
        }
        
        self.leaves.push(leaf);
        self.tree = None; // Invalidate cached tree
        Ok(())
    }

    /// Add multiple leaves
    pub fn add_leaves(&mut self, new_leaves: Vec<Vec<u8>>) -> Result<()> {
        if self.leaves.len() + new_leaves.len() > self.capacity {
            return Err(CryptoError::InvalidInput("Tree capacity would be exceeded".to_string()));
        }

        self.leaves.extend(new_leaves);
        self.tree = None;
        Ok(())
    }

    /// Build or rebuild the tree
    pub fn build(&mut self) -> Result<()> {
        if self.leaves.is_empty() {
            return Err(CryptoError::InvalidInput("Cannot build tree with no leaves".to_string()));
        }

        self.tree = Some(MerkleTree::new_parallel(self.leaves.clone(), self.algorithm)?);
        Ok(())
    }

    /// Get the current root (builds tree if needed)
    pub fn root(&mut self) -> Result<Vec<u8>> {
        if self.tree.is_none() {
            self.build()?;
        }
        Ok(self.tree.as_ref().unwrap().root().to_vec())
    }

    /// Generate proof for a leaf
    pub fn generate_proof(&mut self, leaf_index: usize) -> Result<MerkleProof> {
        if self.tree.is_none() {
            self.build()?;
        }
        self.tree.as_ref().unwrap().generate_proof(leaf_index)
    }

    /// Get current leaf count
    pub fn leaf_count(&self) -> usize {
        self.leaves.len()
    }
}

/// Optimized batch proof verification
pub fn verify_proofs_batch(
    tree: &MerkleTree,
    proofs: &[MerkleProof],
) -> Vec<bool> {
    let engine = Arc::new(HashEngine::new(tree.algorithm));
    let tree_root = tree.root();

    proofs
        .par_iter()
        .map(|proof| {
            match MerkleTree::compute_root_from_proof(&engine, proof) {
                Ok(computed_root) => computed_root == tree_root,
                Err(_) => false,
            }
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_merkle_tree_creation() {
        let leaves: Vec<Vec<u8>> = (0..8)
            .map(|i| format!("leaf_{}", i).into_bytes())
            .collect();

        let tree = MerkleTree::new(leaves.clone(), HashAlgorithm::Blake3).unwrap();
        assert_eq!(tree.leaf_count(), 8);
        assert_eq!(tree.depth(), 4); // 8 leaves -> 4 levels (including root)
    }

    #[test]
    fn test_merkle_proof_generation_and_verification() {
        let leaves: Vec<Vec<u8>> = (0..8)
            .map(|i| format!("leaf_{}", i).into_bytes())
            .collect();

        let tree = MerkleTree::new(leaves, HashAlgorithm::Sha256).unwrap();

        // Generate and verify proof for each leaf
        for i in 0..8 {
            let proof = tree.generate_proof(i).unwrap();
            assert!(tree.verify_proof(&proof).unwrap());
        }
    }

    #[test]
    fn test_incremental_merkle_tree() {
        let mut incremental = IncrementalMerkleTree::new(100, HashAlgorithm::Blake3);

        // Add leaves one by one
        for i in 0..10 {
            incremental.add_leaf(format!("leaf_{}", i).into_bytes()).unwrap();
        }

        let root1 = incremental.root().unwrap();

        // Add more leaves
        let new_leaves: Vec<Vec<u8>> = (10..20)
            .map(|i| format!("leaf_{}", i).into_bytes())
            .collect();
        incremental.add_leaves(new_leaves).unwrap();

        let root2 = incremental.root().unwrap();
        assert_ne!(root1, root2); // Root should change with new leaves
    }

    #[test]
    fn test_parallel_construction() {
        let large_dataset: Vec<Vec<u8>> = (0..10000)
            .map(|i| format!("large_leaf_{}", i).into_bytes())
            .collect();

        let tree = MerkleTree::new_parallel(large_dataset, HashAlgorithm::Blake3).unwrap();
        assert_eq!(tree.leaf_count(), 10000);
    }
}