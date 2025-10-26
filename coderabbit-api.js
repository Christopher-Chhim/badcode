import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const { CODERABBIT_API_KEY, CODERABBIT_API_URL, PORT = 3000 } = process.env;

if (!CODERABBIT_API_KEY) {
  console.error("Missing CodeRabbit API key in .env");
  process.exit(1);
}

const app = express();
app.use(bodyParser.json());

// GET / route for status check
app.get("/", (req, res) => {
  res.send("CodeRabbit test API is running. Use POST /review to trigger a review.");
});

// POST /review endpoint for CodeRabbit
app.post("/review", async (req, res) => {
  try {
    const { repoUrl, prNumber } = req.body;

    if (!repoUrl) return res.status(400).json({ error: "Missing repoUrl" });

    const payload = {
      repo_url: repoUrl,
      pr_number: prNumber || 1,
    };

    const response = await axios.post(CODERABBIT_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${CODERABBIT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const cbData = response.data;

    const dashboardResponse = {
      summary: cbData.summary || "No summary provided",
      overallRisk: cbData.overall_risk || "Unknown",
      securityIssues: cbData.issues?.map(issue => ({
        file: issue.file || "unknown",
        line: issue.line || null,
        type: issue.type || "Unknown",
        description: issue.description || "No description",
        remediation: issue.remediation || "No remediation provided",
      })) || [],
      recommendations: cbData.recommendations || [],
      timestamp: new Date().toISOString(),
    };

    res.json({ success: true, data: dashboardResponse });
  } catch (err) {
    console.error("Error calling CodeRabbit API:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

app.listen(PORT, () => console.log(`CodeRabbit test API running on port ${PORT}`));
