/*
 * details.EAP/ui/app.js
 *
 * Client-side logic for the Employee Attrition Prediction demo.
 * Talks to the HF Space backend defined in ../backend/app.py.
 */

// TODO: replace with the public URL of your HF Space backend
const BACKEND_BASE = "https://YOUR-SPACE-USERNAME-HERE.hf.space";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const state = {
  modelReady: false,
  keyMode: "none",
  keyAvailable: false,
};

/* =========================================================
   Utilities
   ========================================================= */

function fetchJSON(url, options = {}) {
  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData) && options.body) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(url, {
    ...options,
    headers,
    body: options.body || undefined,
  }).then((res) => res.json());
}

function show(container, visible) {
  if (visible) {
    container.classList.remove("hidden");
  } else {
    container.classList.add("hidden");
  }
}

function hideAll(...containers) {
  containers.forEach((c) => {
    if (c) show(c, false);
  });
}

function setKeyStatus(message, kind = "muted") {
  const box = $("#keyStatusBox");
  box.textContent = message;
  box.className = "key-status " + kind;
}

/* =========================================================
   Backend status + key mode
   ========================================================= */

async function loadBackendStatus() {
  try {
    const status = await fetchJSON(BACKEND_BASE + "/status");
    state.modelReady = !!status.ready;
    renderKeyMode(status.key_mode, status.key_available);
    return status.ready;
  } catch (err) {
    console.warn("Backend status check failed:", err);
    return false;
  }
}

async function refreshKeyMode() {
  try {
    const res = await fetchJSON(BACKEND_BASE + "/key-mode");
    renderKeyMode(res.key_mode);
  } catch (err) {
    console.warn("Failed to read key mode:", err);
  }
}

function renderKeyMode(mode, keyAvailable) {
  state.keyMode = mode || "none";
  if (typeof keyAvailable === "boolean") {
    state.keyAvailable = keyAvailable;
  }

  // Suggest next step to the user.
  if (!state.keyAvailable) {
    setKeyStatus("Belum ada kunci Groq. Masukkan kunci Anda di atas untuk mengaktifkan Ringkasan HR.", "warn");
  } else if (state.keyMode === "custom") {
    setKeyStatus("Kunci Groq aktif. Ringkasan HR siap digunakan.", "ok");
  }
}

/* =========================================================
   Key toggle logic
   ========================================================= */

function wireKeyToggle() {
  const saveBtn = $("#saveCustomKeyBtn");
  const clearBtn = $("#clearCustomKeyBtn");

  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const input = $("#customKeyInput");
      const key = (input && input.value || "").trim();
      if (!key) {
        setKeyStatus("Masukkan kunci Groq API terlebih dahulu.", "warn");
        return;
      }
      try {
        await fetchJSON(BACKEND_BASE + "/set-key", {
          method: "POST",
          body: JSON.stringify({ groq_api_key: key }),
        });
        setKeyStatus("Kunci Groq disimpan. Backend akan menggunakannya sekarang.", "ok");
        state.keyAvailable = true;
        state.keyMode = "custom";
        input.value = "";
      } catch (err) {
        setKeyStatus("Gagal menyimpan kunci: " + (err?.detail || err), "error");
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", async () => {
      try {
        await fetchJSON(BACKEND_BASE + "/clear-key", { method: "POST" });
        setKeyStatus("Kunci dihapus. Masukkan kunci lagi untuk mengaktifkan Ringkasan HR.", "warn");
        state.keyAvailable = false;
        state.keyMode = "none";
      } catch (err) {
        setKeyStatus("Gagal menghapus kunci: " + (err?.detail || err), "error");
      }
    });
  }
}

/* =========================================================
   Training
   ========================================================= */

async function startTraining() {
  const btn = $("#trainBtn");
  const box = $("#trainStatusBox");
  if (!btn || !box) return;

  btn.disabled = true;
  btn.textContent = "Pelatihan berjalan…";
  show(box, true);
  box.textContent = "Memulai pelatihan…";
  box.className = "train-status";

  try {
    const res = await fetchJSON(BACKEND_BASE + "/train", {
      method: "POST",
      body: JSON.stringify({ force: true }),
    });

    if (res.status === "ok" || res.detail) {
      const msg = res.message || "Pelatihan selesai.";
      const metrics = [];
      if (typeof res.roc_auc === "number") metrics.push("ROC-AUC: " + res.roc_auc.toFixed(3));
      if (typeof res.recall_resign === "number") metrics.push("Recall(Resign): " + res.recall_resign.toFixed(3));
      if (typeof res.f1_resign === "number") metrics.push("F1(Resign): " + res.f1_resign.toFixed(3));
      box.textContent =
        "Model: " +
        (res.model || "LogisticRegression") +
        (metrics.length ? " · " + metrics.join(" · ") : "") +
        (res.detail ? " · " + res.detail : "") +
        (msg ? " · " + msg : "");
      box.className = "train-status ok";
      state.modelReady = true;
    } else {
      throw new Error(res.detail || "Training response tidak dikenal.");
    }
  } catch (err) {
    box.textContent = "Pelatihan gagal: " + (err?.detail || err);
    box.className = "train-status error";
    state.modelReady = false;
  } finally {
    btn.disabled = false;
    btn.textContent = "Mulai pelatihan";
  }
}

/* =========================================================
   Prediction + SHAP + narrative
   ========================================================= */

async function runPrediction() {
  hideAll($("#outputArea"), $("#errorBox"));
  const errorBox = $("#errorBox");

  if (!state.modelReady) {
    errorBox.textContent = "Model belum siap. Klik “Mulai pelatihan” terlebih dahulu.";
    show(errorBox, true);
    return;
  }

  const form = $("#employeeForm");
  if (!form) return;

  const formData = new FormData(form);
  const employee = {};
  for (const [key, value] of formData.entries()) {
    employee[key] = value;
  }

  for (const key of Object.keys(employee)) {
    if (employee[key] === "") {
      employee[key] = undefined;
    }
  }

  try {
    const pred = await fetchJSON(BACKEND_BASE + "/predict", {
      method: "POST",
      body: JSON.stringify({ employee }),
    });

    if (pred.detail) {
      throw new Error(pred.detail);
    }

    renderPrediction(pred);

    const narrativeWrap = $("#narrativeWrap");
    if (!state.keyAvailable) {
      // BYOK: without a user-supplied key, skip the Groq call entirely.
      if (narrativeWrap) {
        narrativeWrap.textContent =
          "[Ringkasan HR tidak tersedia. Masukkan kunci Groq API Anda di bagian atas halaman, lalu ulangi prediksi.]";
        show(narrativeWrap.closest(".section-block"), true);
      }
      return;
    }

    const narrative = await fetchJSON(BACKEND_BASE + "/narrative", {
      method: "POST",
      body: JSON.stringify({
        probability: pred.probability,
        top_factors: pred.top_factors,
        employee_info: {
          JobRole: employee.JobRole,
          Department: employee.Department,
          Age: employee.Age,
          YearsAtCompany: employee.YearsAtCompany,
          OverTime: employee.OverTime,
        },
      }),
    });

    if (narrativeWrap) {
      narrativeWrap.textContent = narrative.narrative || "[Tidak ada narasi.]";
      show(narrativeWrap.closest(".section-block"), true);
    }
  } catch (err) {
    errorBox.textContent = "Prediksi gagal: " + (err?.detail || err);
    show(errorBox, true);
  }
}

function renderPrediction(pred) {
  $("#resultLabel").textContent = pred.label || "—";
  $("#resultProbability").textContent = (pred.probability * 100).toFixed(1) + "%";
  $("#resultRiskTier").textContent = (pred.risk_tier || "").toUpperCase();
  $("#resultRiskTier").style.color = riskColor(pred.risk_tier);

  const shapWrap = $("#shapWrap");
  if (shapWrap) {
    shapWrap.innerHTML = "";
    renderSHAPBars(shapWrap, pred.top_factors || []);
    show(shapWrap.closest(".section-block"), true);
  }

  const explanationWrap = $("#explanationWrap");
  if (explanationWrap) {
    explanationWrap.textContent = explanationText(pred);
    show(explanationWrap.closest(".section-block"), true);
  }

  show($("#outputArea"), true);
}

function riskColor(tier) {
  if (!tier) return "var(--muted)";
  const t = String(tier).toUpperCase();
  if (t === "RENDAH") return "var(--good)";
  if (t === "SEDANG") return "var(--warn)";
  if (t === "TINGGI") return "var(--danger)";
  return "var(--muted)";
}

function explanationText(pred) {
  const p = pred.probability || 0;
  const tier = pred.risk_tier || "—";
  const factors = pred.top_factors || [];
  const top = factors.slice(0, 3);

  let factorText = "";
  if (top.length) {
    factorText = "\nFaktor paling dominan:\n" + top
      .map(
        (f) =>
          "- " +
          f.feature +
          " (" + f.contribution.toFixed(3) + ", " + f.direction + ")",
      )
      .join("\n");
  }

  return (
    "Probabilitas resign: " +
    (p * 100).toFixed(1) +
    "%\nKategori risiko: " +
    tier +
    "." +
    factorText +
    "\n\nSHAP menjelaskan kontribusi setiap fitur terhadap prediksi ini."
  );
}

function renderSHAPBars(container, factors) {
  if (!factors.length) {
    container.textContent = "Tidak ada faktor SHAP yang tersedia.";
    return;
  }

  const max = Math.max(...factors.map((f) => Math.abs(f.contribution)), 0.0001);

  factors.forEach((f) => {
    const abs = Math.abs(f.contribution);
    const pct = (abs / max) * 100;
    const bar = document.createElement("div");
    bar.className = "shap-bar";

    const feature = document.createElement("div");
    feature.className = "shapfeature";
    feature.textContent = f.feature;

    const track = document.createElement("div");
    track.className = "shap-track";

    const fill = document.createElement("div");
    fill.className = "shap-fill " + (f.contribution > 0 ? "pos" : "neg");
    fill.style.width = pct + "%";

    track.appendChild(fill);

    const value = document.createElement("div");
    value.className = "shap-value";
    value.textContent = f.contribution.toFixed(3);

    bar.appendChild(feature);
    bar.appendChild(track);
    bar.appendChild(value);
    container.appendChild(bar);
  });
}

/* =========================================================
   Init
   ========================================================= */

function init() {
  wireKeyToggle();

  const trainBtn = $("#trainBtn");
  if (trainBtn) {
    trainBtn.addEventListener("click", startTraining);
  }

  const predictBtn = $("#predictBtn");
  if (predictBtn) {
    predictBtn.addEventListener("click", runPrediction);
  }

  loadBackendStatus().then((ready) => {
    if (!ready) {
      const box = $("#trainStatusBox");
      if (box) {
        box.textContent = "Backend belum siap. Tekan “Mulai pelatihan” untuk menyusun model.";
        show(box, true);
        box.className = "train-status warn";
      }
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
