import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(__dirname));

let appointments = [
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

app.get("/api/appointments", (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.json(appointments);
  }

  const filteredAppointments = appointments.filter(
    appointment => appointment.date === date
  );

  res.json(filteredAppointments);
});

app.post("/api/appointments", (req, res) => {
  const { tutor, pet, phone, service, date, time } = req.body;

  if (!tutor || !pet || !phone || !service || !date || !time) {
    return res.status(400).json({
      message: "Preencha todos os campos."
    });
  }

  const newAppointment = {
    id: Date.now(),
    tutor,
    pet,
    phone,
    service,
    date,
    time
  };

  appointments.push(newAppointment);

  res.status(201).json(newAppointment);
});

app.delete("/api/appointments/:id", (req, res) => {
  const appointmentId = Number(req.params.id);

  appointments = appointments.filter(
    appointment => appointment.id !== appointmentId
  );

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
