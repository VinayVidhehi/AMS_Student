const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const { getAttendanceByEmail, addOrUpdateStudentEmailMappings } = require('./router');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = 3333;

app.get('/', (req, res) => {
  res.json({message:"welcome to attendance management system - web version"})
})


app.post('/get-student-attendance', getAttendanceByEmail);
app.post('/add-students', addOrUpdateStudentEmailMappings);

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running,and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
