const mongoose = require('mongoose');
const StudentEmailMapping = require('./models/usnmappingemail_schema')
const Attendance = require('./models/attendance_schema')
require('dotenv').config(); // Load environment variables

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit the process with failure
  }
};

// Call the connection function
connectDB();

const addOrUpdateStudentEmailMappings = async (req, res) => {
  console.log("req body is ", req.body);
  const { courseId, students } = req.body;

  if (!courseId || !Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ error: 'Course ID and students array are required' });
  }

  try {
    // Find or create a document for the course
    const existingMapping = await StudentEmailMapping.findOne({ courseId });

    if (existingMapping) {
      // Update the existing mapping
      existingMapping.students = students;
      await existingMapping.save();
      res.status(200).json({ message: 'Mappings updated successfully' });
    } else {
      // Create a new mapping
      const newMapping = new StudentEmailMapping({ courseId, students });
      await newMapping.save();
      res.status(201).json({ message: 'Mappings added successfully' });
    }
  } catch (error) {
    console.error('Error adding/updating student-email mappings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getAttendanceByEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the student's USN using the email
    const studentMapping = await StudentEmailMapping.findOne({ 'students.email': email });

    if (!studentMapping) {
      return res.status(404).json({ message: 'Student mapping not found' });
    }

    console.log("students mappings are", studentMapping)

    // Extract USN from the mapping
    const student = studentMapping.students.find(student => student.email === email);
    if (!student) {
      return res.status(404).json({ message: 'Student not found in mapping' });
    }

    console.log("student found is", student)

    // Find all attendance records for the student's USN
    const attendanceRecords = await Attendance.find();

    if (!attendanceRecords.length) {
      return res.status(404).json({ message: 'No attendance records found for this student' });
    }


    console.log("final attendance for that student is ", attendanceRecords, student)

    return res.status(200).json({attendanceRecords, studentDetails:student});
  } catch (err) {
    console.error('Error fetching attendance:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { getAttendanceByEmail, addOrUpdateStudentEmailMappings  };
