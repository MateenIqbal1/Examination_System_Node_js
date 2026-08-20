const mongoose = require("mongoose");

const studentCourseEnrollmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseOfferingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseOffering",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "dropped", "completed"],
      default: "active",
      required: true,
      index: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

studentCourseEnrollmentSchema.index(
  { studentId: 1, courseOfferingId: 1 },
  { unique: true, name: "uniq_student_courseOffering" }
);

const StudentCourseEnrollment = mongoose.model(
  "StudentCourseEnrollment",
  studentCourseEnrollmentSchema
);

module.exports = { StudentCourseEnrollment };