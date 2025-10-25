# CodeRabbit API Testing Suite

A comprehensive testing suite for CodeRabbit API integration with multiple testing modes and utilities.

## 🚀 Quick Start

1. **Setup Environment**
   ```bash
   cp env.template .env
   # Edit .env with your actual API keys and configuration
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Tests**
   ```bash
   # Run all tests
   npm test

   # Quick test with specific repository
   npm run test:quick

   # Test specific modes
   npm run test:direct
   npm run test:local
   npm run test:github
   ```

## 📁 Files Overview

- `coderabbit-test-function.js` - Main testing functions and CLI interface
- `test-utils.js` - Utility functions and helpers
- `coderabbit-api.js` - Local proxy server for testing
- `test-coderabbit.js` - Original test script
- `env.template` - Environment configuration template

## 🧪 Testing Modes

### 1. Direct Mode
Tests CodeRabbit API directly without any proxy.

```javascript
import { testCodeRabbitDirect } from './coderabbit-test-function.js';

const result = await testCodeRabbitDirect({
  repoUrl: 'https://github.com/facebook/react.git',
  prNumber: 12345
});
```

### 2. Local Proxy Mode
Tests through your local proxy server (requires `coderabbit-api.js` to be running).

```javascript
import { testCodeRabbitLocal } from './coderabbit-test-function.js';

const result = await testCodeRabbitLocal({
  repoUrl: 'https://github.com/facebook/react.git',
  prNumber: 12345
});
```

### 3. GitHub Integration Mode
Fetches PR data from GitHub and sends comprehensive payload to CodeRabbit.

```javascript
import { testCodeRabbitWithGitHub } from './coderabbit-test-function.js';

const result = await testCodeRabbitWithGitHub({
  repoUrl: 'https://github.com/facebook/react.git',
  prNumber: 12345
});
```

## 🛠️ Available Functions

### Core Testing Functions

- `testCodeRabbitDirect(options)` - Direct API testing
- `testCodeRabbitLocal(options)` - Local proxy testing
- `testCodeRabbitWithGitHub(options)` - GitHub integration testing
- `runTestSuite(options)` - Run comprehensive test suite
- `quickTest(repoUrl, prNumber)` - Quick single test

### Utility Functions

- `displayTestResults(result, testType)` - Format and display results
- `testPayloads` - Pre-built payload generators
- `mockResponses` - Mock data for testing
- `performanceUtils` - Performance measurement tools
- `validators` - Response validation utilities
- `logger` - Logging utilities

## 📋 CLI Usage

### Basic Commands

```bash
# Run test suite with all modes
node coderabbit-test-function.js suite

# Run specific modes
node coderabbit-test-function.js suite direct,local

# Quick test
node coderabbit-test-function.js quick https://github.com/facebook/react.git 12345

# GitHub integration test
node coderabbit-test-function.js github
```

### Advanced Usage

```bash
# Test with custom timeout
TEST_TIMEOUT=300000 node coderabbit-test-function.js suite

# Test specific repository
REPO_URL=https://github.com/your-repo.git PR_NUMBER=123 node coderabbit-test-function.js suite
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CODERABBIT_API_KEY` | Yes | - | Your CodeRabbit API key |
| `CODERABBIT_API_URL` | No | `https://api.coderabbit.ai/v1/review` | CodeRabbit API endpoint |
| `GITHUB_TOKEN` | For GitHub mode | - | GitHub personal access token |
| `REPO_URL` | For CLI | - | Default repository URL |
| `PR_NUMBER` | For GitHub mode | - | Pull request number |
| `TEST_MODE` | No | `direct` | Default test mode |
| `LOCAL_API_URL` | No | `http://localhost:3000` | Local proxy URL |
| `TEST_TIMEOUT` | No | `120000` | Test timeout in milliseconds |

### Test Configuration

Create a `test-config.json` file for advanced configuration:

```json
{
  "repositories": [
    "https://github.com/facebook/react.git",
    "https://github.com/vuejs/vue.git"
  ],
  "testModes": ["direct", "local"],
  "timeout": 180000,
  "saveResults": true,
  "performance": {
    "iterations": 3,
    "measureMemory": true
  }
}
```

## 📊 Test Results

### Result Structure

```javascript
{
  success: true,
  data: {
    summary: "Code review completed",
    overall_risk: "low",
    issues: [...],
    recommendations: [...]
  },
  duration: 1500,
  status: 200,
  prInfo: {
    title: "Fix bug in authentication",
    author: "developer",
    filesChanged: 3,
    additions: 15,
    deletions: 8
  }
}
```

### Performance Metrics

- **Duration**: API response time in milliseconds
- **Status**: HTTP response status code
- **Success Rate**: Percentage of successful tests
- **Error Rate**: Percentage of failed tests

## 🚨 Error Handling

The testing suite includes comprehensive error handling:

- **API Errors**: Network issues, authentication failures, rate limiting
- **Validation Errors**: Invalid URLs, missing parameters
- **Timeout Errors**: Long-running requests
- **GitHub API Errors**: Token issues, repository access

## 🔍 Debugging

### Enable Debug Logging

```bash
DEBUG=true node coderabbit-test-function.js suite
```

### Save Test Results

```bash
# Results are automatically saved when using runTestSuite with saveResults: true
node coderabbit-test-function.js suite
```

### View Detailed Logs

```javascript
import { logger } from './test-utils.js';

const testLogger = logger.create('DEBUG');
testLogger.info('Starting test...');
testLogger.error('Test failed');
```

## 🧪 Example Test Scenarios

### 1. Basic Repository Test

```javascript
import { quickTest } from './coderabbit-test-function.js';

const result = await quickTest('https://github.com/facebook/react.git');
console.log('Test completed:', result.success);
```

### 2. PR-Specific Test

```javascript
import { testCodeRabbitWithGitHub } from './coderabbit-test-function.js';

const result = await testCodeRabbitWithGitHub({
  repoUrl: 'https://github.com/facebook/react.git',
  prNumber: 12345
});

if (result.success) {
  console.log('Issues found:', result.data.issues?.length || 0);
  console.log('Overall risk:', result.data.overall_risk);
}
```

### 3. Performance Testing

```javascript
import { performanceUtils } from './test-utils.js';

const testFn = () => testCodeRabbitDirect({
  repoUrl: 'https://github.com/facebook/react.git'
});

const results = await performanceUtils.runIterations(testFn, 5);
console.log('Average time:', results.avgDuration, 'ms');
```

### 4. Custom Payload Testing

```javascript
import { testCodeRabbitDirect } from './coderabbit-test-function.js';
import { testPayloads } from './test-utils.js';

const securityPayload = testPayloads.security(
  'https://github.com/facebook/react.git',
  12345
);

const result = await testCodeRabbitDirect({
  repoUrl: 'https://github.com/facebook/react.git',
  customPayload: securityPayload
});
```

## 📈 Best Practices

1. **Start Simple**: Begin with direct mode testing
2. **Use Environment Variables**: Store sensitive data in `.env`
3. **Test Different Scenarios**: Try various repository types and PR sizes
4. **Monitor Performance**: Use performance utilities for optimization
5. **Save Results**: Keep test results for analysis
6. **Handle Errors Gracefully**: Implement proper error handling
7. **Validate Responses**: Use validation utilities to ensure data integrity

## 🆘 Troubleshooting

### Common Issues

1. **Missing API Key**: Ensure `CODERABBIT_API_KEY` is set in `.env`
2. **Network Timeouts**: Increase `TEST_TIMEOUT` value
3. **GitHub API Limits**: Check your GitHub token permissions
4. **Local Server Not Running**: Start the proxy server with `npm run start:api`

### Getting Help

- Check the console output for detailed error messages
- Verify your environment configuration
- Test with a simple repository first
- Use the debug mode for detailed logging

## 🔄 Integration with CI/CD

### GitHub Actions Example

```yaml
name: CodeRabbit API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run CodeRabbit tests
        run: npm test
        env:
          CODERABBIT_API_KEY: ${{ secrets.CODERABBIT_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

This testing suite provides everything you need to thoroughly test your CodeRabbit API integration with multiple testing modes, comprehensive utilities, and detailed result reporting.
