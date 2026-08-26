// ============================================================================
// Weinbummel Thurgau – Weinquiz – App-Logik
// ============================================================================
(function () {
  "use strict";

  const LETTERS = ["A", "B", "C", "D"];
  const NAME_KEY = "weinbummel_last_name";
  const LOCAL_FINAL_KEY = "weinbummel_leaderboard_v2";
  const LOCAL_PROGRESS_KEY = "weinbummel_progress_v2";
  const MY_ENTRIES_KEY = "weinbummel_my_entries_v2";
  const QUESTIONS_PER_ROUND = 6;
  const TOTAL_ROUNDS = ROUNDS.length;

  let roundIndex = 0;          // 0..2
  let qIndexInRound = 0;       // 0..5
  let roundState = [];         // pro aktueller Runde: {optionOrder, selectedPos, correctPos, isCorrect, praiseText} oder null
  let roundScores = [0, 0, 0];
  let answered = false;
  let playerName = "";
  let playerId = "";
  let startTimeTotal = 0;
  let lastPraiseIdx = -1;

  // ---------------------------------------------------------------- helpers
  const $ = (id) => document.getElementById(id);
  const backendConfigured = () =>
    typeof APPS_SCRIPT_URL === "string" &&
    APPS_SCRIPT_URL.startsWith("http") &&
    !APPS_SCRIPT_URL.includes("DEINE_APPS_SCRIPT_URL");

  function genId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID().replace(/-/g, "").slice(0, 20);
    return "id" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  function shuffledIndexes(n) {
    const arr = Array.from({ length: n }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function pickPraise() {
    let idx;
    do { idx = Math.floor(Math.random() * PRAISE.length); } while (idx === lastPraiseIdx && PRAISE.length > 1);
    lastPraiseIdx = idx;
    return PRAISE[idx];
  }

  function showScreen(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    $(id).classList.add("active");
    document.body.classList.toggle("on-start", id === "screen-start");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------------------------------------------------------------- route pins
  function buildRoute() {
    const track = $("route-track");
    track.innerHTML = "";
    for (let i = 0; i < QUESTIONS_PER_ROUND; i++) {
      const pin = document.createElement("div");
      pin.className = "route-pin";
      pin.dataset.i = i;
      track.appendChild(pin);
    }
  }
  function updateRoute() {
    const pins = document.querySelectorAll(".route-pin");
    pins.forEach((pin, i) => {
      pin.classList.remove("current", "correct", "wrong");
      if (roundState[i] && roundState[i].isCorrect === true) pin.classList.add("correct");
      else if (roundState[i] && roundState[i].isCorrect === false) pin.classList.add("wrong");
      else if (i === qIndexInRound) pin.classList.add("current");
    });
    const currentPin = pins[qIndexInRound];
    if (currentPin) currentPin.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
  }

  // ---------------------------------------------------------------- name → start
  $("form-name").addEventListener("submit", (e) => {
    e.preventDefault();
    playerName = $("input-playername").value.trim();
    if (!playerName) return;
    localStorage.setItem(NAME_KEY, playerName);
    playerId = genId();
    startTimeTotal = Date.now();
    roundScores = [0, 0, 0];
    startRound(0);
  });

  // ---------------------------------------------------------------- round flow
  function startRound(idx) {
    roundIndex = idx;
    qIndexInRound = 0;
    roundState = new Array(QUESTIONS_PER_ROUND).fill(null);
    buildRoute();
    $("quiz-total").textContent = QUESTIONS_PER_ROUND;
    $("round-banner").textContent = `${ROUNDS[idx].title} von ${TOTAL_ROUNDS} · ${ROUNDS[idx].subtitle}`;
    showScreen("screen-quiz");
    renderQuestion();
  }

  function renderQuestion() {
    const q = ROUNDS[roundIndex].questions[qIndexInRound];
    const saved = roundState[qIndexInRound];

    $("quiz-index").textContent = qIndexInRound + 1;
    $("quiz-category").textContent = q.category;
    $("quiz-icon-use").setAttribute("href", "#icon-" + q.icon);
    $("quiz-question").textContent = q.question;
    $("progress-fill").style.width = Math.round((qIndexInRound / QUESTIONS_PER_ROUND) * 100) + "%";
    updateRoute();

    const optionOrder = saved ? saved.optionOrder : shuffledIndexes(q.options.length);
    const correctPos = saved ? saved.correctPos : optionOrder.indexOf(q.correct);

    const wrap = $("quiz-options");
    wrap.innerHTML = "";
    optionOrder.forEach((origIdx, pos) => {
      const btn = document.createElement("button");
      btn.className = "option";
      btn.innerHTML = `<span class="opt-letter">${LETTERS[pos]}</span><span>${escapeHtml(q.options[origIdx])}</span>`;
      if (saved) {
        btn.disabled = true;
        if (pos === correctPos) btn.classList.add("correct");
        else if (pos === saved.selectedPos) btn.classList.add("wrong");
        else btn.classList.add("dim");
      } else {
        btn.addEventListener("click", () => selectOption(pos, correctPos, optionOrder));
      }
      wrap.appendChild(btn);
    });

    $("praise-banner").classList.remove("show");
    $("quiz-explanation").classList.remove("show");
    $("quiz-explanation-text").textContent = q.explanation;

    const isLastOfRound = qIndexInRound === QUESTIONS_PER_ROUND - 1;
    const isLastRound = roundIndex === TOTAL_ROUNDS - 1;
    $("btn-next").textContent = isLastOfRound
      ? (isLastRound ? "Ergebnis ansehen →" : "Zwischenstand ansehen →")
      : "Weiter";
    $("btn-prev").disabled = qIndexInRound === 0;

    if (saved) {
      answered = true;
      if (saved.isCorrect) {
        $("praise-text").textContent = saved.praiseText;
        $("praise-banner").classList.add("show");
      }
      $("quiz-explanation").classList.add("show");
      $("btn-next").disabled = false;
    } else {
      answered = false;
      $("btn-next").disabled = true;
    }
  }

  function selectOption(pos, correctPos, optionOrder) {
    if (answered) return;
    answered = true;
    const isCorrect = pos === correctPos;
    const praiseText = isCorrect ? pickPraise() : null;
    roundState[qIndexInRound] = { optionOrder, selectedPos: pos, correctPos, isCorrect, praiseText };

    const buttons = Array.from(document.querySelectorAll(".option"));
    buttons.forEach((b, i) => {
      b.disabled = true;
      if (i === correctPos) b.classList.add("correct");
      else if (i === pos) b.classList.add("wrong");
      else b.classList.add("dim");
    });

    if (isCorrect) {
      $("praise-text").textContent = praiseText;
      $("praise-banner").classList.add("show");
      playCheers();
    }

    updateRoute();
    $("quiz-explanation").classList.add("show");
    $("btn-next").disabled = false;
    $("btn-next").focus();
  }

  function playCheers() {
    const pop = $("cheers-pop");
    const backdrop = $("cheers-backdrop");
    pop.classList.remove("play");
    backdrop.classList.remove("play");
    void pop.offsetWidth;
    pop.classList.add("play");
    backdrop.classList.add("play");
  }

  function nextQuestion() {
    if (!answered) return;
    qIndexInRound++;
    if (qIndexInRound < QUESTIONS_PER_ROUND) {
      renderQuestion();
      return;
    }
    // Runde fertig
    const roundScore = roundState.filter((s) => s && s.isCorrect).length;
    roundScores[roundIndex] = roundScore;
    $("progress-fill").style.width = "100%";

    if (roundIndex < TOTAL_ROUNDS - 1) {
      showInterim(roundIndex + 1); // 1-basiert: Teil 1 oder Teil 2 abgeschlossen
    } else {
      finishQuiz();
    }
  }
  $("btn-next").addEventListener("click", nextQuestion);

  function prevQuestion() {
    if (qIndexInRound === 0) return;
    qIndexInRound--;
    renderQuestion();
  }
  $("btn-prev").addEventListener("click", prevQuestion);

  // ---------------------------------------------------------------- interim / Zwischenstand
  async function showInterim(completedRound) {
    const totalSoFar = roundScores.slice(0, completedRound).reduce((a, b) => a + b, 0);
    const questionsSoFar = completedRound * QUESTIONS_PER_ROUND;
    const roundScore = roundScores[completedRound - 1];

    $("interim-title").textContent = `${ROUNDS[completedRound - 1].title} geschafft!`;
    $("interim-score-text").textContent =
      `Du hast ${roundScore} von ${QUESTIONS_PER_ROUND} richtig (gesamt ${totalSoFar} von ${questionsSoFar}).`;

    const btn = $("btn-interim-continue");
    btn.textContent = `Weiter zu ${ROUNDS[completedRound].title}`;
    btn.onclick = () => startRound(completedRound);

    showScreen("screen-interim");

    await submitCheckpoint(completedRound, totalSoFar, questionsSoFar);
    await renderInterimList(completedRound);
  }

  async function submitCheckpoint(round, score, total) {
    const entry = { name: playerName, playerId, round, score, total, timeMs: Date.now() - startTimeTotal };
    // lokal spiegeln
    const all = JSON.parse(localStorage.getItem(LOCAL_PROGRESS_KEY) || "{}");
    all[round] = (all[round] || []).filter((e) => e.playerId !== playerId);
    all[round].push(entry);
    localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(all));

    if (!backendConfigured()) return;
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "checkpoint", ...entry }),
      });
    } catch (err) {
      console.warn("Checkpoint konnte nicht gesendet werden, nutze lokalen Stand.", err);
    }
  }

  async function renderInterimList(round) {
    const listEl = $("interim-list");
    const partEl = $("interim-participants");
    listEl.innerHTML = '<p class="leaderboard-loading">Zwischenrangliste wird geladen …</p>';

    let data = null;
    if (backendConfigured()) {
      try {
        const res = await fetch(`${APPS_SCRIPT_URL}?type=progress&round=${round}`);
        if (res.ok) data = await res.json();
      } catch (err) {
        console.warn("Zwischenrangliste nicht erreichbar, nutze lokalen Stand.", err);
      }
    }
    if (!data) {
      const all = JSON.parse(localStorage.getItem(LOCAL_PROGRESS_KEY) || "{}");
      const entries = (all[round] || []).slice().sort((a, b) => b.score - a.score || a.timeMs - b.timeMs);
      data = { round, participantCount: entries.length, entries };
    }

    partEl.textContent = data.participantCount === 1
      ? `1 Person hat ${ROUNDS[round - 1].title} bereits gespielt.`
      : `${data.participantCount} Personen haben ${ROUNDS[round - 1].title} bereits gespielt.`;

    listEl.innerHTML = "";
    if (!data.entries || !data.entries.length) {
      listEl.innerHTML = '<p class="leaderboard-loading">Noch keine weiteren Zwischenstände – du bist die/der Erste!</p>';
      return;
    }
    data.entries.slice(0, 8).forEach((en, i) => {
      const row = document.createElement("div");
      const isMe = en.playerId === playerId;
      row.className = "lb-row" + (isMe ? " me" : "");
      row.style.animationDelay = i * 0.05 + "s";
      row.innerHTML = `
        <span class="lb-rank">${i + 1}</span>
        <span class="lb-name">${escapeHtml(en.name || "Anonym")}</span>
        <span class="lb-score">${en.score}/${en.total}</span>
      `;
      listEl.appendChild(row);
    });
  }

  // ---------------------------------------------------------------- Abschluss
  async function finishQuiz() {
    const totalScore = roundScores.reduce((a, b) => a + b, 0);
    const totalQuestions = QUESTIONS_PER_ROUND * TOTAL_ROUNDS;
    const timeMs = Date.now() - startTimeTotal;
    const pct = totalScore / totalQuestions;

    let title, text;
    if (pct === 1) {
      title = "Staatswein-Champion";
      text = "Volle Punktzahl! Du kennst den Thurgau besser als so mancher Rebbewirtschafter. Zeit für einen Ottenberg Pinot Noir.";
    } else if (pct >= 0.78) {
      title = "Thurgauer Weinexpert:in";
      text = "Sehr stark! Ottenberg, Iselisberg und Müller-Thurgau haben für dich keine Geheimnisse mehr.";
    } else if (pct >= 0.5) {
      title = "Ottenberg-Kenner:in";
      text = "Solides Wissen! Mit ein bisschen mehr Bummeln durch die sechs Anbaugebiete holst du dir locker die Krone.";
    } else if (pct >= 0.25) {
      title = "Rebstock-Spaziergänger:in";
      text = "Ein guter Start! Der Thurgau hat noch einiges zu erzählen – Zeit für eine zweite Runde?";
    } else {
      title = "Mostindien-Neuling";
      text = "Willkommen im Thurgau! Nach diesem Bummel weisst du schon deutlich mehr als vorher – nochmals versuchen?";
    }

    $("result-score").textContent = totalScore;
    document.querySelector(".badge-slash").textContent = "/" + totalQuestions;
    document.querySelector(".badge-ring").style.setProperty("--pct", Math.round(pct * 100) + "%");
    $("result-title").textContent = title;
    $("result-text").textContent = text;
    $("save-hint").textContent = "Wird gespeichert …";

    if (pct >= 0.5) launchConfetti();
    showScreen("screen-result");

    await submitFinal(totalScore, totalQuestions, timeMs);
  }

  async function submitFinal(score, total, timeMs) {
    const entryId = playerId;
    const entry = { name: playerName, entryId, score, total, timeMs };

    const list = JSON.parse(localStorage.getItem(LOCAL_FINAL_KEY) || "[]");
    list.push(entry);
    localStorage.setItem(LOCAL_FINAL_KEY, JSON.stringify(list));

    const mine = JSON.parse(localStorage.getItem(MY_ENTRIES_KEY) || "[]");
    mine.push(entryId);
    localStorage.setItem(MY_ENTRIES_KEY, JSON.stringify(mine));

    if (backendConfigured()) {
      try {
        await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ action: "final", ...entry }),
        });
      } catch (err) {
        console.warn("Ergebnis konnte nicht ans Backend gesendet werden, lokal gespeichert.", err);
      }
    }
    $("save-hint").textContent = `Gespeichert unter „${playerName}" in der ewigen Rangliste.`;
  }

  // ---------------------------------------------------------------- confetti
  function launchConfetti() {
    const layer = $("confetti-layer");
    const colors = ["#8a2246", "#cf9b3c", "#4d6b3f", "#c25a80", "#fbf3e7"];
    const n = 70;
    for (let i = 0; i < n; i++) {
      const el = document.createElement("div");
      el.className = "confetto";
      el.style.left = Math.random() * 100 + "vw";
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.animationDuration = 2.2 + Math.random() * 1.8 + "s";
      el.style.animationDelay = Math.random() * 0.4 + "s";
      el.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      layer.appendChild(el);
      setTimeout(() => el.remove(), 4500);
    }
  }

  // ---------------------------------------------------------------- ewige Rangliste
  function loadLocalFinal() {
    return JSON.parse(localStorage.getItem(LOCAL_FINAL_KEY) || "[]");
  }
  function myEntryIds() {
    return JSON.parse(localStorage.getItem(MY_ENTRIES_KEY) || "[]");
  }

  async function fetchFinalLeaderboard() {
    if (backendConfigured()) {
      try {
        const res = await fetch(`${APPS_SCRIPT_URL}?type=final&limit=${LEADERBOARD_SIZE}`);
        if (res.ok) return { entries: await res.json(), remote: true };
      } catch (err) {
        console.warn("Backend nicht erreichbar, zeige lokale Rangliste.", err);
      }
    }
    return { entries: loadLocalFinal(), remote: false };
  }

  function sortEntries(list) {
    return list.slice().sort((a, b) => b.score - a.score || a.timeMs - b.timeMs).slice(0, LEADERBOARD_SIZE);
  }

  async function renderLeaderboard() {
    const listEl = $("leaderboard-list");
    listEl.innerHTML = '<p class="leaderboard-loading">Rangliste wird geladen …</p>';

    const { entries: raw, remote } = await fetchFinalLeaderboard();
    const entries = sortEntries(raw);
    const mine = myEntryIds();
    listEl.innerHTML = "";

    if (!entries.length) {
      listEl.innerHTML = '<p class="leaderboard-loading">Noch keine Einträge – sei die/der Erste!</p>';
      return;
    }

    entries.forEach((e, i) => {
      const row = document.createElement("div");
      const isMine = e.entryId && mine.includes(e.entryId);
      row.className = "lb-row" + (isMine ? " me" : "");
      row.style.animationDelay = i * 0.05 + "s";
      row.innerHTML = `
        <span class="lb-rank">${i + 1}</span>
        <span class="lb-name">${escapeHtml(e.name || "Anonym")}</span>
        <span class="lb-score">${e.score}/${e.total}</span>
        ${isMine ? `<button class="lb-delete" title="Eigenen Eintrag löschen" aria-label="Eintrag löschen">×</button>` : ""}
      `;
      if (isMine) {
        row.querySelector(".lb-delete").addEventListener("click", () => deleteEntry(e.entryId, row));
      }
      listEl.appendChild(row);
    });

    if (!remote && !backendConfigured()) {
      const note = document.createElement("p");
      note.className = "leaderboard-loading";
      note.style.marginTop = "10px";
      note.textContent = "Hinweis: Backend noch nicht verbunden – Rangliste läuft aktuell nur lokal in diesem Browser.";
      listEl.appendChild(note);
    }
  }

  async function deleteEntry(entryId, rowEl) {
    rowEl.style.transition = "opacity 0.25s ease";
    rowEl.style.opacity = "0.35";

    const list = loadLocalFinal().filter((e) => e.entryId !== entryId);
    localStorage.setItem(LOCAL_FINAL_KEY, JSON.stringify(list));
    const mine = myEntryIds().filter((id) => id !== entryId);
    localStorage.setItem(MY_ENTRIES_KEY, JSON.stringify(mine));

    if (backendConfigured()) {
      try {
        await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ action: "delete", entryId }),
        });
      } catch (err) {
        console.warn("Löschen auf dem Backend fehlgeschlagen.", err);
      }
    }
    rowEl.remove();
  }

  // ---------------------------------------------------------------- Navigation / Buttons
  $("btn-start").addEventListener("click", () => showScreen("screen-name"));
  $("btn-show-leaderboard-start").addEventListener("click", () => {
    showScreen("screen-leaderboard");
    renderLeaderboard();
  });
  $("btn-to-leaderboard").addEventListener("click", () => {
    showScreen("screen-leaderboard");
    renderLeaderboard();
  });
  $("btn-replay").addEventListener("click", () => showScreen("screen-start"));
  $("btn-replay-result").addEventListener("click", () => showScreen("screen-start"));

  $("btn-share").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      $("btn-share").textContent = "Link kopiert ✓";
      setTimeout(() => ($("btn-share").textContent = "Link kopieren & Freunde herausfordern"), 2000);
    } catch (err) {
      alert(window.location.href);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && $("screen-quiz").classList.contains("active") && answered) {
      nextQuestion();
    }
  });

  // Namensfeld beim Start vorausfüllen
  const savedName = localStorage.getItem(NAME_KEY);
  if (savedName) $("input-playername").value = savedName;

  document.body.classList.add("on-start");
})();
