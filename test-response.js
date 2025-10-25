/**
 * Test the correct CodeRabbit API endpoint and show full response
 */

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

console.log("🧪 Testing CodeRabbit API Response");
console.log("=" .repeat(50));

async function testAPI() {
  try {
    const payload = {
      repo_url: process.env.REPO_URL,
      pr_number: parseInt(process.env.PR_NUMBER) || 1
    };

    console.log("📤 Sending payload:", JSON.stringify(payload, null, 2));
    console.log("🔗 Endpoint:", process.env.CODERABBIT_API_URL);
    console.log("");

    const response = await axios.post(process.env.CODERABBIT_API_URL, payload, {
      headers: {
        'Authorization': `Bearer ${process.env.CODERABBIT_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CodeRabbit-Test/1.0'
      },
      timeout: 60000 // 1 minute timeout
    });

    console.log("✅ API Call Successful!");
    console.log("📊 Status:", response.status);
    console.log("📋 Headers:", JSON.stringify(response.headers, null, 2));
    console.log("");
    console.log("📄 Response Data:");
    console.log(JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error("❌ API Call Failed:");
    console.error("Status:", error.response?.status);
    console.error("Error:", error.response?.data || error.message);
    
    if (error.response?.data) {
      console.log("\n📄 Full Error Response:");
      console.log(JSON.stringify(error.response.data, null, 2));
    }
    
    throw error;
  }
}

testAPI().catch(console.error);
