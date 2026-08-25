// ============================================================================
// Weinbummel Thurgau – Weinquiz – App-Logik
// ============================================================================
(function () {
  "use strict";

  const LETTERS = ["A", "B", "C", "D"];
  const LOCAL_KEY = "weinbummel_leaderboard_v1";
  const NAME_KEY = "weinbummel_last_name";

  let order = [];          // randomised order of question indices for this run
  let current = 0;         // pointer into `order`
  let score = 0;
  let answered = false;
  let startTime = 0;
  let lastEntry = null;    // {name, score, total, timeMs, ts} of the run just played

  // ---------------------------------------------------------------- helpers
  const $ = (id) => document.getElementById(id);
  const backendConfigured = () =>
    typeof APPS_SCRIPT_URL === "string" &&
    APPS_SCRIPT_URL.startsWith("http") &&
    !APPS_SCRIPT_URL.includes("DEINE_APPS_SCRIPT_URL");

  function shuffledIndexes(n) {
    const arr = Array.from({ length: n }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function showScreen(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    $(id).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---------------------------------------------------------------- route pins
  function buildRoute() {
    const track = $("route-track");
    track.innerHTML = "";
    QUESTIONS.forEach((_, i) => {
      const pin = document.createElement("div");
      pin.className = "route-pin";
      pin.dataset.i = i;
      track.appendChild(pin);
    });
  }
  function updateRoute() {
    const pins = document.querySelectorAll(".route-pin");
    pins.forEach((pin, i) => {
      pin.classList.toggle("done", i < current);
      pin.classList.toggle("current", i === current);
    });
    const currentPin = pins[current];
    if (currentPin) currentPin.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
  }

  // ---------------------------------------------------------------- quiz flow
  function startQuiz() {
    order = shuffledIndexes(QUESTIONS.length);
    current = 0;
    score = 0;
    startTime = Date.now();
    $("quiz-total").textContent = QUESTIONS.length;
    buildRoute();
    showScreen("screen-quiz");
    renderQuestion();
  }

  function renderQuestion() {
    answered = false;
    const q = QUESTIONS[order[current]];
    $("quiz-index").textContent = current + 1;
    $("quiz-category").textContent = q.category;
    $("quiz-question").textContent = q.question;
    $("progress-fill").style.width = Math.round((current / QUESTIONS.length) * 100) + "%";
    updateRoute();

    // shuffle options per question, remember new correct position
    const optionOrder = shuffledIndexes(q.options.length);
    const newCorrectPos = optionOrder.indexOf(q.correct);

    const wrap = $("quiz-options");
    wrap.innerHTML = "";
    optionOrder.forEach((origIdx, pos) => {
      const btn = document.createElement("button");
      btn.className = "option";
      btn.innerHTML = `<span class="opt-letter">${LETTERS[pos]}</span><span>${q.options[origIdx]}</span>`;
      btn.addEventListener("click", () => selectOption(pos, newCorrectPos, btn));
      wrap.appendChild(btn);
    });

    $("quiz-explanation").classList.remove("show");
    $("quiz-explanation-text").textContent = q.explanation;
    $("btn-next").disabled = true;
    $("btn-next").textContent = current === QUESTIONS.length - 1 ? "Ergebnis ansehen →" : "Weiter";
  }

  function selectOption(pos, correctPos, btnEl) {
    if (answered) return;
    answered = true;
    const buttons = Array.from(document.querySelectorAll(".option"));
    buttons.forEach((b, i) => {
      b.disabled = true;
      if (i === correctPos) b.classList.add("correct");
      else if (i === pos) b.classList.add("wrong");
      else b.classList.add("dim");
    });

    if (pos === correctPos) {
      score++;
      playCheers();
    }

    $("quiz-explanation").classList.add("show");
    $("btn-next").disabled = false;
    $("btn-next").focus();
  }

  function playCheers() {
    const pop = $("cheers-pop");
    pop.classList.remove("play");
    void pop.offsetWidth; // restart animation
    pop.classList.add("play");
  }

  function nextQuestion() {
    if (!answered) return;
    current++;
    if (current >= QUESTIONS.length) {
      finishQuiz();
    } else {
      renderQuestion();
    }
  }

  function finishQuiz() {
    $("progress-fill").style.width = "100%";
    const timeMs = Date.now() - startTime;
    const pct = score / QUESTIONS.length;

    let title, text;
    if (pct === 1) {
      title = "Staatswein-Champion 🏆";
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

    $("result-score").textContent = score;
    document.querySelector(".badge-slash").textContent = "/" + QUESTIONS.length;
    document.querySelector(".badge-ring").style.setProperty("--pct", Math.round(pct * 100) + "%");
    $("result-title").textContent = title;
    $("result-text").textContent = text;

    lastEntry = { score, total: QUESTIONS.length, timeMs, ts: Date.now() };

    const savedName = localStorage.getItem(NAME_KEY);
    if (savedName) $("input-name").value = savedName;

    if (pct >= 0.5) launchConfetti();

    showScreen("screen-result");
  }

  // ---------------------------------------------------------------- confetti
  function launchConfetti() {
    const layer = $("confetti-layer");
    const colors = ["#8a2246", "#cf9b3c", "#4d6b3f", "#c25a80", "#fbf3e7"];
    const n = 60;
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

  // ---------------------------------------------------------------- leaderboard backend
  async function submitScore(name) {
    lastEntry.name = name;
    localStorage.setItem(NAME_KEY, name);

    // always keep a local mirror as a safety net
    saveLocal(lastEntry);

    if (!backendConfigured()) return;

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          name: lastEntry.name,
          score: lastEntry.score,
          total: lastEntry.total,
          timeMs: lastEntry.timeMs,
        }),
      });
    } catch (err) {
      console.warn("Konnte Score nicht ans Backend senden, nutze lokale Rangliste.", err);
    }
  }

  function saveLocal(entry) {
    const list = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
    list.push(entry);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  }

  function loadLocal() {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  }

  async function fetchRemoteLeaderboard() {
    const res = await fetch(`${APPS_SCRIPT_URL}?limit=${LEADERBOARD_SIZE}`);
    if (!res.ok) throw new Error("Antwort nicht ok: " + res.status);
    return res.json();
  }

  function sortEntries(list) {
    return list
      .slice()
      .sort((a, b) => b.score - a.score || a.timeMs - b.timeMs)
      .slice(0, LEADERBOARD_SIZE);
  }

  async function renderLeaderboard() {
    const listEl = $("leaderboard-list");
    listEl.innerHTML = '<p class="leaderboard-loading">Rangliste wird geladen …</p>';

    let entries = [];
    let usedBackend = false;

    if (backendConfigured()) {
      try {
        entries = await fetchRemoteLeaderboard();
        usedBackend = true;
      } catch (err) {
        console.warn("Backend nicht erreichbar, zeige lokale Rangliste.", err);
      }
    }
    if (!usedBackend) {
      entries = loadLocal();
    }

    entries = sortEntries(entries);
    listEl.innerHTML = "";

    if (!entries.length) {
      listEl.innerHTML = '<p class="leaderboard-loading">Noch keine Einträge – sei die/der Erste!</p>';
      return;
    }

    entries.forEach((e, i) => {
      const row = document.createElement("div");
      const isMe =
        lastEntry &&
        e.name === lastEntry.name &&
        e.score === lastEntry.score &&
        Math.abs((e.timeMs || 0) - (lastEntry.timeMs || 0)) < 1000;
      row.className = "lb-row" + (isMe ? " me" : "");
      row.style.animationDelay = i * 0.05 + "s";
      row.innerHTML = `
        <span class="lb-rank">${i + 1}</span>
        <span class="lb-name">${escapeHtml(e.name || "Anonym")}</span>
        <span class="lb-score">${e.score}/${e.total}</span>
      `;
      listEl.appendChild(row);
    });

    if (!usedBackend && backendConfigured() === false) {
      const note = document.createElement("p");
      note.className = "leaderboard-loading";
      note.style.marginTop = "10px";
      note.textContent = "Hinweis: Backend noch nicht verbunden – Rangliste läuft aktuell nur lokal in diesem Browser.";
      listEl.appendChild(note);
    }
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------------------------------------------------------------- events
  $("btn-start").addEventListener("click", startQuiz);
  $("btn-show-leaderboard-start").addEventListener("click", () => {
    lastEntry = null;
    showScreen("screen-leaderboard");
    renderLeaderboard();
  });
  $("btn-next").addEventListener("click", nextQuestion);
  $("btn-replay").addEventListener("click", startQuiz);

  $("form-save").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = $("input-name").value.trim();
    if (!name) return;
    const btn = $("btn-save");
    btn.disabled = true;
    btn.textContent = "Wird gespeichert …";
    $("save-hint").textContent = "";
    try {
      await submitScore(name);
    } finally {
      btn.disabled = false;
      btn.textContent = "In der Rangliste verewigen";
    }
    showScreen("screen-leaderboard");
    renderLeaderboard();
  });

  $("btn-share").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      $("btn-share").textContent = "Link kopiert ✓";
      setTimeout(() => ($("btn-share").textContent = "Link kopieren & Freunde herausfordern"), 2000);
    } catch (err) {
      alert(window.location.href);
    }
  });

  // keyboard: Enter advances once answered
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && $("screen-quiz").classList.contains("active") && answered) {
      nextQuestion();
    }
  });
})();
