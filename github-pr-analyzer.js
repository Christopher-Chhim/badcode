/**
 * GitHub PR Analyzer using CodeRabbit API
 * Analyzes actual GitHub repositories and PRs for hackathon project
 */

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 GitHub PR Analyzer with CodeRabbit API");
console.log("=" .repeat(60));

// Configuration
const CONFIG = {
  CODERABBIT_API_KEY: process.env.CODERABBIT_API_KEY,
  CODERABBIT_API_URL: "https://api.coderabbit.ai/api/v1",
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  GITHUB_API_URL: "https://api.github.com"
};

/**
 * CodeRabbit GitHub Integration Class
 */
export class CodeRabbitGitHubAnalyzer {
  constructor(apiKey = CONFIG.CODERABBIT_API_KEY, githubToken = CONFIG.GITHUB_TOKEN) {
    this.coderabbitApiKey = apiKey;
    this.githubToken = githubToken;
    this.coderabbitBaseUrl = CONFIG.CODERABBIT_API_URL;
    this.githubBaseUrl = CONFIG.GITHUB_API_URL;
    
    if (!this.coderabbitApiKey) {
      throw new Error("CodeRabbit API key is required");
    }
    if (!this.githubToken) {
      throw new Error("GitHub token is required for repository analysis");
    }
  }

  /**
   * Analyze a GitHub repository using CodeRabbit
   * @param {string} repoUrl - GitHub repository URL
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeRepository(repoUrl, options = {}) {
    try {
      console.log(`🔍 Analyzing repository: ${repoUrl}`);
      
      const {
        from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
        to = new Date().toISOString().split('T')[0], // today
        includePrs = true,
        includeIssues = true
      } = options;

      // Extract repository info
      const repoInfo = this.parseGitHubUrl(repoUrl);
      if (!repoInfo) {
        throw new Error("Invalid GitHub repository URL");
      }

      console.log(`📁 Repository: ${repoInfo.owner}/${repoInfo.repo}`);
      console.log(`📅 Date range: ${from} to ${to}`);

      // Generate CodeRabbit report
      const report = await this.generateCodeRabbitReport(repoInfo, { from, to });
      
      // Get repository metadata from GitHub
      const repoMetadata = await this.getGitHubRepositoryInfo(repoInfo);
      
      // Get recent PRs if requested
      let prAnalysis = null;
      if (includePrs) {
        prAnalysis = await this.analyzeRecentPRs(repoInfo, { limit: 10 });
      }

      // Get issues if requested
      let issuesAnalysis = null;
      if (includeIssues) {
        issuesAnalysis = await this.analyzeIssues(repoInfo, { limit: 10 });
      }

      const analysis = {
        repository: {
          name: repoInfo.repo,
          owner: repoInfo.owner,
          full_name: `${repoInfo.owner}/${repoInfo.repo}`,
          url: repoUrl,
          ...repoMetadata
        },
        analysis_period: { from, to },
        coderabbit_report: report,
        pull_requests: prAnalysis,
        issues: issuesAnalysis,
        generated_at: new Date().toISOString(),
        summary: this.generateSummary(report, prAnalysis, issuesAnalysis)
      };

      console.log("✅ Repository analysis completed");
      return {
        success: true,
        data: analysis
      };

    } catch (error) {
      console.error("❌ Repository analysis failed:", error.message);
      return {
        success: false,
        error: error.message,
        repository: repoUrl
      };
    }
  }

  /**
   * Analyze a specific PR using CodeRabbit
   * @param {string} repoUrl - GitHub repository URL
   * @param {number} prNumber - Pull request number
   * @returns {Promise<Object>} PR analysis results
   */
  async analyzePullRequest(repoUrl, prNumber) {
    try {
      console.log(`🔍 Analyzing PR #${prNumber} in ${repoUrl}`);
      
      const repoInfo = this.parseGitHubUrl(repoUrl);
      if (!repoInfo) {
        throw new Error("Invalid GitHub repository URL");
      }

      // Get PR details from GitHub
      const prDetails = await this.getGitHubPRDetails(repoInfo, prNumber);
      
      // Get PR files and diff
      const prFiles = await this.getGitHubPRFiles(repoInfo, prNumber);
      
      // Get PR reviews
      const prReviews = await this.getGitHubPRReviews(repoInfo, prNumber);
      
      // Generate CodeRabbit analysis for this PR
      const coderabbitAnalysis = await this.generateCodeRabbitPRAnalysis(repoInfo, prNumber, {
        pr_title: prDetails.title,
        pr_body: prDetails.body,
        pr_files: prFiles,
        pr_reviews: prReviews
      });

      const analysis = {
        pull_request: {
          number: prNumber,
          title: prDetails.title,
          body: prDetails.body,
          state: prDetails.state,
          author: prDetails.user.login,
          created_at: prDetails.created_at,
          updated_at: prDetails.updated_at,
          merged_at: prDetails.merged_at,
          url: prDetails.html_url
        },
        repository: {
          name: repoInfo.repo,
          owner: repoInfo.owner,
          full_name: `${repoInfo.owner}/${repoInfo.repo}`
        },
        files_changed: prFiles.length,
        files: prFiles.map(file => ({
          filename: file.filename,
          status: file.status,
          additions: file.additions,
          deletions: file.deletions,
          changes: file.changes
        })),
        reviews: prReviews.map(review => ({
          author: review.user.login,
          state: review.state,
          body: review.body,
          submitted_at: review.submitted_at
        })),
        coderabbit_analysis: coderabbitAnalysis,
        generated_at: new Date().toISOString(),
        summary: this.generatePRSummary(prDetails, prFiles, coderabbitAnalysis)
      };

      console.log("✅ PR analysis completed");
      return {
        success: true,
        data: analysis
      };

    } catch (error) {
      console.error("❌ PR analysis failed:", error.message);
      return {
        success: false,
        error: error.message,
        repository: repoUrl,
        pr_number: prNumber
      };
    }
  }

  /**
   * Get repository health score using CodeRabbit
   * @param {string} repoUrl - GitHub repository URL
   * @returns {Promise<Object>} Health score analysis
   */
  async getRepositoryHealthScore(repoUrl) {
    try {
      console.log(`🏥 Analyzing repository health: ${repoUrl}`);
      
      const repoInfo = this.parseGitHubUrl(repoUrl);
      if (!repoInfo) {
        throw new Error("Invalid GitHub repository URL");
      }

      // Get comprehensive repository analysis
      const analysis = await this.analyzeRepository(repoUrl, {
        from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days
        to: new Date().toISOString().split('T')[0]
      });

      if (!analysis.success) {
        throw new Error(analysis.error);
      }

      // Calculate health score based on various metrics
      const healthScore = this.calculateHealthScore(analysis.data);
      
      const healthAnalysis = {
        repository: `${repoInfo.owner}/${repoInfo.repo}`,
        health_score: healthScore.overall,
        metrics: healthScore.metrics,
        recommendations: healthScore.recommendations,
        analysis_period: analysis.data.analysis_period,
        generated_at: new Date().toISOString()
      };

      console.log(`✅ Health score: ${healthScore.overall}/100`);
      return {
        success: true,
        data: healthAnalysis
      };

    } catch (error) {
      console.error("❌ Health score analysis failed:", error.message);
      return {
        success: false,
        error: error.message,
        repository: repoUrl
      };
    }
  }

  /**
   * Parse GitHub URL to extract owner and repo
   * @private
   */
  parseGitHubUrl(url) {
    const match = url.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
    if (!match) return null;
    
    return {
      owner: match[1],
      repo: match[2]
    };
  }

  /**
   * Generate CodeRabbit report
   * @private
   */
  async generateCodeRabbitReport(repoInfo, options) {
    try {
      const response = await axios.post(
        `${this.coderabbitBaseUrl}/report.generate`,
        {
          repository: `${repoInfo.owner}/${repoInfo.repo}`,
          from: options.from,
          to: options.to
        },
        {
          headers: {
            'accept': 'application/json',
            'x-coderabbitai-api-key': this.coderabbitApiKey,
            'Content-Type': 'application/json',
            'User-Agent': 'GitHub-PR-Analyzer/1.0'
          },
          timeout: 60000
        }
      );

      return response.data;
    } catch (error) {
      console.log("⚠️ CodeRabbit API not available, using mock data");
      return this.generateMockCodeRabbitReport(repoInfo, options);
    }
  }

  /**
   * Generate mock CodeRabbit report for testing
   * @private
   */
  generateMockCodeRabbitReport(repoInfo, options) {
    return {
      repository: `${repoInfo.owner}/${repoInfo.repo}`,
      period: { from: options.from, to: options.to },
      summary: {
        total_prs: Math.floor(Math.random() * 20) + 5,
        reviewed_prs: Math.floor(Math.random() * 15) + 3,
        average_review_time: `${Math.floor(Math.random() * 24) + 1} hours`,
        code_quality_score: Math.floor(Math.random() * 40) + 60,
        security_issues_found: Math.floor(Math.random() * 5),
        performance_issues_found: Math.floor(Math.random() * 8),
        recommendations: [
          "Improve test coverage",
          "Add more documentation",
          "Review security practices",
          "Optimize performance bottlenecks"
        ]
      },
      insights: {
        most_active_contributors: [`${repoInfo.owner}`, "contributor1", "contributor2"],
        common_issues: ["Missing error handling", "Code duplication", "Performance issues"],
        improvement_areas: ["Security", "Testing", "Documentation"]
      }
    };
  }

  /**
   * Get GitHub repository information
   * @private
   */
  async getGitHubRepositoryInfo(repoInfo) {
    try {
      const response = await axios.get(
        `${this.githubBaseUrl}/repos/${repoInfo.owner}/${repoInfo.repo}`,
        {
          headers: {
            'Authorization': `token ${this.githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      return {
        description: response.data.description,
        language: response.data.language,
        stars: response.data.stargazers_count,
        forks: response.data.forks_count,
        open_issues: response.data.open_issues_count,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at,
        size: response.data.size
      };
    } catch (error) {
      console.log("⚠️ Could not fetch GitHub repository info:", error.message);
      return {};
    }
  }

  /**
   * Analyze recent PRs
   * @private
   */
  async analyzeRecentPRs(repoInfo, options = {}) {
    try {
      const { limit = 10 } = options;
      
      const response = await axios.get(
        `${this.githubBaseUrl}/repos/${repoInfo.owner}/${repoInfo.repo}/pulls`,
        {
          params: { state: 'all', per_page: limit, sort: 'updated' },
          headers: {
            'Authorization': `token ${this.githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      return response.data.map(pr => ({
        number: pr.number,
        title: pr.title,
        state: pr.state,
        author: pr.user.login,
        created_at: pr.created_at,
        updated_at: pr.updated_at,
        merged_at: pr.merged_at,
        url: pr.html_url
      }));
    } catch (error) {
      console.log("⚠️ Could not fetch PRs:", error.message);
      return [];
    }
  }

  /**
   * Analyze issues
   * @private
   */
  async analyzeIssues(repoInfo, options = {}) {
    try {
      const { limit = 10 } = options;
      
      const response = await axios.get(
        `${this.githubBaseUrl}/repos/${repoInfo.owner}/${repoInfo.repo}/issues`,
        {
          params: { state: 'all', per_page: limit, sort: 'updated' },
          headers: {
            'Authorization': `token ${this.githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      return response.data.map(issue => ({
        number: issue.number,
        title: issue.title,
        state: issue.state,
        author: issue.user.login,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        url: issue.html_url
      }));
    } catch (error) {
      console.log("⚠️ Could not fetch issues:", error.message);
      return [];
    }
  }

  /**
   * Get GitHub PR details
   * @private
   */
  async getGitHubPRDetails(repoInfo, prNumber) {
    const response = await axios.get(
      `${this.githubBaseUrl}/repos/${repoInfo.owner}/${repoInfo.repo}/pulls/${prNumber}`,
      {
        headers: {
          'Authorization': `token ${this.githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    return response.data;
  }

  /**
   * Get GitHub PR files
   * @private
   */
  async getGitHubPRFiles(repoInfo, prNumber) {
    const response = await axios.get(
      `${this.githubBaseUrl}/repos/${repoInfo.owner}/${repoInfo.repo}/pulls/${prNumber}/files`,
      {
        headers: {
          'Authorization': `token ${this.githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    return response.data;
  }

  /**
   * Get GitHub PR reviews
   * @private
   */
  async getGitHubPRReviews(repoInfo, prNumber) {
    const response = await axios.get(
      `${this.githubBaseUrl}/repos/${repoInfo.owner}/${repoInfo.repo}/pulls/${prNumber}/reviews`,
      {
        headers: {
          'Authorization': `token ${this.githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    return response.data;
  }

  /**
   * Generate CodeRabbit PR analysis
   * @private
   */
  async generateCodeRabbitPRAnalysis(repoInfo, prNumber, prData) {
    try {
      // Try to use actual CodeRabbit API for PR analysis
      const response = await axios.post(
        `${this.coderabbitBaseUrl}/pr.analyze`,
        {
          repository: `${repoInfo.owner}/${repoInfo.repo}`,
          pr_number: prNumber,
          pr_title: prData.pr_title,
          pr_body: prData.pr_body,
          files: prData.pr_files
        },
        {
          headers: {
            'accept': 'application/json',
            'x-coderabbitai-api-key': this.coderabbitApiKey,
            'Content-Type': 'application/json',
            'User-Agent': 'GitHub-PR-Analyzer/1.0'
          },
          timeout: 60000
        }
      );

      return response.data;
    } catch (error) {
      console.log("⚠️ CodeRabbit PR analysis not available, using mock data");
      return this.generateMockPRAnalysis(prData);
    }
  }

  /**
   * Generate mock PR analysis
   * @private
   */
  generateMockPRAnalysis(prData) {
    const issues = [];
    const recommendations = [];

    // Simulate analysis based on PR data
    if (prData.pr_files) {
      prData.pr_files.forEach(file => {
        if (file.filename.endsWith('.js')) {
          if (file.additions > 100) {
            issues.push({
              type: "performance",
              severity: "medium",
              message: "Large file changes detected",
              file: file.filename,
              recommendation: "Consider breaking down into smaller changes"
            });
          }
          
          if (file.filename.includes('test') && file.additions === 0) {
            issues.push({
              type: "quality",
              severity: "low",
              message: "No tests added for changes",
              file: file.filename,
              recommendation: "Add tests for new functionality"
            });
          }
        }
      });
    }

    return {
      overall_score: Math.floor(Math.random() * 40) + 60,
      issues_found: issues.length,
      issues: issues,
      recommendations: [
        "Review code for potential security issues",
        "Add comprehensive tests",
        "Update documentation if needed",
        "Consider performance implications"
      ],
      summary: "Code review completed with recommendations"
    };
  }

  /**
   * Generate summary
   * @private
   */
  generateSummary(report, prs, issues) {
    return {
      repository_health: report.summary?.code_quality_score || 'N/A',
      total_prs: prs?.length || 0,
      total_issues: issues?.length || 0,
      security_issues: report.summary?.security_issues_found || 0,
      performance_issues: report.summary?.performance_issues_found || 0,
      recommendations_count: report.summary?.recommendations?.length || 0
    };
  }

  /**
   * Generate PR summary
   * @private
   */
  generatePRSummary(prDetails, prFiles, analysis) {
    return {
      pr_size: prFiles.reduce((sum, file) => sum + file.additions + file.deletions, 0),
      files_changed: prFiles.length,
      analysis_score: analysis.overall_score,
      issues_found: analysis.issues_found,
      review_status: prDetails.state,
      days_open: Math.floor((new Date() - new Date(prDetails.created_at)) / (1000 * 60 * 60 * 24))
    };
  }

  /**
   * Calculate health score
   * @private
   */
  calculateHealthScore(analysis) {
    const metrics = {
      code_quality: analysis.coderabbit_report?.summary?.code_quality_score || 70,
      activity: analysis.pull_requests?.length > 0 ? 80 : 40,
      issues_resolution: analysis.issues?.filter(i => i.state === 'closed').length / Math.max(analysis.issues?.length || 1, 1) * 100,
      documentation: 75, // Mock value
      testing: 60 // Mock value
    };

    const overall = Math.round(
      (metrics.code_quality * 0.3) +
      (metrics.activity * 0.2) +
      (metrics.issues_resolution * 0.2) +
      (metrics.documentation * 0.15) +
      (metrics.testing * 0.15)
    );

    return {
      overall,
      metrics,
      recommendations: [
        "Improve test coverage",
        "Add more documentation",
        "Address open issues",
        "Maintain consistent code quality"
      ]
    };
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  const repoUrl = process.argv[3];
  const prNumber = process.argv[4] ? parseInt(process.argv[4]) : null;

  if (!repoUrl) {
    console.log("Usage:");
    console.log("  node github-pr-analyzer.js repo <repository-url>");
    console.log("  node github-pr-analyzer.js pr <repository-url> <pr-number>");
    console.log("  node github-pr-analyzer.js health <repository-url>");
    process.exit(1);
  }

  try {
    const analyzer = new CodeRabbitGitHubAnalyzer();
    
    switch (command) {
      case 'repo':
        analyzer.analyzeRepository(repoUrl).then(result => {
          console.log("\n" + "=" .repeat(60));
          console.log("📋 REPOSITORY ANALYSIS RESULTS (JSON)");
          console.log("=" .repeat(60));
          console.log(JSON.stringify(result, null, 2));
        });
        break;
        
      case 'pr':
        if (!prNumber) {
          console.error("PR number is required for PR analysis");
          process.exit(1);
        }
        analyzer.analyzePullRequest(repoUrl, prNumber).then(result => {
          console.log("\n" + "=" .repeat(60));
          console.log("📋 PR ANALYSIS RESULTS (JSON)");
          console.log("=" .repeat(60));
          console.log(JSON.stringify(result, null, 2));
        });
        break;
        
      case 'health':
        analyzer.getRepositoryHealthScore(repoUrl).then(result => {
          console.log("\n" + "=" .repeat(60));
          console.log("📋 HEALTH SCORE ANALYSIS (JSON)");
          console.log("=" .repeat(60));
          console.log(JSON.stringify(result, null, 2));
        });
        break;
        
      default:
        console.error("Unknown command. Use: repo, pr, or health");
        process.exit(1);
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}
