// ─── StudyDebt AI — app.js ───────────────────────────────────────
// Same structure as your original. Step 3 = Future Failure Simulator
// Steps 4,5,6 = your original 3,4,5. Step 7 = Adaptive Recovery.

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
let agentContext = {};

async function callGemini(apiKey, prompt) {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2048
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices[0].message.content.trim();
}

function setStep(n, state) {
  const el = document.getElementById(`step-${n}`);
  el.classList.remove("active", "done");
  if (state) el.classList.add(state);
}

function setOutput(n, text) {
  document.getElementById(`out-${n}`).textContent = text;
}

async function runAgent() {
  const subject = document.getElementById("subject").value.trim();
  const skipped = document.getElementById("skipped").value.trim();
  const apiKey  = document.getElementById("apikey").value.trim();

  if (!subject || !skipped || !apiKey) {
    alert("Please fill in all three fields.");
    return;
  }

  const btn = document.getElementById("run-btn");
  btn.disabled = true;
  document.getElementById("btn-text").textContent = "Agent running...";
  document.getElementById("pipeline").style.display = "block";
  const results = document.getElementById("results");
  results.style.display = "none";
  results.innerHTML = "";
  [1,2,3,4,5,6].forEach(n => setStep(n, null));

  try {

    // ── STEP 1: Knowledge Auditor ──────────────────────────────────
    setStep(1, "active");
    const audit = await callGemini(apiKey, `You are a knowledge debt auditor.
Subject: ${subject}
Topics the student skipped: ${skipped}

Calculate a Knowledge Debt Score from 1-100 based on how foundational these topics are.
Also estimate recovery time in days.

Respond in STRICT JSON only, no markdown:
{
  "debtScore": 81,
  "recoveryDays": 12,
  "auditSummary": "One sentence summary of the damage."
}`);

    const auditData = JSON.parse(audit.replace(/```json|```/g, "").trim());
    setOutput(1, `✓ Debt score: ${auditData.debtScore}/100`);
    setStep(1, "done");

    // ── STEP 2: Dependency Mapper ──────────────────────────────────
    setStep(2, "active");
    const depsRaw = await callGemini(apiKey, `You are a curriculum dependency expert.
Subject: ${subject}
Skipped topics: ${skipped}

List every topic in ${subject} that DIRECTLY depends on these skipped topics.
Respond in STRICT JSON only, no markdown:
{
  "dependencies": ["DFS", "Backtracking", "Dynamic Programming", "Segment Trees"]
}`);

    const depsData = JSON.parse(depsRaw.replace(/```json|```/g, "").trim());
    setOutput(2, `✓ ${depsData.dependencies.length} broken dependencies found`);
    setStep(2, "done");

    // ── STEP 3: Future Failure Simulator ──────────────────────────
    // NEW AGENT: picks the most impactful broken dependency,
    // simulates the student attempting it step-by-step,
    // shows exactly which step fails and why.
    setStep(3, "active");
    const simRaw = await callGemini(apiKey, `You are a Future Failure Simulator for students.
Subject: ${subject}
Skipped topics: ${skipped}
Broken dependencies: ${depsData.dependencies.join(", ")}

Pick the single most impactful topic from the broken dependencies.
Simulate a student ATTEMPTING that topic step-by-step.
Show exactly which step fails because of the missing prerequisite.

Respond in STRICT JSON only, no markdown:
{
  "targetTopic": "Dynamic Programming",
  "attemptSteps": [
    { "step": 1, "description": "Identify the recursive subproblem", "passed": true },
    { "step": 2, "description": "Build the recurrence relation", "passed": false }
  ],
  "failureReason": "Student lacks recursion fundamentals needed to decompose the problem.",
  "confidencePct": 88
}`);

    const simData = JSON.parse(simRaw.replace(/```json|```/g, "").trim());
    setOutput(3, `✓ Simulated failure at: ${simData.targetTopic}`);
    setStep(3, "done");

    // ── STEP 4: Consequence Predictor (was Step 3) ────────────────
    setStep(4, "active");
    const consRaw = await callGemini(apiKey, `You are an academic risk analyst.
Subject: ${subject}
Skipped: ${skipped}
Broken dependencies: ${depsData.dependencies.join(", ")}

Predict real-world consequences of this knowledge gap.
Respond in STRICT JSON only, no markdown:
{
  "interviewRisk": "High",
  "rootGap": "Recursion",
  "rootGapExplanation": "2 sentences on why this is the single most critical gap.",
  "examRisk": "Medium",
  "careerImpact": "One sentence on long-term career impact."
}`);

    const consData = JSON.parse(consRaw.replace(/```json|```/g, "").trim());
    setOutput(4, `✓ Interview risk: ${consData.interviewRisk}`);
    setStep(4, "done");

    // ── STEP 5: Recovery Planner ───────────────────────────────────
setStep(5, "active");
const planRaw = await callGemini(apiKey, `You are a study coach.
Subject: ${subject}
Root gap: ${consData.rootGap}
All skipped: ${skipped}
Recovery days: ${auditData.recoveryDays}

Create a ${Math.min(auditData.recoveryDays, 7)}-day recovery plan.
Each day must have exactly 2 resources only. Keep all text short.

Respond in STRICT JSON only, no markdown, no extra text:
{
  "plan": [
    {
      "day": 1,
      "topic": "Recursion basics",
      "action": "Watch 1 video, solve 2 problems",
      "resources": [
        { "type": "video", "title": "Recursion Crash Course", "source": "freeCodeCamp", "url": "https://youtube.com/watch?v=IJDJ0kBx2LM" },
        { "type": "problem", "title": "Climbing Stairs", "source": "LeetCode #70", "url": "https://leetcode.com/problems/climbing-stairs/" }
      ]
    }
  ]
}`);

const planData = JSON.parse(planRaw.replace(/```json|```/g, "").trim());
console.log("Plan day 1 resources:", planData.plan[0].resources);
setOutput(5, `✓ ${planData.plan.length}-day roadmap built`);
setStep(5, "done");

    // ── STEP 6: Quiz Generator (was Step 5) ───────────────────────
    setStep(6, "active");
    const quizRaw = await callGemini(apiKey, `You are a professor.
Root gap topic: ${consData.rootGap} in ${subject}

Create 1 multiple choice diagnostic question.
Respond in STRICT JSON only, no markdown:
{
  "question": "...",
  "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
  "answer": "A",
  "explanation": "..."
}`);

    const quizData = JSON.parse(quizRaw.replace(/```json|```/g, "").trim());
    setOutput(6, "✓ Diagnostic quiz ready");
    setStep(6, "done");

    // ── RENDER ─────────────────────────────────────────────────────
    renderResults(auditData, depsData, simData, consData, planData, quizData);

  } catch (err) {
    alert("Error: " + err.message);
    btn.disabled = false;
    document.getElementById("btn-text").textContent = "Analyze My Debt →";
  }
}

function renderResults(audit, deps, sim, cons, plan, quiz) {
  const results = document.getElementById("results");
  results.style.display = "flex";

  const riskColor = { High: "red", Medium: "amber", Low: "green" };
  const riskClass = riskColor[cons.interviewRisk] || "amber";

  // Build simulation steps HTML
  const simStepsHtml = sim.attemptSteps.map(s => `
    <div class="sim-step">
      <span class="sim-icon ${s.passed ? 'pass' : 'fail'}">${s.passed ? '✓' : '✗'}</span>
      <span class="sim-text ${s.passed ? 'pass' : 'fail'}">
        <strong>Step ${s.step}:</strong> ${s.description}
      </span>
    </div>
  `).join("");

  results.innerHTML = `

    <!-- SCORE ROW -->
    <div class="score-row">
      <div class="score-card">
        <div class="label">Knowledge Debt</div>
        <div class="value red">${audit.debtScore}<span style="font-size:1rem">/100</span></div>
        <div class="sublabel">Severity score</div>
      </div>
      <div class="score-card">
        <div class="label">Interview Risk</div>
        <div class="value ${riskClass}">${cons.interviewRisk}</div>
        <div class="sublabel">Predicted risk level</div>
      </div>
      <div class="score-card">
        <div class="label">Recovery Time</div>
        <div class="value amber">${audit.recoveryDays}<span style="font-size:1rem">d</span></div>
        <div class="sublabel">Estimated days</div>
      </div>
    </div>

    <!-- AUDIT SUMMARY -->
    <div class="result-card">
      <h3>Audit Summary</h3>
      <p>${audit.auditSummary}</p>
      <p style="margin-top:0.8rem"><strong style="color:#f0eeff">Root Gap:</strong> ${cons.rootGap}</p>
      <p style="margin-top:0.4rem">${cons.rootGapExplanation}</p>
      <p style="margin-top:0.8rem;font-size:0.85rem;color:var(--muted)">Career impact: ${cons.careerImpact}</p>
    </div>

    <!-- BROKEN DEPENDENCIES -->
    <div class="result-card">
      <h3>Critical Consequences — Topics You've Broken</h3>
      <div class="consequence-tags">
        ${deps.dependencies.map(d => `<span class="tag">${d}</span>`).join("")}
      </div>
    </div>

    <!-- FUTURE FAILURE SIMULATOR (NEW) -->
    <div class="result-card sim-card">
      <h3 class="sim-title">Future Failure Simulation</h3>
      <p class="sim-attempting">Attempting <strong>${sim.targetTopic}</strong>...</p>
      ${simStepsHtml}
      <div class="sim-reason-box">
        <div class="sim-reason-label">Failure reason</div>
        <div class="sim-reason-text">${sim.failureReason}</div>
      </div>
      <div class="sim-confidence">
        <span class="sim-conf-label">Confidence</span>
        <div class="sim-conf-bar">
          <div class="sim-conf-fill" id="sim-conf-fill" style="width:0%"></div>
        </div>
        <span class="sim-conf-val">${sim.confidencePct}%</span>
      </div>
    </div>

    <!-- RECOVERY PLAN -->
    <div class="result-card">
      <h3>Recovery Roadmap</h3>
      <ul class="plan-list">
  ${plan.plan.map(d => `
    <li class="plan-item">
      <div class="plan-header">
        <strong style="color:#f0eeff">Day ${d.day} — ${d.topic}</strong>
        <span class="plan-action">${d.action}</span>
      </div>
      <div class="plan-resources">
        ${(d.resources || []).map(r => `
          <a href="${r.url}" target="_blank" class="resource-link resource-${r.type}">
            <span class="resource-icon">${r.type === 'video' ? '▶' : r.type === 'problem' ? '⚡' : '📄'}</span>
            <span class="resource-body">
              <span class="resource-title">${r.title}</span>
              <span class="resource-source">${r.source}</span>
            </span>
          </a>
        `).join("")}
      </div>
    </li>
  `).join("")}
</ul>
    </div>

    <!-- QUIZ -->
    <div class="quiz-section" id="quiz-container">
      <h3>Diagnostic Quiz — Test Yourself Now</h3>
      <div class="quiz-q">${quiz.question}</div>
      <div class="quiz-options">
        ${quiz.options.map((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          return `<button class="quiz-opt" onclick="checkAnswer(this,'${letter}','${quiz.answer}')">${opt}</button>`;
        }).join("")}
      </div>
      <div class="quiz-explain" id="quiz-explain">${quiz.explanation}</div>
    </div>
  `;

  agentContext = {
    subject: document.getElementById("subject").value.trim(),
    rootGap: cons.rootGap,
    originalPlan: plan.plan
      .map(d => `Day ${d.day}: ${d.topic} - ${d.action}`)
      .join(", ")
  };

  // Animate confidence bar after render
  setTimeout(() => {
    const fill = document.getElementById("sim-conf-fill");
    if (fill) fill.style.width = sim.confidencePct + "%";
  }, 300);

  results.scrollIntoView({ behavior: "smooth" });
  const btn = document.getElementById("run-btn");
  btn.disabled = false;
  document.getElementById("btn-text").textContent = "Run Again →";
}

// Unchanged from your original
function checkAnswer(btn, selected, correct) {
  document.querySelectorAll(".quiz-opt").forEach(o => o.disabled = true);
  btn.classList.add(selected === correct ? "correct" : "wrong");
  document.querySelectorAll(".quiz-opt").forEach(o => {
    if (o.textContent.trim().charAt(0) === correct) o.classList.add("correct");
  });
  document.getElementById("quiz-explain").style.display = "block";
  runAdaptiveRecovery(selected === correct);
}

async function runAdaptiveRecovery(passed) {
  const apiKey = document.getElementById("apikey").value.trim();
  const adaptiveDiv = document.createElement("div");
  adaptiveDiv.className = "result-card";
  adaptiveDiv.innerHTML = `
    <h3>Step 7 — Adaptive Recovery Agent</h3>
    <p style="color:var(--muted)">Analyzing quiz performance and rebuilding roadmap...</p>
  `;
  document.getElementById("results").appendChild(adaptiveDiv);

  try {
    const prompt = `
You are an adaptive learning agent.
Subject: ${agentContext.subject}
Root Gap: ${agentContext.rootGap}
Original Plan: ${agentContext.originalPlan}
Quiz Result: ${passed ? "PASS" : "FAIL"}
${passed ? "Accelerate: remove easy steps, add harder practice." : "Simplify: revisit fundamentals, add extra exercises."}
Return STRICT JSON:
{
  "adjustment": "Accelerated",
  "verdict": "...",
  "reason": "...",
  "newPlan": [{"day":1,"topic":"...","action":"..."}]
}`;

    const raw = await callGemini(apiKey, prompt);
    const adapted = JSON.parse(raw.replace(/```json|```/g, "").trim());

    adaptiveDiv.innerHTML = `
      <h3>Step 7 — Adaptive Recovery Agent</h3>
      <div style="margin-bottom:1rem;color:var(--green);font-family:'DM Mono',monospace">${adapted.adjustment}</div>
      <p style="margin-bottom:0.8rem">${adapted.verdict}</p>
      <p style="margin-bottom:1rem;color:var(--muted)">${adapted.reason}</p>
      <ul>${adapted.newPlan.map(d => `<li><strong>Day ${d.day} — ${d.topic}</strong><br>${d.action}</li>`).join("")}</ul>
    `;
  } catch (err) {
    adaptiveDiv.innerHTML = `
      <h3>Step 7 — Adaptive Recovery Agent</h3>
      <p style="color:var(--accent2)">Failed to generate adaptive roadmap.</p>
    `;
    console.error(err);
  }
}