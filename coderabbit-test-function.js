/**
 * CodeRabbit API Test Function
 * Comprehensive testing utilities for CodeRabbit API integration
 * 
 * Usage:
 * - Import and use individual functions
 * - Run as standalone script: node coderabbit-test-function.js
 * - Use with npm scripts: npm run test:api
 */

import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// Configuration
const CONFIG = {
  CODERABBIT_API_KEY: process.env.CODERABBIT_API_KEY,
  CODERABBIT_API_URL: process.env.CODERABBIT_API_URL || "https://api.coderabbit.ai/v1/review",
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  REPO_URL: process.env.REPO_URL,
  PR_NUMBER: process.env.PR_NUMBER,
  TEST_MODE: process.env.TEST_MODE || "direct", // "direct", "proxy", "local"
  LOCAL_API_URL: process.env.LOCAL_API_URL || "http://localhost:3000",
  TIMEOUT: parseInt(process.env.TEST_TIMEOUT) || 120000, // 2 minutes
};

/**
 * Test CodeRabbit API directly
 * @param {Object} options - Test options
 * @param {string} options.repoUrl - Repository URL
 * @param {number} [options.prNumber] - Pull request number
 * @param {Object} [options.customPayload] - Custom payload to send
 * @returns {Promise<Object>} API response
 */
export async function testCodeRabbitDirect({ repoUrl, prNumber, customPayload = null }) {
  console.log("🧪 Testing CodeRabbit API (Direct Mode)");
  console.log(`📁 Repository: ${repoUrl}`);
  if (prNumber) console.log(`🔢 PR Number: ${prNumber}`);
  
  if (!CONFIG.CODERABBIT_API_KEY) {
    throw new Error("❌ CODERABBIT_API_KEY is required for direct testing");
  }

  const payload = customPayload || {
    repo_url: repoUrl,
    ...(prNumber && { pr_number: prNumber })
  };

  try {
    const startTime = Date.now();
    const response = await axios.post(CONFIG.CODERABBIT_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${CONFIG.CODERABBIT_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: CONFIG.TIMEOUT,
    });
    
    const duration = Date.now() - startTime;
    console.log(`✅ API call completed in ${duration}ms`);
    
    return {
      success: true,
      data: response.data,
      duration,
      status: response.status,
      headers: response.headers
    };
  } catch (error) {
    console.error("❌ Direct API test failed:", error.response?.status, error.response?.data || error.message);
    throw error;
  }
}

/**
 * Test CodeRabbit API through local proxy server
 * @param {Object} options - Test options
 * @param {string} options.repoUrl - Repository URL
 * @param {number} [options.prNumber] - Pull request number
 * @returns {Promise<Object>} API response
 */
export async function testCodeRabbitLocal({ repoUrl, prNumber }) {
  console.log("🧪 Testing CodeRabbit API (Local Proxy Mode)");
  console.log(`📁 Repository: ${repoUrl}`);
  if (prNumber) console.log(`🔢 PR Number: ${prNumber}`);
  
  const payload = {
    repoUrl,
    ...(prNumber && { prNumber })
  };

  try {
    const startTime = Date.now();
    const response = await axios.post(`${CONFIG.LOCAL_API_URL}/review`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: CONFIG.TIMEOUT,
    });
    
    const duration = Date.now() - startTime;
    console.log(`✅ Local proxy test completed in ${duration}ms`);
    
    return {
      success: true,
      data: response.data,
      duration,
      status: response.status,
      headers: response.headers
    };
  } catch (error) {
    console.error("❌ Local proxy test failed:", error.response?.status, error.response?.data || error.message);
    throw error;
  }
}

/**
 * Test CodeRabbit API with GitHub integration (proxy mode)
 * @param {Object} options - Test options
 * @param {string} options.repoUrl - Repository URL
 * @param {number} options.prNumber - Pull request number
 * @returns {Promise<Object>} API response
 */
export async function testCodeRabbitWithGitHub({ repoUrl, prNumber }) {
  console.log("🧪 Testing CodeRabbit API (GitHub Proxy Mode)");
  console.log(`📁 Repository: ${repoUrl}`);
  console.log(`🔢 PR Number: ${prNumber}`);
  
  if (!CONFIG.GITHUB_TOKEN) {
    throw new Error("❌ GITHUB_TOKEN is required for GitHub proxy testing");
  }

  try {
    // Extract owner/repo from URL
    const match = repoUrl.match(/github\.com[:/](.+?)\/(.+?)(?:\.git)?$/);
    if (!match) {
      throw new Error("❌ Invalid GitHub repository URL format");
    }
    
    const [, owner, repo] = match;
    const repoFull = `${owner}/${repo}`;
    
    console.log(`📥 Fetching PR #${prNumber} from ${repoFull}...`);
    
    // Fetch PR data from GitHub
    const { pr, files, diff } = await fetchPrFromGitHub(repoFull, prNumber);
    
    // Build comprehensive payload
    const payload = {
      repo: repoFull,
      pr_number: Number(prNumber),
      pr_title: pr.title,
      pr_body: pr.body,
      diff,
      files: files.map(f => ({
        filename: f.filename,
        patch: f.patch,
        status: f.status,
        additions: f.additions,
        deletions: f.deletions,
        changes: f.changes
      })),
    };

    console.log(`📊 Payload size: ${JSON.stringify(payload).length} characters`);
    console.log(`📁 Files changed: ${files.length}`);
    
    const startTime = Date.now();
    const response = await axios.post(CONFIG.CODERABBIT_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${CONFIG.CODERABBIT_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: CONFIG.TIMEOUT,
    });
    
    const duration = Date.now() - startTime;
    console.log(`✅ GitHub proxy test completed in ${duration}ms`);
    
    return {
      success: true,
      data: response.data,
      duration,
      status: response.status,
      prInfo: {
        title: pr.title,
        author: pr.user.login,
        filesChanged: files.length,
        additions: files.reduce((sum, f) => sum + f.additions, 0),
        deletions: files.reduce((sum, f) => sum + f.deletions, 0)
      }
    };
  } catch (error) {
    console.error("❌ GitHub proxy test failed:", error.response?.status, error.response?.data || error.message);
    throw error;
  }
}

/**
 * Fetch PR data from GitHub API
 * @param {string} repoFullName - Repository in format "owner/repo"
 * @param {number} prNumber - Pull request number
 * @returns {Promise<Object>} PR data including metadata, files, and diff
 */
async function fetchPrFromGitHub(repoFullName, prNumber) {
  const headers = {
    Authorization: `token ${CONFIG.GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json"
  };

  const [owner, repo] = repoFullName.split("/");

  // Fetch PR metadata
  const prResp = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
    { headers }
  );
  const pr = prResp.data;

  // Fetch changed files
  const filesResp = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`,
    { headers }
  );
  const files = filesResp.data;

  // Fetch unified diff
  const diffResp = await axios.get(
    `https://patch-diff.githubusercontent.com/raw/${owner}/${repo}/pull/${prNumber}.diff`,
    { headers }
  );
  const diff = diffResp.data;

  return { pr, files, diff };
}

/**
 * Format and display test results
 * @param {Object} result - Test result object
 * @param {string} testType - Type of test performed
 */
export function displayTestResults(result, testType = "Unknown") {
  console.log("\n" + "=".repeat(60));
  console.log(`📊 ${testType} Test Results`);
  console.log("=".repeat(60));
  
  if (result.success) {
    console.log(`✅ Status: Success`);
    console.log(`⏱️  Duration: ${result.duration}ms`);
    console.log(`📡 HTTP Status: ${result.status}`);
    
    if (result.prInfo) {
      console.log(`\n📋 PR Information:`);
      console.log(`   Title: ${result.prInfo.title}`);
      console.log(`   Author: ${result.prInfo.author}`);
      console.log(`   Files Changed: ${result.prInfo.filesChanged}`);
      console.log(`   Additions: +${result.prInfo.additions}`);
      console.log(`   Deletions: -${result.prInfo.deletions}`);
    }
    
    console.log(`\n📄 Response Data:`);
    if (result.data.summary) {
      console.log(`Summary: ${result.data.summary}`);
    }
    if (result.data.overall_risk) {
      console.log(`Overall Risk: ${result.data.overall_risk}`);
    }
    if (result.data.issues && result.data.issues.length > 0) {
      console.log(`Issues Found: ${result.data.issues.length}`);
      result.data.issues.forEach((issue, i) => {
        console.log(`  ${i + 1}. ${issue.type || 'Issue'} in ${issue.file || 'unknown'}`);
        if (issue.line) console.log(`     Line: ${issue.line}`);
        if (issue.description) console.log(`     Description: ${issue.description}`);
      });
    }
    if (result.data.recommendations && result.data.recommendations.length > 0) {
      console.log(`Recommendations: ${result.data.recommendations.length}`);
    }
  } else {
    console.log(`❌ Status: Failed`);
    console.log(`Error: ${result.error || 'Unknown error'}`);
  }
  
  console.log("=".repeat(60) + "\n");
}

/**
 * Run comprehensive test suite
 * @param {Object} options - Test configuration
 * @returns {Promise<Object>} Test results summary
 */
export async function runTestSuite(options = {}) {
  const {
    repoUrl = CONFIG.REPO_URL,
    prNumber = CONFIG.PR_NUMBER,
    testModes = ['direct', 'local'],
    saveResults = false
  } = options;

  if (!repoUrl) {
    throw new Error("❌ Repository URL is required. Set REPO_URL in .env or pass as parameter.");
  }

  console.log("🚀 Starting CodeRabbit API Test Suite");
  console.log(`📁 Repository: ${repoUrl}`);
  if (prNumber) console.log(`🔢 PR Number: ${prNumber}`);
  console.log(`🧪 Test Modes: ${testModes.join(', ')}`);
  console.log("");

  const results = {
    timestamp: new Date().toISOString(),
    repoUrl,
    prNumber,
    tests: []
  };

  for (const mode of testModes) {
    try {
      console.log(`\n🔄 Running ${mode} test...`);
      let testResult;
      
      switch (mode) {
        case 'direct':
          testResult = await testCodeRabbitDirect({ repoUrl, prNumber });
          break;
        case 'local':
          testResult = await testCodeRabbitLocal({ repoUrl, prNumber });
          break;
        case 'github':
          if (!prNumber) {
            console.log(`⚠️  Skipping GitHub test - PR number required`);
            continue;
          }
          testResult = await testCodeRabbitWithGitHub({ repoUrl, prNumber });
          break;
        default:
          console.log(`⚠️  Unknown test mode: ${mode}`);
          continue;
      }
      
      displayTestResults(testResult, mode.toUpperCase());
      results.tests.push({
        mode,
        success: testResult.success,
        duration: testResult.duration,
        status: testResult.status
      });
      
    } catch (error) {
      console.error(`❌ ${mode} test failed:`, error.message);
      results.tests.push({
        mode,
        success: false,
        error: error.message
      });
    }
  }

  // Summary
  const successful = results.tests.filter(t => t.success).length;
  const total = results.tests.length;
  console.log(`\n📈 Test Suite Summary: ${successful}/${total} tests passed`);
  
  if (saveResults) {
    const filename = `test-results-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(results, null, 2));
    console.log(`💾 Results saved to ${filename}`);
  }

  return results;
}

/**
 * Quick test function for immediate use
 * @param {string} repoUrl - Repository URL to test
 * @param {number} [prNumber] - Optional PR number
 * @returns {Promise<Object>} Test result
 */
export async function quickTest(repoUrl, prNumber = null) {
  console.log("⚡ Quick CodeRabbit API Test");
  
  try {
    const result = await testCodeRabbitDirect({ repoUrl, prNumber });
    displayTestResults(result, "QUICK");
    return result;
  } catch (error) {
    console.error("❌ Quick test failed:", error.message);
    throw error;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const command = args[0] || 'suite';
  
  try {
    switch (command) {
      case 'quick':
        const repoUrl = args[1] || CONFIG.REPO_URL;
        const prNumber = args[2] ? parseInt(args[2]) : CONFIG.PR_NUMBER;
        await quickTest(repoUrl, prNumber);
        break;
        
      case 'suite':
        const testModes = args[1] ? args[1].split(',') : ['direct', 'local'];
        await runTestSuite({ testModes });
        break;
        
      case 'github':
        if (!CONFIG.PR_NUMBER) {
          console.error("❌ PR_NUMBER required for GitHub test");
          process.exit(1);
        }
        const result = await testCodeRabbitWithGitHub({
          repoUrl: CONFIG.REPO_URL,
          prNumber: CONFIG.PR_NUMBER
        });
        displayTestResults(result, "GITHUB");
        break;
        
      default:
        console.log("Usage:");
        console.log("  node coderabbit-test-function.js quick [repoUrl] [prNumber]");
        console.log("  node coderabbit-test-function.js suite [modes]");
        console.log("  node coderabbit-test-function.js github");
        console.log("\nModes: direct, local, github");
        break;
    }
  } catch (error) {
    console.error("💥 Test execution failed:", error.message);
    process.exit(1);
  }
}
