const opts = { matchWholeWords: true, preserveDisabled: true, autoSelective: true, useProbability: true };
let convertedData = null;

document.querySelectorAll('.option').forEach(el => {
  el.addEventListener('click', () => {
    const key = el.dataset.opt;
    opts[key] = !opts[key];
    el.classList.toggle('active', opts[key]);
  });
});

const pasteArea = document.getElementById('pasteArea');
const entryCountSpan = document.getElementById('entryCountNum');
const convertBtn = document.getElementById('convertBtn');

pasteArea.addEventListener('input', () => {
  const val = pasteArea.value.trim();
  if (!val) { setCount(0, false); convertBtn.disabled = true; return; }
  try {
    const data = JSON.parse(val);
    if (Array.isArray(data)) {
      setCount(data.length, true);
      convertBtn.disabled = data.length === 0;
    } else {
      setCount(0, false);
      convertBtn.disabled = true;
    }
  } catch {
    setCount(0, false);
    convertBtn.disabled = true;
  }
});

function setCount(n, valid) {
  entryCountSpan.textContent = n;
  entryCountSpan.style.color = valid ? 'var(--success)' : 'var(--error)';
}

document.getElementById('clearBtn').addEventListener('click', () => {
  pasteArea.value = '';
  setCount(0, false);
  convertBtn.disabled = true;
  document.getElementById('log').classList.remove('visible');
  document.getElementById('downloadBtn').classList.remove('visible');
  convertedData = null;
});

convertBtn.addEventListener('click', () => {
  let entries;
  try {
    entries = JSON.parse(pasteArea.value.trim());
    if (!Array.isArray(entries)) throw new Error();
  } catch {
    showLog([{ type: 'err', icon: '✗', msg: 'Invalid JSON — please check your input.' }]);
    return;
  }

  const filename = document.getElementById('filenameInput').value.trim() || 'lorebook_sillytavern';
  const lorebook = { name: filename, entries: {} };
  let skipped = 0, uid = 0;

  entries.forEach((entry, i) => {
    if (!opts.preserveDisabled && entry.enabled === false) { skipped++; return; }

    // Shorthand for the extensions block (may or may not exist)
    const ext = (entry.extensions && typeof entry.extensions === 'object') ? entry.extensions : {};

    // Secondary keys — used for selective logic
    const hasSecondary = Array.isArray(entry.keysecondary) && entry.keysecondary.length > 0;

    // comment: JanitorAI uses 'comment' as title in newer exports, 'name' in older ones
    const comment = entry.comment || entry.name || '';

    // order: top-level insertion_order wins; fallback to index-based spacing
    const order = entry.insertion_order ?? (i * 100);

    // position: top-level first, then extensions, default 0
    const position = entry.position ?? ext.position ?? 0;

    // disable: entry is disabled if enabled is explicitly false
    const disable = entry.enabled === false;

    // probability: top-level wins, extensions as fallback
    const probability = entry.probability ?? ext.probability ?? 100;

    // depth: top-level wins, extensions as fallback
    const depth = entry.depth ?? ext.depth ?? 4;

    // group fields: top-level wins, extensions as fallback
    const group = entry.group ?? ext.group ?? '';
    const groupOverride = entry.groupOverride ?? ext.group_override ?? false;
    const groupWeight = entry.groupWeight ?? ext.group_weight ?? 100;

    // scan depth: top-level wins, extensions as fallback
    const scanDepth = entry.scanDepth ?? ext.scan_depth ?? null;

    // matchWholeWords: top-level wins, extensions as fallback; option toggle can override to null
    const matchWholeWords = opts.matchWholeWords
      ? (entry.matchWholeWords ?? ext.match_whole_words ?? null)
      : null;

    // caseSensitive: ST uses null as default (not false)
    const caseSensitive = entry.case_sensitive ?? ext.case_sensitive ?? null;

    // role: top-level wins, extensions as fallback
    // JanitorAI uses 0 to mean "no role", ST uses null
    const rawRole = entry.role ?? ext.role ?? null;
    const role = rawRole === 0 ? null : rawRole;

    // automationId: extensions field maps to automation_id
    const automationId = entry.automationId ?? ext.automation_id ?? '';

    // recursion fields — only exist in extensions in JanitorAI
    const excludeRecursion = ext.exclude_recursion ?? false;
    const preventRecursion = ext.prevent_recursion ?? false;
    const delayUntilRecursion = ext.delay_until_recursion ?? false;

    // budget/sticky/cooldown/delay — only exist in extensions
    const ignoreBudget = ext.ignore_budget ?? false;
    const sticky = ext.sticky ?? 0;
    const cooldown = ext.cooldown ?? 0;
    const delay = ext.delay ?? 0;

    // match* fields — JanitorAI has these in extensions, default false
    const matchPersonaDescription = ext.match_persona_description ?? false;
    const matchCharacterDescription = ext.match_character_description ?? false;
    const matchCharacterPersonality = ext.match_character_personality ?? false;
    const matchCharacterDepthPrompt = ext.match_character_depth_prompt ?? false;
    const matchScenario = ext.match_scenario ?? false;
    const matchCreatorNotes = ext.match_creator_notes ?? false;

    lorebook.entries[String(uid)] = {
      uid,
      key: entry.key || [],
      keysecondary: entry.keysecondary || [],
      comment,
      content: entry.content || '',
      constant: entry.constant || false,
      vectorized: false,
      selective: opts.autoSelective ? hasSecondary : false,
      selectiveLogic: entry.selectiveLogic ?? ext.selectiveLogic ?? 0,
      addMemo: true,
      order,
      position,
      disable,
      ignoreBudget,
      excludeRecursion,
      preventRecursion,
      matchPersonaDescription,
      matchCharacterDescription,
      matchCharacterPersonality,
      matchCharacterDepthPrompt,
      matchScenario,
      matchCreatorNotes,
      delayUntilRecursion,
      probability,
      useProbability: opts.useProbability,
      depth,
      outletName: '',
      group,
      groupOverride,
      groupWeight,
      scanDepth,
      caseSensitive,
      matchWholeWords,
      useGroupScoring: null,
      automationId,
      role,
      sticky,
      cooldown,
      delay,
      triggers: [],
      displayIndex: uid,
      characterFilter: { isExclude: false, names: [], tags: [] }
    };
    uid++;
  });

  const total = Object.keys(lorebook.entries).length;
  const logs = [{ type: 'info', icon: '◆', msg: `Processing ${entries.length} entries...` }];
  if (skipped > 0) logs.push({ type: 'info', icon: '○', msg: `Skipped ${skipped} disabled entries.` });
  logs.push({ type: 'ok', icon: '✓', msg: `Converted ${total} entries successfully.` });

  convertedData = JSON.stringify(lorebook, null, 2);
  showLog(logs);
  document.getElementById('downloadBtn').classList.add('visible');
  triggerDownload();
});

document.getElementById('downloadBtn').addEventListener('click', triggerDownload);

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function triggerDownload() {
  if (!convertedData) return;
  const name = (document.getElementById('filenameInput').value.trim() || 'lorebook_sillytavern') + '.json';

  if (isIOS()) {
    // iOS Safari doesn't support blob downloads — open in new tab so user can use Share → Save to Files
    const blob = new Blob([convertedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    showLog([
      { type: 'ok', icon: '✓', msg: 'Opened in new tab.' },
      { type: 'info', icon: '◆', msg: 'Tap Share → Save to Files to save the JSON.' }
    ]);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    return;
  }

  const blob = new Blob([convertedData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function showLog(lines) {
  const log = document.getElementById('log');
  log.innerHTML = lines.map(l =>
    `<div class="log-line ${l.type}"><span class="log-icon">${l.icon}</span><span class="log-msg">${l.msg}</span></div>`
  ).join('');
  log.classList.add('visible');
}
