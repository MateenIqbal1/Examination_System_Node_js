const { CourseOffering } = require("../models/CourseOfferings");

const createCourseOffering = async (req, res) => {
    const { courseId, sectionId, teacherId, semester, session } = req.body
    const newCourseOffering = await CourseOffering.create({ courseId, sectionId, teacherId, semester, session })
    if (!newCourseOffering) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong ,courseOffering not created"
        })
    }
    return res.status(201).json({
        success: true,
        courseOffering: newCourseOffering

    })
}

const getCourseOffering = async (req, res) => {
    const { courseOfferingId } = req.body
    const courseOffering = await CourseOffering.findById(courseOfferingId)
    if (!courseOffering) {
        return res.status(500).json({
            success: false,
            message: "CourseOffering not found in db"
        })
    }
    return res.status(200).json({
        success: true,
        courseOffering
    })
}

const updateCourseOffering = async (req, res) => {
    const { courseOfferingId, courseId, sectionId, teacherId, semester, session ,isPaperAllowed} = req.body
    const courseOffering = await CourseOffering.findById(courseOfferingId)
    if (!courseOffering) {
        return res.status(500).json({
            success: false,
            message: "course offering not found"
        })
    }

    if (courseId !== undefined) {
        courseOffering.courseId = courseId
    }
    if (sectionId !== undefined) {
        courseOffering.sectionId = sectionId
    }
    if (teacherId !== undefined) {
        courseOffering.teacherId = teacherId
    }
    if (semester !== undefined) {
        courseOffering.semester = semester
    }
    if (session !== undefined) {
        courseOffering.session = session
    }
    if (isPaperAllowed !== undefined) {
        courseOffering.isPaperAllowed = isPaperAllowed
    }
    await courseOffering.save();
    return res.status(200).json({
        success: true,
        courseOffering
    })


}

const deleteCourseOffeirng = async (req, res) => {
    const { courseOfferingId } = req.body
    const courseOffering = await CourseOffering.findById(courseOfferingId)
    if (!courseOffering) {
        return res.status(500).json({
            success: false,
            message: "CourseOffering not found in db"
        })
    }
    const courseOfferingd = await CourseOffering.findByIdAndDelete(courseOfferingId)

    return res.status(200).json({
        success: true,
        courseOfferingd
    })
}

module.exports = { createCourseOffering, getCourseOffering, updateCourseOffering, deleteCourseOffeirng }