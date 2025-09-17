#!/usr/bin/env python3
"""
Simple test script for AI Mental Health Assistant backend
Run this to verify all endpoints are working properly
"""

import requests
import json
import time

# Configuration
BASE_URL = "http://localhost:8001"
TEST_USER_ID = "demo-user-id"

def test_health_check():
    """Test health check endpoint"""
    print("🔍 Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data['service']}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_authentication():
    """Test authentication endpoints"""
    print("\n🔐 Testing authentication...")
    
    # Test login
    try:
        login_data = {"username": "demo", "password": "password"}
        response = requests.post(f"{BASE_URL}/api/v1/auth/login", json=login_data)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login successful: {data['data']['user']['name']}")
            return True
        else:
            print(f"❌ Login failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Login error: {e}")
        return False

def test_chat():
    """Test chat functionality"""
    print("\n💬 Testing chat...")
    try:
        chat_data = {"message": "Hello! How are you today?"}
        response = requests.post(f"{BASE_URL}/api/v1/chat/send", json=chat_data)
        
        if response.status_code == 200:
            data = response.json()
            message = data['data']['message']
            emotion = data['data']['emotion_detected']
            print(f"✅ Chat response received")
            print(f"   Response: {message[:100]}...")
            print(f"   Emotion detected: {emotion}")
            return True
        else:
            print(f"❌ Chat failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Chat error: {e}")
        return False

def test_profile_management():
    """Test profile management endpoints"""
    print("\n👤 Testing profile management...")
    try:
        # Test get profile
        response = requests.get(f"{BASE_URL}/api/v1/profile/{TEST_USER_ID}")
        
        if response.status_code == 200:
            data = response.json()
            user = data['data']['user']
            print(f"✅ Profile retrieved: {user['name']}")
            print(f"   Bio: {user['bio']}")
            print(f"   Location: {user['location']}")
            
            # Test update profile
            update_data = {
                "name": "Updated Demo User",
                "bio": "Updated bio for testing",
                "location": "Updated Location"
            }
            response = requests.put(f"{BASE_URL}/api/v1/profile/{TEST_USER_ID}", json=update_data)
            
            if response.status_code == 200:
                print("✅ Profile update successful")
                return True
            else:
                print(f"❌ Profile update failed: {response.status_code}")
                return False
        else:
            print(f"❌ Profile retrieval failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Profile management error: {e}")
        return False

def test_avatar_update():
    """Test avatar update"""
    print("\n🎨 Testing avatar update...")
    try:
        avatar_data = {"avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=test"}
        response = requests.post(f"{BASE_URL}/api/v1/profile/{TEST_USER_ID}/avatar", json=avatar_data)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Avatar updated: {data['data']['avatar_url'][:50]}...")
            return True
        else:
            print(f"❌ Avatar update failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Avatar update error: {e}")
        return False

def test_user_stats():
    """Test user stats endpoint"""
    print("\n📊 Testing user stats...")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/profile/{TEST_USER_ID}/stats")
        
        if response.status_code == 200:
            data = response.json()
            stats = data['data']['stats']
            print(f"✅ Stats retrieved:")
            print(f"   Total sessions: {stats['total_sessions']}")
            print(f"   Streak days: {stats['streak_days']}")
            print(f"   Average mood: {stats['mood_average']}/10")
            print(f"   Achievements: {len(stats['achievements'])}")
            return True
        else:
            print(f"❌ Stats retrieval failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Stats error: {e}")
        return False

def test_emotion_analysis():
    """Test emotion analysis"""
    print("\n😊 Testing emotion analysis...")
    try:
        emotion_data = {"text": "I'm feeling really happy and excited today!"}
        response = requests.post(f"{BASE_URL}/api/v1/emotions/analyze", json=emotion_data)
        
        if response.status_code == 200:
            data = response.json()
            emotion = data['data']['emotion']
            confidence = data['data']['confidence']
            print(f"✅ Emotion analysis: {emotion} (confidence: {confidence})")
            return True
        else:
            print(f"❌ Emotion analysis failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Emotion analysis error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting AI Mental Health Assistant Backend Tests")
    print("=" * 60)
    
    tests = [
        test_health_check,
        test_authentication,
        test_chat,
        test_profile_management,
        test_avatar_update,
        test_user_stats,
        test_emotion_analysis
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        time.sleep(0.5)  # Small delay between tests
    
    print("\n" + "=" * 60)
    print(f"🎯 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Backend is working perfectly!")
    else:
        print(f"⚠️  {total - passed} tests failed. Check the output above.")
    
    print("\n💡 Make sure the backend server is running on http://localhost:8001")
    print("   Run: python main.py")

if __name__ == "__main__":
    main()
