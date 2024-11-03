const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 5000;

app.use(express.json());

const marathons = [
  { id: 1, name: 'מבוא להסתברות', date: '01/10/2024', price: 240 },
  { id: 2, name: 'מתמטיקה בדידה', date: '02/10/2024', price: 260 },
];

app.get('/api/marathons', (req, res) => {
  res.json(marathons);
});

app.get('/api/marathon/:id', (req, res) => {
  const marathon = marathons.find(m => m.id === parseInt(req.params.id));
  res.json(marathon);
});

app.post('/api/register/:id', (req, res) => {
  const { student, transactionId } = req.body;
  const marathonId = req.params.id;
  const filePath = path.join(__dirname, `marathon_${marathonId}_registrations.csv`);

  const data = `${transactionId},${student.fullName},${student.studentId},${student.email},${new Date().toISOString()}\n`;
  fs.appendFile(filePath, data, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('שגיאה בשמירת הנתונים');
    } else {
      res.send('ההרשמה נשמרה בהצלחה');
    }
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
