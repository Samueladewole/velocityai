/// Velocity.ai Cryptographic Core
/// 
/// High-performance cryptographic operations for the Velocity Trust Protocol
/// Optimized for blockchain verification, Merkle tree generation, and trust scoring

pub mod hash_engine;
pub mod merkle_tree;
pub mod trust_calculator;
pub mod signature_verifier;
pub mod monte_carlo;
pub mod blockchain_compliance;
pub mod ffi;

use thiserror::Error;

#[derive(Error, Debug)]
pub enum CryptoError {
    #[error("Invalid input data: {0}")]
    InvalidInput(String),
    
    #[error("Cryptographic operation failed: {0}")]
    CryptoOperationFailed(String),
    
    #[error("Verification failed: {0}")]
    VerificationFailed(String),
    
    #[error("Serialization error: {0}")]
    SerializationError(String),
}

pub type Result<T> = std::result::Result<T, CryptoError>;

/// Initialize the crypto core with optimal performance settings
pub fn initialize() {
    // Set up thread pool for parallel operations
    rayon::ThreadPoolBuilder::new()
        .num_threads(num_cpus::get())
        .build_global()
        .unwrap_or_else(|_| eprintln!("Failed to initialize thread pool"));
    
    println!("🔐 Velocity Crypto Core initialized with {} threads", num_cpus::get());
}