/**
 * Detailed Code Analysis with JSON Output
 * Simulates CodeRabbit's analysis capabilities on error-prone files
 */

import fs from 'fs';
import path from 'path';

console.log("🔍 Detailed Code Analysis - CodeRabbit Simulation");
console.log("=" .repeat(60));

// Test files directory
const testFilesDir = './test-files';
const testFiles = [
    'security-vulnerabilities.js',
    'performance-issues.js', 
    'code-quality-issues.js',
    'best-practices-violations.js'
];

/**
 * Analyze security vulnerabilities
 */
function analyzeSecurity(content, filename) {
    const issues = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const lowerLine = line.toLowerCase();
        
        // Hardcoded credentials
        if (lowerLine.includes('password') && lowerLine.includes('=')) {
            issues.push({
                type: "security",
                severity: "critical",
                category: "Hardcoded Credentials",
                message: "Hardcoded password detected",
                line: lineNum,
                code: line.trim(),
                recommendation: "Store sensitive data in environment variables or secure vault",
                cwe: "CWE-798"
            });
        }
        
        if (lowerLine.includes('api_key') && lowerLine.includes('=')) {
            issues.push({
                type: "security",
                severity: "critical",
                category: "Hardcoded Credentials",
                message: "Hardcoded API key detected",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use environment variables for API keys",
                cwe: "CWE-798"
            });
        }
        
        // SQL Injection
        if (lowerLine.includes('sql') && lowerLine.includes('${')) {
            issues.push({
                type: "security",
                severity: "high",
                category: "SQL Injection",
                message: "Potential SQL injection vulnerability",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use parameterized queries or prepared statements",
                cwe: "CWE-89"
            });
        }
        
        // Weak encryption
        if (lowerLine.includes('password') && lowerLine.includes('+') && lowerLine.includes('salt')) {
            issues.push({
                type: "security",
                severity: "high",
                category: "Weak Cryptography",
                message: "Weak password hashing implementation",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use bcrypt, scrypt, or Argon2 for password hashing",
                cwe: "CWE-327"
            });
        }
        
        // Insecure random
        if (lowerLine.includes('math.random()')) {
            issues.push({
                type: "security",
                severity: "medium",
                category: "Weak Randomness",
                message: "Insecure random number generation",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use crypto.randomBytes() for cryptographic purposes",
                cwe: "CWE-330"
            });
        }
        
        // CORS misconfiguration
        if (lowerLine.includes('origin') && lowerLine.includes('*')) {
            issues.push({
                type: "security",
                severity: "medium",
                category: "CORS Misconfiguration",
                message: "Overly permissive CORS configuration",
                line: lineNum,
                code: line.trim(),
                recommendation: "Specify exact origins instead of wildcard",
                cwe: "CWE-942"
            });
        }
        
        // Exposed sensitive data
        if (lowerLine.includes('ssn') || lowerLine.includes('creditcard')) {
            issues.push({
                type: "security",
                severity: "high",
                category: "Information Exposure",
                message: "Sensitive data exposure in object",
                line: lineNum,
                code: line.trim(),
                recommendation: "Remove or encrypt sensitive data",
                cwe: "CWE-200"
            });
        }
        
        // No authentication
        if (lowerLine.includes('/admin') && !lowerLine.includes('auth')) {
            issues.push({
                type: "security",
                severity: "critical",
                category: "Missing Authentication",
                message: "Admin endpoint without authentication",
                line: lineNum,
                code: line.trim(),
                recommendation: "Implement proper authentication middleware",
                cwe: "CWE-306"
            });
        }
        
        // File upload vulnerability
        if (lowerLine.includes('upload') && !lowerLine.includes('validation')) {
            issues.push({
                type: "security",
                severity: "high",
                category: "File Upload Vulnerability",
                message: "Unsafe file upload without validation",
                line: lineNum,
                code: line.trim(),
                recommendation: "Validate file types and scan for malware",
                cwe: "CWE-434"
            });
        }
    });
    
    return issues;
}

/**
 * Analyze performance issues
 */
function analyzePerformance(content, filename) {
    const issues = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const lowerLine = line.toLowerCase();
        
        // N+1 Query Problem
        if (lowerLine.includes('for') && lowerLine.includes('await')) {
            issues.push({
                type: "performance",
                severity: "high",
                category: "N+1 Query Problem",
                message: "Potential N+1 query problem detected",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use batch queries or eager loading to reduce database calls",
                impact: "High database load and slow response times"
            });
        }
        
        // Synchronous file operations
        if (lowerLine.includes('readfilesync')) {
            issues.push({
                type: "performance",
                severity: "medium",
                category: "Blocking I/O",
                message: "Synchronous file operation blocks event loop",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use fs.promises or async/await for file operations",
                impact: "Blocks event loop, reducing concurrency"
            });
        }
        
        // Inefficient string concatenation
        if (lowerLine.includes('+=') && lowerLine.includes('string')) {
            issues.push({
                type: "performance",
                severity: "medium",
                category: "Inefficient String Operations",
                message: "Inefficient string concatenation in loop",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use array.join() or template literals for better performance",
                impact: "O(n²) time complexity for string building"
            });
        }
        
        // Memory leaks
        if (lowerLine.includes('addlistener') && !lowerLine.includes('removelistener')) {
            issues.push({
                type: "performance",
                severity: "high",
                category: "Memory Leak",
                message: "Potential memory leak - listeners not removed",
                line: lineNum,
                code: line.trim(),
                recommendation: "Remove event listeners when no longer needed",
                impact: "Memory usage grows over time"
            });
        }
        
        // Large objects in memory
        if (lowerLine.includes('new array') && lowerLine.includes('1000000')) {
            issues.push({
                type: "performance",
                severity: "high",
                category: "Memory Usage",
                message: "Creating very large array in memory",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use streaming or pagination for large datasets",
                impact: "High memory consumption"
            });
        }
        
        // Inefficient algorithms
        if (lowerLine.includes('for') && lowerLine.includes('for') && lowerLine.includes('i++')) {
            issues.push({
                type: "performance",
                severity: "medium",
                category: "Algorithm Efficiency",
                message: "Nested loops may indicate inefficient algorithm",
                line: lineNum,
                code: line.trim(),
                recommendation: "Consider using more efficient algorithms or data structures",
                impact: "O(n²) or worse time complexity"
            });
        }
        
        // No caching
        if (lowerLine.includes('expensive') && !lowerLine.includes('cache')) {
            issues.push({
                type: "performance",
                severity: "medium",
                category: "Missing Caching",
                message: "Expensive operation without caching",
                line: lineNum,
                code: line.trim(),
                recommendation: "Implement caching for expensive operations",
                impact: "Repeated expensive computations"
            });
        }
    });
    
    return issues;
}

/**
 * Analyze code quality issues
 */
function analyzeCodeQuality(content, filename) {
    const issues = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const lowerLine = line.toLowerCase();
        
        // No error handling
        if (lowerLine.includes('return') && lowerLine.includes('/') && !lowerLine.includes('try')) {
            issues.push({
                type: "code_quality",
                severity: "medium",
                category: "Missing Error Handling",
                message: "Division operation without error handling",
                line: lineNum,
                code: line.trim(),
                recommendation: "Add try-catch blocks and validate inputs",
                impact: "Potential runtime errors"
            });
        }
        
        // Magic numbers
        if (lowerLine.includes('0.15') || lowerLine.includes('1000000')) {
            issues.push({
                type: "code_quality",
                severity: "low",
                category: "Magic Numbers",
                message: "Magic number detected",
                line: lineNum,
                code: line.trim(),
                recommendation: "Define constants with meaningful names",
                impact: "Reduced code maintainability"
            });
        }
        
        // Long functions (approximate)
        const functionStart = content.lastIndexOf('function', content.indexOf(line));
        if (functionStart !== -1) {
            const functionLines = content.substring(functionStart, content.indexOf(line)).split('\n').length;
            if (functionLines > 20) {
                issues.push({
                    type: "code_quality",
                    severity: "medium",
                    category: "Function Length",
                    message: "Function appears to be too long",
                    line: lineNum,
                    code: line.trim(),
                    recommendation: "Break down into smaller, focused functions",
                    impact: "Reduced readability and maintainability"
                });
            }
        }
        
        // Inconsistent naming
        if (lowerLine.includes('var ') && lowerLine.includes('_')) {
            issues.push({
                type: "code_quality",
                severity: "low",
                category: "Naming Convention",
                message: "Inconsistent variable naming convention",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use consistent camelCase or snake_case throughout",
                impact: "Reduced code consistency"
            });
        }
        
        // Dead code
        if (lowerLine.includes('if (false)') || lowerLine.includes('unusedfunction')) {
            issues.push({
                type: "code_quality",
                severity: "low",
                category: "Dead Code",
                message: "Dead code detected",
                line: lineNum,
                code: line.trim(),
                recommendation: "Remove unused code to improve maintainability",
                impact: "Code bloat and confusion"
            });
        }
        
        // Global variables
        if (lowerLine.includes('var ') && !lowerLine.includes('function')) {
            issues.push({
                type: "code_quality",
                severity: "medium",
                category: "Global Variables",
                message: "Global variable declaration",
                line: lineNum,
                code: line.trim(),
                recommendation: "Avoid global variables, use modules or closures",
                impact: "Namespace pollution and potential conflicts"
            });
        }
        
        // Deeply nested code
        const openBraces = (line.match(/\{/g) || []).length;
        const closeBraces = (line.match(/\}/g) || []).length;
        if (openBraces > 2) {
            issues.push({
                type: "code_quality",
                severity: "medium",
                category: "Code Complexity",
                message: "Deeply nested code structure",
                line: lineNum,
                code: line.trim(),
                recommendation: "Refactor to reduce nesting depth",
                impact: "Reduced readability and maintainability"
            });
        }
        
        // Duplicate code patterns
        if (lowerLine.includes('return') && lowerLine.includes('*') && lowerLine.includes('height')) {
            issues.push({
                type: "code_quality",
                severity: "low",
                category: "Code Duplication",
                message: "Potential code duplication",
                line: lineNum,
                code: line.trim(),
                recommendation: "Extract common logic into reusable functions",
                impact: "Increased maintenance burden"
            });
        }
        
        // Inconsistent return types
        if (lowerLine.includes('return') && (lowerLine.includes('null') || lowerLine.includes('false'))) {
            issues.push({
                type: "code_quality",
                severity: "medium",
                category: "Return Type Consistency",
                message: "Inconsistent return types",
                line: lineNum,
                code: line.trim(),
                recommendation: "Ensure consistent return types throughout function",
                impact: "Unpredictable function behavior"
            });
        }
        
        // No input validation
        if (lowerLine.includes('function') && lowerLine.includes('(') && !lowerLine.includes('if')) {
            issues.push({
                type: "code_quality",
                severity: "medium",
                category: "Input Validation",
                message: "Function without input validation",
                line: lineNum,
                code: line.trim(),
                recommendation: "Add input validation and sanitization",
                impact: "Potential runtime errors and security issues"
            });
        }
        
        // Hardcoded values
        if (lowerLine.includes('https://') || lowerLine.includes('localhost')) {
            issues.push({
                type: "code_quality",
                severity: "low",
                category: "Configuration",
                message: "Hardcoded configuration values",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use configuration files or environment variables",
                impact: "Reduced flexibility and maintainability"
            });
        }
    });
    
    return issues;
}

/**
 * Analyze best practices violations
 */
function analyzeBestPractices(content, filename) {
    const issues = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const lowerLine = line.toLowerCase();
        
        // Using var instead of let/const
        if (lowerLine.includes('var ')) {
            issues.push({
                type: "best_practices",
                severity: "low",
                category: "Variable Declaration",
                message: "Use of var instead of let/const",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use let for variables that change, const for constants",
                impact: "Function-scoped vs block-scoped variables"
            });
        }
        
        // Missing semicolons
        if (lowerLine.includes('const') && !line.trim().endsWith(';') && !line.trim().endsWith('{')) {
            issues.push({
                type: "best_practices",
                severity: "low",
                category: "Code Style",
                message: "Missing semicolon",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use consistent semicolon style",
                impact: "Potential ASI (Automatic Semicolon Insertion) issues"
            });
        }
        
        // Using == instead of ===
        if (lowerLine.includes('==') && !lowerLine.includes('===')) {
            issues.push({
                type: "best_practices",
                severity: "medium",
                category: "Comparison Operators",
                message: "Use of == instead of ===",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use strict equality (===) to avoid type coercion",
                impact: "Unexpected type coercion behavior"
            });
        }
        
        // Not using strict mode
        if (index === 0 && !lowerLine.includes('use strict')) {
            issues.push({
                type: "best_practices",
                severity: "low",
                category: "Strict Mode",
                message: "File not using strict mode",
                line: lineNum,
                code: line.trim(),
                recommendation: "Add 'use strict'; at the top of the file",
                impact: "Less strict error checking"
            });
        }
        
        // Callback hell pattern
        if (lowerLine.includes('function') && lowerLine.includes('callback') && lowerLine.includes('function')) {
            issues.push({
                type: "best_practices",
                severity: "medium",
                category: "Async Patterns",
                message: "Callback hell pattern detected",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use async/await or Promises for better readability",
                impact: "Reduced code readability and maintainability"
            });
        }
        
        // Not handling promises properly
        if (lowerLine.includes('.then(') && !lowerLine.includes('.catch(')) {
            issues.push({
                type: "best_practices",
                severity: "high",
                category: "Promise Handling",
                message: "Promise without error handling",
                line: lineNum,
                code: line.trim(),
                recommendation: "Always handle promise rejections with .catch()",
                impact: "Unhandled promise rejections"
            });
        }
        
        // Using eval()
        if (lowerLine.includes('eval(')) {
            issues.push({
                type: "best_practices",
                severity: "critical",
                category: "Security",
                message: "Use of eval() function",
                line: lineNum,
                code: line.trim(),
                recommendation: "Avoid eval() - use safer alternatives",
                impact: "Security vulnerability and performance issues"
            });
        }
        
        // Not using const for immutable values
        if (lowerLine.includes('let') && (lowerLine.includes('pi') || lowerLine.includes('api_url'))) {
            issues.push({
                type: "best_practices",
                severity: "low",
                category: "Variable Declaration",
                message: "Use const for immutable values",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use const for values that don't change",
                impact: "Prevents accidental reassignment"
            });
        }
        
        // Mutating function parameters
        if (lowerLine.includes('arr.push(') || lowerLine.includes('arr[')) {
            issues.push({
                type: "best_practices",
                severity: "medium",
                category: "Immutability",
                message: "Mutating function parameters",
                line: lineNum,
                code: line.trim(),
                recommendation: "Avoid mutating input parameters",
                impact: "Unexpected side effects"
            });
        }
        
        // Not using template literals
        if (lowerLine.includes('+') && lowerLine.includes('"') && lowerLine.includes('+')) {
            issues.push({
                type: "best_practices",
                severity: "low",
                category: "String Concatenation",
                message: "String concatenation instead of template literals",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use template literals for better readability",
                impact: "Reduced code readability"
            });
        }
        
        // Using console.log in production code
        if (lowerLine.includes('console.log')) {
            issues.push({
                type: "best_practices",
                severity: "low",
                category: "Logging",
                message: "Console.log in production code",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use proper logging framework",
                impact: "Performance and security concerns"
            });
        }
        
        // Not using meaningful variable names
        if (lowerLine.includes('calc(') || lowerLine.includes('a, b, c')) {
            issues.push({
                type: "best_practices",
                severity: "low",
                category: "Naming",
                message: "Non-descriptive function or variable names",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use descriptive names that explain purpose",
                impact: "Reduced code readability"
            });
        }
        
        // Not using arrow functions where appropriate
        if (lowerLine.includes('function') && lowerLine.includes('=>')) {
            issues.push({
                type: "best_practices",
                severity: "low",
                category: "Function Syntax",
                message: "Consider using arrow function",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use arrow functions for simple callbacks",
                impact: "More concise syntax"
            });
        }
        
        // Not using destructuring
        if (lowerLine.includes('user.') && lowerLine.includes('user.')) {
            issues.push({
                type: "best_practices",
                severity: "low",
                category: "ES6 Features",
                message: "Consider using destructuring",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use destructuring for cleaner object property access",
                impact: "More concise and readable code"
            });
        }
        
        // Not using default parameters
        if (lowerLine.includes('||') && lowerLine.includes('undefined')) {
            issues.push({
                type: "best_practices",
                severity: "low",
                category: "Function Parameters",
                message: "Consider using default parameters",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use ES6 default parameters instead of || operator",
                impact: "More explicit and cleaner code"
            });
        }
        
        // Not using spread operator
        if (lowerLine.includes('object.assign')) {
            issues.push({
                type: "best_practices",
                severity: "low",
                category: "ES6 Features",
                message: "Consider using spread operator",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use spread operator (...) instead of Object.assign",
                impact: "More concise syntax"
            });
        }
        
        // Not using array methods properly
        if (lowerLine.includes('for (') && lowerLine.includes('length')) {
            issues.push({
                type: "best_practices",
                severity: "low",
                category: "Array Methods",
                message: "Consider using array methods",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use map, filter, reduce instead of manual loops",
                impact: "More functional and readable code"
            });
        }
        
        // Not using optional chaining
        if (lowerLine.includes('&&') && lowerLine.includes('.')) {
            issues.push({
                type: "best_practices",
                severity: "low",
                category: "ES2020 Features",
                message: "Consider using optional chaining",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use ?. operator for safer property access",
                impact: "Cleaner null/undefined checking"
            });
        }
        
        // Not using nullish coalescing
        if (lowerLine.includes('||') && !lowerLine.includes('??')) {
            issues.push({
                type: "best_practices",
                severity: "low",
                category: "ES2020 Features",
                message: "Consider using nullish coalescing",
                line: lineNum,
                code: line.trim(),
                recommendation: "Use ?? operator for null/undefined checks",
                impact: "More precise falsy value handling"
            });
        }
        
        // Not using proper error handling
        if (lowerLine.includes('try') && !lowerLine.includes('catch')) {
            issues.push({
                type: "best_practices",
                severity: "high",
                category: "Error Handling",
                message: "Try block without catch",
                line: lineNum,
                code: line.trim(),
                recommendation: "Always include catch block for error handling",
                impact: "Unhandled exceptions"
            });
        }
    });
    
    return issues;
}

/**
 * Main analysis function
 */
async function runDetailedAnalysis() {
    const results = [];
    let totalIssues = 0;
    
    console.log("🚀 Starting detailed code analysis...\n");
    
    for (const filename of testFiles) {
        const filePath = path.join(testFilesDir, filename);
        
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️ File not found: ${filePath}`);
            continue;
        }
        
        console.log(`📁 Analyzing: ${filename}`);
        
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        // Analyze different aspects
        const securityIssues = analyzeSecurity(content, filename);
        const performanceIssues = analyzePerformance(content, filename);
        const qualityIssues = analyzeCodeQuality(content, filename);
        const bestPracticeIssues = analyzeBestPractices(content, filename);
        
        const allIssues = [...securityIssues, ...performanceIssues, ...qualityIssues, ...bestPracticeIssues];
        totalIssues += allIssues.length;
        
        // Calculate metrics
        const metrics = {
            total_lines: lines.length,
            total_issues: allIssues.length,
            security_issues: securityIssues.length,
            performance_issues: performanceIssues.length,
            quality_issues: qualityIssues.length,
            best_practice_issues: bestPracticeIssues.length,
            critical_issues: allIssues.filter(i => i.severity === 'critical').length,
            high_issues: allIssues.filter(i => i.severity === 'high').length,
            medium_issues: allIssues.filter(i => i.severity === 'medium').length,
            low_issues: allIssues.filter(i => i.severity === 'low').length
        };
        
        // Determine overall risk
        const overallRisk = metrics.critical_issues > 0 ? 'critical' :
                           metrics.high_issues > 3 ? 'high' :
                           metrics.medium_issues > 5 ? 'medium' : 'low';
        
        const fileResult = {
            file: filename,
            path: filePath,
            metrics: metrics,
            overall_risk: overallRisk,
            issues: allIssues,
            summary: {
                total_issues: allIssues.length,
                by_severity: {
                    critical: metrics.critical_issues,
                    high: metrics.high_issues,
                    medium: metrics.medium_issues,
                    low: metrics.low_issues
                },
                by_category: {
                    security: metrics.security_issues,
                    performance: metrics.performance_issues,
                    code_quality: metrics.quality_issues,
                    best_practices: metrics.best_practice_issues
                }
            },
            recommendations: generateRecommendations(allIssues),
            timestamp: new Date().toISOString()
        };
        
        results.push(fileResult);
        console.log(`   ✅ Found ${allIssues.length} issues (${overallRisk} risk)`);
    }
    
    // Generate overall summary
    const overallSummary = {
        total_files: results.length,
        total_issues: totalIssues,
        files_analyzed: results.map(r => r.file),
        overall_risk_distribution: {
            critical: results.filter(r => r.overall_risk === 'critical').length,
            high: results.filter(r => r.overall_risk === 'high').length,
            medium: results.filter(r => r.overall_risk === 'medium').length,
            low: results.filter(r => r.overall_risk === 'low').length
        },
        top_issues: getTopIssues(results),
        analysis_timestamp: new Date().toISOString()
    };
    
    const finalResult = {
        analysis_info: {
            tool: "CodeRabbit Simulation",
            version: "1.0.0",
            description: "Detailed code analysis with security, performance, and quality insights"
        },
        summary: overallSummary,
        files: results,
        recommendations: [
            "Address all critical and high severity issues immediately",
            "Implement proper security measures and input validation",
            "Optimize performance bottlenecks and memory usage",
            "Follow consistent coding standards and best practices",
            "Add comprehensive error handling and logging",
            "Implement automated testing and code review processes"
        ]
    };
    
    // Output as JSON
    console.log("\n" + "=" .repeat(60));
    console.log("📋 DETAILED ANALYSIS RESULTS (JSON)");
    console.log("=" .repeat(60));
    console.log(JSON.stringify(finalResult, null, 2));
    
    return finalResult;
}

/**
 * Generate recommendations based on issues
 */
function generateRecommendations(issues) {
    const recommendations = [];
    const categories = [...new Set(issues.map(i => i.category))];
    
    categories.forEach(category => {
        const categoryIssues = issues.filter(i => i.category === category);
        if (categoryIssues.length > 0) {
            recommendations.push({
                category: category,
                count: categoryIssues.length,
                priority: categoryIssues.some(i => i.severity === 'critical' || i.severity === 'high') ? 'high' : 'medium',
                suggestion: `Address ${category.toLowerCase()} issues to improve code quality`
            });
        }
    });
    
    return recommendations;
}

/**
 * Get top issues across all files
 */
function getTopIssues(results) {
    const allIssues = results.flatMap(r => r.issues);
    const issueCounts = {};
    
    allIssues.forEach(issue => {
        const key = issue.category;
        issueCounts[key] = (issueCounts[key] || 0) + 1;
    });
    
    return Object.entries(issueCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([category, count]) => ({ category, count }));
}

// Run the analysis
runDetailedAnalysis().catch(console.error);
