const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors({
  origin: 'https://afekamarathons.netlify.app', // Allow requests from the Netlify frontend
}));

// File paths for JSON storage
const marathonsFilePath = path.join(__dirname, 'marathons.json');
const studentsFilePath = path.join(__dirname, 'students.json');

// Read marathons data from JSON file
const readMarathons = () => {
  if (fs.existsSync(marathonsFilePath)) {
    const data = fs.readFileSync(marathonsFilePath);
    return JSON.parse(data);
  }
  return [];
};

// Read students data from JSON file
const readStudents = () => {
  if (fs.existsSync(studentsFilePath)) {
    const data = fs.readFileSync(studentsFilePath);
    return JSON.parse(data);
  }
  return [];
};

// Write data to a JSON file
const writeToFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Load initial data
let marathons = readMarathons();
let students = readStudents();

// Endpoint to get the list of marathons
app.get('/api/marathons', (req, res) => {
  res.json(marathons);
});

// Endpoint to get details of a specific marathon by ID
app.get('/api/marathon/:id', (req, res) => {
  const marathon = marathons.find(m => m.id === parseInt(req.params.id));
  if (marathon) {
    res.json(marathon);
  } else {
    res.status(404).send('Marathon not found');
  }
});

// Endpoint to register a student and save data in JSON and CSV files
app.post('/api/register/:id', (req, res) => {
  const marathonId = parseInt(req.params.id);
  const { student, transactionId } = req.body;

  const marathon = marathons.find(m => m.id === marathonId);
  if (!marathon) {
    return res.status(404).send('Marathon not found');
  }

  // Save student data in JSON file
  const newStudent = {
    marathonId,
    transactionId,
    fullName: student.fullName,
    studentId: student.studentId,
    email: student.email,
    registrationDate: new Date().toISOString()
  };
  students.push(newStudent);
  writeToFile(studentsFilePath, students);

  // Save student data in a CSV file specific to the marathon
  const csvFilePath = path.join(__dirname, `marathon_${marathonId}_registrations.csv`);
  const csvData = `${transactionId},${student.fullName},${student.studentId},${student.email},${new Date().toISOString()}\n`;
  fs.appendFile(csvFilePath, csvData, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error saving data');
    }
    res.send('Registration saved successfully');
  });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
