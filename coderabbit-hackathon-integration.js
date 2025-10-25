/**
 * CodeRabbit API Integration for Hackathon Project
 * 
 * This module provides a complete integration with CodeRabbit's actual API
 * for generating reports and managing code reviews.
 */

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Configuration
const CONFIG = {
  API_KEY: process.env.CODERABBIT_API_KEY,
  API_BASE_URL: "https://api.coderabbit.ai/api/v1",
  TIMEOUT: 30000
};

/**
 * CodeRabbit API Client for Hackathon Integration
 */
export class CodeRabbitAPI {
  constructor(apiKey = CONFIG.API_KEY) {
    this.apiKey = apiKey;
    this.baseURL = CONFIG.API_BASE_URL;
    
    if (!this.apiKey) {
      throw new Error("CodeRabbit API key is required");
    }
  }

  /**
   * Generate an on-demand report
   * @param {Object} options - Report options
   * @param {string} options.from - Start date (YYYY-MM-DD)
   * @param {string} options.to - End date (YYYY-MM-DD)
   * @param {string} [options.repository] - Specific repository
   * @param {string} [options.team] - Team name
   * @returns {Promise<Object>} Report data
   */
  async generateReport({ from, to, repository = null, team = null }) {
    try {
      console.log("📊 Generating CodeRabbit report...");
      console.log(`📅 Date range: ${from} to ${to}`);
      if (repository) console.log(`📁 Repository: ${repository}`);
      if (team) console.log(`👥 Team: ${team}`);

      const payload = {
        from,
        to,
        ...(repository && { repository }),
        ...(team && { team })
      };

      const response = await axios.post(
        `${this.baseURL}/report.generate`,
        payload,
        {
          headers: {
            'accept': 'application/json',
            'x-coderabbitai-api-key': this.apiKey,
            'Content-Type': 'application/json',
            'User-Agent': 'Hackathon-Project/1.0'
          },
          timeout: CONFIG.TIMEOUT
        }
      );

      console.log("✅ Report generated successfully");
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      console.error("❌ Failed to generate report:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get repository information
   * @param {string} repository - Repository name (owner/repo)
   * @returns {Promise<Object>} Repository data
   */
  async getRepository(repository) {
    try {
      console.log(`📁 Fetching repository info: ${repository}`);

      const response = await axios.get(
        `${this.baseURL}/repositories/${encodeURIComponent(repository)}`,
        {
          headers: {
            'accept': 'application/json',
            'x-coderabbitai-api-key': this.apiKey,
            'User-Agent': 'Hackathon-Project/1.0'
          },
          timeout: CONFIG.TIMEOUT
        }
      );

      console.log("✅ Repository info retrieved");
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      console.error("❌ Failed to get repository info:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get pull request reviews
   * @param {string} repository - Repository name (owner/repo)
   * @param {number} prNumber - Pull request number
   * @returns {Promise<Object>} PR review data
   */
  async getPullRequestReview(repository, prNumber) {
    try {
      console.log(`🔍 Fetching PR review: ${repository}#${prNumber}`);

      const response = await axios.get(
        `${this.baseURL}/repositories/${encodeURIComponent(repository)}/pulls/${prNumber}/reviews`,
        {
          headers: {
            'accept': 'application/json',
            'x-coderabbitai-api-key': this.apiKey,
            'User-Agent': 'Hackathon-Project/1.0'
          },
          timeout: CONFIG.TIMEOUT
        }
      );

      console.log("✅ PR review retrieved");
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      console.error("❌ Failed to get PR review:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get team statistics
   * @param {string} [team] - Team name (optional)
   * @returns {Promise<Object>} Team statistics
   */
  async getTeamStats(team = null) {
    try {
      console.log(`📈 Fetching team statistics${team ? ` for: ${team}` : ''}`);

      const url = team 
        ? `${this.baseURL}/teams/${encodeURIComponent(team)}/stats`
        : `${this.baseURL}/stats`;

      const response = await axios.get(url, {
        headers: {
          'accept': 'application/json',
          'x-coderabbitai-api-key': this.apiKey,
          'User-Agent': 'Hackathon-Project/1.0'
        },
        timeout: CONFIG.TIMEOUT
      });

      console.log("✅ Team statistics retrieved");
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      console.error("❌ Failed to get team stats:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Health check - verify API connection
   * @returns {Promise<Object>} Health status
   */
  async healthCheck() {
    try {
      console.log("🏥 Checking CodeRabbit API health...");

      const response = await axios.get(`${this.baseURL}/health`, {
        headers: {
          'accept': 'application/json',
          'x-coderabbitai-api-key': this.apiKey,
          'User-Agent': 'Hackathon-Project/1.0'
        },
        timeout: 10000
      });

      console.log("✅ API is healthy");
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      console.log("⚠️ API health check failed:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }
}

/**
 * Hackathon-specific utility functions
 */
export class HackathonUtils {
  constructor(apiClient) {
    this.api = apiClient;
  }

  /**
   * Generate a comprehensive hackathon report
   * @param {Object} options - Report options
   * @returns {Promise<Object>} Comprehensive report
   */
  async generateHackathonReport(options = {}) {
    const {
      from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
      to = new Date().toISOString().split('T')[0], // today
      repository = null,
      team = null
    } = options;

    console.log("🚀 Generating comprehensive hackathon report...");

    try {
      // Generate main report
      const report = await this.api.generateReport({ from, to, repository, team });
      
      // Get team stats if available
      let teamStats = null;
      if (team) {
        try {
          teamStats = await this.api.getTeamStats(team);
        } catch (error) {
          console.log("⚠️ Could not fetch team stats:", error.message);
        }
      }

      // Format hackathon-specific data
      const hackathonReport = {
        period: { from, to },
        repository: repository || 'All repositories',
        team: team || 'All teams',
        generated_at: new Date().toISOString(),
        report_data: report.data,
        team_statistics: teamStats?.data || null,
        summary: this._generateSummary(report.data)
      };

      console.log("✅ Hackathon report generated successfully");
      return {
        success: true,
        data: hackathonReport
      };
    } catch (error) {
      console.error("❌ Failed to generate hackathon report:", error.message);
      throw error;
    }
  }

  /**
   * Get code review insights for a specific PR
   * @param {string} repository - Repository name
   * @param {number} prNumber - Pull request number
   * @returns {Promise<Object>} PR insights
   */
  async getPRInsights(repository, prNumber) {
    try {
      console.log(`🔍 Analyzing PR insights: ${repository}#${prNumber}`);

      const review = await this.api.getPullRequestReview(repository, prNumber);
      
      const insights = {
        pr_number: prNumber,
        repository,
        review_data: review.data,
        insights: this._analyzePRReview(review.data),
        generated_at: new Date().toISOString()
      };

      console.log("✅ PR insights generated");
      return {
        success: true,
        data: insights
      };
    } catch (error) {
      console.error("❌ Failed to get PR insights:", error.message);
      throw error;
    }
  }

  /**
   * Generate summary from report data
   * @private
   */
  _generateSummary(reportData) {
    // This would analyze the report data and generate insights
    // Implementation depends on the actual API response structure
    return {
      total_reviews: reportData?.total_reviews || 0,
      average_review_time: reportData?.average_review_time || 'N/A',
      code_quality_score: reportData?.code_quality_score || 'N/A',
      recommendations: reportData?.recommendations || []
    };
  }

  /**
   * Analyze PR review data
   * @private
   */
  _analyzePRReview(reviewData) {
    // This would analyze the PR review data
    // Implementation depends on the actual API response structure
    return {
      review_status: reviewData?.status || 'unknown',
      issues_found: reviewData?.issues?.length || 0,
      suggestions: reviewData?.suggestions?.length || 0,
      overall_rating: reviewData?.rating || 'N/A'
    };
  }
}

/**
 * Quick setup function for hackathon projects
 * @param {string} apiKey - CodeRabbit API key
 * @returns {Object} Configured API client and utilities
 */
export function setupCodeRabbitForHackathon(apiKey = CONFIG.API_KEY) {
  const apiClient = new CodeRabbitAPI(apiKey);
  const utils = new HackathonUtils(apiClient);
  
  return {
    api: apiClient,
    utils,
    // Convenience methods
    generateReport: (options) => apiClient.generateReport(options),
    getPRReview: (repo, pr) => apiClient.getPullRequestReview(repo, pr),
    getTeamStats: (team) => apiClient.getTeamStats(team),
    healthCheck: () => apiClient.healthCheck(),
    generateHackathonReport: (options) => utils.generateHackathonReport(options),
    getPRInsights: (repo, pr) => utils.getPRInsights(repo, pr)
  };
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2] || 'help';
  
  try {
    const coderabbit = setupCodeRabbitForHackathon();
    
    switch (command) {
      case 'health':
        await coderabbit.healthCheck();
        break;
        
      case 'report':
        const from = process.argv[3] || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const to = process.argv[4] || new Date().toISOString().split('T')[0];
        const repo = process.argv[5] || null;
        
        const report = await coderabbit.generateHackathonReport({ from, to, repository: repo });
        console.log(JSON.stringify(report, null, 2));
        break;
        
      case 'pr':
        const repository = process.argv[3];
        const prNumber = parseInt(process.argv[4]);
        
        if (!repository || !prNumber) {
          console.error("Usage: node coderabbit-hackathon-integration.js pr <repository> <pr_number>");
          process.exit(1);
        }
        
        const insights = await coderabbit.getPRInsights(repository, prNumber);
        console.log(JSON.stringify(insights, null, 2));
        break;
        
      case 'help':
      default:
        console.log("CodeRabbit Hackathon Integration");
        console.log("Usage:");
        console.log("  node coderabbit-hackathon-integration.js health");
        console.log("  node coderabbit-hackathon-integration.js report [from] [to] [repository]");
        console.log("  node coderabbit-hackathon-integration.js pr <repository> <pr_number>");
        break;
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}
