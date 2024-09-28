document.addEventListener("DOMContentLoaded", () => {
  loadEvents();
});

let currentPage = 1;
const eventsPerPage = 8;
let allEvents = [];

// Асинхронна функція для завантаження подій
async function loadEvents() {
  try {
    const response = await fetch(
      "https://event-registration-backend-jomp.onrender.com/api/events"
    );
    if (!response.ok) {
      throw new Error(`Помилка: ${response.statusText}`);
    }
    const events = await response.json();
    allEvents = events;
    displayEvents(allEvents);
  } catch (error) {
    console.error("Сталася помилка при завантаженні подій:", error);
  }
}

// Функція для сортування подій
function sortEvents(criteria) {
  switch (criteria) {
    case "title":
      return allEvents.sort((a, b) => a.title.localeCompare(b.title));
    case "date":
      return allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    case "organizer":
      return allEvents.sort((a, b) => a.organizer.localeCompare(b.organizer));
    default:
      return allEvents;
  }
}

// Обробник події для зміни сортування
document.getElementById("sort-by").addEventListener("change", (event) => {
  const sortedEvents = sortEvents(event.target.value);
  displayEvents(sortedEvents);
});

// Обробник події для вибору дати
document.getElementById("save-date-btn").addEventListener("click", () => {
  const selectedDate = document.getElementById("event-date").value;

  if (selectedDate) {
    console.log(`Обрана дата: ${selectedDate}`);
    filterEventsByDate(selectedDate);
  } else {
    alert("Будь ласка, виберіть дату.");
  }
});

function filterEventsByDate(date) {
  const filteredEvents = allEvents.filter((event) => {
    const eventDate = new Date(event.date).toISOString().split("T")[0];
    return eventDate === date;
  });
  displayEvents(filteredEvents);
}

// Функція для відображення подій
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
      displayEvents(allEvents);
    };
    pageNumbers.appendChild(pageButton);
  }
}

// Функція для перенаправлення
function redirectTo(page, eventId) {
  if (eventId) {
    window.location.href = `${page}.html?eventId=${eventId}`;
  } else {
    alert("Помилка: Ідентифікатор події не знайдено.");
  }
}
