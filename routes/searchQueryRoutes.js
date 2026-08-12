const express = require('express');
const { searchUserWithName, searchCourses, searchSections } = require('../controllers/searchQueryController');
const router = express.Router();

router.get("/search/user",searchUserWithName);
router.get("/search/course",searchCourses);
router.get("/search/section",searchSections)



module.exports = router