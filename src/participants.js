document.addEventListener("DOMContentLoaded", () => {
  const eventId = getEventIdFromURL();

  if (!eventId) {
    alert("Помилка: Ідентифікатор події не знайдено.");
    return;
  }

  loadParticipants(eventId);
});

// Отримання eventId з URL
function getEventIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("eventId");
}

async function loadParticipants(eventId) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/participants?eventId=${eventId}`
    );
    if (!response.ok) {
      throw new Error(`HTTP помилка! статус: ${response.status}`);
    }

    const participants = await response.json();
    displayParticipants(participants);
  } catch (error) {
    console.error("Сталася помилка при завантаженні учасників:", error);
    alert(`Сталася помилка при завантаженні учасників: ${error.message}`);
  }
}

function displayParticipants(participants) {
  const participantsTbody = document.getElementById("participants-tbody");
  participantsTbody.innerHTML = "";

  participants.forEach((participant) => {
    const row = document.createElement("tr");
    const name = document.createElement("td");
    const email = document.createElement("td");
    const birthDate = document.createElement("td");
    const source = document.createElement("td");

    name.textContent = participant.fullName;
    email.textContent = participant.email;
    birthDate.textContent = participant.birthDate;
    source.textContent = participant.source;

    row.appendChild(name);
    row.appendChild(email);
    row.appendChild(birthDate);
    row.appendChild(source);
    participantsTbody.appendChild(row);
  });
}

async function viewParticipants(eventId) {
  window.location.href = `participants.html?eventId=${eventId}`;
}
