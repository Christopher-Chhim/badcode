/**
 * Example Usage of CodeRabbit API Testing Functions
 * 
 * This file demonstrates how to use the various testing functions
 * in different scenarios.
 */

import { 
  testCodeRabbitDirect, 
  testCodeRabbitLocal, 
  testCodeRabbitWithGitHub,
  runTestSuite,
  quickTest,
  displayTestResults 
} from './coderabbit-test-function.js';

import { 
  testPayloads, 
  mockResponses, 
  performanceUtils,
  validators,
  logger 
} from './test-utils.js';

// Example 1: Basic Direct API Test
async function example1_BasicTest() {
  console.log("\n🧪 Example 1: Basic Direct API Test");
  console.log("=" .repeat(50));
  
  try {
    const result = await testCodeRabbitDirect({
      repoUrl: 'https://github.com/facebook/react.git',
      prNumber: 1
    });
    
    displayTestResults(result, "BASIC DIRECT");
    return result;
  } catch (error) {
    console.error("❌ Basic test failed:", error.message);
  }
}

// Example 2: Local Proxy Test
async function example2_LocalTest() {
  console.log("\n🧪 Example 2: Local Proxy Test");
  console.log("=" .repeat(50));
  
  try {
    const result = await testCodeRabbitLocal({
      repoUrl: 'https://github.com/facebook/react.git',
      prNumber: 1
    });
    
    displayTestResults(result, "LOCAL PROXY");
    return result;
  } catch (error) {
    console.error("❌ Local test failed:", error.message);
  }
}

// Example 3: GitHub Integration Test
async function example3_GitHubTest() {
  console.log("\n🧪 Example 3: GitHub Integration Test");
  console.log("=" .repeat(50));
  
  try {
    const result = await testCodeRabbitWithGitHub({
      repoUrl: 'https://github.com/facebook/react.git',
      prNumber: 1
    });
    
    displayTestResults(result, "GITHUB INTEGRATION");
    return result;
  } catch (error) {
    console.error("❌ GitHub test failed:", error.message);
  }
}

// Example 4: Custom Payload Test
async function example4_CustomPayload() {
  console.log("\n🧪 Example 4: Custom Payload Test");
  console.log("=" .repeat(50));
  
  try {
    // Create a security-focused payload
    const securityPayload = testPayloads.security(
      'https://github.com/facebook/react.git',
      1
    );
    
    const result = await testCodeRabbitDirect({
      repoUrl: 'https://github.com/facebook/react.git',
      customPayload: securityPayload
    });
    
    displayTestResults(result, "SECURITY FOCUSED");
    return result;
  } catch (error) {
    console.error("❌ Custom payload test failed:", error.message);
  }
}

// Example 5: Performance Testing
async function example5_PerformanceTest() {
  console.log("\n🧪 Example 5: Performance Testing");
  console.log("=" .repeat(50));
  
  const testFunction = async () => {
    return await testCodeRabbitDirect({
      repoUrl: 'https://github.com/facebook/react.git'
    });
  };
  
  try {
    const results = await performanceUtils.runIterations(testFunction, 3);
    console.log("📊 Performance test completed");
    return results;
  } catch (error) {
    console.error("❌ Performance test failed:", error.message);
  }
}

// Example 6: Response Validation
async function example6_Validation() {
  console.log("\n🧪 Example 6: Response Validation");
  console.log("=" .repeat(50));
  
  try {
    const result = await testCodeRabbitDirect({
      repoUrl: 'https://github.com/facebook/react.git'
    });
    
    // Validate the response
    const validation = validators.validateResponse(result);
    
    if (validation.isValid) {
      console.log("✅ Response validation passed");
    } else {
      console.log("❌ Response validation failed:");
      validation.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    return { result, validation };
  } catch (error) {
    console.error("❌ Validation test failed:", error.message);
  }
}

// Example 7: Mock Data Testing
async function example7_MockData() {
  console.log("\n🧪 Example 7: Mock Data Testing");
  console.log("=" .repeat(50));
  
  // Simulate different response scenarios
  const scenarios = [
    { name: "Success", data: mockResponses.success },
    { name: "With Issues", data: mockResponses.withIssues },
    { name: "High Risk", data: mockResponses.highRisk }
  ];
  
  scenarios.forEach(scenario => {
    console.log(`\n📋 Testing ${scenario.name} scenario:`);
    displayTestResults({ success: true, data: scenario.data }, scenario.name.toUpperCase());
  });
}

// Example 8: Comprehensive Test Suite
async function example8_TestSuite() {
  console.log("\n🧪 Example 8: Comprehensive Test Suite");
  console.log("=" .repeat(50));
  
  try {
    const results = await runTestSuite({
      repoUrl: 'https://github.com/facebook/react.git',
      prNumber: 1,
      testModes: ['direct', 'local'],
      saveResults: true
    });
    
    console.log("📊 Test suite completed");
    return results;
  } catch (error) {
    console.error("❌ Test suite failed:", error.message);
  }
}

// Example 9: Logging and Error Handling
async function example9_Logging() {
  console.log("\n🧪 Example 9: Logging and Error Handling");
  console.log("=" .repeat(50));
  
  const testLogger = logger.create('EXAMPLE');
  
  testLogger.info("Starting test with custom logging");
  
  try {
    const result = await quickTest('https://github.com/facebook/react.git');
    testLogger.success("Test completed successfully");
    return result;
  } catch (error) {
    testLogger.error(`Test failed: ${error.message}`);
    throw error;
  }
}

// Example 10: Quick Test with Different Repositories
async function example10_MultipleRepos() {
  console.log("\n🧪 Example 10: Multiple Repository Testing");
  console.log("=" .repeat(50));
  
  const repositories = [
    'https://github.com/facebook/react.git',
    'https://github.com/vuejs/vue.git',
    'https://github.com/angular/angular.git'
  ];
  
  const results = [];
  
  for (const repo of repositories) {
    try {
      console.log(`\n🔄 Testing ${repo}...`);
      const result = await quickTest(repo);
      results.push({ repo, success: true, result });
      console.log(`✅ ${repo} - Success`);
    } catch (error) {
      results.push({ repo, success: false, error: error.message });
      console.log(`❌ ${repo} - Failed: ${error.message}`);
    }
  }
  
  const successCount = results.filter(r => r.success).length;
  console.log(`\n📊 Results: ${successCount}/${results.length} repositories tested successfully`);
  
  return results;
}

// Main execution function
async function runExamples() {
  console.log("🚀 CodeRabbit API Testing Examples");
  console.log("=" .repeat(60));
  
  const examples = [
    { name: "Basic Test", fn: example1_BasicTest },
    { name: "Local Test", fn: example2_LocalTest },
    { name: "GitHub Test", fn: example3_GitHubTest },
    { name: "Custom Payload", fn: example4_CustomPayload },
    { name: "Performance Test", fn: example5_PerformanceTest },
    { name: "Validation", fn: example6_Validation },
    { name: "Mock Data", fn: example7_MockData },
    { name: "Test Suite", fn: example8_TestSuite },
    { name: "Logging", fn: example9_Logging },
    { name: "Multiple Repos", fn: example10_MultipleRepos }
  ];
  
  for (const example of examples) {
    try {
      console.log(`\n🔄 Running ${example.name}...`);
      await example.fn();
    } catch (error) {
      console.error(`❌ ${example.name} failed:`, error.message);
    }
  }
  
  console.log("\n✅ All examples completed!");
}

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples().catch(console.error);
}

export {
  example1_BasicTest,
  example2_LocalTest,
  example3_GitHubTest,
  example4_CustomPayload,
  example5_PerformanceTest,
  example6_Validation,
  example7_MockData,
  example8_TestSuite,
  example9_Logging,
  example10_MultipleRepos,
  runExamples
};
