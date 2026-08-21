const { default: mongoose } = require("mongoose");
const { CourseOffering } = require("../models/CourseOfferings");
const { StudentCourseEnrollment } = require("../models/StudentCourseEnrollment");
const User = require("../models/User");

const createStudentCourseEnrollment = async (req, res, next) => {

  try {
    const { studentId, courseOfferingId, status = "active" } = req.body;
    console.log("this is courseoffering", courseOfferingId)
    const student = await User.findById(studentId).select("_id role");
    if (!student || student.role !== "student") {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    const offerings = await CourseOffering.find({}).limit(10);


    const offering = await CourseOffering.findById(courseOfferingId)
    if (!offering) {
      return res.status(404).json({ success: false, message: "Course offering not found in db" });
    }

    const created = await StudentCourseEnrollment.create({
      studentId,
      courseOfferingId,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Enrollment created",
      enrollment: created,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Enrollment already exists for this student and course offering",
      });
    }

    return res.status(500).json({ success: false, message: error.message });
  }
};

const getStudentEnrollments = async (req, res, next) => {
    try {
        const { studentId } = req.params;

        const enrollments = await StudentCourseEnrollment.aggregate([
            {
                $match: {
                    studentId: new mongoose.Types.ObjectId(studentId)
                }
            },

            {
                $lookup: {
                    from: "courseofferings",
                    localField: "courseOfferingId",
                    foreignField: "_id",
                    as: "courseOffering"
                }
            },

            {
                $unwind: "$courseOffering"
            },

            {
                $lookup: {
                    from: "courses",
                    localField: "courseOffering.courseId",
                    foreignField: "_id",
                    as: "course"
                }
            },

            {
                $unwind: "$course"
            },

            {
                $lookup: {
                    from: "sections",
                    localField: "courseOffering.sectionId",
                    foreignField: "_id",
                    as: "section"
                }
            },

            {
                $unwind: "$section"
            },

            {
                $project: {
                    _id: 1,

                    status: 1,
                    enrolledAt: 1,

                    course: {
                        _id: "$course._id",
                        name: "$course.title",
                        code: "$course.code",
                        creditHours: "$course.creditHours"
                    },

                    section: {
                        _id: "$section._id",
                        name: "$section.name",
                        batch: "$section.batch",
                        semester: "$section.semester"
                    },

                    courseOffering: {
                        _id: "$courseOffering._id",
                        semester: "$courseOffering.semester",
                        session: "$courseOffering.session"
                    }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            count: enrollments.length,
            enrollments
        });

    } catch (error) {
        return next(error);
    }
};

const deleteStudentCourseEnrollment = async (req, res, next) => {
    try {
        const { studentId, courseOfferingId } = req.body;

        const enrollment =
            await StudentCourseEnrollment.findOneAndDelete({
                studentId,
                courseOfferingId
            });

        if (!enrollment) {
            return next(
                new ApiError(404, "Student course enrollment not found")
            );
        }

        return res.status(200).json({
            success: true,
            message: "Student course enrollment deleted successfully"
        });

    } catch (error) {
        return next(error);
    }
};

const updateStudentCourseEnrollment = async (req, res, next) => {
    try {
        const {
            studentId,
            courseOfferingId,
            status
        } = req.body;

        const enrollment =
            await StudentCourseEnrollment.findOneAndUpdate(
                {
                    studentId,
                    courseOfferingId
                },
                {
                    status
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!enrollment) {
            return next(
                new ApiError(
                    404,
                    "Student course enrollment not found"
                )
            );
        }

        return res.status(200).json({
            success: true,
            message: "Enrollment updated successfully",
            enrollment
        });

    } catch (error) {
        return next(error);
    }
};

module.exports = { createStudentCourseEnrollment ,getStudentEnrollments ,deleteStudentCourseEnrollment , updateStudentCourseEnrollment}