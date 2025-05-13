let totalTime = 60 * 60; // 60 minutes in seconds
let timeLeft = totalTime;
let timerInterval;
let breaksTaken = 0;
let breakAvailable = false;
let breakInterval;
let fifteenMinutePromptShown = false;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const breakBtn = document.getElementById('breakBtn');
const promptDiv = document.getElementById('prompt');
const continueBtn = document.getElementById('continueBtn');
const stopBtn = document.getElementById('stopBtn');

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
  startBtn.disabled = true;
  breakInterval = setInterval(() => {
    if (breaksTaken < 3) {
      breakAvailable = true;
      breakBtn.disabled = false;
    }
  }, 5 * 60 * 1000); // Every 5 minutes

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft === totalTime - 15 * 60 && !fifteenMinutePromptShown) {
      fifteenMinutePromptShown = true;
      clearInterval(timerInterval);
      clearInterval(breakInterval);
      promptDiv.style.display = 'block';
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      clearInterval(breakInterval);
      alert('Class completed! Full points awarded.');
      logSession('Full');
    }
  }, 1000);
}

function takeBreak() {
  if (breakAvailable && breaksTaken < 3) {
    breaksTaken++;
    breakAvailable = false;
    breakBtn.disabled = true;
    alert(`Break taken. (${breaksTaken}/3)`);
  }
}

function continueSession() {
  promptDiv.style.display = 'none';
  startTimer();
}

function stopSession() {
  promptDiv.style.display = 'none';
  alert('Session stopped. Half points awarded.');
  logSession('Half');
}

function logSession(points) {
  // Send data to Google Apps Script Web App
  fetch('YOUR_WEB_APP_URL', {
    method: 'POST',
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      duration: totalTime - timeLeft,
      breaks: breaksTaken,
      points: points
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

startBtn.addEventListener('click', startTimer);
breakBtn.addEventListener('click', takeBreak);
continueBtn.addEventListener('click', continueSession);
stopBtn.addEventListener('click', stopSession);

updateTimerDisplay();
