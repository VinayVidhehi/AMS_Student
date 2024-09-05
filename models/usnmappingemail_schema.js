const mongoose = require('mongoose');

const studentEmailMappingSchema = new mongoose.Schema({
  courseId: { type: String, required: true }, // ID of the course to which students belong
  students: [
    {
      usn: { type: String, required: true },
      email: { type: String, required: true }
    }
  ]
});

const StudentEmailMapping = mongoose.model('StudentEmailMapping', studentEmailMappingSchema);

module.exports = StudentEmailMapping;
