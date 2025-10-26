/**
 * Test CodeRabbit Analysis with Error-Prone Files
 * This script tests CodeRabbit's capabilities by analyzing files with intentional errors
 */

import fs from 'fs';
import path from 'path';
import { setupCodeRabbitForHackathon } from './coderabbit-hackathon-integration.js';
import dotenv from 'dotenv';

dotenv.config();

console.log("🧪 Testing CodeRabbit Analysis with Error-Prone Files");
console.log("=" .repeat(70));

// Test files with different types of errors
const testFiles = [
    {
        name: "Security Vulnerabilities",
        path: "./test-files/security-vulnerabilities.js",
        expectedIssues: [
            "hardcoded credentials",
            "sql injection",
            "input validation",
            "weak encryption",
            "exposed sensitive data",
            "insecure random generation",
            "rate limiting",
            "cors misconfiguration",
            "authentication",
            "file upload"
        ]
    },
    {
        name: "Performance Issues",
        path: "./test-files/performance-issues.js",
        expectedIssues: [
            "n+1 query",
            "inefficient algorithms",
            "memory leaks",
            "synchronous operations",
            "string concatenation",
            "database calls in loop",
            "large objects",
            "caching",
            "blocking operations",
            "regex performance"
        ]
    },
    {
        name: "Code Quality Issues",
        path: "./test-files/code-quality-issues.js",
        expectedIssues: [
            "error handling",
            "magic numbers",
            "long functions",
            "naming conventions",
            "dead code",
            "documentation",
            "global variables",
            "nested code",
            "duplicate code",
            "return types",
            "input validation",
            "hardcoded values"
        ]
    },
    {
        name: "Best Practices Violations",
        path: "./test-files/best-practices-violations.js",
        expectedIssues: [
            "var usage",
            "semicolons",
            "equality operators",
            "strict mode",
            "callback hell",
            "promise handling",
            "eval usage",
            "const usage",
            "parameter mutation",
            "template literals",
            "console.log",
            "variable naming",
            "arrow functions",
            "destructuring",
            "default parameters",
            "spread operator",
            "array methods",
            "optional chaining",
            "nullish coalescing",
            "error handling"
        ]
    }
];

/**
 * Analyze a single file using CodeRabbit
 */
async function analyzeFile(fileInfo, coderabbit) {
    try {
        console.log(`\n🔍 Analyzing: ${fileInfo.name}`);
        console.log(`📁 File: ${fileInfo.path}`);
        
        // Read the file content
        const fileContent = fs.readFileSync(fileInfo.path, 'utf8');
        
        // Create a temporary repository structure for analysis
        const tempRepo = {
            name: "test-repo",
            full_name: "test-org/test-repo",
            html_url: "https://github.com/test-org/test-repo",
            files: [
                {
                    filename: fileInfo.path,
                    content: fileContent,
                    patch: `+${fileContent.split('\n').map(line => `+${line}`).join('\n')}`
                }
            ]
        };

        // Try to analyze using CodeRabbit API
        let analysisResult = null;
        
        try {
            // Attempt to use the actual CodeRabbit API
            const report = await coderabbit.generateReport({
                from: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                to: new Date().toISOString().split('T')[0]
            });
            
            analysisResult = {
                source: "coderabbit_api",
                data: report.data,
                success: true
            };
        } catch (apiError) {
            console.log(`⚠️ CodeRabbit API not available, using mock analysis`);
            
            // Fallback to mock analysis based on file content
            analysisResult = await performMockAnalysis(fileInfo, fileContent);
        }

        return {
            file: fileInfo.name,
            path: fileInfo.path,
            expected_issues: fileInfo.expectedIssues,
            analysis: analysisResult,
            file_size: fileContent.length,
            line_count: fileContent.split('\n').length,
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error(`❌ Error analyzing ${fileInfo.name}:`, error.message);
        return {
            file: fileInfo.name,
            path: fileInfo.path,
            error: error.message,
            success: false,
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Perform mock analysis when CodeRabbit API is not available
 */
async function performMockAnalysis(fileInfo, fileContent) {
    const issues = [];
    const recommendations = [];
    
    // Analyze based on file content patterns
    const content = fileContent.toLowerCase();
    
    // Security analysis
    if (content.includes('password') || content.includes('secret') || content.includes('key')) {
        issues.push({
            type: "security",
            severity: "high",
            message: "Potential hardcoded credentials detected",
            line: findLineNumber(fileContent, 'password|secret|key'),
            recommendation: "Use environment variables for sensitive data"
        });
    }
    
    if (content.includes('eval(')) {
        issues.push({
            type: "security",
            severity: "critical",
            message: "Use of eval() function detected",
            line: findLineNumber(fileContent, 'eval\\('),
            recommendation: "Avoid using eval() as it poses security risks"
        });
    }
    
    if (content.includes('sql') && content.includes('${')) {
        issues.push({
            type: "security",
            severity: "high",
            message: "Potential SQL injection vulnerability",
            line: findLineNumber(fileContent, 'sql.*\\$\\{'),
            recommendation: "Use parameterized queries to prevent SQL injection"
        });
    }
    
    // Performance analysis
    if (content.includes('for (') && content.includes('await')) {
        issues.push({
            type: "performance",
            severity: "medium",
            message: "Potential N+1 query problem detected",
            line: findLineNumber(fileContent, 'for.*await'),
            recommendation: "Consider using batch queries or eager loading"
        });
    }
    
    if (content.includes('readfilesync')) {
        issues.push({
            type: "performance",
            severity: "medium",
            message: "Synchronous file operation detected",
            line: findLineNumber(fileContent, 'readfilesync'),
            recommendation: "Use asynchronous file operations to avoid blocking"
        });
    }
    
    // Code quality analysis
    if (content.includes('var ')) {
        issues.push({
            type: "code_quality",
            severity: "low",
            message: "Use of var instead of let/const",
            line: findLineNumber(fileContent, 'var '),
            recommendation: "Use let or const instead of var for better scoping"
        });
    }
    
    if (content.includes('==') && !content.includes('===')) {
        issues.push({
            type: "code_quality",
            severity: "medium",
            message: "Use of == instead of ===",
            line: findLineNumber(fileContent, '=='),
            recommendation: "Use strict equality (===) instead of loose equality (==)"
        });
    }
    
    if (content.includes('console.log')) {
        issues.push({
            type: "code_quality",
            severity: "low",
            message: "Console.log statements found",
            line: findLineNumber(fileContent, 'console\\.log'),
            recommendation: "Use proper logging framework instead of console.log"
        });
    }
    
    // Calculate metrics
    const metrics = {
        total_lines: fileContent.split('\n').length,
        total_issues: issues.length,
        security_issues: issues.filter(i => i.type === 'security').length,
        performance_issues: issues.filter(i => i.type === 'performance').length,
        quality_issues: issues.filter(i => i.type === 'code_quality').length,
        critical_issues: issues.filter(i => i.severity === 'critical').length,
        high_issues: issues.filter(i => i.severity === 'high').length,
        medium_issues: issues.filter(i => i.severity === 'medium').length,
        low_issues: issues.filter(i => i.severity === 'low').length
    };
    
    return {
        source: "mock_analysis",
        success: true,
        issues: issues,
        metrics: metrics,
        recommendations: [
            "Implement proper error handling",
            "Add input validation",
            "Use environment variables for configuration",
            "Follow consistent coding standards",
            "Add comprehensive tests",
            "Use proper logging framework",
            "Implement security best practices"
        ],
        overall_risk: metrics.critical_issues > 0 ? "high" : 
                     metrics.high_issues > 2 ? "medium" : "low"
    };
}

/**
 * Find line number for a pattern in content
 */
function findLineNumber(content, pattern) {
    const lines = content.split('\n');
    const regex = new RegExp(pattern, 'i');
    for (let i = 0; i < lines.length; i++) {
        if (regex.test(lines[i])) {
            return i + 1;
        }
    }
    return null;
}

/**
 * Main analysis function
 */
async function runAnalysis() {
    try {
        console.log("🚀 Starting CodeRabbit Analysis Test");
        console.log(`📊 Testing ${testFiles.length} files with intentional errors\n`);
        
        // Initialize CodeRabbit
        const coderabbit = setupCodeRabbitForHackathon();
        
        // Analyze each file
        const results = [];
        for (const fileInfo of testFiles) {
            const result = await analyzeFile(fileInfo, coderabbit);
            results.push(result);
            
            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Generate summary
        const summary = {
            total_files: results.length,
            successful_analyses: results.filter(r => r.success !== false).length,
            failed_analyses: results.filter(r => r.success === false).length,
            total_issues: results.reduce((sum, r) => sum + (r.analysis?.issues?.length || 0), 0),
            analysis_timestamp: new Date().toISOString(),
            test_duration_ms: Date.now() - startTime
        };
        
        // Create final result
        const finalResult = {
            test_info: {
                name: "CodeRabbit Analysis Test",
                description: "Testing CodeRabbit's capabilities with error-prone files",
                version: "1.0.0"
            },
            summary: summary,
            results: results,
            recommendations: [
                "Review all identified security vulnerabilities",
                "Address performance bottlenecks",
                "Improve code quality and maintainability",
                "Follow best practices and coding standards",
                "Implement proper error handling and validation",
                "Add comprehensive testing coverage"
            ]
        };
        
        // Output as JSON
        console.log("\n" + "=" .repeat(70));
        console.log("📋 ANALYSIS RESULTS (JSON)");
        console.log("=" .repeat(70));
        console.log(JSON.stringify(finalResult, null, 2));
        
        return finalResult;
        
    } catch (error) {
        console.error("❌ Analysis failed:", error.message);
        return {
            error: error.message,
            success: false,
            timestamp: new Date().toISOString()
        };
    }
}

// Run the analysis
const startTime = Date.now();
runAnalysis().catch(console.error);
