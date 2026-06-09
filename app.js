const patientName = document.querySelector("#patientName");
const reportType = document.querySelector("#reportType");
const reportText = document.querySelector("#reportText");
const reportUpload = document.querySelector("#reportUpload");
const explainButton = document.querySelector("#explainReport");
const sampleButton = document.querySelector("#loadSample");
const resetButton = document.querySelector("#resetApp");
const saveButton = document.querySelector("#saveExplanation");
const copyButton = document.querySelector("#copyExplanation");
const clearHistoryButton = document.querySelector("#clearHistory");
const inputStatus = document.querySelector("#inputStatus");
const savedCount = document.querySelector("#savedCount");
const termCount = document.querySelector("#termCount");
const complexityScore = document.querySelector("#complexityScore");
const concernCount = document.querySelector("#concernCount");
const readingLevel = document.querySelector("#readingLevel");
const simpleSummary = document.querySelector("#simpleSummary");
const termList = document.querySelector("#termList");
const concernList = document.querySelector("#concernList");
const questionList = document.querySelector("#questionList");
const historyList = document.querySelector("#historyList");
const toast = document.querySelector("#toast");

let currentExplanation = "";
let currentTerms = [];
let currentConcerns = [];
let history = JSON.parse(localStorage.getItem("mediscan-report-history") || "[]");

const glossary = [
  ["anemia", "A low red blood cell or hemoglobin level. It can cause tiredness, weakness, or shortness of breath."],
  ["hemoglobin", "A protein in red blood cells that carries oxygen around the body."],
  ["leukocytosis", "A higher than normal white blood cell count, often seen with infection, inflammation, stress, or some blood disorders."],
  ["thrombocytopenia", "A low platelet count. Platelets help blood clot, so low levels can increase bleeding risk."],
  ["creatinine", "A waste product measured in blood to estimate kidney function."],
  ["bilirubin", "A yellow pigment made when red blood cells break down. High levels can point to liver, bile duct, or blood problems."],
  ["cardiomegaly", "An enlarged heart shadow on imaging. It may need correlation with symptoms and other heart tests."],
  ["pleural effusion", "Extra fluid around the lungs. It can happen with infection, heart failure, inflammation, or other causes."],
  ["atelectasis", "Partial collapse or under-expansion of part of the lung."],
  ["consolidation", "A lung area filled with fluid, pus, blood, or cells instead of air. It is often mentioned with pneumonia."],
  ["lesion", "An abnormal area seen on a scan or tissue exam. It does not automatically mean cancer."],
  ["nodule", "A small rounded spot or lump. Doctors usually interpret it based on size, location, and risk factors."],
  ["edema", "Swelling caused by extra fluid in tissues."],
  ["stenosis", "Narrowing of a passage such as a blood vessel, spine canal, or valve."],
  ["ischemia", "Reduced blood flow to tissue, which can limit oxygen supply."],
  ["infarct", "Tissue damage caused by blocked blood supply."],
  ["benign", "Not cancerous."],
  ["malignant", "Cancerous or behaving like cancer."],
  ["metastasis", "Spread of cancer from one body area to another."],
  ["biopsy", "A small tissue sample taken for lab examination."],
  ["inflammation", "The body's response to irritation, infection, or injury. It can cause pain, swelling, heat, or abnormal lab values."],
  ["degenerative", "Wear-and-tear type change, often related to aging or long-term stress on joints or spine."],
  ["unremarkable", "No important abnormal finding was seen in that part of the report."],
  ["within normal limits", "The result is in the expected normal range."],
  ["negative for", "The report did not find evidence of the listed condition."],
  ["positive for", "The report found evidence of the listed condition or marker."],
];

const concernPatterns = [
  "high",
  "low",
  "elevated",
  "reduced",
  "abnormal",
  "positive",
  "suspicious",
  "malignant",
  "metastasis",
  "infarct",
  "ischemia",
  "effusion",
  "consolidation",
  "severe",
  "critical",
  "urgent",
  "follow-up",
  "follow up",
  "recommended",
];

const sampleReport = `CBC shows hemoglobin is low, suggesting mild anemia. White blood cell count is elevated with leukocytosis. Platelets are within normal limits.

Chest X-ray: Mild cardiomegaly is noted. No pleural effusion or pneumothorax. Patchy consolidation is seen in the right lower zone, suspicious for infection. Follow-up imaging is recommended after treatment.`;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

function splitSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function findTerms(text) {
  const lowerText = text.toLowerCase();
  return glossary
    .filter(([term]) => lowerText.includes(term))
    .map(([term, meaning]) => ({ term, meaning }));
}

function findConcerns(sentences) {
  return sentences.filter((sentence) => {
    const lowerSentence = sentence.toLowerCase();
    return concernPatterns.some((pattern) => lowerSentence.includes(pattern));
  });
}

function estimateReadingLevel(text, terms) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const longWords = words.filter((word) => word.replace(/[^a-z]/gi, "").length >= 11).length;
  const score = Math.min(100, Math.round((terms.length * 12) + (longWords / Math.max(words.length, 1)) * 100));

  if (score >= 55) return { label: "Hard", score };
  if (score >= 25) return { label: "Medium", score };
  return { label: "Easy", score };
}

function makeSummary(sentences, terms, concerns) {
  if (!sentences.length) return "No report text was found.";

  const normalLines = sentences.filter((sentence) => {
    const lowerSentence = sentence.toLowerCase();
    return lowerSentence.includes("normal") || lowerSentence.includes("unremarkable") || lowerSentence.includes("negative for");
  });

  const parts = [];
  parts.push(`This ${reportType.value.toLowerCase()} contains ${sentences.length} main statement${sentences.length === 1 ? "" : "s"}.`);

  if (terms.length) {
    parts.push(`It uses ${terms.length} medical term${terms.length === 1 ? "" : "s"} that may need explanation.`);
  }

  if (concerns.length) {
    parts.push(`${concerns.length} line${concerns.length === 1 ? "" : "s"} may need doctor review because they mention abnormal values, infection signs, follow-up, or concerning wording.`);
  } else {
    parts.push("No obvious warning wording was detected by this simple checker.");
  }

  if (normalLines.length) {
    parts.push("Some lines also say a result is normal or that a condition was not found.");
  }

  return parts.join(" ");
}

function makeQuestions(terms, concerns) {
  const questions = [
    "Which findings in this report are most important for me?",
    "Do any results need treatment, repeat testing, or follow-up imaging?",
    "Are these findings urgent, or can they wait for a routine appointment?",
  ];

  if (terms.some(({ term }) => ["lesion", "nodule", "malignant", "metastasis", "biopsy"].includes(term))) {
    questions.push("Does this finding need comparison with older reports or a biopsy?");
  }

  if (concerns.length) {
    questions.push("What symptoms should make me seek care quickly?");
  }

  return questions;
}

function renderResults() {
  const text = reportText.value.trim();

  if (!text) {
    showToast("Paste or upload a report first.");
    reportText.focus();
    return;
  }

  const sentences = splitSentences(text);
  currentTerms = findTerms(text);
  currentConcerns = findConcerns(sentences);
  const level = estimateReadingLevel(text, currentTerms);
  const summary = makeSummary(sentences, currentTerms, currentConcerns);
  const questions = makeQuestions(currentTerms, currentConcerns);

  termCount.textContent = currentTerms.length;
  complexityScore.textContent = `${level.score}%`;
  concernCount.textContent = currentConcerns.length;
  readingLevel.textContent = level.label;
  inputStatus.textContent = "Explained";

  simpleSummary.textContent = summary;

  termList.innerHTML = currentTerms.length
    ? currentTerms
        .map(
          ({ term, meaning }) => `
            <article class="term-card">
              <strong>${escapeHtml(term)}</strong>
              <span>${escapeHtml(meaning)}</span>
            </article>
          `
        )
        .join("")
    : '<p class="empty-state">No glossary terms were detected. You can still review the summary and questions.</p>';

  concernList.innerHTML = currentConcerns.length
    ? currentConcerns.map((sentence) => `<div class="concern">${escapeHtml(sentence)}</div>`).join("")
    : '<p class="empty-state">No obvious concern wording was detected by this simple checker.</p>';

  questionList.innerHTML = questions.map((question) => `<div class="question">${escapeHtml(question)}</div>`).join("");

  currentExplanation = [
    `Patient: ${patientName.value.trim() || "Not specified"}`,
    `Report type: ${reportType.value}`,
    "",
    "Simple summary:",
    summary,
    "",
    "Complex words explained:",
    ...(currentTerms.length ? currentTerms.map(({ term, meaning }) => `- ${term}: ${meaning}`) : ["- No glossary terms detected."]),
    "",
    "Important lines to discuss:",
    ...(currentConcerns.length ? currentConcerns.map((sentence) => `- ${sentence}`) : ["- No obvious concern wording detected."]),
    "",
    "Questions for doctor:",
    ...questions.map((question) => `- ${question}`),
  ].join("\n");

  showToast("Report explained.");
}

function updateHistory() {
  savedCount.textContent = history.length;

  if (!history.length) {
    historyList.innerHTML = '<p class="empty-state">Saved explanations will appear here.</p>';
    return;
  }

  historyList.innerHTML = history
    .map(
      (item) => `
        <article class="history-card">
          <strong>${escapeHtml(item.patient)}</strong>
          <span>${escapeHtml(item.type)} - ${escapeHtml(item.date)}</span>
          <span>${item.terms} terms, ${item.concerns} concerns</span>
        </article>
      `
    )
    .join("");
}

function persistHistory() {
  localStorage.setItem("mediscan-report-history", JSON.stringify(history));
  updateHistory();
}

reportUpload.addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;

  if (!file.type.includes("text") && !file.name.toLowerCase().endsWith(".txt")) {
    showToast("This version supports TXT report uploads. Paste text from PDF/image reports.");
    return;
  }

  reportText.value = await file.text();
  inputStatus.textContent = file.name;
  showToast("Report loaded.");
});

explainButton.addEventListener("click", renderResults);

sampleButton.addEventListener("click", () => {
  reportText.value = sampleReport;
  patientName.value = "Sample patient";
  reportType.value = "Radiology";
  inputStatus.textContent = "Sample";
  renderResults();
});

resetButton.addEventListener("click", () => {
  patientName.value = "";
  reportType.value = "Blood test";
  reportText.value = "";
  reportUpload.value = "";
  currentExplanation = "";
  currentTerms = [];
  currentConcerns = [];
  termCount.textContent = "0";
  complexityScore.textContent = "--";
  concernCount.textContent = "--";
  readingLevel.textContent = "--";
  inputStatus.textContent = "Ready";
  simpleSummary.textContent = "Add a report and click Explain Report.";
  termList.innerHTML = '<p class="empty-state">Medical terms found in the report will appear here.</p>';
  concernList.innerHTML = '<p class="empty-state">Possible abnormal or follow-up items will appear here.</p>';
  questionList.innerHTML = '<p class="empty-state">Suggested questions will appear here.</p>';
});

saveButton.addEventListener("click", () => {
  if (!currentExplanation) {
    renderResults();
  }

  if (!currentExplanation) return;

  history = [
    {
      patient: patientName.value.trim() || "Unnamed patient",
      type: reportType.value,
      date: new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" }),
      terms: currentTerms.length,
      concerns: currentConcerns.length,
    },
    ...history,
  ].slice(0, 8);

  persistHistory();
  showToast("Explanation saved.");
});

copyButton.addEventListener("click", async () => {
  if (!currentExplanation) {
    renderResults();
  }

  if (!currentExplanation) return;

  await navigator.clipboard.writeText(currentExplanation);
  showToast("Explanation copied.");
});

clearHistoryButton.addEventListener("click", () => {
  history = [];
  persistHistory();
  showToast("Recent reports cleared.");
});

updateHistory();
