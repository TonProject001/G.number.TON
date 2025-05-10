let currentNumber = 1;
let startTime;
let timerInterval;

function startGame() {
  document.getElementById("menu").style.display = "none";
  const gameContainer = document.getElementById("gameContainer");
  gameContainer.style.display = "block";

  // Reset
  currentNumber = 1;
  clearInterval(timerInterval);
  document.getElementById("successPopup").style.display = "none";
  document.getElementById("nameInputBox").style.display = "none";

  // ลบวงกลมเก่าออก
  const oldCircles = document.querySelectorAll(".circle");
  oldCircles.forEach(c => c.remove());

  // สุ่มตัวเลข
  const numbers = Array.from({ length: 50 }, (_, i) => i + 1);
  shuffleArray(numbers);

  const placedCircles = [];

  // พื้นที่ปลอดภัย
  const padding = 100;
  const circleSize = 80;

  numbers.forEach((num) => {
    let x, y;
    let attempts = 0;

    do {
      x = Math.random() * (window.innerWidth - circleSize - padding * 2) + padding;
      y = Math.random() * (window.innerHeight - circleSize - padding * 2) + padding;
      attempts++;
    } while (isOverlapping(x, y, placedCircles) && attempts < 1000);

    placedCircles.push({ x, y });

    const circle = document.createElement("div");
    circle.className = "circle";
    circle.textContent = num;
    circle.dataset.number = num;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    circle.addEventListener("click", () => handleClick(circle, num));
    gameContainer.appendChild(circle);
  });
}

function handleClick(circleElement, number) {
  if (number === currentNumber) {
    if (currentNumber === 1) {
      startTimer();
    }

    circleElement.style.backgroundColor = "#4CAF50"; // เปลี่ยนเป็นสีเขียว
    circleElement.style.pointerEvents = "none";

    currentNumber++;

    if (currentNumber > 50) {
      stopTimer();
      setTimeout(() => {
        showSuccessPopup();
      }, 500);
    }
  }
}

function startTimer() {
  startTime = Date.now();
}

function stopTimer() {
  clearInterval(timerInterval);
}

function isOverlapping(newX, newY, circles) {
  const radius = 40;
  for (let c of circles) {
    const dx = newX - c.x;
    const dy = newY - c.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < radius * 2) return true;
  }
  return false;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// โหลด leaderboard เมื่อเริ่มเกม
window.onload = function () {
  loadLeaderboard();
};

function loadLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  const container = document.getElementById("leaderboard");
  container.innerHTML = "<strong>TOP 10</strong><br>";

  if (leaderboard.length === 0) {
    container.innerHTML += "ยังไม่มีคะแนน";
  } else {
    leaderboard.forEach((entry, idx) => {
      container.innerHTML += `${idx + 1}. ${entry.name} — ${entry.time.toFixed(2)} วินาที<br>`;
    });
  }
}

// แสดง popup เมื่อเล่นเสร็จ
function showSuccessPopup() {
  document.getElementById("nameInputBox").style.display = "block";
  document.getElementById("popupTime").textContent = `เวลา: ${((Date.now() - startTime) / 1000).toFixed(2)} วินาที`;
  document.getElementById("popupName").textContent = "";
}

// บันทึกคะแนน
function saveScore() {
  const name = document.getElementById("playerName").value.trim();
  if (!name) {
    alert("กรุณากรอกชื่อ");
    return;
  }

  const time = ((Date.now() - startTime) / 1000).toFixed(2);
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");

  leaderboard.push({ name, time: parseFloat(time) });
  leaderboard.sort((a, b) => a.time - b.time);
  leaderboard.splice(10); // เก็บแค่ 10 อันดับแรก

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  document.getElementById("nameInputBox").style.display = "none";
  document.getElementById("popupName").textContent = `ชื่อ: ${name}`;
  document.getElementById("popupTime").textContent = `เวลา: ${time} วินาที`;
  document.getElementById("successPopup").style.display = "block";
  loadLeaderboard();
}

// กลับสู่เมนู
function closePopup() {
  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("menu").style.display = "block";
}
