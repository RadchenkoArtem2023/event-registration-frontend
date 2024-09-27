document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registration-form");
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get("eventId");

  if (!eventId) {
    alert("Помилка: Ідентифікатор події не знайдено.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const participantData = {
      ...data,
      eventId,
    };

    try {
      const response = await fetch("http://localhost:8080/api/participants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(participantData),
      });

      if (!response.ok) {
        throw new Error(`Помилка: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Учасника успішно зареєстровано:", result);
      alert("Учасника успішно зареєстровано!");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Сталася помилка при реєстрації:", error);
      alert("Сталася помилка при реєстрації учасника.");
    }
  });
});
