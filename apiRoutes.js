import axios from "axios";

async function reviewPullRequest(repoUrl, prNumber) {
  try {
    const response = await axios.post(
      "https://api.coderabbit.ai/v1/review",
      {
        repo_url: 'https://github.com/Christopher-Chhim/badcode',
        pr_number: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CODERABBIT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // JSON with PR summary, security issues, suggestions
  } catch (err) {
    console.error("Error calling CodeRabbit API:", err.response?.data || err.message);
    throw err;
  }
}

// Example usage:
reviewPullRequest("https://github.com/Christopher-Chhim/badcode", 1)
  .then(data => console.log("CodeRabbit Review:", data));
