/**
 * Test the CodeRabbit Hackathon Integration
 */

import { setupCodeRabbitForHackathon } from './coderabbit-hackathon-integration.js';
import dotenv from 'dotenv';

dotenv.config();

console.log("🚀 Testing CodeRabbit Hackathon Integration");
console.log("=" .repeat(60));

async function testIntegration() {
  try {
    // Setup the integration
    const coderabbit = setupCodeRabbitForHackathon();
    
    console.log("✅ CodeRabbit integration initialized");
    console.log(`🔑 API Key: ${process.env.CODERABBIT_API_KEY?.substring(0, 10)}...`);
    console.log("");

    // Test 1: Health Check
    console.log("🏥 Test 1: Health Check");
    console.log("-" .repeat(30));
    try {
      const health = await coderabbit.healthCheck();
      console.log("Health Status:", health.success ? "✅ Healthy" : "❌ Unhealthy");
      if (health.data) {
        console.log("Response:", JSON.stringify(health.data, null, 2));
      }
    } catch (error) {
      console.log("Health check failed (this might be expected):", error.message);
    }

    // Test 2: Generate Report
    console.log("\n📊 Test 2: Generate Report");
    console.log("-" .repeat(30));
    try {
      const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const to = new Date().toISOString().split('T')[0];
      
      console.log(`Generating report from ${from} to ${to}...`);
      const report = await coderabbit.generateHackathonReport({ 
        from, 
        to,
        repository: process.env.REPO_URL?.replace('https://github.com/', '').replace('.git', '')
      });
      
      console.log("✅ Report generated successfully");
      console.log("Report Summary:", JSON.stringify(report.data.summary, null, 2));
    } catch (error) {
      console.log("Report generation failed:", error.message);
      if (error.response?.data) {
        console.log("Error details:", JSON.stringify(error.response.data, null, 2));
      }
    }

    // Test 3: PR Insights (if PR number is available)
    console.log("\n🔍 Test 3: PR Insights");
    console.log("-" .repeat(30));
    if (process.env.PR_NUMBER && process.env.REPO_URL) {
      try {
        const repo = process.env.REPO_URL.replace('https://github.com/', '').replace('.git', '');
        const prNumber = parseInt(process.env.PR_NUMBER);
        
        console.log(`Getting insights for ${repo}#${prNumber}...`);
        const insights = await coderabbit.getPRInsights(repo, prNumber);
        
        console.log("✅ PR insights generated");
        console.log("Insights:", JSON.stringify(insights.data.insights, null, 2));
      } catch (error) {
        console.log("PR insights failed:", error.message);
        if (error.response?.data) {
          console.log("Error details:", JSON.stringify(error.response.data, null, 2));
        }
      }
    } else {
      console.log("⚠️ Skipping PR insights test - PR_NUMBER or REPO_URL not set");
    }

    console.log("\n✅ Integration testing completed!");
    
  } catch (error) {
    console.error("❌ Integration test failed:", error.message);
  }
}

// Run the test
testIntegration();
