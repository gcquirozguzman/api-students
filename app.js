// app.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const PORT = 8000;

// middleware para manejar form-data y json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// conectar a sqlite
const db = new sqlite3.Database("./students.sqlite", (err) => {
  if (err) {
    console.error("Error al conectar a la base de datos", err.message);
  } else {
    console.log("Conectado a la base de datos SQLite.");
  }
});

// ========== Rutas ==========

// GET todos los estudiantes
app.get("/students", (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// POST crear estudiante
app.post("/students", (req, res) => {
  const { firstname, lastname, gender, age } = req.body;
  const sql = "INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)";
  db.run(sql, [firstname, lastname, gender, age], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(`Student with id: ${this.lastID} created successfully`);
  });
});

// GET un estudiante
app.get("/student/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM students WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).send("Student not found");
    }
    res.json(row);
  });
});

// PUT actualizar estudiante
app.put("/student/:id", (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, gender, age } = req.body;
  const sql = "UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?";
  db.run(sql, [firstname, lastname, gender, age, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, firstname, lastname, gender, age });
  });
});

// DELETE estudiante
app.delete("/student/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM students WHERE id = ?";
  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.send(`The Student with id: ${id} has been deleted.`);
  });
});

// iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
