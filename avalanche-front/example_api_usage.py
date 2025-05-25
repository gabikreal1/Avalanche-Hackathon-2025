#!/usr/bin/env python3
"""
Example script demonstrating how to interact with the subnet configuration chat API.
This script shows the expected request/response format for the LLM integration.
"""

import requests
import json

def test_chat_api():
    """Test the chat API with a sample configuration and question."""
    
    # API endpoint
    url = "http://192.168.86.9:8000/chat"
    
    # Sample subnet configuration (matches the TypeScript interface)
    sample_config = {
        "subnetId": "test-subnet-123",
        "vmId": "srEXiWaHuhNyGwPUi444Tu47ZEDwxTWrbQiuD7FmgSAQ6X7Dy",
        "evmChainId": 43114,
        "gasLimit": 8000000,
        "targetBlockRate": 2,
        "tokenAllocations": [
            {
                "address": "0x1234567890123456789012345678901234567890",
                "amount": "1000000000000000000000"
            }
        ],
        "feeConfig": {
            "minBaseFee": "25000000000",
            "baseFeeChangeDenominator": 48,
            "minBlockGasCost": "0",
            "maxBlockGasCost": "1000000",
            "blockGasCostStep": "200000",
            "targetGas": "15000000"
        },
        "contractDeployerAllowListConfig": {
            "enabled": True,
            "admins": ["0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"],
            "members": [],
            "enabledAddresses": []
        },
        "contractNativeMinterConfig": {
            "enabled": False,
            "admins": [],
            "members": [],
            "enabledAddresses": []
        },
        "txAllowListConfig": {
            "enabled": False,
            "admins": [],
            "members": [],
            "enabledAddresses": []
        },
        "feeManagerEnabled": True,
        "feeManagerAdmins": ["0x1234567890123456789012345678901234567890"],
        "rewardManagerEnabled": False,
        "rewardManagerAdmins": []
    }
    
    # Sample chat history
    chat_history = "User: Hi, I need help with subnet configuration\nBot: Hello! I'd be happy to help you configure your subnet. What specific aspect would you like assistance with?"
    
    # Test questions
    test_questions = [
        "How do I set up a custom gas fee configuration?",
        "What's the recommended gas limit for a high-throughput subnet?",
        "How do I enable the contract deployer allow list?",
        "What are the best practices for fee manager configuration?"
    ]
    
    for question in test_questions:
        print(f"\n{'='*60}")
        print(f"Testing question: {question}")
        print('='*60)
        
        # Prepare the request payload
        payload = {
            "chat_history": chat_history,
            "user_config": sample_config,
            "question": question
        }
        
        try:
            # Send the request
            print("Sending request to API...")
            response = requests.post(url, json=payload, timeout=30)
            
            # Check for HTTP errors
            response.raise_for_status()
            
            # Parse the response
            data = response.json()
            
            print(f"✅ Success!")
            print(f"LLM Reply: {data.get('reply', 'No reply received')}")
            
            # Check for configuration updates
            updates = data.get('update', {})
            if updates:
                print(f"Configuration Updates:")
                print(json.dumps(updates, indent=2))
            else:
                print("No configuration updates suggested.")
                
            # Update chat history for next iteration
            chat_history += f"\nUser: {question}\nBot: {data.get('reply', '')}"
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed: {e}")
        except json.JSONDecodeError as e:
            print(f"❌ Invalid JSON response: {e}")
        except Exception as e:
            print(f"❌ Unexpected error: {e}")

def validate_config_structure(config):
    """Validate that the configuration matches the expected structure."""
    required_fields = [
        'subnetId', 'vmId', 'evmChainId', 'gasLimit', 'targetBlockRate',
        'tokenAllocations', 'feeConfig', 'contractDeployerAllowListConfig',
        'contractNativeMinterConfig', 'txAllowListConfig', 'feeManagerEnabled',
        'feeManagerAdmins', 'rewardManagerEnabled', 'rewardManagerAdmins'
    ]
    
    for field in required_fields:
        if field not in config:
            print(f"❌ Missing required field: {field}")
            return False
    
    # Validate nested structures
    fee_config_fields = ['minBaseFee', 'baseFeeChangeDenominator', 'minBlockGasCost', 
                        'maxBlockGasCost', 'blockGasCostStep', 'targetGas']
    for field in fee_config_fields:
        if field not in config['feeConfig']:
            print(f"❌ Missing feeConfig field: {field}")
            return False
    
    allowlist_fields = ['enabled', 'admins', 'members', 'enabledAddresses']
    for config_name in ['contractDeployerAllowListConfig', 'contractNativeMinterConfig', 'txAllowListConfig']:
        for field in allowlist_fields:
            if field not in config[config_name]:
                print(f"❌ Missing {config_name} field: {field}")
                return False
    
    print("✅ Configuration structure is valid")
    return True

if __name__ == "__main__":
    print("Subnet Configuration Chat API Test")
    print("=" * 40)
    
    # Test the API
    test_chat_api()
    
    print(f"\n{'='*60}")
    print("Test completed!")
    print("="*60) 