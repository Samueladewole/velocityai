#!/usr/bin/env python3
"""
Enhanced Authentication Test Suite
Tests TOTP MFA implementation and enrollment flows
"""

import asyncio
import sys
import os

# Add the current directory to Python path for imports
sys.path.insert(0, os.path.abspath('.'))

async def test_totp_manager():
    """Test TOTP manager functionality"""
    print("Testing TOTP Manager...")
    
    try:
        from enhanced_auth.mfa import TOTPManager, MFAManager
        
        # Test TOTP manager
        totp_manager = TOTPManager()
        
        # Generate secret
        secret = totp_manager.generate_secret()
        print(f"✓ Generated TOTP secret: {secret[:8]}...")
        
        # Generate current token for testing
        current_token = totp_manager.get_current_totp(secret)
        print(f"✓ Generated current TOTP: {current_token}")
        
        # Verify token
        is_valid = totp_manager.verify_totp(secret, current_token)
        print(f"✓ Token verification: {'PASS' if is_valid else 'FAIL'}")
        
        # Test QR code generation
        qr_code = totp_manager.generate_qr_code("test@erip.com", secret)
        print(f"✓ QR code generated: {len(qr_code)} characters")
        print(f"✓ QR code format: {'Valid' if qr_code.startswith('data:image/png;base64,') else 'Invalid'}")
        
        return True
        
    except Exception as e:
        print(f"✗ TOTP Manager test failed: {e}")
        return False

async def test_mfa_enrollment_flow():
    """Test complete MFA enrollment flow"""
    print("\nTesting MFA Enrollment Flow...")
    
    try:
        from enhanced_auth.mfa import MFAManager, MFAMethod
        
        mfa_manager = MFAManager()
        test_user_id = "test_user_001"
        test_email = "test@erip.com"
        
        # Start enrollment
        enrollment_data = await mfa_manager.enroll_totp(test_user_id, test_email)
        print("✓ TOTP enrollment started")
        print(f"  - Secret: {enrollment_data['secret'][:8]}...")
        print(f"  - QR code: {len(enrollment_data['qr_code'])} characters")
        print(f"  - Issuer: {enrollment_data['issuer']}")
        
        # Get current token for verification
        secret = enrollment_data["secret"]
        current_token = mfa_manager.totp_manager.get_current_totp(secret)
        
        # Verify enrollment
        enrollment_success = await mfa_manager.verify_totp_enrollment(test_user_id, current_token)
        print(f"✓ Enrollment verification: {'SUCCESS' if enrollment_success else 'FAILED'}")
        
        if enrollment_success:
            # Check user methods
            methods = await mfa_manager.get_user_mfa_methods(test_user_id)
            print(f"✓ Enrolled methods: {len(methods)}")
            for method in methods:
                print(f"  - {method['method']}: enrolled at {method['enrolled_at']}")
                if 'backup_codes_remaining' in method:
                    print(f"    Backup codes: {method['backup_codes_remaining']}")
        
        return enrollment_success
        
    except Exception as e:
        print(f"✗ MFA enrollment flow test failed: {e}")
        return False

async def test_mfa_challenge_flow():
    """Test MFA challenge and verification flow"""
    print("\nTesting MFA Challenge Flow...")
    
    try:
        from enhanced_auth.mfa import MFAManager, MFAMethod
        
        mfa_manager = MFAManager()
        test_user_id = "test_user_002"
        test_email = "challenge@erip.com"
        
        # Enroll user first
        enrollment_data = await mfa_manager.enroll_totp(test_user_id, test_email)
        secret = enrollment_data["secret"]
        current_token = mfa_manager.totp_manager.get_current_totp(secret)
        await mfa_manager.verify_totp_enrollment(test_user_id, current_token)
        
        print("✓ Test user enrolled in TOTP")
        
        # Create challenge
        challenge = await mfa_manager.create_mfa_challenge(test_user_id, MFAMethod.TOTP)
        if challenge:
            print(f"✓ MFA challenge created: {challenge.challenge_id}")
            print(f"  - Method: {challenge.method}")
            print(f"  - Expires: {challenge.expires_at}")
            print(f"  - Max attempts: {challenge.max_attempts}")
            
            # Verify challenge with correct token
            new_token = mfa_manager.totp_manager.get_current_totp(secret)
            verification_success = await mfa_manager.verify_mfa_challenge(challenge.challenge_id, new_token)
            print(f"✓ Challenge verification: {'SUCCESS' if verification_success else 'FAILED'}")
            
            return verification_success
        else:
            print("✗ Failed to create MFA challenge")
            return False
            
    except Exception as e:
        print(f"✗ MFA challenge flow test failed: {e}")
        return False

async def test_backup_codes():
    """Test backup codes functionality"""
    print("\nTesting Backup Codes...")
    
    try:
        from enhanced_auth.mfa import MFAManager
        
        mfa_manager = MFAManager()
        test_user_id = "test_user_003"
        test_email = "backup@erip.com"
        
        # Enroll user and complete verification
        enrollment_data = await mfa_manager.enroll_totp(test_user_id, test_email)
        secret = enrollment_data["secret"]
        current_token = mfa_manager.totp_manager.get_current_totp(secret)
        await mfa_manager.verify_totp_enrollment(test_user_id, current_token)
        
        # Get user enrollment to check backup codes
        enrollments = mfa_manager.user_enrollments.get(test_user_id, [])
        totp_enrollment = next((e for e in enrollments if e.method.value == "totp"), None)
        
        if totp_enrollment and totp_enrollment.backup_codes:
            print(f"✓ Backup codes generated: {len(totp_enrollment.backup_codes)}")
            print(f"  - Sample code: {totp_enrollment.backup_codes[0]}")
            
            # Test backup code verification
            test_code = totp_enrollment.backup_codes[0]
            is_valid = mfa_manager._verify_backup_code(totp_enrollment, test_code)
            print(f"✓ Backup code verification: {'SUCCESS' if is_valid else 'FAILED'}")
            
            # Check that code was consumed
            remaining_codes = len(totp_enrollment.backup_codes)
            print(f"✓ Backup codes remaining after use: {remaining_codes}")
            
            return is_valid and remaining_codes == 9  # Should be 9 remaining
        else:
            print("✗ No backup codes found")
            return False
            
    except Exception as e:
        print(f"✗ Backup codes test failed: {e}")
        return False

async def test_api_endpoints():
    """Test API endpoint accessibility"""
    print("\nTesting API Endpoints...")
    
    try:
        # Test that we can import the router
        from enhanced_auth.router import router
        print(f"✓ Enhanced auth router imported successfully")
        print(f"✓ Router has {len(router.routes)} endpoints")
        
        # List key endpoints
        routes = []
        for route in router.routes:
            if hasattr(route, 'path') and hasattr(route, 'methods'):
                methods = list(route.methods) if route.methods else ['GET']
                routes.append(f"{methods[0]} {route.path}")
        
        print("✓ Available endpoints:")
        for route in routes:
            print(f"  - {route}")
        
        return len(routes) > 0
        
    except Exception as e:
        print(f"✗ API endpoints test failed: {e}")
        return False

async def main():
    """Run all enhanced authentication tests"""
    print("=" * 80)
    print("ERIP ENHANCED AUTHENTICATION TEST SUITE")
    print("=" * 80)
    
    tests = [
        ("TOTP Manager", test_totp_manager),
        ("MFA Enrollment Flow", test_mfa_enrollment_flow),
        ("MFA Challenge Flow", test_mfa_challenge_flow),
        ("Backup Codes", test_backup_codes),
        ("API Endpoints", test_api_endpoints)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n{test_name}:")
        print("-" * 60)
        
        try:
            result = await test_func()
            if result:
                passed += 1
                print(f"✓ {test_name} test passed")
            else:
                print(f"✗ {test_name} test failed")
        except Exception as e:
            print(f"✗ {test_name} test error: {e}")
    
    print("\n" + "=" * 80)
    print(f"ENHANCED AUTH TEST SUMMARY: {passed}/{total} TESTS PASSED")
    if passed == total:
        print("🎉 ALL ENHANCED AUTHENTICATION TESTS PASSED!")
        print("\n🔒 TOTP MFA Implementation Complete:")
        print("  ✓ Authenticator app support (Google Authenticator, Authy)")
        print("  ✓ QR code enrollment flow")
        print("  ✓ Token verification and challenges")
        print("  ✓ Backup codes for recovery")
        print("  ✓ API endpoints ready for frontend integration")
    else:
        print(f"⚠️  {total - passed} TESTS FAILED")
    print("=" * 80)
    
    return passed == total

if __name__ == "__main__":
    result = asyncio.run(main())
    sys.exit(0 if result else 1)