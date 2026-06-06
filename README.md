# StudyDebt AI
### Discover the hidden cost of skipped learning.

> "The reason you're struggling today may be because of something you skipped months ago."

**Live Demo:** https://studydebt.vercel.app

---

## What is StudyDebt?

StudyDebt AI is a 7-step agentic AI pipeline that takes the topics you skipped in a course and reveals the full downstream damage — every topic you unknowingly broke, where you'll fail next, and exactly how to recover.

Most students don't know what they don't know. StudyDebt makes the invisible visible.

---

## The 7-Agent Pipeline

| Step | Agent | What it does |
|------|-------|-------------|
| 1 | **Knowledge Auditor** | Calculates your Knowledge Debt Score (1–100) and estimates recovery time |
| 2 | **Dependency Mapper** | Maps every topic in the course that directly depends on what you skipped |
| 3 | **Future Failure Simulator** | Picks your most impactful broken dependency and simulates you attempting it step-by-step, showing exactly where you fail and why |
| 4 | **Consequence Predictor** | Predicts interview risk, exam risk, and long-term career impact |
| 5 | **Recovery Planner** | Builds a personalized day-by-day roadmap with curated resources |
| 6 | **Quiz Generator** | Creates a diagnostic question targeting your root gap |
| 7 | **Adaptive Recovery Agent** | Analyzes your quiz result and rebuilds the recovery plan — simplified if you failed, accelerated if you passed |

Each agent receives context from the previous step, forming a **stateful reasoning chain** rather than independent prompts.

---

## Example

**Input:**
```
Subject: Data Structures & Algorithms
Skipped: Recursion, Binary Trees
```

**Output:**
```
Knowledge Debt Score: 87/100
Interview Risk: High
Recovery Time: 20 days

Broken Topics: DFS, Backtracking, Dynamic Programming,
               Segment Trees, Heap, Trie, Graph Algorithms

Future Failure Simulation:
  Attempting: Dynamic Programming
  ✓ Step 1: Identify the subproblem
  ✗ Step 2: Build the recurrence relation
  Failure: Lacks recursive decomposition fundamentals
  Confidence: 91%

→ 7-day recovery roadmap generated
→ Diagnostic quiz generated
→ Adaptive plan rebuilt based on quiz result
```

---

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript
- **AI:** Groq API (LLaMA 3.3 70B)
- **Deployment:** Vercel

No backend. No database. No framework. Pure agentic AI.

---

## Why It Works

StudyDebt doesn't just tell you what you missed. It:
1. **Reveals** hidden consequences you never considered
2. **Simulates** future failure before it happens
3. **Adapts** to your actual knowledge level via quiz feedback

That's the difference between a prompt and an agent.

---

## Built At

**Evorozen Innovators Hackathon** — June 2026  
Solo project | 10 hours
