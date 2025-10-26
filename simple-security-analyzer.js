/**
 * Simple Security Analyzer for badcode Repository
 * Focuses on security analysis using CodeRabbit API
 */

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

console.log("🔒 Simple Security Analyzer for badcode Repository");
console.log("=" .repeat(60));

async function analyzeSecurity() {
  try {
    console.log("🔍 Analyzing security for: Christopher-Chhim/badcode");
    console.log("🔒 Focus: Security vulnerabilities, secrets, dependencies");
    console.log("");

    // Test 1: Security-focused CodeRabbit analysis
    console.log("🔍 Test 1: Security-Focused CodeRabbit Analysis");
    console.log("-" .repeat(50));
    
    const securityPayload = {
      repository: "Christopher-Chhim/badcode",
      from: "2024-10-01",
      to: "2024-10-25",
      focus_areas: ["security", "vulnerabilities", "secrets", "dependencies"],
      severity_threshold: "medium",
      security_scan: true,
      vulnerability_scan: true,
      dependency_scan: true
    };

    console.log("📤 Sending security-focused request to CodeRabbit...");
    console.log("📋 Payload:", JSON.stringify(securityPayload, null, 2));
    
    const response = await axios.post(
      `${process.env.CODERABBIT_API_URL}/report.generate`,
      securityPayload,
      {
        headers: {
          'accept': 'application/json',
          'x-coderabbitai-api-key': process.env.CODERABBIT_API_KEY,
          'Content-Type': 'application/json',
          'User-Agent': 'Security-Analyzer/1.0'
        },
        timeout: 60000
      }
    );

    console.log("✅ Security analysis request successful!");
    console.log(`📊 Status: ${response.status}`);
    console.log("📄 Response:", JSON.stringify(response.data, null, 2));

    // Test 2: Try different security endpoints
    console.log("\n🔍 Test 2: Security-Specific Endpoints");
    console.log("-" .repeat(50));
    
    const securityEndpoints = [
      { name: "Security Scan", path: "/security.scan" },
      { name: "Vulnerability Check", path: "/vulnerability.check" },
      { name: "Dependency Scan", path: "/dependency.scan" },
      { name: "Secrets Scan", path: "/secrets.scan" }
    ];

    for (const endpoint of securityEndpoints) {
      try {
        console.log(`\n🔄 Testing ${endpoint.name}: ${endpoint.path}`);
        
        const endpointResponse = await axios.post(
          `${process.env.CODERABBIT_API_URL}${endpoint.path}`,
          {
            repository: "Christopher-Chhim/badcode",
            scan_type: "security",
            include_fixes: true
          },
          {
            headers: {
              'accept': 'application/json',
              'x-coderabbitai-api-key': process.env.CODERABBIT_API_KEY,
              'Content-Type': 'application/json',
              'User-Agent': 'Security-Analyzer/1.0'
            },
            timeout: 30000
          }
        );
        
        console.log(`   ✅ ${endpoint.name}: ${endpointResponse.status}`);
        console.log(`   📄 Response: ${JSON.stringify(endpointResponse.data, null, 2)}`);
        
      } catch (error) {
        console.log(`   ❌ ${endpoint.name}: ${error.response?.status || error.message}`);
        if (error.response?.data) {
          console.log(`   📄 Error Response: ${JSON.stringify(error.response.data, null, 2)}`);
        }
      }
    }

    // Test 3: Analyze your actual files for security issues
    console.log("\n🔍 Test 3: Analyzing Your Repository Files");
    console.log("-" .repeat(50));
    
    const securityAnalysis = await analyzeRepositoryFiles();
    
    // Generate comprehensive security report
    const securityReport = {
      repository: {
        name: "badcode",
        owner: "Christopher-Chhim",
        full_name: "Christopher-Chhim/badcode",
        url: "https://github.com/Christopher-Chhim/badcode"
      },
      analysis_timestamp: new Date().toISOString(),
      coderabbit_analysis: {
        status: "success",
        response: response.data,
        security_focus: true
      },
      file_analysis: securityAnalysis,
      security_summary: {
        total_files_analyzed: securityAnalysis.files.length,
        security_issues_found: securityAnalysis.issues.length,
        critical_issues: securityAnalysis.issues.filter(i => i.severity === 'critical').length,
        high_issues: securityAnalysis.issues.filter(i => i.severity === 'high').length,
        medium_issues: securityAnalysis.issues.filter(i => i.severity === 'medium').length,
        low_issues: securityAnalysis.issues.filter(i => i.severity === 'low').length,
        security_score: calculateSecurityScore(securityAnalysis.issues),
        risk_level: determineRiskLevel(securityAnalysis.issues)
      },
      recommendations: generateSecurityRecommendations(securityAnalysis.issues)
    };

    console.log("\n" + "=" .repeat(60));
    console.log("🔒 SECURITY ANALYSIS REPORT (JSON)");
    console.log("=" .repeat(60));
    console.log(JSON.stringify(securityReport, null, 2));

    return securityReport;

  } catch (error) {
    console.error("❌ Security analysis failed:", error.message);
    if (error.response) {
      console.error("📊 Status:", error.response.status);
      console.error("📄 Response:", JSON.stringify(error.response.data, null, 2));
    }
    return {
      success: false,
      error: error.message,
      repository: "Christopher-Chhim/badcode"
    };
  }
}

/**
 * Analyze repository files for security issues
 */
async function analyzeRepositoryFiles() {
  const fs = await import('fs');
  const path = await import('path');
  
  const files = [
    'apiRoutes.js',
    'bad.js',
    'coderabbit-api.js',
    'cyber.js',
    'flawed.js',
    'hi.js'
  ];
  
  const issues = [];
  const analyzedFiles = [];
  
  for (const filename of files) {
    try {
      if (fs.existsSync(filename)) {
        const content = fs.readFileSync(filename, 'utf8');
        const fileIssues = analyzeFileForSecurityIssues(filename, content);
        
        analyzedFiles.push({
          filename: filename,
          size: content.length,
          lines: content.split('\n').length,
          issues_found: fileIssues.length
        });
        
        issues.push(...fileIssues);
      }
    } catch (error) {
      console.log(`⚠️ Could not analyze ${filename}: ${error.message}`);
    }
  }
  
  return {
    files: analyzedFiles,
    issues: issues,
    total_issues: issues.length
  };
}

/**
 * Analyze a single file for security issues
 */
function analyzeFileForSecurityIssues(filename, content) {
  const issues = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const lowerLine = line.toLowerCase();
    
    // Check for hardcoded secrets
    if (lowerLine.includes('password') && lowerLine.includes('=')) {
      issues.push({
        type: 'hardcoded_secret',
        severity: 'high',
        file: filename,
        line: lineNum,
        code: line.trim(),
        description: 'Hardcoded password detected',
        recommendation: 'Use environment variables for sensitive data'
      });
    }
    
    if (lowerLine.includes('api_key') && lowerLine.includes('=')) {
      issues.push({
        type: 'hardcoded_secret',
        severity: 'critical',
        file: filename,
        line: lineNum,
        code: line.trim(),
        description: 'Hardcoded API key detected',
        recommendation: 'Store API keys in environment variables or secure vault'
      });
    }
    
    if (lowerLine.includes('secret') && lowerLine.includes('=')) {
      issues.push({
        type: 'hardcoded_secret',
        severity: 'high',
        file: filename,
        line: lineNum,
        code: line.trim(),
        description: 'Hardcoded secret detected',
        recommendation: 'Use secure secret management'
      });
    }
    
    // Check for SQL injection vulnerabilities
    if (lowerLine.includes('sql') && lowerLine.includes('${')) {
      issues.push({
        type: 'sql_injection',
        severity: 'critical',
        file: filename,
        line: lineNum,
        code: line.trim(),
        description: 'Potential SQL injection vulnerability',
        recommendation: 'Use parameterized queries or prepared statements'
      });
    }
    
    // Check for eval usage
    if (lowerLine.includes('eval(')) {
      issues.push({
        type: 'code_injection',
        severity: 'critical',
        file: filename,
        line: lineNum,
        code: line.trim(),
        description: 'Use of eval() function - security risk',
        recommendation: 'Avoid eval() - use safer alternatives'
      });
    }
    
    // Check for console.log in production code
    if (lowerLine.includes('console.log')) {
      issues.push({
        type: 'information_disclosure',
        severity: 'low',
        file: filename,
        line: lineNum,
        code: line.trim(),
        description: 'Console.log in production code',
        recommendation: 'Use proper logging framework'
      });
    }
    
    // Check for weak random generation
    if (lowerLine.includes('math.random()')) {
      issues.push({
        type: 'weak_randomness',
        severity: 'medium',
        file: filename,
        line: lineNum,
        code: line.trim(),
        description: 'Insecure random number generation',
        recommendation: 'Use crypto.randomBytes() for cryptographic purposes'
      });
    }
    
    // Check for missing error handling
    if (lowerLine.includes('return') && lowerLine.includes('/') && !lowerLine.includes('try')) {
      issues.push({
        type: 'missing_error_handling',
        severity: 'medium',
        file: filename,
        line: lineNum,
        code: line.trim(),
        description: 'Division operation without error handling',
        recommendation: 'Add try-catch blocks and validate inputs'
      });
    }
    
    // Check for global variables
    if (lowerLine.includes('var ') && !lowerLine.includes('function')) {
      issues.push({
        type: 'global_variable',
        severity: 'low',
        file: filename,
        line: lineNum,
        code: line.trim(),
        description: 'Global variable declaration',
        recommendation: 'Use let/const and avoid global variables'
      });
    }
  });
  
  return issues;
}

/**
 * Calculate security score
 */
function calculateSecurityScore(issues) {
  if (issues.length === 0) return 100;
  
  const severityScores = { critical: 20, high: 10, medium: 5, low: 2 };
  const totalPenalty = issues.reduce((sum, issue) => sum + (severityScores[issue.severity] || 0), 0);
  
  return Math.max(0, 100 - totalPenalty);
}

/**
 * Determine risk level
 */
function determineRiskLevel(issues) {
  const critical = issues.filter(i => i.severity === 'critical').length;
  const high = issues.filter(i => i.severity === 'high').length;
  
  if (critical > 0) return 'critical';
  if (high > 2) return 'high';
  if (high > 0 || issues.filter(i => i.severity === 'medium').length > 5) return 'medium';
  return 'low';
}

/**
 * Generate security recommendations
 */
function generateSecurityRecommendations(issues) {
  const recommendations = [];
  
  const criticalIssues = issues.filter(i => i.severity === 'critical');
  const highIssues = issues.filter(i => i.severity === 'high');
  
  if (criticalIssues.length > 0) {
    recommendations.push("URGENT: Fix critical security issues immediately");
  }
  
  if (highIssues.length > 0) {
    recommendations.push("Fix high-severity security vulnerabilities");
  }
  
  if (issues.some(i => i.type === 'hardcoded_secret')) {
    recommendations.push("Implement proper secret management");
  }
  
  if (issues.some(i => i.type === 'sql_injection')) {
    recommendations.push("Use parameterized queries to prevent SQL injection");
  }
  
  if (issues.some(i => i.type === 'code_injection')) {
    recommendations.push("Remove eval() usage and use safer alternatives");
  }
  
  recommendations.push("Implement regular security scanning");
  recommendations.push("Add security testing to CI/CD pipeline");
  recommendations.push("Train team on secure coding practices");
  recommendations.push("Use static analysis tools");
  recommendations.push("Implement code review process");
  
  return recommendations;
}

// Run the security analysis
analyzeSecurity();
