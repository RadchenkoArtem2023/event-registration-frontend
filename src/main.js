document.addEventListener("DOMContentLoaded", () => {
  loadEvents();
});

let currentPage = 1;
const eventsPerPage = 8;

// Асинхронна функція для завантаження подій
async function loadEvents() {
  try {
    const response = await fetch("http://localhost:8080/api/events");
    if (!response.ok) {
      throw new Error(`Помилка: ${response.statusText}`);
    }
    const events = await response.json();
    displayEvents(events);
  } catch (error) {
    console.error("Сталася помилка при завантаженні подій:", error);
  }
}

function displayEvents(events) {
  const eventBoard = document.getElementById("event-board");
  eventBoard.innerHTML = "";

  // Відображення подій для поточної сторінки
  const paginatedEvents = paginateEvents(events);

  paginatedEvents.forEach((event) => {
    const eventDiv = createEventDiv(event);
    eventBoard.appendChild(eventDiv);
  });

  setupPagination(events.length);
}

function paginateEvents(events) {
  const startIndex = (currentPage - 1) * eventsPerPage;
  return events.slice(startIndex, startIndex + eventsPerPage);
}

function createEventDiv(event) {
  const eventDiv = document.createElement("div");
  eventDiv.classList.add("event");
  eventDiv.innerHTML = `
    <div id="event-container">
      <h2>${event.title}</h2>
      <p>${event.description}</p>
      <p><strong>Дата:</strong> ${new Date(event.date).toLocaleDateString()}</p>
      <p><strong>Організатор:</strong> ${event.organizer}</p>
      <button class="register-btn" data-event-id="${
        event._id
      }">Зареєструватися</button>
      <button onclick="redirectTo('participants', '${
        event._id
      }')">Переглянути</button>
    </div>
  `;

  // Обробник події для кнопки "Зареєструватися"
  const registerButton = eventDiv.querySelector(".register-btn");
  registerButton.addEventListener("click", () => {
    const eventId = registerButton.getAttribute("data-event-id");
    redirectTo("register", eventId);
  });

  return eventDiv;
}

function setupPagination(totalEvents) {
  const pagination = document.querySelector(".pagination");
  const totalPages = Math.ceil(totalEvents / eventsPerPage);
  const pageNumbers = document.getElementById("pageNumbers");

  if (!pageNumbers) {
    console.error("Елемент #pageNumbers не знайдено.");
    return;
  }

  pageNumbers.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.onclick = () => {
      currentPage = i;
      loadEvents();
      pageNumbers.appendChild(pageButton);
    };
  }

  // Функція для перенаправлення
  function redirectTo(page, eventId) {
    if (eventId) {
      window.location.href = `${page}.html?eventId=${eventId}`;
    } else {
      alert("Помилка: Ідентифікатор події не знайдено.");
    }
  }
}
