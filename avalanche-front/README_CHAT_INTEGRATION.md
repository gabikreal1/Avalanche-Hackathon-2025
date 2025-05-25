# Subnet Configuration Chat Integration

This implementation provides a complete solution for integrating an LLM chat system with subnet configuration management. The system automatically restores the original JSON structure from flattened form fields and sends it to the chat API along with conversation context.

## Features

- **JSON Structure Restoration**: Automatically converts flattened form data back to the original nested JSON structure
- **Chat API Integration**: Sends complete configuration and chat history to the LLM endpoint
- **Real-time Updates**: Applies LLM responses back to the form fields
- **Type Safety**: Full TypeScript support with proper interfaces

## Architecture

### Core Components

1. **`src/types/subnetConfig.ts`** - Type definitions for the complete configuration structure
2. **`src/lib/configRestorer.ts`** - Utility functions for JSON restoration and chat formatting
3. **`src/lib/apiClient.ts`** - API client with chat endpoint support
4. **`src/contexts/ChatContext.tsx`** - Updated chat context with configuration integration
5. **`src/components/ConfigurationTest.tsx`** - Test component for demonstration

### Configuration Structure

The system handles the following JSON structure:

```json
{
  "subnetId": "string",
  "subnetOwner": "string",
  "vmId": "string",
  "evmChainId": "number",
  "gasLimit": "number",
  "targetBlockRate": "number",
  "tokenAllocations": [
    {
      "address": "string",
      "amount": "string"
    }
  ],
  "feeConfig": {
    "minBaseFee": "string",
    "baseFeeChangeDenominator": "number",
    "minBlockGasCost": "string",
    "maxBlockGasCost": "string",
    "blockGasCostStep": "string",
    "targetGas": "string"
  },
  "contractDeployerAllowListConfig": {
    "enabled": "boolean",
    "admins": ["string"],
    "members": ["string"],
    "enabledAddresses": ["string"]
  },
  "contractNativeMinterConfig": {
    "enabled": "boolean",
    "admins": ["string"],
    "members": ["string"],
    "enabledAddresses": ["string"]
  },
  "txAllowListConfig": {
    "enabled": "boolean",
    "admins": ["string"],
    "members": ["string"],
    "enabledAddresses": ["string"]
  },
  "feeManagerEnabled": "boolean",
  "feeManagerAdmins": ["string"],
  "rewardManagerEnabled": "boolean",
  "rewardManagerAdmins": ["string"]
}
```

## API Integration

### Chat Endpoint

The system sends POST requests to `http://192.168.86.9:8000/chat` with the following structure:

```typescript
interface ChatApiRequest {
  chat_history: string;
  user_config: SubnetConfig;
  question: string;
}
```

### Expected Response

```typescript
interface ChatApiResponse {
  reply: string;
  update: Partial<SubnetConfig>;
}
```

### Example Request

```python
import requests

url = "http://192.168.86.9:8000/chat"

payload = {
    "chat_history": "User: Hi\nBot: Hello! How can I help?\n",
    "user_config": {
        "gasLimit": 8000000,
        "feeConfig": {"minBaseFee": "1000000000"},
        # ... complete configuration
    },
    "question": "How do I set up a subnet with a custom gas fee?"
}

response = requests.post(url, json=payload)
data = response.json()
print("LLM reply:", data["reply"])
print("JSON updates:", data["update"])
```

## Usage

### 1. Basic Integration

The chat system is already integrated into the main application. To use it:

```tsx
import { ChatProvider } from '@/contexts/ChatContext';
import { BlockProvider } from '@/contexts/BlockContext';

function App() {
  return (
    <BlockProvider>
      <ChatProvider>
        {/* Your app components */}
      </ChatProvider>
    </BlockProvider>
  );
}
```

### 2. Testing

Visit `/test` to see the demonstration page with:
- Configuration test panel
- Live chat interface
- Real-time JSON restoration display

### 3. Custom Implementation

To use the configuration restoration in your own components:

```tsx
import { useBlock } from '@/contexts/BlockContext';
import { restoreSubnetConfig } from '@/lib/configRestorer';

function MyComponent() {
  const { formData } = useBlock();
  const currentConfig = restoreSubnetConfig(formData);
  
  // Use currentConfig for API calls or display
}
```

## Field Mapping

The system maps flattened form fields to the nested structure:

| Flattened Field | JSON Path |
|----------------|-----------|
| `subnetId` | `subnetId` |
| `subnetOwner` | `subnetOwner` |
| `vmId` | `vmId` |
| `evmChainId` | `evmChainId` |
| `gasLimit` | `gasLimit` |
| `targetBlockRate` | `targetBlockRate` |
| `minBaseFee` | `feeConfig.minBaseFee` |
| `baseFeeChangeDenominator` | `feeConfig.baseFeeChangeDenominator` |
| `contractDeployerAllowListEnabled` | `contractDeployerAllowListConfig.enabled` |
| `contractDeployerAllowListAdmins` | `contractDeployerAllowListConfig.admins` |
| `feeManagerEnabled` | `feeManagerEnabled` |
| `feeManagerAdmins` | `feeManagerAdmins` |

## Error Handling

The system includes comprehensive error handling:

- Network timeouts (30 seconds for chat requests)
- API errors with user-friendly messages
- Graceful fallbacks for malformed responses
- Console logging for debugging

## Development

### Adding New Fields

1. Update the `SubnetConfig` interface in `src/types/subnetConfig.ts`
2. Add field mapping in `restoreSubnetConfig()` function
3. Update the default configuration template
4. Test with the configuration test component

### Debugging

Enable console logging to see:
- Complete configuration being sent to API
- API responses and updates
- Field mapping results

```javascript
// Check browser console for:
console.log('Sending chat request:', chatRequest);
console.log('Received chat response:', response);
console.log('Parsed updates:', parsedUpdates);
```

## Dependencies

- React 18+
- TypeScript
- Tailwind CSS (for styling)
- Custom context providers (ChatContext, BlockContext)

## Notes

- The API endpoint is currently hardcoded to `http://192.168.86.9:8000`
- Chat history is formatted as "User: message\nBot: response\n"
- All configuration values are properly typed and validated
- The system supports partial updates from the LLM responses 