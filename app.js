/* ============================================================
   NOVES STORY BUILDER — app.js
   ============================================================ */

const DEFAULT_STATE = {
  ui: { activeSection: 'section1', showInstructions: false },
  section1: {
    headlineCustom: '',
    subheadingCustom: '',
    notes: '',
  },
  section2: {
    headlineIndex: 0,
    headlineCustom: '',
    subheadingIndex: 0,
    subheadingCustom: '',
    privateDataBubbles: ['canton-validator-ops', 'intraday-settlement', 'on-prem-ledgers'],
    publicDataBubbles:  ['rwa-holdings', 'ethereum-positions', 'token-transfers'],
    customPrivateBubbles: [],
    customPublicBubbles:  [],
    sentinelIndex: 3,
    sentinelCustomText: '',
    outputCategories: [
      { label: 'Finance',    desc: 'Reporting, reconciliation and position data' },
      { label: 'Regulator',  desc: 'Audit trail and regulatory outputs on demand' },
      { label: 'Operations', desc: 'Monitoring, alerts and traffic attribution' },
    ],
    notes: '',
  },
  section3: {
    headlineIndex: 0,
    headlineCustom: '',
    subheadingIndex: 0,
    subheadingCustom: '',
    showDarkStrip: true,
    customProofPoints: [],
    stageCustomLabels:  { access: '', translate: '', reconcile: '', report: '' },
    stageSubheadings:   { access: '', translate: '', reconcile: '', report: '' },
    notes: '',
  },
  section4: {
    headlineIndex: 0,
    headlineCustom: '',
    subheadingIndex: 0,
    subheadingCustom: '',
    selectedBlocks: [0, 1, 2],
    blockOrder: [0, 1, 2],
    customBlock: { label: '', copy: '' },
    includeCustomBlock: false,
    notes: '',
  },
};

// ─── STATE PERSISTENCE ───────────────────────────────────────

const STORAGE_KEY = 'noves-story-builder-v4';
let STATE = JSON.parse(JSON.stringify(DEFAULT_STATE));

function deepMerge(saved, defaults) {
  const result = JSON.parse(JSON.stringify(defaults));
  for (const key in saved) {
    if (!(key in result)) continue;
    if (saved[key] !== null && typeof saved[key] === 'object' && !Array.isArray(saved[key])) {
      result[key] = deepMerge(saved[key], result[key]);
    } else {
      result[key] = saved[key];
    }
  }
  return result;
}

function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE)); } catch (e) {} }

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) STATE = deepMerge(JSON.parse(saved), JSON.parse(JSON.stringify(DEFAULT_STATE)));
  } catch (e) { STATE = JSON.parse(JSON.stringify(DEFAULT_STATE)); }
}

function resetState() {
  if (!confirm('Reset all selections?')) return;
  localStorage.removeItem(STORAGE_KEY);
  STATE = JSON.parse(JSON.stringify(DEFAULT_STATE));
  render();
}

// ─── CONTENT GETTERS ─────────────────────────────────────────

function getHeadline1()    { return STATE.section1.headlineCustom   || DATA.section1.headline; }
function getSubheading1() { return STATE.section1.subheadingCustom || DATA.section1.subheading; }
function getHeadline2()   { return STATE.section2.headlineCustom  || DATA.section2.headlines[STATE.section2.headlineIndex]  || DATA.section2.headlines[0]; }
function getSubheading2() { return STATE.section2.subheadingCustom || DATA.section2.subheadings[STATE.section2.subheadingIndex] || DATA.section2.subheadings[0]; }
function getSentinelText(){ return STATE.section2.sentinelCustomText || DATA.section2.sentinelOptions[STATE.section2.sentinelIndex]?.label || 'Governed access'; }
function getHeadline3()   { return STATE.section3.headlineCustom  || DATA.section3.headlines[STATE.section3.headlineIndex]  || DATA.section3.headlines[0]; }
function getSubheading3() { return STATE.section3.subheadingCustom || DATA.section3.subheadings[STATE.section3.subheadingIndex] || DATA.section3.subheadings[0]; }
function getHeadline4()    { return STATE.section4.headlineCustom   || DATA.section4.headlines[STATE.section4.headlineIndex]   || DATA.section4.headlines[0]; }
function getSubheading4()  { return STATE.section4.subheadingCustom || DATA.section4.subheadings[STATE.section4.subheadingIndex] || DATA.section4.subheadings[0]; }

// ─── UTILS ───────────────────────────────────────────────────

function esc(str) {
  return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function notesBlock(text) {
  if (!text) return '';
  return `<div class="notes-block"><strong>Notes</strong> — ${esc(text)}</div>`;
}

// ─── LEFT PANEL (ACCORDION) ──────────────────────────────────

function renderLeftPanel() {
  const el = document.getElementById('left-panel');
  if (!el) return;
  const sections = [
    { key: 'section1', label: 'Section 1 — Hero',            bodyFn: renderSection1Body },
    { key: 'section2', label: 'Section 2 — This Is For You', bodyFn: renderSection2Body },
    { key: 'section3', label: 'Section 3 — In What Way',     bodyFn: renderSection3Body },
    { key: 'section4', label: 'Section 4 — Growth Story',    bodyFn: renderSection4Body },
  ];
  el.innerHTML = sections.map(({ key, label, bodyFn }) => {
    const open = STATE.ui.activeSection === key;
    return `
      <div class="acc-item">
        <div class="acc-header ${open?'open':''}" onclick="setActiveSection('${key}')">
          <span class="acc-chevron">${open?'▾':'▸'}</span>
          <span class="acc-label">${label}</span>
        </div>
        ${open ? `<div class="acc-body">${bodyFn()}</div>` : ''}
      </div>`;
  }).join('');
  wireLeftPanelInputs();
}

function renderSection1Body() {
  return `
    <div class="field-group">
      <div class="field-label">Headline <span class="locked-badge">Locked</span></div>
      <div class="preset-display" style="margin-bottom:6px;">${esc(DATA.section1.headline)}</div>
      <div class="write-your-own-wrap ${STATE.section1.headlineCustom?'active':''}">
        <div class="write-your-own-label">Write your own</div>
        <textarea class="text-input" id="s1-headline-custom" rows="2"
          placeholder="Alternative headline…" style="resize:vertical;">${esc(STATE.section1.headlineCustom)}</textarea>
      </div>
    </div>
    <div class="field-group">
      <div class="field-label">Subheading</div>
      <div class="preset-display" style="margin-bottom:6px;">${esc(DATA.section1.subheading)}</div>
      <div class="write-your-own-wrap ${STATE.section1.subheadingCustom?'active':''}">
        <div class="write-your-own-label">Write your own</div>
        <textarea class="text-input" id="s1-subheading-custom" rows="3"
          placeholder="Alternative subheading…" style="resize:vertical;">${esc(STATE.section1.subheadingCustom)}</textarea>
      </div>
    </div>
    <div class="field-group">
      <div class="field-label">Notes</div>
      <textarea class="text-input" id="s1-notes" rows="3"
        placeholder="What sounds right, what doesn't, what's missing…" style="resize:vertical;">${esc(STATE.section1.notes)}</textarea>
    </div>`;
}

function renderSection2Body() {
  const headlineCards = DATA.section2.headlines.map((h, i) => {
    const active = STATE.section2.headlineIndex === i && !STATE.section2.headlineCustom;
    return `<div class="option-card ${active?'active':''}" onclick="setS2Headline(${i})">${esc(h)}</div>`;
  }).join('');

  const subCards = DATA.section2.subheadings.map((s, i) => {
    const active = STATE.section2.subheadingIndex === i && !STATE.section2.subheadingCustom;
    return `<div class="option-card ${active?'active':''}" onclick="setS2Subheading(${i})">${esc(s)}</div>`;
  }).join('');

  const privateBubbles = DATA.section2.privateDataOptions.map(opt => {
    const sel = STATE.section2.privateDataBubbles.includes(opt.id);
    return `<label class="bubble-toggle ${sel?'selected':''}">
      <input type="checkbox" data-bubble-type="private" data-bubble-id="${opt.id}"
        ${sel?'checked':''} style="display:none;">${esc(opt.label)}</label>`;
  }).join('');
  const customPrivate = STATE.section2.customPrivateBubbles.map((b, i) =>
    `<span class="bubble-custom">${esc(b)}<button onclick="removeCustomBubble('private',${i})" class="bubble-remove">×</button></span>`
  ).join('');

  const publicBubbles = DATA.section2.publicDataOptions.map(opt => {
    const sel = STATE.section2.publicDataBubbles.includes(opt.id);
    return `<label class="bubble-toggle ${sel?'selected':''}">
      <input type="checkbox" data-bubble-type="public" data-bubble-id="${opt.id}"
        ${sel?'checked':''} style="display:none;">${esc(opt.label)}</label>`;
  }).join('');
  const customPublic = STATE.section2.customPublicBubbles.map((b, i) =>
    `<span class="bubble-custom">${esc(b)}<button onclick="removeCustomBubble('public',${i})" class="bubble-remove">×</button></span>`
  ).join('');

  const sentinelCards = DATA.section2.sentinelOptions.map(opt => {
    const active = STATE.section2.sentinelIndex === opt.id && !STATE.section2.sentinelCustomText;
    return `
      <div class="sentinel-card ${active?'active':''}" onclick="setSentinel(${opt.id})">
        <div class="sentinel-card-label">${esc(opt.label)}</div>
      </div>`;
  }).join('');

  const outputCats = STATE.section2.outputCategories.map((cat, i) => `
    <div class="output-cat-slot">
      <div class="field-label" style="margin-bottom:4px;">Category ${i+1}</div>
      <input type="text" class="text-input" data-output-cat="${i}" data-output-field="label"
        placeholder="e.g. Finance" value="${esc(cat.label)}" style="margin-bottom:4px;">
      <input type="text" class="text-input" data-output-cat="${i}" data-output-field="desc"
        placeholder="Subheading…" value="${esc(cat.desc)}">
    </div>`).join('');

  return `
    <div class="field-group">
      <div class="field-label">Headline</div>
      <div class="option-card-group">${headlineCards}</div>
      <div class="write-your-own-wrap ${STATE.section2.headlineCustom?'active':''}">
        <div class="write-your-own-label">Write your own headline</div>
        <input type="text" class="text-input" id="s2-headline-custom"
          placeholder="Write your headline…" value="${esc(STATE.section2.headlineCustom)}">
      </div>
    </div>

    <div class="field-group">
      <div class="field-label">Subheading</div>
      <div class="option-card-group">${subCards}</div>
      <div class="write-your-own-wrap ${STATE.section2.subheadingCustom?'active':''}">
        <div class="write-your-own-label">Write your own subheading</div>
        <textarea class="text-input" id="s2-subheading-custom" rows="3"
          placeholder="Write your subheading…" style="resize:vertical;">${esc(STATE.section2.subheadingCustom)}</textarea>
      </div>
    </div>

    <div class="field-group">
      <div class="field-label">Private data bubbles</div>
      <div class="bubble-picker">${privateBubbles}</div>
      ${customPrivate ? `<div class="custom-bubbles-row">${customPrivate}</div>` : ''}
      <div style="display:flex;gap:6px;margin-top:6px;">
        <input type="text" class="text-input" id="private-bubble-input" placeholder="Add your own…" style="flex:1;">
        <button onclick="addCustomBubble('private')" class="btn btn-secondary btn-sm">+ Add</button>
      </div>
    </div>

    <div class="field-group">
      <div class="field-label">Public data bubbles</div>
      <div class="bubble-picker">${publicBubbles}</div>
      ${customPublic ? `<div class="custom-bubbles-row">${customPublic}</div>` : ''}
      <div style="display:flex;gap:6px;margin-top:6px;">
        <input type="text" class="text-input" id="public-bubble-input" placeholder="Add your own…" style="flex:1;">
        <button onclick="addCustomBubble('public')" class="btn btn-secondary btn-sm">+ Add</button>
      </div>
    </div>

    <div class="field-group">
      <div class="field-label">Governance phrase <span style="font-size:0.65rem;font-weight:400;text-transform:none;letter-spacing:0;color:#9ca3af;">— shown in the Noves box</span></div>
      <div class="sentinel-card-group">${sentinelCards}</div>
      <div class="write-your-own-wrap ${STATE.section2.sentinelCustomText?'active':''}">
        <div class="write-your-own-label">Write your own phrase</div>
        <input type="text" class="text-input" id="sentinel-custom-input"
          placeholder="Type your phrase…" value="${esc(STATE.section2.sentinelCustomText)}">
      </div>
    </div>

    <div class="field-group">
      <div class="field-label">Output categories</div>
      <div style="font-size:0.7rem;color:#9ca3af;margin-bottom:8px;">The three boxes below the security boundary.</div>
      <div style="display:flex;flex-direction:column;gap:10px;">${outputCats}</div>
    </div>

    <div class="field-group">
      <div class="field-label">Notes</div>
      <textarea class="text-input" id="s2-notes" rows="3"
        placeholder="What sounds right, what doesn't…" style="resize:vertical;">${esc(STATE.section2.notes)}</textarea>
    </div>`;
}

function renderSection3Body() {
  const headlineCards = DATA.section3.headlines.map((h, i) => {
    const active = STATE.section3.headlineIndex === i && !STATE.section3.headlineCustom;
    return `<div class="option-card ${active?'active':''}" onclick="setS3Headline(${i})">${esc(h)}</div>`;
  }).join('');

  const subCards = DATA.section3.subheadings.map((s, i) => {
    const active = STATE.section3.subheadingIndex === i && !STATE.section3.subheadingCustom;
    return `<div class="option-card ${active?'active':''}" onclick="setS3Subheading(${i})">${esc(s)}</div>`;
  }).join('');

  const stageFields = DATA.section3.stages.map(st => `
    <div style="border:1px solid #e5e7eb;border-radius:8px;padding:10px 12px;margin-bottom:8px;">
      <div style="font-size:0.75rem;font-weight:600;color:#374151;margin-bottom:8px;">${st.label}</div>
      <div class="field-label" style="margin-bottom:3px;">Alternative label</div>
      <input type="text" class="text-input" data-stage-custom="${st.id}"
        placeholder="${esc(st.label)}"
        value="${esc(STATE.section3.stageCustomLabels[st.id])}"
        style="margin-bottom:8px;">
      <div class="field-label" style="margin-bottom:3px;">Subheading</div>
      <textarea class="text-input" data-stage-subheading="${st.id}" rows="2"
        placeholder="${esc(st.description)}"
        style="resize:vertical;">${esc(STATE.section3.stageSubheadings[st.id])}</textarea>
    </div>`).join('');

  const allProofPoints = [...DATA.section3.darkStripItems, ...STATE.section3.customProofPoints];
  const customProofPointsHtml = STATE.section3.customProofPoints.map((p, i) =>
    `<div style="display:flex;align-items:center;gap:6px;margin-top:4px;">
      <span style="font-size:0.73rem;color:#374151;">✓ ${esc(p)}</span>
      <button onclick="removeCustomProofPoint(${i})" class="bubble-remove">×</button>
    </div>`
  ).join('');

  return `
    <div class="field-group">
      <div class="field-label">Headline</div>
      <div class="option-card-group">${headlineCards}</div>
      <div class="write-your-own-wrap ${STATE.section3.headlineCustom?'active':''}">
        <div class="write-your-own-label">Write your own headline</div>
        <input type="text" class="text-input" id="s3-headline-custom"
          placeholder="Write your headline…" value="${esc(STATE.section3.headlineCustom)}">
      </div>
    </div>

    <div class="field-group">
      <div class="field-label">Subheading</div>
      <div class="option-card-group">${subCards}</div>
      <div class="write-your-own-wrap ${STATE.section3.subheadingCustom?'active':''}">
        <div class="write-your-own-label">Write your own subheading</div>
        <textarea class="text-input" id="s3-subheading-custom" rows="3"
          placeholder="Write your subheading…" style="resize:vertical;">${esc(STATE.section3.subheadingCustom)}</textarea>
      </div>
    </div>

    <div class="field-group">
      <div class="field-label">Pipeline stages</div>
      ${stageFields}
    </div>

    <div class="field-group">
      <label style="display:flex;align-items:flex-start;gap:8px;cursor:pointer;margin-bottom:8px;">
        <input type="checkbox" id="s3-dark-strip" ${STATE.section3.showDarkStrip?'checked':''}
          style="accent-color:#6366f1;margin-top:2px;flex-shrink:0;">
        <span style="font-size:0.78rem;color:#374151;font-weight:500;">Include proof-point strip</span>
      </label>
      ${STATE.section3.showDarkStrip ? `
        <div style="padding-left:4px;">
          ${DATA.section3.darkStripItems.map(p => `<div style="font-size:0.73rem;color:#6b7280;margin-bottom:3px;">✓ ${esc(p)}</div>`).join('')}
          ${customProofPointsHtml}
          <div style="display:flex;gap:6px;margin-top:8px;">
            <input type="text" class="text-input" id="proof-point-input" placeholder="Add proof point…" style="flex:1;">
            <button onclick="addCustomProofPoint()" class="btn btn-secondary btn-sm">+ Add</button>
          </div>
        </div>` : ''}
    </div>

    <div class="field-group">
      <div class="field-label">Notes</div>
      <textarea class="text-input" id="s3-notes" rows="3"
        placeholder="General notes on this section…" style="resize:vertical;">${esc(STATE.section3.notes)}</textarea>
    </div>`;
}

function renderSection4Body() {
  const headlineCards = DATA.section4.headlines.map((h, i) => {
    const active = STATE.section4.headlineIndex === i && !STATE.section4.headlineCustom;
    return `<div class="option-card ${active?'active':''}" onclick="setS4Headline(${i})">${esc(h)}</div>`;
  }).join('');

  const blockCheckboxes = DATA.section4.blocks.map(b => {
    const sel   = STATE.section4.selectedBlocks.includes(b.id);
    const atMax = STATE.section4.selectedBlocks.length >= 5 && !sel;
    return `
      <div class="checkbox-row ${atMax?'disabled':''}">
        <input type="checkbox" data-block-id="${b.id}"
          ${sel?'checked':''} ${atMax?'disabled':''}
          style="accent-color:#6366f1;margin-top:3px;flex-shrink:0;">
        <label style="cursor:pointer;font-size:0.78rem;color:#374151;">
          ${esc(b.label)}
          <span style="font-size:0.7rem;color:#9ca3af;display:block;margin-top:2px;">${esc(b.copy)}</span>
        </label>
      </div>`;
  }).join('');

  const subheadingCards = DATA.section4.subheadings.map((s, i) => {
    const active = STATE.section4.subheadingIndex === i && !STATE.section4.subheadingCustom;
    return `<div class="option-card ${active?'active':''}" onclick="setS4Subheading(${i})">${esc(s)}</div>`;
  }).join('');

  return `
    <div class="field-group">
      <div class="field-label">Headline</div>
      <div class="option-card-group">${headlineCards}</div>
      <div class="write-your-own-wrap ${STATE.section4.headlineCustom?'active':''}">
        <div class="write-your-own-label">Write your own headline</div>
        <input type="text" class="text-input" id="s4-headline-custom"
          placeholder="Write your headline…" value="${esc(STATE.section4.headlineCustom)}">
      </div>
    </div>

    <div class="field-group">
      <div class="field-label">Subheading</div>
      <div class="option-card-group">${subheadingCards}</div>
      <div class="write-your-own-wrap ${STATE.section4.subheadingCustom?'active':''}">
        <div class="write-your-own-label">Write your own subheading</div>
        <textarea class="text-input" id="s4-subheading-custom" rows="2"
          placeholder="Alternative subheading…" style="resize:vertical;">${esc(STATE.section4.subheadingCustom)}</textarea>
      </div>
    </div>

    <div class="field-group">
      <div class="field-label">Growth blocks <span style="font-weight:400;color:#9ca3af;text-transform:none;letter-spacing:0;">— select 3–5</span></div>
      ${STATE.section4.selectedBlocks.length > 5 ? '<div class="warn-text">Maximum 5 blocks.</div>' : ''}
      ${STATE.section4.selectedBlocks.length < 3 && STATE.section4.selectedBlocks.length > 0 ? '<div class="warn-text">Select at least 3.</div>' : ''}
      ${blockCheckboxes}

      <div style="margin-top:10px;border:1px dashed #d1d5db;border-radius:8px;padding:10px 12px;">
        <label style="display:flex;align-items:center;gap:8px;margin-bottom:6px;cursor:pointer;">
          <input type="checkbox" id="s4-custom-block-toggle"
            ${STATE.section4.includeCustomBlock?'checked':''}
            style="accent-color:#6366f1;">
          <span style="font-size:0.75rem;font-weight:500;color:#374151;">Add your own block</span>
        </label>
        ${STATE.section4.includeCustomBlock ? `
          <div style="margin-bottom:6px;">
            <div class="field-label" style="margin-bottom:3px;">Block label</div>
            <input type="text" class="text-input" id="s4-custom-label"
              placeholder="e.g. Treasury operations"
              value="${esc(STATE.section4.customBlock.label)}">
          </div>
          <div>
            <div class="field-label" style="margin-bottom:3px;">Block copy</div>
            <textarea class="text-input" id="s4-custom-copy" rows="2"
              placeholder="Write the outcome statement…"
              style="resize:vertical;">${esc(STATE.section4.customBlock.copy)}</textarea>
          </div>` : ''}
      </div>
    </div>

    <div class="field-group">
      <div class="field-label">Notes</div>
      <textarea class="text-input" id="s4-notes" rows="3"
        placeholder="General notes on this section…" style="resize:vertical;">${esc(STATE.section4.notes)}</textarea>
    </div>`;
}

// ─── WIRE LEFT PANEL INPUTS ───────────────────────────────────

function wireLeftPanelInputs() {
  const bind = (id, ev, fn) => { const el = document.getElementById(id); if (el) el.addEventListener(ev, fn); };

  bind('s1-headline-custom',   'input', e => { STATE.section1.headlineCustom   = e.target.value; saveState(); renderCanvas(); });
  bind('s1-subheading-custom', 'input', e => { STATE.section1.subheadingCustom = e.target.value; saveState(); renderCanvas(); });
  bind('s1-notes',             'input', e => { STATE.section1.notes            = e.target.value; saveState(); renderCanvas(); });

  bind('s2-headline-custom',   'input', e => { STATE.section2.headlineCustom    = e.target.value; saveState(); renderCanvas(); renderDecisionPanel(); });
  bind('s2-subheading-custom', 'input', e => { STATE.section2.subheadingCustom  = e.target.value; saveState(); renderCanvas(); });
  bind('sentinel-custom-input','input', e => { STATE.section2.sentinelCustomText = e.target.value; saveState(); renderCanvas(); renderDecisionPanel(); });
  bind('s2-notes',             'input', e => { STATE.section2.notes             = e.target.value; saveState(); renderCanvas(); });

  document.querySelectorAll('[data-bubble-type]').forEach(el => {
    el.addEventListener('change', e => {
      const type = e.target.dataset.bubbleType;
      const id   = e.target.dataset.bubbleId;
      const key  = type === 'private' ? 'privateDataBubbles' : 'publicDataBubbles';
      if (e.target.checked) { if (!STATE.section2[key].includes(id)) STATE.section2[key].push(id); }
      else { STATE.section2[key] = STATE.section2[key].filter(x => x !== id); }
      const label = e.target.closest('label');
      if (label) label.classList.toggle('selected', e.target.checked);
      saveState(); renderCanvas();
    });
  });

  document.querySelectorAll('[data-output-cat]').forEach(el => {
    el.addEventListener('input', e => {
      const idx = Number(e.target.dataset.outputCat);
      STATE.section2.outputCategories[idx][e.target.dataset.outputField] = e.target.value;
      saveState(); renderCanvas();
    });
  });

  bind('s3-headline-custom',   'input', e => { STATE.section3.headlineCustom   = e.target.value; saveState(); renderCanvas(); });
  bind('s3-subheading-custom', 'input', e => { STATE.section3.subheadingCustom = e.target.value; saveState(); renderCanvas(); });
  bind('s3-dark-strip',        'change',e => { STATE.section3.showDarkStrip = e.target.checked; saveState(); renderLeftPanel(); renderCanvas(); });
  bind('s3-notes',             'input', e => { STATE.section3.notes = e.target.value; saveState(); renderCanvas(); });

  document.querySelectorAll('[data-stage-custom]').forEach(el => {
    el.addEventListener('input', e => { STATE.section3.stageCustomLabels[e.target.dataset.stageCustom] = e.target.value; saveState(); renderCanvas(); });
  });
  document.querySelectorAll('[data-stage-subheading]').forEach(el => {
    el.addEventListener('input', e => { STATE.section3.stageSubheadings[e.target.dataset.stageSubheading] = e.target.value; saveState(); renderCanvas(); });
  });

  bind('s4-headline-custom',     'input', e => { STATE.section4.headlineCustom   = e.target.value; saveState(); renderCanvas(); renderDecisionPanel(); });
  bind('s4-subheading-custom',   'input', e => { STATE.section4.subheadingCustom = e.target.value; saveState(); renderLeftPanel(); renderCanvas(); });
  bind('s4-custom-block-toggle', 'change',e => { STATE.section4.includeCustomBlock = e.target.checked; saveState(); renderLeftPanel(); renderCanvas(); });
  bind('s4-custom-label',        'input', e => { STATE.section4.customBlock.label = e.target.value; saveState(); renderCanvas(); });
  bind('s4-custom-copy',         'input', e => { STATE.section4.customBlock.copy  = e.target.value; saveState(); renderCanvas(); });
  bind('s4-notes',               'input', e => { STATE.section4.notes = e.target.value; saveState(); renderCanvas(); });

  document.querySelectorAll('[data-block-id]').forEach(el => {
    el.addEventListener('change', e => {
      const id = Number(e.target.dataset.blockId);
      if (e.target.checked) {
        if (STATE.section4.selectedBlocks.length < 5) {
          STATE.section4.selectedBlocks.push(id); STATE.section4.blockOrder.push(id);
        } else { e.target.checked = false; return; }
      } else {
        STATE.section4.selectedBlocks = STATE.section4.selectedBlocks.filter(x => x !== id);
        STATE.section4.blockOrder     = STATE.section4.blockOrder.filter(x => x !== id);
      }
      saveState(); render();
    });
  });
}

// ─── CANVAS ──────────────────────────────────────────────────

function renderCanvas() {
  const el = document.getElementById('canvas');
  if (!el) return;
  el.innerHTML =
    renderCanvasSection1() +
    renderCanvasSection2() +
    renderCanvasSection3() +
    renderCanvasSection4();
  initSortable();
}

function renderCanvasSection1() {
  const subheading = getSubheading1();
  return `
    <div id="canvas-section1" class="cs-section cs-white" onclick="setActiveSection('section1')" style="cursor:pointer;">
      <div class="cs-section-tag">Section 1 — Hero</div>
      <div class="cs-center">
        <h1 class="cs-headline">${esc(getHeadline1())}</h1>
        <p class="cs-subheading">${esc(subheading)}</p>
        ${STATE.section1.notes ? `<div class="notes-block" style="text-align:left;max-width:560px;">${esc(STATE.section1.notes)}</div>` : ''}
      </div>
    </div>`;
}

function renderCanvasSection2() {
  const sentinel = getSentinelText();
  const cats     = STATE.section2.outputCategories;

  const allPrivate = [
    ...DATA.section2.privateDataOptions.filter(o => STATE.section2.privateDataBubbles.includes(o.id)).map(o => o.label),
    ...STATE.section2.customPrivateBubbles,
  ];
  const allPublic = [
    ...DATA.section2.publicDataOptions.filter(o => STATE.section2.publicDataBubbles.includes(o.id)).map(o => o.label),
    ...STATE.section2.customPublicBubbles,
  ];

  const bubbleRow = items => items.length
    ? items.map(l => `<span class="preview-bubble">${esc(l)}</span>`).join('')
    : '<span style="font-size:0.72rem;color:#9ca3af;font-style:italic;">None selected</span>';

  return `
    <div id="canvas-section2" class="cs-section cs-subtle" onclick="setActiveSection('section2')" style="cursor:pointer;">
      <div class="cs-section-tag">Section 2 — This Is For You</div>
      <div class="cs-center">
        <h2 class="cs-headline">${esc(getHeadline2())}</h2>
        <p class="cs-subheading">${esc(getSubheading2())}</p>

        <!-- Diagram -->
        <div class="s2-diagram">

          <!-- Row 1: Private + Public data boxes -->
          <div class="s2-data-row">
            <div class="s2-data-box">
              <div class="s2-data-label">● Private data</div>
              <div class="s2-bubbles">${bubbleRow(allPrivate)}</div>
            </div>
            <div class="s2-data-box">
              <div class="s2-data-label">● Public data</div>
              <div class="s2-bubbles">${bubbleRow(allPublic)}</div>
            </div>
          </div>

          <!-- Arrows from each data box down -->
          <div class="s2-connector-row">
            <div class="s2-arrow-cell">↓</div>
            <div class="s2-arrow-cell">↓</div>
          </div>

          <!-- Security boundary (dashed) -->
          <div class="s2-security-boundary">
            <div class="s2-boundary-label">Your security boundary</div>
            <div class="s2-noves-box">
              <div class="s2-noves-name">≋ Noves</div>
              <div class="s2-noves-phrase">${esc(sentinel)}</div>
            </div>
          </div>

          <!-- Arrow down to outputs -->
          <div class="s2-connector-single">↓</div>

          <!-- Authorised recipients -->
          <div class="s2-authorised">Authorised recipients only</div>

          <!-- Output categories -->
          <div class="s2-outputs">
            ${cats.map(cat => `
              <div class="s2-output-box">
                <div class="s2-output-label">
                  <span class="s2-output-dot"></span>
                  ${esc(cat.label) || '—'}
                </div>
                <div class="s2-output-desc">${esc(cat.desc)}</div>
              </div>`).join('')}
          </div>
        </div>

        ${STATE.section2.notes ? `<div class="notes-block" style="text-align:left;max-width:700px;margin-top:24px;">${esc(STATE.section2.notes)}</div>` : ''}
      </div>
    </div>`;
}

function renderCanvasSection3() {
  const allProofPoints = [...DATA.section3.darkStripItems, ...STATE.section3.customProofPoints];

  const stages = DATA.section3.stages.map(st => {
    const label = STATE.section3.stageCustomLabels[st.id] || st.label;
    const desc  = STATE.section3.stageSubheadings[st.id] || st.description;
    return `
      <div class="cs3-stage">
        <div class="cs3-stage-tag">${esc(label)}</div>
        <div class="cs3-stage-desc">${esc(desc)}</div>
      </div>`;
  }).join('');

  const darkStrip = STATE.section3.showDarkStrip ? `
    <div class="s3-dark-strip">
      ${allProofPoints.map(p => `<div class="s3-strip-item">✓ ${esc(p)}</div>`).join('')}
    </div>` : '';

  return `
    <div id="canvas-section3" class="cs-section cs-white" onclick="setActiveSection('section3')" style="cursor:pointer;">
      <div class="cs-section-tag">Section 3 — In What Way</div>
      <div class="cs-center">
        <h2 class="cs-headline">${esc(getHeadline3())}</h2>
        <p class="cs-subheading">${esc(getSubheading3())}</p>
        <div class="cs3-stages">${stages}</div>
        ${darkStrip}
        ${STATE.section3.notes ? `<div class="notes-block" style="text-align:left;max-width:700px;margin-top:24px;">${esc(STATE.section3.notes)}</div>` : ''}
      </div>
    </div>`;
}

function renderCanvasSection4() {
  const headline = getHeadline4();
  const orderedBlocks = STATE.section4.blockOrder.filter(id => STATE.section4.selectedBlocks.includes(id));

  const items = orderedBlocks.map(id => {
    const b = DATA.section4.blocks[id];
    return `
      <div class="cs4-block" data-block-id="${id}">
        <span class="drag-handle" title="Drag to reorder">⣿</span>
        <div style="flex:1;">
          <div class="cs4-block-label">${esc(b.label)}</div>
          <div class="cs4-block-copy">${esc(b.copy)}</div>
        </div>
      </div>`;
  }).join('');

  const customItem = (STATE.section4.includeCustomBlock && (STATE.section4.customBlock.copy || STATE.section4.customBlock.label)) ? `
    <div class="cs4-block" style="border-style:dashed;border-color:#a5b4fc;">
      <span class="drag-handle">⣿</span>
      <div style="flex:1;">
        <div class="cs4-block-label">${esc(STATE.section4.customBlock.label || 'Custom block')}</div>
        <div class="cs4-block-copy">${esc(STATE.section4.customBlock.copy) || '<em style="color:#9ca3af;">Add copy in left panel</em>'}</div>
      </div>
    </div>` : '';

  const empty = !items && !customItem
    ? '<div style="font-size:0.9rem;color:#9ca3af;text-align:center;padding:40px 0;">Select 3–5 growth blocks in the left panel.</div>'
    : '';

  return `
    <div id="canvas-section4" class="cs-section cs-subtle" onclick="setActiveSection('section4')" style="cursor:pointer;">
      <div class="cs-section-tag">Section 4 — Growth Story</div>
      <div class="cs-center">
        <h2 class="cs-headline">${esc(headline)}</h2>
        <p class="cs-subheading" style="margin-bottom:40px;">${esc(getSubheading4())}</p>
        <div id="section4-block-list" style="width:100%;max-width:640px;">
          ${empty}${items}${customItem}
        </div>
        ${STATE.section4.notes ? `<div class="notes-block" style="text-align:left;max-width:640px;margin-top:24px;">${esc(STATE.section4.notes)}</div>` : ''}
      </div>
    </div>`;
}

// ─── DECISION PANEL ──────────────────────────────────────────

function renderDecisionPanel() {
  const el = document.getElementById('decision-cards');
  if (!el) return;
  const fns = { section1: decisionsS1, section2: decisionsS2, section3: decisionsS3, section4: decisionsS4 };
  el.innerHTML = (fns[STATE.ui.activeSection] || decisionsS1)();
}

function decisionsS1() {
  return `
    <div class="decision-card" style="grid-column:span 4;">
      <h3>Section 1 — Hero</h3>
      <div style="font-size:0.9rem;font-weight:600;color:#111827;margin-bottom:6px;">${esc(DATA.section1.headline)}</div>
      <div style="font-size:0.8rem;color:#6b7280;margin-bottom:12px;">${esc(getSubheading1())}</div>
      ${STATE.section1.notes ? `<div style="font-size:0.78rem;color:#6b7280;font-style:italic;"><strong style="font-style:normal;">Notes:</strong> ${esc(STATE.section1.notes)}</div>` : '<div style="font-size:0.78rem;color:#9ca3af;">No notes yet.</div>'}
    </div>`;
}

function decisionsS2() {
  const d1 = `
    <div class="decision-card">
      <h3>Decision 1 — Headline</h3>
      <div class="decision-scroll">
        ${DATA.section2.headlines.map((h,i) => `
          <button class="decision-option ${STATE.section2.headlineIndex===i && !STATE.section2.headlineCustom ? 'active' : ''}"
            onclick="setS2Headline(${i})">${esc(h)}</button>`).join('')}
        ${STATE.section2.headlineCustom ? `<button class="decision-option active">Custom: "${esc(STATE.section2.headlineCustom)}"</button>` : ''}
      </div>
    </div>`;
  const d2 = `
    <div class="decision-card">
      <h3>Decision 2 — Governance phrase</h3>
      ${DATA.section2.sentinelOptions.map(opt => `
        <button class="decision-option ${STATE.section2.sentinelIndex===opt.id && !STATE.section2.sentinelCustomText ? 'active' : ''}"
          onclick="setSentinel(${opt.id})">${esc(opt.label)}</button>`).join('')}
      ${STATE.section2.sentinelCustomText ? `<button class="decision-option active">Custom: "${esc(STATE.section2.sentinelCustomText)}"</button>` : ''}
    </div>`;
  const d4 = `
    <div class="decision-card">
      <h3>Decision 4 — Output categories</h3>
      ${STATE.section2.outputCategories.map((cat, i) => `
        <div style="padding:5px 8px;border-radius:5px;font-size:0.76rem;color:#374151;margin-bottom:3px;background:#f9fafb;">
          <strong>${esc(cat.label)||'—'}</strong>
          <span style="color:#9ca3af;font-size:0.7rem;"> · ${esc(cat.desc)||'No subheading'}</span>
        </div>`).join('')}
    </div>`;
  return d1 + d2 + d4;
}

function decisionsS3() {
  const d1 = `
    <div class="decision-card" style="grid-column:span 2;">
      <h3>Decision 1 — Headline</h3>
      ${DATA.section3.headlines.map((h,i) => `
        <button class="decision-option ${STATE.section3.headlineIndex===i && !STATE.section3.headlineCustom ? 'active' : ''}"
          onclick="setS3Headline(${i})">${esc(h)}</button>`).join('')}
      ${STATE.section3.headlineCustom ? `<button class="decision-option active">Custom: "${esc(STATE.section3.headlineCustom)}"</button>` : ''}
    </div>`;
  const d2 = `
    <div class="decision-card" style="grid-column:span 2;">
      <h3>Decision 2 — Stages</h3>
      ${DATA.section3.stages.map(st => {
        const custom = STATE.section3.stageCustomLabels[st.id];
        const sub    = STATE.section3.stageSubheadings[st.id];
        return `<div style="padding:5px 8px;border-radius:5px;font-size:0.76rem;margin-bottom:3px;background:#f9fafb;">
          <strong>${esc(custom||st.label)}</strong>${custom ? ' <span style="color:#6366f1;font-size:0.65rem;">(edited)</span>' : ''}
          ${sub ? `<div style="font-size:0.68rem;color:#6b7280;">${esc(sub)}</div>` : ''}
        </div>`;
      }).join('')}
    </div>`;
  return d1 + d2;
}

function decisionsS4() {
  const orderedBlocks = STATE.section4.blockOrder.filter(id => STATE.section4.selectedBlocks.includes(id));
  const d1 = `
    <div class="decision-card" style="grid-column:span 2;">
      <h3>Decision 1 — Headline</h3>
      <div class="decision-scroll">
        ${DATA.section4.headlines.map((h,i) => `
          <button class="decision-option ${STATE.section4.headlineIndex===i && !STATE.section4.headlineCustom ? 'active' : ''}"
            onclick="setS4Headline(${i})">${esc(h)}</button>`).join('')}
        ${STATE.section4.headlineCustom ? `<button class="decision-option active">Custom: "${esc(STATE.section4.headlineCustom)}"</button>` : ''}
      </div>
    </div>`;
  const d2 = `
    <div class="decision-card" style="grid-column:span 2;">
      <h3>Decision 2 — Blocks selected (${orderedBlocks.length}/5)</h3>
      ${orderedBlocks.map((id, i) => {
        const b = DATA.section4.blocks[id];
        return `<div style="padding:4px 8px;border-radius:5px;font-size:0.73rem;color:#374151;margin-bottom:2px;background:#f9fafb;">
          <span style="color:#9ca3af;font-size:0.65rem;">${i+1}.</span> ${esc(b.label)}
        </div>`;
      }).join('')}
      ${orderedBlocks.length === 0 ? '<div style="font-size:0.73rem;color:#9ca3af;">No blocks selected.</div>' : ''}
    </div>`;
  return d1 + d2;
}

// ─── DRAG-AND-DROP ────────────────────────────────────────────

function initSortable() {
  const el = document.getElementById('section4-block-list');
  if (!el || el.querySelectorAll('[data-block-id]').length === 0) return;
  if (el._sortable) { el._sortable.destroy(); el._sortable = null; }
  el._sortable = new Sortable(el, {
    animation: 150, handle: '.drag-handle',
    ghostClass: 'sortable-ghost', chosenClass: 'sortable-chosen',
    onEnd() {
      STATE.section4.blockOrder = [...el.querySelectorAll('[data-block-id]')].map(x => Number(x.dataset.blockId));
      saveState();
    },
  });
}

// ─── ACTION HANDLERS ─────────────────────────────────────────

function setActiveSection(key) {
  STATE.ui.activeSection = key;
  saveState();
  renderLeftPanel();
  renderDecisionPanel();
  const target = document.getElementById('canvas-' + key);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setS2Headline(i)   { STATE.section2.headlineIndex   = i; STATE.section2.headlineCustom    = ''; saveState(); renderLeftPanel(); renderCanvas(); renderDecisionPanel(); }
function setS2Subheading(i) { STATE.section2.subheadingIndex  = i; STATE.section2.subheadingCustom  = ''; saveState(); renderLeftPanel(); renderCanvas(); }
function setSentinel(i)     { STATE.section2.sentinelIndex    = i; STATE.section2.sentinelCustomText = ''; saveState(); renderLeftPanel(); renderCanvas(); renderDecisionPanel(); }
function setS3Headline(i)   { STATE.section3.headlineIndex   = i; STATE.section3.headlineCustom    = ''; saveState(); renderLeftPanel(); renderCanvas(); renderDecisionPanel(); }
function setS3Subheading(i) { STATE.section3.subheadingIndex  = i; STATE.section3.subheadingCustom  = ''; saveState(); renderLeftPanel(); renderCanvas(); }
function setS4Headline(i)   { STATE.section4.headlineIndex   = i; STATE.section4.headlineCustom    = ''; saveState(); renderLeftPanel(); renderCanvas(); renderDecisionPanel(); }
function setS4Subheading(i) { STATE.section4.subheadingIndex  = i; STATE.section4.subheadingCustom  = ''; saveState(); renderLeftPanel(); renderCanvas(); }

function addCustomBubble(type) {
  const input = document.getElementById(type + '-bubble-input');
  if (!input || !input.value.trim()) return;
  const key = type === 'private' ? 'customPrivateBubbles' : 'customPublicBubbles';
  STATE.section2[key].push(input.value.trim()); input.value = '';
  saveState(); renderLeftPanel(); renderCanvas();
}
function removeCustomBubble(type, i) {
  const key = type === 'private' ? 'customPrivateBubbles' : 'customPublicBubbles';
  STATE.section2[key].splice(i, 1); saveState(); renderLeftPanel(); renderCanvas();
}
function addCustomProofPoint() {
  const input = document.getElementById('proof-point-input');
  if (!input || !input.value.trim()) return;
  STATE.section3.customProofPoints.push(input.value.trim()); input.value = '';
  saveState(); renderLeftPanel(); renderCanvas();
}
function removeCustomProofPoint(i) {
  STATE.section3.customProofPoints.splice(i, 1); saveState(); renderLeftPanel(); renderCanvas();
}

// ─── EXPORT (PDF via browser print) ──────────────────────────

function exportStory() {
  window.print();
}

// ─── ONBOARDING ───────────────────────────────────────────────

const ONBOARDING_KEY = 'noves-story-builder-onboarded';

function checkOnboarding() {
  if (!localStorage.getItem(ONBOARDING_KEY)) {
    document.getElementById('onboarding-overlay').style.display = 'flex';
  }
}

function dismissOnboarding() {
  localStorage.setItem(ONBOARDING_KEY, '1');
  document.getElementById('onboarding-overlay').style.display = 'none';
}

// ─── CONTEXTUAL HELP ──────────────────────────────────────────

const HELP_TIPS = {
  section1: {
    title: 'Section 1 — Hero',
    tip: 'The headline is locked. Use the left panel to write an alternative subheading, or leave a note for the designer about tone or direction.',
  },
  section2: {
    title: 'Section 2 — This Is For You',
    tip: 'Pick a headline and subheading from the presets, or write your own. Use the bubble pickers to choose which data types appear in each column. Select a governance phrase for the Noves box in the centre.',
  },
  section3: {
    title: 'Section 3 — In What Way',
    tip: 'Choose a headline variant. For each stage (Access → Report) you can set an alternative label and a subheading. Toggle the dark proof-point strip on or off, and add your own proof points.',
  },
  section4: {
    title: 'Section 4 — Growth Story',
    tip: 'Select 3–5 growth blocks from the left panel. Drag them on the canvas to set the order. You can also write a custom block if nothing in the list fits.',
  },
};

function renderHelpBar() {
  const el = document.getElementById('help-bar');
  const btn = document.getElementById('help-toggle-btn');
  if (!el) return;

  if (!STATE.ui.showInstructions) {
    el.style.display = 'none';
    if (btn) { btn.classList.remove('btn-help-active'); }
    return;
  }

  if (btn) { btn.classList.add('btn-help-active'); }
  const tip = HELP_TIPS[STATE.ui.activeSection] || HELP_TIPS.section1;
  el.style.display = 'flex';
  el.innerHTML = `
    <div class="help-bar">
      <span class="help-bar-icon">💡</span>
      <span class="help-bar-section">${esc(tip.title)}</span>
      <span class="help-bar-divider">·</span>
      <span class="help-bar-tip">${esc(tip.tip)}</span>
      <button class="help-bar-close" onclick="toggleHelp()" title="Close help">✕</button>
    </div>`;
}

function toggleHelp() {
  STATE.ui.showInstructions = !STATE.ui.showInstructions;
  saveState();
  renderHelpBar();
}

// ─── TOP-LEVEL RENDER ─────────────────────────────────────────

function render() { renderLeftPanel(); renderCanvas(); renderDecisionPanel(); renderHelpBar(); }

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  render();
  checkOnboarding();
});
