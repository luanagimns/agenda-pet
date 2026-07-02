const modalOverlay = document.getElementById("modalOverlay");
const openModalButton = document.getElementById("openModalButton");
const closeModalButton = document.getElementById("closeModalButton");
const appointmentForm = document.getElementById("appointmentForm");

const morningList = document.getElementById("morningList");
const afternoonList = document.getElementById("afternoonList");
const nightList = document.getElementById("nightList");

const phoneInput = document.getElementById("phone");

const selectedDate = "2024-01-10";

openModalButton.addEventListener("click", openModal);
closeModalButton.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", event => {
  if (event.target === modalOverlay) {
    closeModal();
  }
});

appointmentForm.addEventListener("submit", handleSubmit);

phoneInput.addEventListener("input", event => {
  event.target.value = formatPhone(event.target.value);
});

loadAppointments();

function openModal() {
  modalOverlay.classList.remove("hidden");
}

function closeModal() {
  modalOverlay.classList.add("hidden");
}

async function loadAppointments() {
  const response = await fetch(`/api/appointments?date=${selectedDate}`);
  const appointments = await response.json();

  renderAppointments(appointments);
}

function renderAppointments(appointments) {
  const morningAppointments = appointments.filter(appointment => {
    const hour = Number(appointment.time.split(":")[0]);
    return hour >= 9 && hour <= 12;
  });

  const afternoonAppointments = appointments.filter(appointment => {
    const hour = Number(appointment.time.split(":")[0]);
    return hour >= 13 && hour <= 18;
  });

  const nightAppointments = appointments.filter(appointment => {
    const hour = Number(appointment.time.split(":")[0]);
    return hour >= 19 && hour <= 21;
  });

  renderList(morningList, morningAppointments);
  renderList(afternoonList, afternoonAppointments);
  renderList(nightList, nightAppointments);
}

function renderList(container, appointments) {
  container.innerHTML = "";

  if (appointments.length === 0) {
    container.innerHTML = `
      <div class="empty-message">
        Nenhum agendamento nesse período.
      </div>
    `;

    return;
  }

  appointments
    .sort((a, b) => a.time.localeCompare(b.time))
    .forEach(appointment => {
      const item = document.createElement("div");

      item.className = "appointment-item";

      item.innerHTML = `
        <span class="appointment-time">${appointment.time}</span>

        <p class="appointment-client">
          <strong>${appointment.pet}</strong> / ${appointment.tutor}
        </p>

        <p class="appointment-service">
          ${appointment.service}
        </p>

        <button class="remove-button" type="button">
          Remover agendamento
        </button>
      `;

      const removeButton = item.querySelector(".remove-button");

      removeButton.addEventListener("click", () => {
        removeAppointment(appointment.id);
      });

      container.appendChild(item);
    });
}

async function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(appointmentForm);

  const appointment = {
    tutor: formData.get("tutor").trim(),
    pet: formData.get("pet").trim(),
    phone: formData.get("phone").trim(),
    service: formData.get("service").trim(),
    date: formData.get("date"),
    time: formData.get("time")
  };

  if (
    !appointment.tutor ||
    !appointment.pet ||
    !appointment.phone ||
    !appointment.service ||
    !appointment.date ||
    !appointment.time
  ) {
    alert("Preencha todos os campos.");
    return;
  }

  await fetch("/api/appointments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(appointment)
  });

  appointmentForm.reset();

  document.getElementById("date").value = "2024-01-10";
  document.getElementById("time").value = "12:00";

  closeModal();
  loadAppointments();
}

async function removeAppointment(id) {
  await fetch(`/api/appointments/${id}`, {
    method: "DELETE"
  });

  loadAppointments();
}

function formatPhone(value) {
  const numbers = value.replace(/\D/g, "").slice(0, 11);

  if (numbers.length <= 2) {
    return numbers;
  }

  if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }

  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 3)} ${numbers.slice(
    3,
    7
  )}-${numbers.slice(7)}`;
}
