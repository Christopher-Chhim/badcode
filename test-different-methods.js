/**
 * Test different HTTP methods and endpoints for CodeRabbit API
 */

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 Testing different HTTP methods and endpoints");
console.log("=" .repeat(60));

const baseUrl = "https://app.coderabbit.ai/api/v1";
const apiKey = process.env.CODERABBIT_API_KEY;
const repoUrl = process.env.REPO_URL;

async function testMethod(method, endpoint, data = null) {
  try {
    console.log(`\n🔄 Testing ${method.toUpperCase()} ${endpoint}`);
    
    const config = {
      method,
      url: `${baseUrl}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CodeRabbit-Test/1.0',
        'Accept': 'application/json'
      },
      timeout: 30000
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    
    console.log(`✅ ${method.toUpperCase()} ${endpoint} - Status: ${response.status}`);
    console.log(`📋 Content-Type: ${response.headers['content-type']}`);
    
    // Check if response is JSON
    if (response.headers['content-type']?.includes('application/json')) {
      console.log(`📄 JSON Response:`, JSON.stringify(response.data, null, 2));
    } else {
      console.log(`📄 Non-JSON Response (first 200 chars):`, 
        response.data.toString().substring(0, 200) + '...');
    }
    
    return { success: true, response };
  } catch (error) {
    console.log(`❌ ${method.toUpperCase()} ${endpoint} - Error: ${error.response?.status || error.message}`);
    if (error.response?.data) {
      const data = error.response.data;
      if (typeof data === 'string' && data.includes('<!doctype html>')) {
        console.log(`   📄 HTML Response (likely web interface)`);
      } else {
        console.log(`   📄 Error Response:`, JSON.stringify(data, null, 2).substring(0, 300));
      }
    }
    return { success: false, error };
  }
}

async function main() {
  console.log(`🔑 API Key: ${apiKey?.substring(0, 10)}...`);
  console.log(`📁 Repo: ${repoUrl}`);
  console.log(`🔗 Base URL: ${baseUrl}`);
  
  const testData = {
    repo_url: repoUrl,
    pr_number: 1
  };

  // Test different endpoints
  const endpoints = [
    '/review',
    '/analyze', 
    '/scan',
    '/check',
    '/inspect',
    '/webhook',
    '/github',
    '/pr',
    '/pull-request',
    '/code-review',
    '/reviews',
    '/analysis'
  ];

  // Test different HTTP methods
  const methods = ['GET', 'POST', 'PUT', 'PATCH'];

  console.log("\n📡 Testing GET requests:");
  for (const endpoint of endpoints) {
    await testMethod('GET', endpoint);
  }

  console.log("\n📡 Testing POST requests:");
  for (const endpoint of endpoints) {
    await testMethod('POST', endpoint, testData);
  }

  // Test with different payload structures
  console.log("\n📡 Testing different payload structures:");
  const payloads = [
    { repo_url: repoUrl },
    { repository: repoUrl },
    { url: repoUrl },
    { repo: repoUrl },
    { repository_url: repoUrl },
    { github_url: repoUrl },
    { 
      repository: {
        url: repoUrl,
        name: 'badcode',
        owner: 'Christopher-Chhim'
      }
    },
    {
      pull_request: {
        number: 1,
        repository: repoUrl
      }
    }
  ];

  for (const payload of payloads) {
    console.log(`\n🔄 Testing payload:`, Object.keys(payload).join(', '));
    await testMethod('POST', '/review', payload);
  }

  // Test with different headers
  console.log("\n📡 Testing different headers:");
  const headerTests = [
    { 'Accept': 'application/json' },
    { 'Accept': 'application/vnd.api+json' },
    { 'Accept': '*/*' },
    { 'X-API-Version': 'v1' },
    { 'X-API-Key': apiKey },
    { 'Authorization': `Token ${apiKey}` },
    { 'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}` }
  ];

  for (const headers of headerTests) {
    try {
      console.log(`\n🔄 Testing headers:`, Object.keys(headers).join(', '));
      
      const response = await axios.post(`${baseUrl}/review`, testData, {
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          'User-Agent': 'CodeRabbit-Test/1.0'
        },
        timeout: 30000
      });
      
      console.log(`✅ Status: ${response.status}`);
      console.log(`📋 Content-Type: ${response.headers['content-type']}`);
      
    } catch (error) {
      console.log(`❌ Error: ${error.response?.status || error.message}`);
    }
  }

  console.log("\n✅ Testing completed!");
}

main().catch(console.error);
