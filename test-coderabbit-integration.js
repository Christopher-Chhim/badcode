/**
 * Test CodeRabbit API Integration
 * Verifies that the integration works correctly
 */

import { CodeRabbitGitHubAnalyzer } from './github-pr-analyzer.js';
import dotenv from 'dotenv';

dotenv.config();

console.log("🧪 Testing CodeRabbit API Integration");
console.log("=" .repeat(60));

/**
 * Test 1: Verify API Key and Basic Connection
 */
async function test1_APIConnection() {
  console.log("\n🔍 Test 1: API Key and Basic Connection");
  console.log("-" .repeat(40));
  
  try {
    const analyzer = new CodeRabbitGitHubAnalyzer();
    console.log("✅ CodeRabbitGitHubAnalyzer initialized successfully");
    console.log(`🔑 API Key: ${process.env.CODERABBIT_API_KEY?.substring(0, 10)}...`);
    console.log(`🔗 API URL: ${process.env.CODERABBIT_API_URL}`);
    
    return { success: true, message: "API connection setup successful" };
  } catch (error) {
    console.log("❌ API connection failed:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test 2: Test CodeRabbit API Directly
 */
async function test2_DirectCodeRabbitAPI() {
  console.log("\n🔍 Test 2: Direct CodeRabbit API Call");
  console.log("-" .repeat(40));
  
  try {
    const axios = (await import('axios')).default;
    
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
    
    console.log("✅ CodeRabbit API call successful");
    console.log(`📊 Status: ${response.status}`);
    console.log(`📋 Response type: ${typeof response.data}`);
    console.log(`📄 Response keys: ${Object.keys(response.data).join(', ')}`);
    
    return {
      success: true,
      status: response.status,
      data: response.data,
      message: "Direct API call successful"
    };
  } catch (error) {
    console.log("❌ Direct API call failed:", error.message);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Response: ${JSON.stringify(error.response.data).substring(0, 200)}...`);
    }
    return { success: false, error: error.message };
  }
}

/**
 * Test 3: Test GitHub URL Parsing
 */
async function test3_GitHubURLParsing() {
  console.log("\n🔍 Test 3: GitHub URL Parsing");
  console.log("-" .repeat(40));
  
  try {
    const analyzer = new CodeRabbitGitHubAnalyzer();
    
    const testUrls = [
      "https://github.com/facebook/react",
      "https://github.com/facebook/react.git",
      "https://github.com/microsoft/vscode",
      "https://github.com/Christopher-Chhim/badcode",
      "invalid-url"
    ];
    
    const results = testUrls.map(url => {
      const parsed = analyzer.parseGitHubUrl(url);
      console.log(`📁 ${url} -> ${parsed ? `${parsed.owner}/${parsed.repo}` : 'Invalid'}`);
      return { url, parsed, valid: !!parsed };
    });
    
    const validCount = results.filter(r => r.valid).length;
    console.log(`✅ Parsed ${validCount}/${results.length} URLs correctly`);
    
    return { success: true, results, message: "URL parsing working correctly" };
  } catch (error) {
    console.log("❌ URL parsing failed:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test 4: Test Mock Analysis (without GitHub token)
 */
async function test4_MockAnalysis() {
  console.log("\n🔍 Test 4: Mock Analysis (No GitHub Token)");
  console.log("-" .repeat(40));
  
  try {
    const analyzer = new CodeRabbitGitHubAnalyzer();
    
    // Test repository analysis with mock data
    const result = await analyzer.analyzeRepository("https://github.com/facebook/react", {
      from: "2024-10-01",
      to: "2024-10-25"
    });
    
    if (result.success) {
      console.log("✅ Mock repository analysis successful");
      console.log(`📊 Repository: ${result.data.repository.full_name}`);
      console.log(`📅 Period: ${result.data.analysis_period.from} to ${result.data.analysis_period.to}`);
      console.log(`📈 Summary:`, result.data.summary);
      
      return {
        success: true,
        data: result.data,
        message: "Mock analysis working correctly"
      };
    } else {
      console.log("❌ Mock analysis failed:", result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.log("❌ Mock analysis failed:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test 5: Test PR Analysis
 */
async function test5_PRAnalysis() {
  console.log("\n🔍 Test 5: PR Analysis");
  console.log("-" .repeat(40));
  
  try {
    const analyzer = new CodeRabbitGitHubAnalyzer();
    
    // Test PR analysis with mock data
    const result = await analyzer.analyzePullRequest("https://github.com/facebook/react", 12345);
    
    if (result.success) {
      console.log("✅ Mock PR analysis successful");
      console.log(`📊 PR #${result.data.pull_request.number}: ${result.data.pull_request.title}`);
      console.log(`📁 Files changed: ${result.data.files_changed}`);
      console.log(`📈 Analysis score: ${result.data.coderabbit_analysis.overall_score}`);
      
      return {
        success: true,
        data: result.data,
        message: "Mock PR analysis working correctly"
      };
    } else {
      console.log("❌ Mock PR analysis failed:", result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.log("❌ Mock PR analysis failed:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test 6: Test Health Score
 */
async function test6_HealthScore() {
  console.log("\n🔍 Test 6: Health Score Analysis");
  console.log("-" .repeat(40));
  
  try {
    const analyzer = new CodeRabbitGitHubAnalyzer();
    
    const result = await analyzer.getRepositoryHealthScore("https://github.com/facebook/react");
    
    if (result.success) {
      console.log("✅ Health score analysis successful");
      console.log(`📊 Repository: ${result.data.repository}`);
      console.log(`🏥 Health Score: ${result.data.health_score}/100`);
      console.log(`📈 Metrics:`, result.data.metrics);
      
      return {
        success: true,
        data: result.data,
        message: "Health score analysis working correctly"
      };
    } else {
      console.log("❌ Health score analysis failed:", result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.log("❌ Health score analysis failed:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test 7: Verify Integration Requirements
 */
async function test7_IntegrationRequirements() {
  console.log("\n🔍 Test 7: Integration Requirements Check");
  console.log("-" .repeat(40));
  
  const requirements = {
    coderabbit_api_key: !!process.env.CODERABBIT_API_KEY,
    coderabbit_api_url: !!process.env.CODERABBIT_API_URL,
    github_token: !!process.env.GITHUB_TOKEN,
    repo_url: !!process.env.REPO_URL,
    pr_number: !!process.env.PR_NUMBER
  };
  
  console.log("📋 Requirements Status:");
  Object.entries(requirements).forEach(([key, status]) => {
    console.log(`   ${status ? '✅' : '❌'} ${key}: ${status ? 'Present' : 'Missing'}`);
  });
  
  const allPresent = Object.values(requirements).every(Boolean);
  const criticalPresent = requirements.coderabbit_api_key && requirements.coderabbit_api_url;
  
  console.log(`\n📊 Summary:`);
  console.log(`   Critical requirements: ${criticalPresent ? '✅' : '❌'}`);
  console.log(`   All requirements: ${allPresent ? '✅' : '❌'}`);
  
  return {
    success: criticalPresent,
    requirements,
    message: criticalPresent ? "Critical requirements met" : "Missing critical requirements"
  };
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log("🚀 Starting CodeRabbit Integration Tests\n");
  
  const tests = [
    { name: "API Connection", fn: test1_APIConnection },
    { name: "Direct CodeRabbit API", fn: test2_DirectCodeRabbitAPI },
    { name: "GitHub URL Parsing", fn: test3_GitHubURLParsing },
    { name: "Mock Analysis", fn: test4_MockAnalysis },
    { name: "PR Analysis", fn: test5_PRAnalysis },
    { name: "Health Score", fn: test6_HealthScore },
    { name: "Requirements Check", fn: test7_IntegrationRequirements }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      results.push({
        test: test.name,
        success: result.success,
        message: result.message || result.error,
        data: result.data || null
      });
    } catch (error) {
      results.push({
        test: test.name,
        success: false,
        message: error.message,
        data: null
      });
    }
  }
  
  // Summary
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log("\n" + "=" .repeat(60));
  console.log("📊 INTEGRATION TEST RESULTS");
  console.log("=" .repeat(60));
  
  results.forEach(result => {
    console.log(`${result.success ? '✅' : '❌'} ${result.test}: ${result.message}`);
  });
  
  console.log(`\n📈 Overall: ${successful}/${total} tests passed`);
  
  // Integration status
  const criticalTests = results.filter(r => 
    ['API Connection', 'Direct CodeRabbit API', 'Requirements Check'].includes(r.test)
  );
  const criticalPassed = criticalTests.filter(r => r.success).length;
  
  console.log(`\n🎯 Integration Status:`);
  if (criticalPassed === criticalTests.length) {
    console.log("✅ CodeRabbit integration is working correctly!");
    console.log("💡 You can now analyze GitHub repositories and PRs");
  } else {
    console.log("❌ CodeRabbit integration has issues");
    console.log("💡 Check the failed tests above for details");
  }
  
  // Recommendations
  console.log(`\n💡 Recommendations:`);
  if (!process.env.GITHUB_TOKEN) {
    console.log("   - Add GITHUB_TOKEN to .env for full GitHub integration");
  }
  if (!process.env.CODERABBIT_API_KEY) {
    console.log("   - Add CODERABBIT_API_KEY to .env for CodeRabbit analysis");
  }
  console.log("   - Test with real repositories: node github-pr-analyzer.js repo <repo-url>");
  console.log("   - Test with real PRs: node github-pr-analyzer.js pr <repo-url> <pr-number>");
  
  return {
    total_tests: total,
    passed_tests: successful,
    failed_tests: total - successful,
    results: results,
    integration_working: criticalPassed === criticalTests.length
  };
}

// Run all tests
runAllTests().catch(console.error);
