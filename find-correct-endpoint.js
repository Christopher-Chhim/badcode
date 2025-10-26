/**
 * Find the correct CodeRabbit API endpoint
 */

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 Searching for correct CodeRabbit API endpoint...");
console.log("=" .repeat(60));

// Common API endpoint patterns to try
const endpoints = [
  // Standard REST API patterns
  "https://api.coderabbit.ai/v1/reviews",
  "https://api.coderabbit.ai/v1/analyze",
  "https://api.coderabbit.ai/v1/scan",
  "https://api.coderabbit.ai/v1/check",
  "https://api.coderabbit.ai/v1/inspect",
  
  // Alternative domains
  "https://coderabbit.ai/api/v1/review",
  "https://coderabbit.ai/api/v1/analyze",
  "https://app.coderabbit.ai/api/v1/review",
  "https://app.coderabbit.ai/api/v1/analyze",
  
  // Different versions
  "https://api.coderabbit.ai/v2/review",
  "https://api.coderabbit.ai/v2/analyze",
  "https://api.coderabbit.ai/review",
  "https://api.coderabbit.ai/analyze",
  
  // Webhook/CI patterns
  "https://api.coderabbit.ai/webhook",
  "https://api.coderabbit.ai/ci",
  "https://api.coderabbit.ai/github",
];

async function testEndpoint(url) {
  try {
    console.log(`🔄 Testing: ${url}`);
    
    // Try GET first
    const getResponse = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${process.env.CODERABBIT_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CodeRabbit-Test/1.0'
      },
      timeout: 10000
    });
    
    console.log(`✅ GET ${url} - Status: ${getResponse.status}`);
    return { url, method: 'GET', status: getResponse.status, success: true };
    
  } catch (getError) {
    // If GET fails, try POST
    try {
      const payload = {
        repo_url: process.env.REPO_URL || "https://github.com/facebook/react.git",
        pr_number: 1
      };
      
      const postResponse = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${process.env.CODERABBIT_API_KEY}`,
          'Content-Type': 'application/json',
          'User-Agent': 'CodeRabbit-Test/1.0'
        },
        timeout: 30000
      });
      
      console.log(`✅ POST ${url} - Status: ${postResponse.status}`);
      console.log(`   Response keys: ${Object.keys(postResponse.data).join(', ')}`);
      return { url, method: 'POST', status: postResponse.status, success: true, data: postResponse.data };
      
    } catch (postError) {
      const status = postError.response?.status || getError.response?.status;
      const message = postError.response?.data || getError.response?.data || postError.message;
      
      console.log(`❌ ${url} - Error: ${status || 'Network Error'}`);
      
      // Show more details for certain error types
      if (status === 401) {
        console.log(`   🔑 Authentication failed - check your API key`);
      } else if (status === 403) {
        console.log(`   🚫 Forbidden - API key might not have permission`);
      } else if (status === 422) {
        console.log(`   📝 Validation error - endpoint might be correct but payload is wrong`);
        console.log(`   Response: ${JSON.stringify(message).substring(0, 200)}...`);
      } else if (status === 404) {
        console.log(`   🔍 Not found - endpoint doesn't exist`);
      } else if (status === 500) {
        console.log(`   ⚠️  Server error - endpoint might be correct but server issue`);
      }
      
      return { url, error: status || 'Network Error', success: false };
    }
  }
}

async function main() {
  console.log(`🔑 Using API Key: ${process.env.CODERABBIT_API_KEY?.substring(0, 10)}...`);
  console.log(`📁 Using Repo: ${process.env.REPO_URL}`);
  console.log("");
  
  const results = [];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);
    
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log("\n" + "=" .repeat(60));
  console.log("📊 RESULTS SUMMARY");
  console.log("=" .repeat(60));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  
  if (successful.length > 0) {
    console.log("\n🎉 WORKING ENDPOINTS:");
    successful.forEach(result => {
      console.log(`   ${result.method} ${result.url} - Status: ${result.status}`);
    });
  } else {
    console.log("\n😞 No working endpoints found.");
    console.log("\n💡 Suggestions:");
    console.log("   1. Check if your API key is valid");
    console.log("   2. Verify the CodeRabbit service is running");
    console.log("   3. Check CodeRabbit documentation for correct endpoints");
    console.log("   4. Try contacting CodeRabbit support");
  }
  
  // Show most promising failures (422, 500 errors might indicate correct endpoint)
  const promising = failed.filter(r => 
    r.error === 422 || r.error === 500 || 
    (typeof r.error === 'string' && r.error.includes('422'))
  );
  
  if (promising.length > 0) {
    console.log("\n🔍 PROMISING ENDPOINTS (might be correct but with wrong payload):");
    promising.forEach(result => {
      console.log(`   ${result.url} - Error: ${result.error}`);
    });
  }
}

main().catch(console.error);
