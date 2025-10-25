/**
 * CodeRabbit Test Utilities
 * Additional helper functions for testing CodeRabbit API
 */

import fs from "fs";
import path from "path";

/**
 * Generate test payloads for different scenarios
 */
export const testPayloads = {
  /**
   * Basic repository test payload
   */
  basic: (repoUrl, prNumber = null) => ({
    repo_url: repoUrl,
    ...(prNumber && { pr_number: prNumber })
  }),

  /**
   * Custom payload with specific parameters
   */
  custom: (options = {}) => ({
    repo_url: options.repoUrl,
    pr_number: options.prNumber,
    ...options.extra
  }),

  /**
   * Payload for testing specific file types
   */
  fileType: (repoUrl, fileTypes = []) => ({
    repo_url: repoUrl,
    file_types: fileTypes,
    focus_areas: fileTypes
  }),

  /**
   * Payload for security-focused review
   */
  security: (repoUrl, prNumber = null) => ({
    repo_url: repoUrl,
    pr_number: prNumber,
    focus_areas: ["security", "vulnerabilities", "secrets"],
    severity_threshold: "medium"
  }),

  /**
   * Payload for performance-focused review
   */
  performance: (repoUrl, prNumber = null) => ({
    repo_url: repoUrl,
    pr_number: prNumber,
    focus_areas: ["performance", "optimization", "efficiency"],
    include_suggestions: true
  })
};

/**
 * Mock response data for testing
 */
export const mockResponses = {
  success: {
    summary: "Code review completed successfully",
    overall_risk: "low",
    issues: [],
    recommendations: [
      "Consider adding more unit tests",
      "Document complex functions"
    ],
    timestamp: new Date().toISOString()
  },

  withIssues: {
    summary: "Found several issues that need attention",
    overall_risk: "medium",
    issues: [
      {
        file: "src/utils.js",
        line: 15,
        type: "security",
        description: "Potential SQL injection vulnerability",
        remediation: "Use parameterized queries"
      },
      {
        file: "src/auth.js",
        line: 42,
        type: "bug",
        description: "Missing null check",
        remediation: "Add null validation before accessing properties"
      }
    ],
    recommendations: [
      "Fix security vulnerabilities immediately",
      "Add input validation",
      "Increase test coverage"
    ],
    timestamp: new Date().toISOString()
  },

  highRisk: {
    summary: "Critical issues found - immediate action required",
    overall_risk: "high",
    issues: [
      {
        file: "src/database.js",
        line: 8,
        type: "security",
        description: "Hardcoded database credentials",
        remediation: "Use environment variables for sensitive data"
      },
      {
        file: "src/api.js",
        line: 25,
        type: "security",
        description: "No authentication on sensitive endpoint",
        remediation: "Add proper authentication middleware"
      }
    ],
    recommendations: [
      "URGENT: Fix security vulnerabilities",
      "Implement proper authentication",
      "Review all sensitive endpoints",
      "Conduct security audit"
    ],
    timestamp: new Date().toISOString()
  }
};

/**
 * Test data generators
 */
export const testData = {
  /**
   * Generate random repository URLs for testing
   */
  randomRepoUrl: () => {
    const orgs = ["facebook", "google", "microsoft", "apple", "netflix"];
    const repos = ["react", "angular", "vue", "express", "fastapi"];
    const org = orgs[Math.floor(Math.random() * orgs.length)];
    const repo = repos[Math.floor(Math.random() * repos.length)];
    return `https://github.com/${org}/${repo}.git`;
  },

  /**
   * Generate test file content
   */
  generateTestFile: (filename, content) => {
    const testDir = "./test-files";
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    
    const filePath = path.join(testDir, filename);
    fs.writeFileSync(filePath, content);
    return filePath;
  },

  /**
   * Clean up test files
   */
  cleanupTestFiles: () => {
    const testDir = "./test-files";
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  }
};

/**
 * Performance testing utilities
 */
export const performanceUtils = {
  /**
   * Measure execution time of a function
   */
  measureTime: async (fn, label = "Operation") => {
    const start = process.hrtime.bigint();
    const result = await fn();
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1000000; // Convert to milliseconds
    console.log(`⏱️  ${label}: ${duration.toFixed(2)}ms`);
    return { result, duration };
  },

  /**
   * Run multiple iterations of a test
   */
  runIterations: async (fn, iterations = 5) => {
    const results = [];
    for (let i = 0; i < iterations; i++) {
      console.log(`🔄 Running iteration ${i + 1}/${iterations}`);
      const result = await fn();
      results.push(result);
    }
    
    const durations = results.map(r => r.duration || 0);
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);
    
    console.log(`📊 Performance Summary:`);
    console.log(`   Average: ${avgDuration.toFixed(2)}ms`);
    console.log(`   Min: ${minDuration.toFixed(2)}ms`);
    console.log(`   Max: ${maxDuration.toFixed(2)}ms`);
    
    return { results, avgDuration, minDuration, maxDuration };
  }
};

/**
 * Validation utilities
 */
export const validators = {
  /**
   * Validate API response structure
   */
  validateResponse: (response) => {
    const errors = [];
    
    if (!response.data) {
      errors.push("Missing data property");
    } else {
      const data = response.data;
      
      if (!data.summary && !data.overall_risk) {
        errors.push("Missing summary or overall_risk");
      }
      
      if (data.issues && !Array.isArray(data.issues)) {
        errors.push("Issues should be an array");
      }
      
      if (data.recommendations && !Array.isArray(data.recommendations)) {
        errors.push("Recommendations should be an array");
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Validate repository URL format
   */
  validateRepoUrl: (url) => {
    const githubPattern = /^https:\/\/github\.com\/[^\/]+\/[^\/]+(?:\.git)?$/;
    return githubPattern.test(url);
  },

  /**
   * Validate PR number
   */
  validatePrNumber: (prNumber) => {
    return Number.isInteger(prNumber) && prNumber > 0;
  }
};

/**
 * Logging utilities
 */
export const logger = {
  /**
   * Create a test logger with timestamps
   */
  create: (prefix = "TEST") => ({
    info: (message) => console.log(`[${new Date().toISOString()}] ${prefix}: ${message}`),
    error: (message) => console.error(`[${new Date().toISOString()}] ${prefix}: ❌ ${message}`),
    success: (message) => console.log(`[${new Date().toISOString()}] ${prefix}: ✅ ${message}`),
    warn: (message) => console.warn(`[${new Date().toISOString()}] ${prefix}: ⚠️  ${message}`)
  }),

  /**
   * Save test results to file
   */
  saveResults: (results, filename = null) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const defaultFilename = `test-results-${timestamp}.json`;
    const finalFilename = filename || defaultFilename;
    
    fs.writeFileSync(finalFilename, JSON.stringify(results, null, 2));
    console.log(`💾 Test results saved to ${finalFilename}`);
    return finalFilename;
  }
};

/**
 * Configuration helpers
 */
export const config = {
  /**
   * Load test configuration from file
   */
  loadFromFile: (filePath = "./test-config.json") => {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return {};
  },

  /**
   * Save test configuration to file
   */
  saveToFile: (config, filePath = "./test-config.json") => {
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
    console.log(`💾 Configuration saved to ${filePath}`);
  },

  /**
   * Merge configurations
   */
  merge: (...configs) => {
    return Object.assign({}, ...configs);
  }
};
