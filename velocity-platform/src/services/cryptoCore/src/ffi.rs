/// Foreign Function Interface (FFI) for TypeScript/Node.js integration
/// 
/// Provides C-compatible functions for the Velocity crypto core
/// Can be compiled to both native library and WebAssembly

use crate::hash_engine::{HashAlgorithm, HashEngine};
use crate::merkle_tree::MerkleTree;
use crate::trust_calculator::{TrustActivity, TrustCalculator, TrustCalculatorConfig};
use crate::monte_carlo::{MonteCarloEngine, MonteCarloConfig, ComplianceScenario};
use crate::signature_verifier::{SignatureVerifier, SignatureRequest, SignatureAlgorithm};
use std::ffi::{CStr, CString};
use std::os::raw::{c_char, c_double, c_int, c_uchar, c_uint};
use std::ptr;
use std::slice;

/// Error codes for FFI
#[repr(C)]
pub enum VelocityCryptoError {
    Success = 0,
    InvalidInput = 1,
    CryptoOperationFailed = 2,
    VerificationFailed = 3,
    SerializationError = 4,
    MemoryAllocationFailed = 5,
}

/// Result structure for FFI operations
#[repr(C)]
pub struct VelocityCryptoResult {
    pub error_code: VelocityCryptoError,
    pub data: *mut c_uchar,
    pub data_len: c_uint,
    pub error_message: *mut c_char,
}

impl VelocityCryptoResult {
    fn success(data: Vec<u8>) -> Self {
        let data_len = data.len() as c_uint;
        let data_ptr = if data.is_empty() {
            ptr::null_mut()
        } else {
            let mut data_boxed = data.into_boxed_slice();
            let ptr = data_boxed.as_mut_ptr();
            std::mem::forget(data_boxed);
            ptr
        };

        Self {
            error_code: VelocityCryptoError::Success,
            data: data_ptr,
            data_len,
            error_message: ptr::null_mut(),
        }
    }

    fn error(code: VelocityCryptoError, message: &str) -> Self {
        let c_message = CString::new(message).unwrap_or_else(|_| CString::new("Unknown error").unwrap());
        let message_ptr = c_message.into_raw();

        Self {
            error_code: code,
            data: ptr::null_mut(),
            data_len: 0,
            error_message: message_ptr,
        }
    }
}

/// Initialize the crypto core
#[no_mangle]
pub extern "C" fn velocity_crypto_initialize() {
    crate::initialize();
}

/// Free a result structure
#[no_mangle]
pub extern "C" fn velocity_crypto_free_result(result: *mut VelocityCryptoResult) {
    if result.is_null() {
        return;
    }

    unsafe {
        let result = &mut *result;
        
        // Free data
        if !result.data.is_null() && result.data_len > 0 {
            let _ = Vec::from_raw_parts(result.data, result.data_len as usize, result.data_len as usize);
        }

        // Free error message
        if !result.error_message.is_null() {
            let _ = CString::from_raw(result.error_message);
        }

        // Free the result itself
        Box::from_raw(result);
    }
}

/// Hash data using specified algorithm
#[no_mangle]
pub extern "C" fn velocity_crypto_hash(
    data: *const c_uchar,
    data_len: c_uint,
    algorithm: c_int,
) -> *mut VelocityCryptoResult {
    if data.is_null() {
        return Box::into_raw(Box::new(VelocityCryptoResult::error(
            VelocityCryptoError::InvalidInput,
            "Data pointer is null",
        )));
    }

    let algorithm = match algorithm {
        0 => HashAlgorithm::Sha256,
        1 => HashAlgorithm::Sha512,
        2 => HashAlgorithm::Sha3_256,
        3 => HashAlgorithm::Sha3_512,
        4 => HashAlgorithm::Blake3,
        _ => {
            return Box::into_raw(Box::new(VelocityCryptoResult::error(
                VelocityCryptoError::InvalidInput,
                "Invalid hash algorithm",
            )));
        }
    };

    unsafe {
        let data_slice = slice::from_raw_parts(data, data_len as usize);
        let engine = HashEngine::new(algorithm);
        
        match engine.hash(data_slice) {
            Ok(hash) => Box::into_raw(Box::new(VelocityCryptoResult::success(hash))),
            Err(e) => Box::into_raw(Box::new(VelocityCryptoResult::error(
                VelocityCryptoError::CryptoOperationFailed,
                &e.to_string(),
            ))),
        }
    }
}

/// Create a Merkle tree from leaves
#[no_mangle]
pub extern "C" fn velocity_crypto_merkle_tree_create(
    leaves_data: *const c_uchar,
    leaves_data_len: c_uint,
    leaf_count: c_uint,
    algorithm: c_int,
) -> *mut VelocityCryptoResult {
    if leaves_data.is_null() || leaf_count == 0 {
        return Box::into_raw(Box::new(VelocityCryptoResult::error(
            VelocityCryptoError::InvalidInput,
            "Invalid leaves data",
        )));
    }

    let algorithm = match algorithm {
        0 => HashAlgorithm::Sha256,
        1 => HashAlgorithm::Sha512,
        4 => HashAlgorithm::Blake3,
        _ => HashAlgorithm::Blake3,
    };

    unsafe {
        let data_slice = slice::from_raw_parts(leaves_data, leaves_data_len as usize);
        
        // Parse leaves from concatenated data
        // Format: [len1][data1][len2][data2]...
        let mut leaves = Vec::new();
        let mut offset = 0;
        
        for _ in 0..leaf_count {
            if offset + 4 > data_slice.len() {
                return Box::into_raw(Box::new(VelocityCryptoResult::error(
                    VelocityCryptoError::InvalidInput,
                    "Invalid leaf data format",
                )));
            }
            
            let len = u32::from_le_bytes([
                data_slice[offset],
                data_slice[offset + 1],
                data_slice[offset + 2],
                data_slice[offset + 3],
            ]) as usize;
            offset += 4;
            
            if offset + len > data_slice.len() {
                return Box::into_raw(Box::new(VelocityCryptoResult::error(
                    VelocityCryptoError::InvalidInput,
                    "Invalid leaf length",
                )));
            }
            
            leaves.push(data_slice[offset..offset + len].to_vec());
            offset += len;
        }

        match MerkleTree::new_parallel(leaves, algorithm) {
            Ok(tree) => {
                // Serialize tree to return
                match bincode::serialize(&tree) {
                    Ok(serialized) => Box::into_raw(Box::new(VelocityCryptoResult::success(serialized))),
                    Err(e) => Box::into_raw(Box::new(VelocityCryptoResult::error(
                        VelocityCryptoError::SerializationError,
                        &e.to_string(),
                    ))),
                }
            }
            Err(e) => Box::into_raw(Box::new(VelocityCryptoResult::error(
                VelocityCryptoError::CryptoOperationFailed,
                &e.to_string(),
            ))),
        }
    }
}

/// Calculate trust score
#[no_mangle]
pub extern "C" fn velocity_crypto_calculate_trust_score(
    activities_json: *const c_char,
) -> *mut VelocityCryptoResult {
    if activities_json.is_null() {
        return Box::into_raw(Box::new(VelocityCryptoResult::error(
            VelocityCryptoError::InvalidInput,
            "Activities JSON is null",
        )));
    }

    unsafe {
        let activities_str = match CStr::from_ptr(activities_json).to_str() {
            Ok(s) => s,
            Err(_) => {
                return Box::into_raw(Box::new(VelocityCryptoResult::error(
                    VelocityCryptoError::InvalidInput,
                    "Invalid UTF-8 in activities JSON",
                )));
            }
        };

        let activities: Vec<TrustActivity> = match serde_json::from_str(activities_str) {
            Ok(a) => a,
            Err(e) => {
                return Box::into_raw(Box::new(VelocityCryptoResult::error(
                    VelocityCryptoError::SerializationError,
                    &format!("Failed to parse activities: {}", e),
                )));
            }
        };

        let calculator = TrustCalculator::new(TrustCalculatorConfig::default());
        
        match calculator.calculate_trust_score(&activities) {
            Ok(score) => {
                match serde_json::to_vec(&score) {
                    Ok(json) => Box::into_raw(Box::new(VelocityCryptoResult::success(json))),
                    Err(e) => Box::into_raw(Box::new(VelocityCryptoResult::error(
                        VelocityCryptoError::SerializationError,
                        &e.to_string(),
                    ))),
                }
            }
            Err(e) => Box::into_raw(Box::new(VelocityCryptoResult::error(
                VelocityCryptoError::CryptoOperationFailed,
                &e.to_string(),
            ))),
        }
    }
}

/// Run Monte Carlo simulation
#[no_mangle]
pub extern "C" fn velocity_crypto_monte_carlo_simulate(
    scenario_json: *const c_char,
    iterations: c_uint,
) -> *mut VelocityCryptoResult {
    if scenario_json.is_null() {
        return Box::into_raw(Box::new(VelocityCryptoResult::error(
            VelocityCryptoError::InvalidInput,
            "Scenario JSON is null",
        )));
    }

    unsafe {
        let scenario_str = match CStr::from_ptr(scenario_json).to_str() {
            Ok(s) => s,
            Err(_) => {
                return Box::into_raw(Box::new(VelocityCryptoResult::error(
                    VelocityCryptoError::InvalidInput,
                    "Invalid UTF-8 in scenario JSON",
                )));
            }
        };

        let scenario: ComplianceScenario = match serde_json::from_str(scenario_str) {
            Ok(s) => s,
            Err(e) => {
                return Box::into_raw(Box::new(VelocityCryptoResult::error(
                    VelocityCryptoError::SerializationError,
                    &format!("Failed to parse scenario: {}", e),
                )));
            }
        };

        let mut config = MonteCarloConfig::default();
        config.iterations = iterations as usize;
        
        let engine = MonteCarloEngine::new(config);
        
        match engine.simulate_compliance_risk(&scenario) {
            Ok(result) => {
                match serde_json::to_vec(&result) {
                    Ok(json) => Box::into_raw(Box::new(VelocityCryptoResult::success(json))),
                    Err(e) => Box::into_raw(Box::new(VelocityCryptoResult::error(
                        VelocityCryptoError::SerializationError,
                        &e.to_string(),
                    ))),
                }
            }
            Err(e) => Box::into_raw(Box::new(VelocityCryptoResult::error(
                VelocityCryptoError::CryptoOperationFailed,
                &e.to_string(),
            ))),
        }
    }
}

/// Verify a signature
#[no_mangle]
pub extern "C" fn velocity_crypto_verify_signature(
    message: *const c_uchar,
    message_len: c_uint,
    signature: *const c_uchar,
    signature_len: c_uint,
    public_key: *const c_uchar,
    public_key_len: c_uint,
    algorithm: c_int,
) -> *mut VelocityCryptoResult {
    if message.is_null() || signature.is_null() || public_key.is_null() {
        return Box::into_raw(Box::new(VelocityCryptoResult::error(
            VelocityCryptoError::InvalidInput,
            "Null pointer provided",
        )));
    }

    let algorithm = match algorithm {
        0 => SignatureAlgorithm::Ed25519,
        1 => SignatureAlgorithm::EcdsaP256,
        2 => SignatureAlgorithm::RsaPss2048,
        3 => SignatureAlgorithm::PolygonEcdsa,
        _ => {
            return Box::into_raw(Box::new(VelocityCryptoResult::error(
                VelocityCryptoError::InvalidInput,
                "Invalid signature algorithm",
            )));
        }
    };

    unsafe {
        let message_slice = slice::from_raw_parts(message, message_len as usize);
        let signature_slice = slice::from_raw_parts(signature, signature_len as usize);
        let public_key_slice = slice::from_raw_parts(public_key, public_key_len as usize);

        let request = SignatureRequest {
            message: message_slice.to_vec(),
            signature: signature_slice.to_vec(),
            public_key: public_key_slice.to_vec(),
            algorithm,
            polygon_tx_hash: None,
        };

        let verifier = SignatureVerifier::new(false);
        let result = verifier.verify_signature(&request);

        match serde_json::to_vec(&result) {
            Ok(json) => Box::into_raw(Box::new(VelocityCryptoResult::success(json))),
            Err(e) => Box::into_raw(Box::new(VelocityCryptoResult::error(
                VelocityCryptoError::SerializationError,
                &e.to_string(),
            ))),
        }
    }
}

// WebAssembly-specific exports when compiling to WASM
#[cfg(target_arch = "wasm32")]
pub mod wasm {
    use wasm_bindgen::prelude::*;
    use super::*;

    #[wasm_bindgen]
    pub fn wasm_hash(data: &[u8], algorithm: u32) -> Result<Vec<u8>, JsValue> {
        let algorithm = match algorithm {
            0 => HashAlgorithm::Sha256,
            1 => HashAlgorithm::Sha512,
            4 => HashAlgorithm::Blake3,
            _ => return Err(JsValue::from_str("Invalid algorithm")),
        };

        let engine = HashEngine::new(algorithm);
        engine.hash(data)
            .map_err(|e| JsValue::from_str(&e.to_string()))
    }

    #[wasm_bindgen]
    pub fn wasm_calculate_trust_score(activities_json: &str) -> Result<String, JsValue> {
        let activities: Vec<TrustActivity> = serde_json::from_str(activities_json)
            .map_err(|e| JsValue::from_str(&e.to_string()))?;

        let calculator = TrustCalculator::new(TrustCalculatorConfig::default());
        let score = calculator.calculate_trust_score(&activities)
            .map_err(|e| JsValue::from_str(&e.to_string()))?;

        serde_json::to_string(&score)
            .map_err(|e| JsValue::from_str(&e.to_string()))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_ffi_hash() {
        let data = b"test data";
        let result_ptr = velocity_crypto_hash(data.as_ptr(), data.len() as c_uint, 4); // Blake3
        
        unsafe {
            let result = &*result_ptr;
            assert_eq!(result.error_code as i32, VelocityCryptoError::Success as i32);
            assert!(!result.data.is_null());
            assert!(result.data_len > 0);
            
            velocity_crypto_free_result(result_ptr);
        }
    }

    #[test]
    fn test_ffi_trust_score() {
        let activities = r#"[
            {
                "activity_type": "ComplianceVerification",
                "timestamp": 1234567890,
                "value": 0.9,
                "confidence": 0.95,
                "verifier_reputation": 0.8,
                "polygon_tx_hash": null,
                "metadata": {}
            }
        ]"#;

        let c_activities = CString::new(activities).unwrap();
        let result_ptr = velocity_crypto_calculate_trust_score(c_activities.as_ptr());
        
        unsafe {
            let result = &*result_ptr;
            assert_eq!(result.error_code as i32, VelocityCryptoError::Success as i32);
            assert!(!result.data.is_null());
            
            velocity_crypto_free_result(result_ptr);
        }
    }
}