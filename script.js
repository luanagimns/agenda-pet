const modalOverlay = document.getElementById("modalOverlay");
const openModalButton = document.getElementById("openModalButton");
const closeModalButton = document.getElementById("closeModalButton");
const appointmentForm = document.getElementById("appointmentForm");

const morningList = document.getElementById("morningList");
const afternoonList = document.getElementById("afternoonList");
const nightList = document.getElementById("nightList");

const phoneInput = document.getElementById("phone");

const selectedDate = "2024-01-10";
const storageKey = "mundo-pet-appointments";
const usesApi = ["localhost", "127.0.0.1"].includes(window.location.hostname);

const defaultAppointments = [
  {
    id: 1,
    time: "09:00",
    pet: "Thor",
    tutor: "Fernanda Costa",
    phone: "(16) 99999-9999",
    service: "Vacinação",
    date: "2024-01-10"
  },
  {
    id: 2,
    time: "13:00",
    pet: "Mel",
    tutor: "João Souza",
    phone: "(16) 98888-8888",
    service: "Corte de Unhas",
    date: "2024-01-10"
  },
  {
    id: 3,
    time: "14:00",
    pet: "Bella",
    tutor: "Pedro Martins",
    phone: "(16) 97777-7777",
    service: "Aplicação de Anti-pulgas",
    date: "2024-01-10"
  },
  {
    id: 4,
    time: "15:00",
    pet: "Simba",
    tutor: "Juliana Rocha",
    phone: "(16) 96666-6666",
    service: "Tosa Higiênica",
    date: "2024-01-10"
  },
  {
    id: 5,
    time: "20:00",
    pet: "Max",
    tutor: "Camila Santos",
    phone: "(16) 95555-5555",
    service: "Limpeza de Dentes",
    date: "2024-01-10"
  }
];

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

if (window.location.hash === "#new") {
  openModal();
}

function openModal() {
  modalOverlay.classList.remove("hidden");
}

function closeModal() {
  modalOverlay.classList.add("hidden");
}

async function loadAppointments() {
  const appointments = usesApi
    ? await fetchApiAppointments()
    : getStoredAppointments();

  renderAppointments(appointments.filter(appointment => appointment.date === selectedDate));
}

async function fetchApiAppointments() {
  const response = await fetch(`/api/appointments?date=${selectedDate}`);

  if (!response.ok) {
    return defaultAppointments;
  }

  return response.json();
}

function getStoredAppointments() {
  const storedAppointments = localStorage.getItem(storageKey);

  if (!storedAppointments) {
    localStorage.setItem(storageKey, JSON.stringify(defaultAppointments));
    return defaultAppointments;
  }

  return JSON.parse(storedAppointments);
}

function saveStoredAppointments(appointments) {
  localStorage.setItem(storageKey, JSON.stringify(appointments));
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

  if (usesApi) {
    await fetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(appointment)
    });
  } else {
    const appointments = getStoredAppointments();
    appointments.push({
      ...appointment,
      id: Date.now()
    });
    saveStoredAppointments(appointments);
  }

  appointmentForm.reset();

  document.getElementById("date").value = "2024-01-10";
  document.getElementById("time").value = "12:00";

  closeModal();
  loadAppointments();
}

async function removeAppointment(id) {
  if (usesApi) {
    await fetch(`/api/appointments/${id}`, {
      method: "DELETE"
    });
  } else {
    const appointments = getStoredAppointments();
    saveStoredAppointments(
      appointments.filter(appointment => appointment.id !== id)
    );
  }

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
