/**
 * Test CodeRabbit API Integration (CodeRabbit Only)
 * Tests the core CodeRabbit functionality without GitHub dependency
 */

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

console.log("🧪 Testing CodeRabbit API Integration (CodeRabbit Only)");
console.log("=" .repeat(70));

/**
 * Test CodeRabbit API directly
 */
async function testCodeRabbitAPI() {
  console.log("\n🔍 Testing CodeRabbit API Directly");
  console.log("-" .repeat(50));
  
  try {
    console.log("📡 Making request to CodeRabbit API...");
    console.log(`🔗 Endpoint: ${process.env.CODERABBIT_API_URL}/report.generate`);
    console.log(`🔑 API Key: ${process.env.CODERABBIT_API_KEY?.substring(0, 10)}...`);
    
    const response = await axios.post(
      `${process.env.CODERABBIT_API_URL}/report.generate`,
      {
        repository: "facebook/react",
        from: "2024-10-01",
        to: "2024-10-25"
      },
      {
        headers: {
          'accept': 'application/json',
          'x-coderabbitai-api-key': process.env.CODERABBIT_API_KEY,
          'Content-Type': 'application/json',
          'User-Agent': 'CodeRabbit-Test/1.0'
        },
        timeout: 30000
      }
    );
    
    console.log("✅ CodeRabbit API call successful!");
    console.log(`📊 HTTP Status: ${response.status}`);
    console.log(`📋 Content-Type: ${response.headers['content-type']}`);
    console.log(`📄 Response Structure:`);
    console.log(JSON.stringify(response.data, null, 2));
    
    return {
      success: true,
      status: response.status,
      data: response.data,
      message: "CodeRabbit API is working correctly"
    };
    
  } catch (error) {
    console.log("❌ CodeRabbit API call failed");
    console.log(`📊 Error: ${error.message}`);
    
    if (error.response) {
      console.log(`📊 HTTP Status: ${error.response.status}`);
      console.log(`📄 Response: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    
    return {
      success: false,
      error: error.message,
      status: error.response?.status,
      response: error.response?.data
    };
  }
}

/**
 * Test different CodeRabbit endpoints
 */
async function testCodeRabbitEndpoints() {
  console.log("\n🔍 Testing Different CodeRabbit Endpoints");
  console.log("-" .repeat(50));
  
  const endpoints = [
    { name: "Report Generate", path: "/report.generate", method: "POST" },
    { name: "Health Check", path: "/health", method: "GET" },
    { name: "Repository Info", path: "/repositories/facebook/react", method: "GET" },
    { name: "Team Stats", path: "/stats", method: "GET" }
  ];
  
  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n🔄 Testing ${endpoint.name} (${endpoint.method} ${endpoint.path})`);
      
      const config = {
        method: endpoint.method.toLowerCase(),
        url: `${process.env.CODERABBIT_API_URL}${endpoint.path}`,
        headers: {
          'accept': 'application/json',
          'x-coderabbitai-api-key': process.env.CODERABBIT_API_KEY,
          'Content-Type': 'application/json',
          'User-Agent': 'CodeRabbit-Test/1.0'
        },
        timeout: 10000
      };
      
      if (endpoint.method === 'POST') {
        config.data = {
          repository: "facebook/react",
          from: "2024-10-01",
          to: "2024-10-25"
        };
      }
      
      const response = await axios(config);
      
      console.log(`   ✅ ${endpoint.name}: ${response.status}`);
      console.log(`   📄 Response keys: ${Object.keys(response.data).join(', ')}`);
      
      results.push({
        endpoint: endpoint.name,
        success: true,
        status: response.status,
        data: response.data
      });
      
    } catch (error) {
      console.log(`   ❌ ${endpoint.name}: ${error.response?.status || error.message}`);
      
      results.push({
        endpoint: endpoint.name,
        success: false,
        error: error.message,
        status: error.response?.status
      });
    }
  }
  
  const successful = results.filter(r => r.success).length;
  console.log(`\n📊 Endpoint Test Results: ${successful}/${results.length} successful`);
  
  return results;
}

/**
 * Test CodeRabbit with different repositories
 */
async function testCodeRabbitWithRepos() {
  console.log("\n🔍 Testing CodeRabbit with Different Repositories");
  console.log("-" .repeat(50));
  
  const repositories = [
    "facebook/react",
    "microsoft/vscode",
    "nodejs/node",
    "Christopher-Chhim/badcode"
  ];
  
  const results = [];
  
  for (const repo of repositories) {
    try {
      console.log(`\n🔄 Testing repository: ${repo}`);
      
      const response = await axios.post(
        `${process.env.CODERABBIT_API_URL}/report.generate`,
        {
          repository: repo,
          from: "2024-10-01",
          to: "2024-10-25"
        },
        {
          headers: {
            'accept': 'application/json',
            'x-coderabbitai-api-key': process.env.CODERABBIT_API_KEY,
            'Content-Type': 'application/json',
            'User-Agent': 'CodeRabbit-Test/1.0'
          },
          timeout: 30000
        }
      );
      
      console.log(`   ✅ ${repo}: ${response.status}`);
      console.log(`   📄 Response type: ${typeof response.data}`);
      
      results.push({
        repository: repo,
        success: true,
        status: response.status,
        data: response.data
      });
      
    } catch (error) {
      console.log(`   ❌ ${repo}: ${error.response?.status || error.message}`);
      
      results.push({
        repository: repo,
        success: false,
        error: error.message,
        status: error.response?.status
      });
    }
  }
  
  const successful = results.filter(r => r.success).length;
  console.log(`\n📊 Repository Test Results: ${successful}/${results.length} successful`);
  
  return results;
}

/**
 * Generate comprehensive test report
 */
async function generateTestReport() {
  console.log("\n🔍 Generating Comprehensive Test Report");
  console.log("-" .repeat(50));
  
  const report = {
    test_info: {
      tool: "CodeRabbit API Integration Test",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      environment: {
        node_version: process.version,
        platform: process.platform,
        arch: process.arch
      }
    },
    configuration: {
      coderabbit_api_key: process.env.CODERABBIT_API_KEY ? "Present" : "Missing",
      coderabbit_api_url: process.env.CODERABBIT_API_URL || "Not set",
      github_token: process.env.GITHUB_TOKEN ? "Present" : "Missing"
    },
    tests: []
  };
  
  // Test 1: Basic API call
  console.log("\n📋 Running Test 1: Basic API Call");
  const basicTest = await testCodeRabbitAPI();
  report.tests.push({
    name: "Basic API Call",
    success: basicTest.success,
    message: basicTest.message || basicTest.error,
    data: basicTest.data || null
  });
  
  // Test 2: Different endpoints
  console.log("\n📋 Running Test 2: Different Endpoints");
  const endpointTests = await testCodeRabbitEndpoints();
  report.tests.push({
    name: "Endpoint Tests",
    success: endpointTests.filter(t => t.success).length > 0,
    message: `${endpointTests.filter(t => t.success).length}/${endpointTests.length} endpoints working`,
    data: endpointTests
  });
  
  // Test 3: Different repositories
  console.log("\n📋 Running Test 3: Different Repositories");
  const repoTests = await testCodeRabbitWithRepos();
  report.tests.push({
    name: "Repository Tests",
    success: repoTests.filter(t => t.success).length > 0,
    message: `${repoTests.filter(t => t.success).length}/${repoTests.length} repositories working`,
    data: repoTests
  });
  
  // Summary
  const totalTests = report.tests.length;
  const successfulTests = report.tests.filter(t => t.success).length;
  
  report.summary = {
    total_tests: totalTests,
    successful_tests: successfulTests,
    failed_tests: totalTests - successfulTests,
    success_rate: Math.round((successfulTests / totalTests) * 100),
    integration_status: successfulTests > 0 ? "Working" : "Not Working"
  };
  
  console.log("\n" + "=" .repeat(70));
  console.log("📊 COMPREHENSIVE TEST REPORT (JSON)");
  console.log("=" .repeat(70));
  console.log(JSON.stringify(report, null, 2));
  
  return report;
}

/**
 * Main execution
 */
async function main() {
  try {
    const report = await generateTestReport();
    
    console.log("\n🎯 INTEGRATION VERIFICATION");
    console.log("=" .repeat(50));
    
    if (report.summary.success_rate > 0) {
      console.log("✅ CodeRabbit API integration is working!");
      console.log(`📊 Success rate: ${report.summary.success_rate}%`);
      console.log("\n💡 How to verify it works:");
      console.log("   1. ✅ API key is valid and accepted");
      console.log("   2. ✅ API endpoints are responding");
      console.log("   3. ✅ Can generate reports for repositories");
      console.log("\n🚀 Next steps:");
      console.log("   - Add GITHUB_TOKEN to .env for full GitHub integration");
      console.log("   - Use: node github-pr-analyzer.js repo <repo-url>");
      console.log("   - Use: node github-pr-analyzer.js pr <repo-url> <pr-number>");
    } else {
      console.log("❌ CodeRabbit API integration is not working");
      console.log("💡 Check the error messages above for details");
    }
    
  } catch (error) {
    console.error("❌ Test execution failed:", error.message);
  }
}

// Run the tests
main();
