let workTime = 25 * 60;
let breakTime = 5 * 60;
let time = workTime;
let isStudy = true;
let timerInterval = null;

/* ---------- DAILY RESET ---------- */
let today = new Date().toDateString();
let storedDate = localStorage.getItem("date");

if (storedDate !== today) {
  localStorage.setItem("sessionsCount", 0);
  localStorage.setItem("date", today);
}

/* ---------- STORAGE ---------- */
let sessions = parseInt(localStorage.getItem("sessionsCount")) || 0;
let savedMood = localStorage.getItem("selectedMood");
document.getElementById("sessions").innerText = sessions;

/* ---------- RESTORE THEME ---------- */
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

/* ---------- CALM VOICE ---------- */
function speakCalm(message) {
  const toggle = document.getElementById("voiceToggle");
  if (!toggle.checked) return;

  window.speechSynthesis.cancel();
  const speech = new SpeechSynthesisUtterance(message);
  speech.rate = 0.85;
  speech.pitch = 0.9;
  speech.volume = 0.8;
  window.speechSynthesis.speak(speech);
}

/* ---------- MOOD ---------- */
function setMood(mood) {
  localStorage.setItem("selectedMood", mood);
  document.getElementById("lastMood").innerText =
    "Last selected mood: " + mood;

  if (mood === "tired") {
    workTime = 15 * 60;
    speakCalm("You seem tired. Let's study gently.");
  } else if (mood === "normal") {
    workTime = 25 * 60;
    speakCalm("Stay calm and focused.");
  } else {
    workTime = 40 * 60;
    speakCalm("You're motivated. Let's begin.");
  }

  time = workTime;
  updateTimer();
}

if (savedMood) setMood(savedMood);

/* ---------- TIMER ---------- */
function startTimer() {
  if (timerInterval) return;

  speakCalm("Study session started.");
  timerInterval = setInterval(() => {
    time--;

    if (time < 0) {
      if (isStudy) {
        sessions++;
        localStorage.setItem("sessionsCount", sessions);
        document.getElementById("sessions").innerText = sessions;
        updateProgress();
        speakCalm("Good job. Take a short break.");
      } else {
        speakCalm("Break over. Let's continue.");
      }

      isStudy = !isStudy;
      document.getElementById("mode").innerText =
        isStudy ? "Study Time" : "Break Time";
      time = isStudy ? workTime : breakTime;
    }
    updateTimer();
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  isStudy = true;
  time = workTime;
  document.getElementById("mode").innerText = "Study Time";
  updateTimer();
  speakCalm("Timer reset.");
}

function updateTimer() {
  let m = Math.floor(time / 60);
  let s = time % 60;
  document.getElementById("timer").innerText =
    `${m}:${s < 10 ? "0" : ""}${s}`;
}

/* ---------- PROGRESS ---------- */
function updateProgress() {
  let msg =
    sessions >= 5 ? "Excellent consistency 🌟" :
    sessions >= 3 ? "You're doing great 👍" :
    "Good start 😊";
  document.getElementById("progressMsg").innerText = msg;
}
updateProgress();

/* ---------- THEME TOGGLE ---------- */
function toggleTheme() {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}