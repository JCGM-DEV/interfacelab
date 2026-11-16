import {
  BASE_CULTURA360_HTML,
  CSS_CHEATSHEET,
  DESIGN_TOKENS,
  MISSIONS,
  ORIGINAL_BROKEN_CSS
} from "./missions.js";

const STORAGE_KEY = "interfacelab_cultura360_v1";

// ============================================================================
// State Initialization & Persistence
// ============================================================================

function createInitialState() {
  const blanks = {};
  const blankStatuses = {};
  const completedMissions = {};
  const extraChallenges = {};

  for (const mission of MISSIONS) {
    completedMissions[mission.id] = Boolean(mission.defaultCompleted);
    for (const [blankId, spec] of Object.entries(mission.blanks)) {
      blanks[blankId] = spec.initial;
      blankStatuses[blankId] = "neutral";
    }
    if (mission.extraChallenge) {
      extraChallenges[mission.id] = mission.extraChallenge.initial || "";
    }
  }

  return {
    activeView: "lab",
    activeMissionId: "m2",
    activeTab: "css",
    editorMode: "guided",
    viewport: "desktop",
    previewVersion: "yours",
    blanks,
    blankStatuses,
    completedMissions,
    extraChallenges,
    freeCss: "",
    useFreeCss: false,
    customHtml: BASE_CULTURA360_HTML,
    notes: "",
    hintCursor: {}
  };
}

function loadState() {
  const fresh = createInitialState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fresh;
    const parsed = JSON.parse(raw);
    return {
      ...fresh,
      ...parsed,
      blanks: { ...fresh.blanks, ...(parsed.blanks || {}) },
      blankStatuses: { ...fresh.blankStatuses, ...(parsed.blankStatuses || {}) },
      completedMissions: { ...fresh.completedMissions, ...(parsed.completedMissions || {}) },
      extraChallenges: { ...fresh.extraChallenges, ...(parsed.extraChallenges || {}) },
      hintCursor: { ...(parsed.hintCursor || {}) }
    };
  } catch {
    return fresh;
  }
}

let state = loadState();
let iframeInitialized = false;
let lastIframeHtmlKey = "";

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const statusEl = document.getElementById("save-status-text");
    if (statusEl) {
      statusEl.textContent = "Guardado local";
    }
  } catch {
    // Ignore quota errors in restricted contexts
  }
}

// ============================================================================
// CSS Compilation Engine for Live Cultura360 Preview
// ============================================================================

function getActiveMission() {
  return MISSIONS.find((m) => m.id === state.activeMissionId) || MISSIONS[0];
}

function getActiveMissionIndex() {
  return MISSIONS.findIndex((m) => m.id === state.activeMissionId);
}

function compileMissionCss(mission, valueResolver) {
  const out = [];
  for (const line of mission.codeLines) {
    if (line.type === "comment") {
      out.push(line.text);
    } else if (line.type === "ruleStart") {
      out.push(`${line.selector} {`);
    } else if (line.type === "ruleEnd") {
      out.push("}");
    } else if (line.type === "mediaStart") {
      out.push(`${line.query} {`);
    } else if (line.type === "mediaEnd") {
      out.push("}");
    } else if (line.type === "propStatic") {
      out.push(`${" ".repeat(line.indent)}${line.prop}: ${line.val};`);
    } else if (line.type === "propBlank") {
      const val = String(valueResolver(line.blankId) || "").trim();
      if (val) {
        out.push(`${" ".repeat(line.indent)}${line.prop}: ${val};`);
      }
    }
  }
  return out.join("\n");
}

function buildBaselineSupportCss(upToIdx) {
  // Structural CSS so the artwork, active nav pill, and unedited sections render cleanly
  const support = [
    `.hero-media { width: 100%; height: 225px; border-radius: 12px; overflow: hidden; background: #0d1321; }`,
    `.hero-media svg { display: block; width: 100%; height: 100%; }`,
    `.site-header nav a { transition: background 0.15s ease, color 0.15s ease; }`,
    `.site-header nav a.is-active { background: #e8eef5; color: #0f172a; }`,
    `.search-panel h2 { margin: 0 0 10px; font-size: 16px; color: #0f172a; }`,
    `.search-field label { display: block; font-size: 11.5px; font-weight: 600; color: #475569; margin-bottom: 5px; }`,
    `.events-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; }`,
    `.events-header h2 { margin: 0; font-size: 16px; color: #0f172a; }`,
    `.events-count { font-size: 12px; color: #64748b; }`,
    `.event-card p { margin: 0; font-size: 12.5px; color: #475569; line-height: 1.45; }`
  ];

  // Provide clean baseline defaults for sections belonging to future missions not reached yet
  if (upToIdx < 2) {
    support.push(
      `.search-panel { padding: 14px 20px 18px; background: #ffffff; border-top: 1px solid #e2e8f0; }`,
      `.search-form { display: flex; align-items: flex-end; gap: 10px; }`,
      `.search-field { flex: 1; }`,
      `.search-input { width: 100%; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; }`,
      `.search-btn { padding: 9px 16px; border-radius: 8px; border: 1px solid #cbd5e1; background: #f8fafc; color: #0f172a; font-weight: 600; cursor: pointer; }`
    );
  }
  if (upToIdx < 3) {
    support.push(
      `.events-section { padding: 14px 20px 24px; background: #ffffff; border-radius: 0 0 14px 14px; }`,
      `.events-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; }`,
      `.event-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; }`
    );
  }
  if (upToIdx < 4) {
    support.push(
      `.event-tag { display: inline-block; font-size: 11px; font-weight: 700; color: #153b64; background: #dbeafe; padding: 2px 8px; border-radius: 999px; }`,
      `.event-card h3 { font-size: 15px; margin: 8px 0 5px; color: #0f172a; }`,
      `.event-meta { margin-top: 8px; font-size: 11.5px; color: #64748b; font-weight: 600; }`
    );
  }

  return support.join("\n");
}

function compileStylesheet(mode = "yours") {
  if (mode === "original") {
    return ORIGINAL_BROKEN_CSS;
  }

  if (mode === "yours" && state.useFreeCss && state.freeCss.trim().length > 0) {
    return state.freeCss;
  }

  const activeIdx = getActiveMissionIndex();
  const limitIdx = mode === "target" ? Math.max(activeIdx, 1) : Math.max(activeIdx, 1);

  const chunks = [buildBaselineSupportCss(limitIdx)];

  MISSIONS.forEach((mission, idx) => {
    // Compile missions up to the active one (plus any already completed later missions)
    const shouldInclude =
      mode === "target"
        ? idx <= activeIdx
        : idx <= activeIdx || state.completedMissions[mission.id];

    if (!shouldInclude) return;

    const resolver = (blankId) =>
      mode === "target" ? mission.blanks[blankId]?.ideal : state.blanks[blankId];

    chunks.push(compileMissionCss(mission, resolver));

    if (mode === "yours" && mission.extraChallenge && state.extraChallenges[mission.id]) {
      chunks.push(state.extraChallenges[mission.id]);
    } else if (mode === "target" && mission.extraChallenge) {
      chunks.push(mission.extraChallenge.initial);
    }
  });

  return chunks.join("\n\n");
}

// ============================================================================
// Live Iframe Preview Renderer
// ============================================================================

function injectCssIntoHtml(htmlDoc, cssText) {
  const styleTag = `<style id="interfacelab-live-css">\n${cssText}\n</style>`;
  if (htmlDoc.includes("</head>")) {
    return htmlDoc.replace("</head>", `${styleTag}\n</head>`);
  }
  return `${styleTag}\n${htmlDoc}`;
}

function renderPreview() {
  const iframe = document.getElementById("preview-iframe");
  const stage = document.getElementById("iframe-stage");
  if (!iframe || !stage) return;

  stage.classList.toggle("mobile-mode", state.viewport === "mobile");

  const css = compileStylesheet(state.previewVersion);
  const htmlBase = state.previewVersion === "original" ? BASE_CULTURA360_HTML : state.customHtml;

  // Update CSS in place without full reload if same HTML document is mounted
  if (iframeInitialized && lastIframeHtmlKey === htmlBase && iframe.contentDocument) {
    const liveStyle = iframe.contentDocument.getElementById("interfacelab-live-css");
    if (liveStyle) {
      liveStyle.textContent = css;
      return;
    }
  }

  lastIframeHtmlKey = htmlBase;
  iframeInitialized = true;
  iframe.srcdoc = injectCssIntoHtml(htmlBase, css);
}

// ============================================================================
// Sidebar, Progress & Navigation Rendering
// ============================================================================

function getCoreProgress() {
  const coreMissions = MISSIONS.filter((m) => m.isCore);
  const doneCount = coreMissions.filter((m) => state.completedMissions[m.id]).length;
  const finalDone = Boolean(state.completedMissions["m5"]);
  const pct = Math.round((doneCount / coreMissions.length) * 100);
  return { doneCount, totalCore: coreMissions.length, finalDone, pct };
}

function renderSidebar() {
  const missionList = document.getElementById("mission-list");
  if (missionList) {
    missionList.innerHTML = "";
    for (const m of MISSIONS) {
      const btn = document.createElement("button");
      btn.type = "button";
      const isDone = Boolean(state.completedMissions[m.id]);
      const isActive = state.activeMissionId === m.id && state.activeView === "lab";
      btn.className = `mission-item${isActive ? " active" : ""}${isDone ? " completed" : ""}`;
      btn.dataset.missionId = m.id;

      const numSpan = document.createElement("span");
      numSpan.className = "mission-num";
      numSpan.textContent = m.number;

      const titleSpan = document.createElement("span");
      titleSpan.textContent = m.shortTitle;

      btn.append(numSpan, titleSpan);

      if (isDone) {
        const check = document.createElement("span");
        check.className = "mission-status-icon";
        check.textContent = "✓";
        check.setAttribute("aria-label", "Completada");
        btn.appendChild(check);
      }

      btn.addEventListener("click", () => {
        state.activeMissionId = m.id;
        state.activeView = "lab";
        saveState();
        renderAll();
        closeMobileSidebar();
      });

      missionList.appendChild(btn);
    }
  }

  // Update progress indicators
  const { doneCount, totalCore, finalDone, pct } = getCoreProgress();
  const badgeEl = document.getElementById("sidebar-core-badge");
  const pctEl = document.getElementById("progress-percent");
  const capEl = document.getElementById("progress-caption");
  const fillEl = document.getElementById("progress-fill");

  if (badgeEl) badgeEl.textContent = `${doneCount}/${totalCore}`;
  if (pctEl) pctEl.textContent = `${pct}%`;
  if (capEl) {
    capEl.textContent = finalDone ? "Misiones + reto final" : "Misiones principales";
  }
  if (fillEl) fillEl.style.width = `${pct}%`;

  // Nav active states & breadcrumb
  document.querySelectorAll(".nav-item[data-view]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === state.activeView);
  });

  document.querySelectorAll(".view-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `view-${state.activeView}`);
  });

  const breadcrumb = document.getElementById("topbar-breadcrumb");
  if (breadcrumb) {
    const labels = {
      lab: "ÁREA DE DESARROLLO",
      brief: "BRIEF DEL CLIENTE",
      report: "INFORME DE ENTREGA"
    };
    breadcrumb.innerHTML = `MESA DE ESTUDIO / <strong>${labels[state.activeView] || "ÁREA DE DESARROLLO"}</strong>`;
  }
}

// ============================================================================
// Mission Content & Guided Code Editor Rendering
// ============================================================================

function countPendingBlanks(mission) {
  let pending = 0;
  for (const blankId of Object.keys(mission.blanks)) {
    const val = (state.blanks[blankId] || "").trim();
    if (!val) pending += 1;
  }
  return pending;
}

function updatePendingBanner(mission) {
  const pill = document.getElementById("pending-pill");
  if (!pill) return;

  if (state.activeTab === "html") {
    pill.className = "pending-pill complete";
    pill.textContent = "HTML semántico de Cultura360";
    return;
  }

  if (state.editorMode === "free") {
    pill.className = "pending-pill complete";
    pill.textContent = "Modo libre activo · edición directa CSS";
    return;
  }

  const pending = countPendingBlanks(mission);
  if (pending === 0) {
    pill.className = "pending-pill complete";
    pill.textContent = state.completedMissions[mission.id]
      ? "Misión validada · todos los valores completados"
      : "Huecos rellenos · pulsa «Comprobar solución»";
  } else {
    pill.className = "pending-pill";
    pill.textContent = `Código por completar: ${pending} ${pending === 1 ? "valor pendiente" : "valores pendientes"}`;
  }
}

function renderCriteriaList(mission) {
  const listEl = document.getElementById("criteria-list");
  if (!listEl) return;
  listEl.innerHTML = "";

  for (const crit of mission.criteria) {
    const allMet = crit.blankIds.every((id) => {
      const val = state.blanks[id] || "";
      return mission.blanks[id]?.validate(val);
    });

    const li = document.createElement("li");
    li.className = `criteria-item${allMet ? " met" : ""}`;

    const check = document.createElement("span");
    check.className = "criteria-check";
    check.textContent = allMet ? "✓" : "";

    const text = document.createElement("span");
    text.textContent = crit.label;

    li.append(check, text);
    listEl.appendChild(li);
  }
}

function computeBlankWidth(value) {
  const len = Math.max((value || "").length, 8);
  return `${Math.min(Math.max(len + 3, 10), 34)}ch`;
}

function renderGuidedCodeEditor(mission) {
  const container = document.getElementById("guided-code-container");
  const freeTextarea = document.getElementById("free-code-textarea");
  const labelEl = document.getElementById("code-file-label");
  const countEl = document.getElementById("code-line-count");
  const clearBtn = document.getElementById("clear-blanks-btn");

  if (!container || !freeTextarea) return;

  const isFree = state.editorMode === "free";
  const isHtml = state.activeTab === "html";

  if (clearBtn) {
    clearBtn.hidden = isFree || isHtml;
  }

  if (isHtml) {
    if (isFree) {
      container.hidden = true;
      freeTextarea.hidden = false;
      freeTextarea.value = state.customHtml;
      if (labelEl) labelEl.textContent = "index.html · editable";
      if (countEl) countEl.textContent = `${state.customHtml.split("\n").length} líneas`;
    } else {
      container.hidden = false;
      freeTextarea.hidden = true;
      container.innerHTML = "";
      const lines = state.customHtml.split("\n");
      lines.forEach((rawLine, idx) => {
        const row = document.createElement("div");
        row.className = "code-line";
        const num = document.createElement("span");
        num.className = "line-num";
        num.textContent = String(idx + 1);
        const code = document.createElement("span");
        code.className = "code-text tok-tag";
        code.textContent = rawLine;
        row.append(num, code);
        container.appendChild(row);
      });
      if (labelEl) labelEl.textContent = "index.html · lectura (pasa a Editor libre para modificar)";
      if (countEl) countEl.textContent = `${lines.length} líneas`;
    }
    return;
  }

  // CSS Tab
  if (isFree) {
    container.hidden = true;
    freeTextarea.hidden = false;
    if (!state.useFreeCss || !state.freeCss) {
      state.freeCss = compileStylesheet("yours");
    }
    freeTextarea.value = state.freeCss;
    if (labelEl) labelEl.textContent = "styles.css · modo libre";
    if (countEl) countEl.textContent = `${state.freeCss.split("\n").length} líneas`;
    return;
  }

  // Guided CSS Mode
  container.hidden = false;
  freeTextarea.hidden = true;
  container.innerHTML = "";

  let lineNumber = 1;
  let firstEmptyInput = null;

  for (const item of mission.codeLines) {
    const row = document.createElement("div");
    row.className = "code-line";

    const num = document.createElement("span");
    num.className = "line-num";
    num.textContent = String(lineNumber++);

    const content = document.createElement("span");
    content.className = "code-text";

    if (item.type === "comment") {
      content.classList.add("tok-comment");
      content.textContent = item.text;
    } else if (item.type === "ruleStart") {
      const sel = document.createElement("span");
      sel.className = "tok-sel";
      sel.textContent = item.selector;
      const brace = document.createElement("span");
      brace.className = "tok-punct";
      brace.textContent = " {";
      content.append(sel, brace);
    } else if (item.type === "ruleEnd" || item.type === "mediaEnd") {
      const brace = document.createElement("span");
      brace.className = "tok-punct";
      brace.textContent = "}";
      content.appendChild(brace);
    } else if (item.type === "mediaStart") {
      const sel = document.createElement("span");
      sel.className = "tok-sel";
      sel.textContent = item.query;
      const brace = document.createElement("span");
      brace.className = "tok-punct";
      brace.textContent = " {";
      content.append(sel, brace);
    } else if (item.type === "propStatic") {
      content.append(
        document.createTextNode(" ".repeat(item.indent)),
        createTokenSpan("tok-prop", item.prop),
        createTokenSpan("tok-punct", ": "),
        document.createTextNode(item.val),
        createTokenSpan("tok-punct", ";")
      );
    } else if (item.type === "propBlank") {
      const blankId = item.blankId;
      const val = state.blanks[blankId] || "";
      const status = state.blankStatuses[blankId] || "neutral";

      const input = document.createElement("input");
      input.type = "text";
      input.className = "code-blank-input";
      if (!val.trim()) input.classList.add("blank-empty");
      if (status === "valid") input.classList.add("blank-valid");
      if (status === "invalid") input.classList.add("blank-invalid");

      input.value = val;
      input.style.width = computeBlankWidth(val);
      input.dataset.blankId = blankId;
      input.placeholder = "valor CSS";
      input.setAttribute("aria-label", `Propiedad ${item.prop}`);

      if (!firstEmptyInput && !val.trim()) {
        firstEmptyInput = input;
      }

      input.addEventListener("input", (e) => {
        const nextVal = e.target.value;
        state.blanks[blankId] = nextVal;
        state.blankStatuses[blankId] = "neutral";
        state.useFreeCss = false;
        e.target.classList.remove("blank-valid", "blank-invalid");
        e.target.classList.toggle("blank-empty", !nextVal.trim());
        e.target.style.width = computeBlankWidth(nextVal);
        updatePendingBanner(mission);
        renderCriteriaList(mission);
        saveState();
        renderPreview();
      });

      input.addEventListener("focus", () => {
        highlightLearnProperty(item.prop);
      });

      content.append(
        document.createTextNode(" ".repeat(item.indent)),
        createTokenSpan("tok-prop", item.prop),
        createTokenSpan("tok-punct", ": "),
        input,
        createTokenSpan("tok-punct", ";")
      );
    }

    row.append(num, content);
    container.appendChild(row);
  }

  if (labelEl) labelEl.textContent = mission.fileLabel;
  if (countEl) countEl.textContent = `${mission.codeLines.length} líneas`;

  // Scroll the first pending input gently into view inside the code container
  if (firstEmptyInput) {
    requestAnimationFrame(() => {
      const offsetTop = firstEmptyInput.closest(".code-line")?.offsetTop || 0;
      if (offsetTop > container.clientHeight - 60) {
        container.scrollTop = Math.max(0, offsetTop - container.clientHeight / 2);
      }
    });
  }
}

function createTokenSpan(cls, text) {
  const span = document.createElement("span");
  span.className = cls;
  span.textContent = text;
  return span;
}

function highlightLearnProperty(propName) {
  document.querySelectorAll(".learn-item").forEach((el) => {
    const target = el.dataset.prop || "";
    el.classList.toggle("highlighted", target.includes(propName));
  });
}

function renderMissionPanel() {
  const mission = getActiveMission();

  document.getElementById("mission-phase-tag").textContent = mission.phaseTag;
  document.getElementById("mission-title").textContent = mission.title;
  document.getElementById("mission-subtitle").textContent = mission.subtitle;
  document.getElementById("client-quote").textContent = mission.clientQuote;
  document.getElementById("client-desc").textContent = mission.clientDesc;

  renderCriteriaList(mission);

  document.getElementById("roadmap-title").textContent = mission.roadmapTitle;
  const roadmapList = document.getElementById("roadmap-steps");
  roadmapList.innerHTML = "";
  for (const step of mission.roadmapSteps) {
    const li = document.createElement("li");
    li.textContent = step;
    roadmapList.appendChild(li);
  }

  const extraEl = document.getElementById("roadmap-extra");
  const extraBox = document.getElementById("extra-challenge-box");
  const extraInput = document.getElementById("extra-challenge-input");

  if (mission.extraChallenge) {
    extraEl.hidden = false;
    extraEl.innerHTML = "";
    const strong = document.createElement("strong");
    strong.textContent = "Reto extra opcional: ";
    extraEl.append(strong, document.createTextNode(mission.extraChallenge.label.replace(/^Reto extra opcional:\s*/i, "")));

    extraBox.hidden = false;
    extraInput.placeholder = mission.extraChallenge.placeholder;
    extraInput.value = state.extraChallenges[mission.id] ?? "";
  } else {
    extraEl.hidden = true;
    extraBox.hidden = true;
  }

  // Tabs & Mode Buttons
  document.getElementById("tab-css").classList.toggle("active", state.activeTab === "css");
  document.getElementById("tab-html").classList.toggle("active", state.activeTab === "html");
  document.getElementById("mode-guided-btn").classList.toggle("active", state.editorMode === "guided");
  document.getElementById("mode-free-btn").classList.toggle("active", state.editorMode === "free");

  const blankCount = Object.keys(mission.blanks).length;
  document.getElementById("editor-instruction").textContent =
    state.activeTab === "html"
      ? "Revisa la estructura HTML semántica de Cultura360 o pasa a Editor libre para añadir nuevas tarjetas."
      : `Completa las ${blankCount} decisiones CSS del nivel. Investiga propiedades y comprueba la vista previa: puedes proponer valores propios si funcionan.`;

  updatePendingBanner(mission);
  renderGuidedCodeEditor(mission);
  clearFeedback();

  // Learn While Coding
  const learnList = document.getElementById("learn-list");
  learnList.innerHTML = "";
  for (const item of mission.learnItems) {
    const box = document.createElement("div");
    box.className = "learn-item";
    box.dataset.prop = item.prop;

    const pTitle = document.createElement("div");
    pTitle.className = "learn-prop";
    pTitle.textContent = item.prop;

    const pDesc = document.createElement("p");
    pDesc.className = "learn-desc";
    pDesc.textContent = item.desc;

    box.append(pTitle, pDesc);
    learnList.appendChild(box);
  }

  // Mini-Experiment
  renderExperiment(mission.experiment);

  updatePreviewButtons();
}

function updatePreviewButtons() {
  document.getElementById("vp-desktop-btn")?.classList.toggle("active", state.viewport === "desktop");
  document.getElementById("vp-mobile-btn")?.classList.toggle("active", state.viewport === "mobile");
  document.getElementById("pv-yours-btn")?.classList.toggle("active", state.previewVersion === "yours");
  document.getElementById("pv-original-btn")?.classList.toggle("active", state.previewVersion === "original");
  document.getElementById("pv-target-btn")?.classList.toggle("active", state.previewVersion === "target");
}

function renderExperiment(exp) {
  document.getElementById("exp-title").textContent = exp.title;
  document.getElementById("exp-desc").textContent = exp.desc;
  document.getElementById("exp-label").textContent = exp.label;

  const slider = document.getElementById("exp-slider");
  slider.min = String(exp.min);
  slider.max = String(exp.max);
  slider.step = String(exp.step);
  slider.value = String(exp.initial);

  document.getElementById("exp-card-title").textContent = exp.cardTitle;
  document.getElementById("exp-card-text").textContent = exp.cardText;

  applyExperimentValue(exp, exp.initial);
}

function applyExperimentValue(exp, rawVal) {
  const valStr = `${rawVal}${exp.unit}`;
  document.getElementById("exp-value").textContent = valStr;

  const card = document.getElementById("exp-card-demo");
  const titleEl = document.getElementById("exp-card-title");

  // Reset experiment properties cleanly before applying the active one
  card.style.padding = "20px";
  card.style.maxWidth = "100%";
  card.style.borderRadius = "10px";
  titleEl.style.fontSize = "14px";

  if (exp.cssProp === "padding") {
    card.style.padding = valStr;
  } else if (exp.cssProp === "maxWidth") {
    card.style.maxWidth = valStr;
  } else if (exp.cssProp === "borderRadius") {
    card.style.borderRadius = valStr;
  } else if (exp.cssProp === "headingSize") {
    titleEl.style.fontSize = valStr;
  }
}

// ============================================================================
// Validation, Hints & Reset Logic
// ============================================================================

function showFeedback(type, htmlMsg) {
  const banner = document.getElementById("editor-feedback");
  if (!banner) return;
  banner.className = `feedback-banner visible ${type}`;
  banner.innerHTML = htmlMsg;
}

function clearFeedback() {
  const banner = document.getElementById("editor-feedback");
  if (!banner) return;
  banner.className = "feedback-banner";
  banner.innerHTML = "";
}

function checkCurrentMission() {
  const mission = getActiveMission();

  if (state.editorMode === "free" && state.useFreeCss) {
    const cssText = (state.freeCss || "").toLowerCase();
    const hasCoreRules = cssText.includes(".hero") && cssText.includes("font-size");
    if (hasCoreRules) {
      state.completedMissions[mission.id] = true;
      saveState();
      renderSidebar();
      showFeedback(
        "success",
        "<strong>Modo libre validado:</strong> tu hoja de estilos contiene reglas reales aplicadas en vivo sobre Cultura360."
      );
    } else {
      showFeedback(
        "warning",
        "<strong>Revisa tu CSS libre:</strong> asegúrate de incluir selectores clave como <code>.hero</code> y propiedades tipográficas."
      );
    }
    return;
  }

  const invalidProps = [];
  let firstBadInput = null;

  for (const [blankId, spec] of Object.entries(mission.blanks)) {
    const val = state.blanks[blankId] || "";
    const ok = spec.validate(val);
    state.blankStatuses[blankId] = ok ? "valid" : "invalid";

    const inputEl = document.querySelector(`.code-blank-input[data-blank-id="${blankId}"]`);
    if (inputEl) {
      inputEl.classList.remove("blank-valid", "blank-invalid", "blank-empty");
      inputEl.classList.add(ok ? "blank-valid" : "blank-invalid");
      if (!ok && !firstBadInput) {
        firstBadInput = inputEl;
      }
    }

    if (!ok) {
      invalidProps.push(spec.label);
    }
  }

  renderCriteriaList(mission);

  if (invalidProps.length === 0) {
    state.completedMissions[mission.id] = true;
    saveState();
    renderSidebar();
    updatePendingBanner(mission);

    const idx = getActiveMissionIndex();
    const nextMission = MISSIONS[idx + 1];
    if (nextMission) {
      showFeedback(
        "success",
        `<strong>¡Misión ${mission.number} superada!</strong> Todos los criterios de aceptación se cumplen. <button type="button" id="goto-next-mission" class="btn btn-secondary btn-sm" style="margin-left:8px;">Pasar a ${nextMission.number} ${nextMission.shortTitle} →</button>`
      );
      document.getElementById("goto-next-mission")?.addEventListener("click", () => {
        state.activeMissionId = nextMission.id;
        saveState();
        renderAll();
      });
    } else {
      showFeedback(
        "success",
        "<strong>¡Proyecto Cultura360 completado al 100%!</strong> Ya puedes revisar tu Informe de entrega y descargar tu trabajo."
      );
    }
  } else {
    state.completedMissions[mission.id] = false;
    saveState();
    renderSidebar();
    updatePendingBanner(mission);
    showFeedback(
      "warning",
      `<strong>Faltan ${invalidProps.length} ajustes por validar:</strong> revisa ${invalidProps
        .map((p) => `<code>${escapeHtml(p)}</code>`)
        .join(", ")}. Puedes pulsar <em>Pedir pista</em> si necesitas orientación.`
    );
    if (firstBadInput) {
      firstBadInput.focus();
    }
  }
}

function showNextHint() {
  const mission = getActiveMission();
  const entries = Object.entries(mission.blanks);
  const pendingOrInvalid = entries.filter(([id, spec]) => !spec.validate(state.blanks[id] || ""));
  const pool = pendingOrInvalid.length > 0 ? pendingOrInvalid : entries;

  const currentIdx = state.hintCursor[mission.id] || 0;
  const [blankId, spec] = pool[currentIdx % pool.length];
  state.hintCursor[mission.id] = (currentIdx + 1) % pool.length;
  saveState();

  showFeedback(
    "info",
    `<strong>Pista para <code>${escapeHtml(spec.label)}</code>:</strong> ${escapeHtml(spec.hint)} <button type="button" id="apply-ideal-hint" class="btn btn-secondary btn-sm" style="margin-left:8px;">Probar valor sugerido (${escapeHtml(spec.ideal)})</button>`
  );

  document.getElementById("apply-ideal-hint")?.addEventListener("click", () => {
    state.blanks[blankId] = spec.ideal;
    state.blankStatuses[blankId] = "neutral";
    state.useFreeCss = false;
    state.editorMode = "guided";
    state.activeTab = "css";
    saveState();
    renderMissionPanel();
    renderPreview();
  });
}

function restoreCurrentFragment() {
  const mission = getActiveMission();
  for (const [blankId, spec] of Object.entries(mission.blanks)) {
    state.blanks[blankId] = spec.initial;
    state.blankStatuses[blankId] = "neutral";
  }
  if (mission.extraChallenge) {
    state.extraChallenges[mission.id] = mission.extraChallenge.initial || "";
  }
  state.completedMissions[mission.id] = Boolean(mission.defaultCompleted);
  state.useFreeCss = false;
  if (state.activeTab === "html") {
    state.customHtml = BASE_CULTURA360_HTML;
  }
  saveState();
  renderAll();
  showFeedback("info", "Fragmento restaurado al estado inicial de la misión.");
}

function clearCurrentMissionBlanks() {
  const mission = getActiveMission();
  for (const blankId of Object.keys(mission.blanks)) {
    state.blanks[blankId] = "";
    state.blankStatuses[blankId] = "neutral";
  }
  state.completedMissions[mission.id] = false;
  state.useFreeCss = false;
  saveState();
  renderAll();
  showFeedback("info", "Todos los huecos de esta misión se han vaciado para practicar desde cero.");
}

function resetEntireLab() {
  state = createInitialState();
  iframeInitialized = false;
  saveState();
  renderAll();
}

// ============================================================================
// Brief & Report Views
// ============================================================================

function renderBriefView() {
  const grid = document.getElementById("swatch-grid");
  if (!grid) return;
  grid.innerHTML = "";

  for (const token of DESIGN_TOKENS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "swatch-btn";
    btn.innerHTML = `
      <span class="swatch-color" style="background:${token.hex}"></span>
      <span class="swatch-meta">
        <span class="swatch-name">${escapeHtml(token.name)}</span>
        <span class="swatch-hex">${escapeHtml(token.hex)}</span>
      </span>
    `;
    btn.title = token.role;
    btn.addEventListener("click", async () => {
      const toast = document.getElementById("copy-toast");
      try {
        await navigator.clipboard.writeText(token.hex);
        if (toast) toast.textContent = `Copiado ${token.hex} (${token.name}) al portapapeles.`;
      } catch {
        if (toast) toast.textContent = `Código: ${token.hex} — ${token.role}`;
      }
    });
    grid.appendChild(btn);
  }
}

function renderReportView() {
  const summaryGrid = document.getElementById("report-summary-grid");
  const tbody = document.getElementById("rubric-table-body");
  const notesEl = document.getElementById("student-notes-input");

  const { doneCount, totalCore, finalDone, pct } = getCoreProgress();

  let totalBlanks = 0;
  let validBlanks = 0;
  for (const m of MISSIONS) {
    for (const [bId, spec] of Object.entries(m.blanks)) {
      totalBlanks += 1;
      if (spec.validate(state.blanks[bId] || "")) validBlanks += 1;
    }
  }

  if (summaryGrid) {
    summaryGrid.innerHTML = `
      <div class="stat-card">
        <div class="stat-label">Progreso principal</div>
        <div class="stat-value" style="color: var(--accent-emerald);">${pct}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Misiones superadas</div>
        <div class="stat-value">${doneCount + (finalDone ? 1 : 0)} / ${MISSIONS.length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Decisiones CSS válidas</div>
        <div class="stat-value">${validBlanks} / ${totalBlanks}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Reto final</div>
        <div class="stat-value" style="font-size: 18px; margin-top: 10px;">${finalDone ? "Completado ✓" : "Pendiente"}</div>
      </div>
    `;
  }

  if (tbody) {
    tbody.innerHTML = "";
    for (const m of MISSIONS) {
      const mTotal = Object.keys(m.blanks).length;
      const mValid = Object.entries(m.blanks).filter(([id, spec]) => spec.validate(state.blanks[id] || "")).length;
      const isDone = Boolean(state.completedMissions[m.id]);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${m.number} · ${escapeHtml(m.shortTitle)}</strong><br><span style="color: var(--text-muted); font-size: 12px;">${escapeHtml(m.title)}</span></td>
        <td><span class="pill-badge ${isDone ? "pill-emerald" : "pill-amber"}">${isDone ? "Completada" : "En progreso"}</span></td>
        <td>${mValid} / ${mTotal} valores válidos</td>
        <td><button type="button" class="btn btn-secondary btn-sm" data-open-mission="${m.id}">Abrir misión</button></td>
      `;
      tr.querySelector("[data-open-mission]")?.addEventListener("click", () => {
        state.activeMissionId = m.id;
        state.activeView = "lab";
        saveState();
        renderAll();
      });
      tbody.appendChild(tr);
    }
  }

  if (notesEl) {
    notesEl.value = state.notes || "";
  }
}

// ============================================================================
// Cheatsheet Modal & Download ZIP Bundle
// ============================================================================

function renderCheatsheet(query = "") {
  const grid = document.getElementById("cheatsheet-grid");
  if (!grid) return;
  const q = query.trim().toLowerCase();

  const filtered = CSS_CHEATSHEET.filter(
    (item) =>
      !q ||
      item.category.toLowerCase().includes(q) ||
      item.prop.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q)
  );

  grid.innerHTML = "";
  for (const item of filtered) {
    const card = document.createElement("div");
    card.className = "cheat-card";
    card.innerHTML = `
      <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: 4px;">${escapeHtml(item.category)}</div>
      <h4>${escapeHtml(item.prop)}</h4>
      <p>${escapeHtml(item.desc)}</p>
      <code>${escapeHtml(item.example)}</code>
    `;
    grid.appendChild(card);
  }
}

// Lightweight uncompressed ZIP builder (zero dependencies)
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function buildZipBlob(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const dataBytes = encoder.encode(file.content);
    const crc = crc32(dataBytes);

    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0x0800, true); // UTF-8
    lv.setUint16(8, 0, true); // Store
    lv.setUint32(14, crc, true);
    lv.setUint32(18, dataBytes.length, true);
    lv.setUint32(22, dataBytes.length, true);
    lv.setUint16(26, nameBytes.length, true);
    localHeader.set(nameBytes, 30);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(centralHeader.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0x0800, true);
    cv.setUint16(10, 0, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, dataBytes.length, true);
    cv.setUint32(24, dataBytes.length, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint32(42, offset, true);
    centralHeader.set(nameBytes, 46);

    localParts.push(localHeader, dataBytes);
    centralParts.push(centralHeader);
    offset += localHeader.length + dataBytes.length;
  }

  const centralSize = centralParts.reduce((acc, arr) => acc + arr.length, 0);
  const endRecord = new Uint8Array(22);
  const ev = new DataView(endRecord.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, files.length, true);
  ev.setUint16(10, files.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true);

  return new Blob([...localParts, ...centralParts, endRecord], { type: "application/zip" });
}

function downloadStudentWork() {
  const compiledCss = compileStylesheet("yours");
  const linkedHtml = state.customHtml.includes("</head>")
    ? state.customHtml.replace("</head>", '  <link rel="stylesheet" href="styles.css" />\n</head>')
    : state.customHtml;

  const { doneCount, totalCore, finalDone, pct } = getCoreProgress();
  const reportLines = [
    "# Informe de entrega · Cultura360 (InterfaceLab 2.º DAW)",
    "",
    `- Progreso misiones principales: ${pct}% (${doneCount}/${totalCore})`,
    `- Reto final: ${finalDone ? "Completado" : "Pendiente"}`,
    `- Fecha de exportación: ${new Date().toLocaleString("es-ES")}`,
    "",
    "## Desglose por misión",
    ...MISSIONS.map((m) => {
      const mTotal = Object.keys(m.blanks).length;
      const mValid = Object.entries(m.blanks).filter(([id, spec]) => spec.validate(state.blanks[id] || "")).length;
      return `- ${m.number} ${m.shortTitle}: ${state.completedMissions[m.id] ? "Superada" : "En progreso"} (${mValid}/${mTotal} decisiones válidas)`;
    }),
    "",
    "## Notas del alumno/a",
    state.notes.trim() || "(Sin anotaciones)"
  ].join("\n");

  const zipBlob = buildZipBlob([
    { name: "cultura360/index.html", content: linkedHtml },
    { name: "cultura360/styles.css", content: compiledCss },
    { name: "cultura360/informe-entrega.md", content: reportLines }
  ]);

  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "cultura360-interfacelab.zip";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// ============================================================================
// Utilities & Event Binding
// ============================================================================

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function openModal(id) {
  document.getElementById(id)?.classList.add("open");
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove("open");
}

function closeMobileSidebar() {
  document.getElementById("sidebar")?.classList.remove("open");
}

function renderAll() {
  renderSidebar();
  if (state.activeView === "lab") {
    renderMissionPanel();
    renderPreview();
  } else if (state.activeView === "brief") {
    renderBriefView();
  } else if (state.activeView === "report") {
    renderReportView();
  }
}

function bindEvents() {
  // Workspace Navigation
  document.querySelectorAll(".nav-item[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeView = btn.dataset.view;
      saveState();
      renderAll();
      closeMobileSidebar();
    });
  });

  // Mobile Menu
  document.getElementById("mobile-menu-btn")?.addEventListener("click", () => {
    document.getElementById("sidebar")?.classList.toggle("open");
  });

  // File Tabs & Editor Mode
  document.getElementById("tab-css")?.addEventListener("click", () => {
    state.activeTab = "css";
    saveState();
    renderMissionPanel();
  });

  document.getElementById("tab-html")?.addEventListener("click", () => {
    state.activeTab = "html";
    saveState();
    renderMissionPanel();
  });

  document.getElementById("mode-guided-btn")?.addEventListener("click", () => {
    state.editorMode = "guided";
    state.useFreeCss = false;
    saveState();
    renderMissionPanel();
    renderPreview();
  });

  document.getElementById("mode-free-btn")?.addEventListener("click", () => {
    state.editorMode = "free";
    if (state.activeTab === "css") {
      state.freeCss = compileStylesheet("yours");
      state.useFreeCss = true;
    }
    saveState();
    renderMissionPanel();
    renderPreview();
  });

  // Free Editor Live Input
  document.getElementById("free-code-textarea")?.addEventListener("input", (e) => {
    const val = e.target.value;
    if (state.activeTab === "html") {
      state.customHtml = val;
    } else {
      state.freeCss = val;
      state.useFreeCss = true;
    }
    document.getElementById("code-line-count").textContent = `${val.split("\n").length} líneas`;
    saveState();
    renderPreview();
  });

  // Extra Challenge Input
  document.getElementById("extra-challenge-input")?.addEventListener("input", (e) => {
    state.extraChallenges[state.activeMissionId] = e.target.value;
    saveState();
    renderPreview();
  });

  // Editor Action Buttons
  document.getElementById("check-solution-btn")?.addEventListener("click", checkCurrentMission);
  document.getElementById("hint-btn")?.addEventListener("click", showNextHint);
  document.getElementById("restore-fragment-btn")?.addEventListener("click", restoreCurrentFragment);
  document.getElementById("clear-blanks-btn")?.addEventListener("click", clearCurrentMissionBlanks);

  // Preview Controls
  document.getElementById("vp-desktop-btn")?.addEventListener("click", () => {
    state.viewport = "desktop";
    saveState();
    updatePreviewButtons();
    renderPreview();
  });

  document.getElementById("vp-mobile-btn")?.addEventListener("click", () => {
    state.viewport = "mobile";
    saveState();
    updatePreviewButtons();
    renderPreview();
  });

  document.getElementById("pv-yours-btn")?.addEventListener("click", () => {
    state.previewVersion = "yours";
    saveState();
    updatePreviewButtons();
    renderPreview();
  });

  document.getElementById("pv-original-btn")?.addEventListener("click", () => {
    state.previewVersion = "original";
    saveState();
    updatePreviewButtons();
    renderPreview();
  });

  document.getElementById("pv-target-btn")?.addEventListener("click", () => {
    state.previewVersion = "target";
    saveState();
    updatePreviewButtons();
    renderPreview();
  });

  // Mini-Experiment Slider
  document.getElementById("exp-slider")?.addEventListener("input", (e) => {
    const mission = getActiveMission();
    applyExperimentValue(mission.experiment, e.target.value);
  });

  // Student Notes & Downloads & Reset
  document.getElementById("student-notes-input")?.addEventListener("input", (e) => {
    state.notes = e.target.value;
    saveState();
  });

  document.getElementById("download-work-btn")?.addEventListener("click", downloadStudentWork);
  document.getElementById("report-download-btn")?.addEventListener("click", downloadStudentWork);

  document.getElementById("reset-lab-btn")?.addEventListener("click", () => {
    resetEntireLab();
  });

  // Modals
  document.getElementById("open-cheatsheet-btn")?.addEventListener("click", () => {
    renderCheatsheet("");
    document.getElementById("css-search-input").value = "";
    openModal("cheatsheet-modal");
  });

  document.getElementById("open-howitworks-btn")?.addEventListener("click", () => {
    openModal("howitworks-modal");
  });

  document.getElementById("css-search-input")?.addEventListener("input", (e) => {
    renderCheatsheet(e.target.value);
  });

  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => closeModal(btn.dataset.closeModal));
  });

  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal("cheatsheet-modal");
      closeModal("howitworks-modal");
      closeMobileSidebar();
    }
  });
}

// Boot
bindEvents();
renderAll();
