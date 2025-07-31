const express = require('express');
const router = express.Router();
const {
  getPublishedSeries,
  getTestsInSeries,
  getTestDetails,
  startTestAttempt,
  saveResponse,
  submitTest,
  getTestHistory
} = require('../controllers/MockTestController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Student routes for mock tests
router.get('/series', getPublishedSeries);
router.get('/series/:seriesId/tests', authMiddleware, getTestsInSeries);
router.get('/test/:testId/details', authMiddleware, getTestDetails);
router.post('/test/:testId/start', authMiddleware, startTestAttempt);
router.put('/attempt/:attemptId/response', authMiddleware, saveResponse);
router.post('/attempt/:attemptId/submit', authMiddleware, submitTest);
router.get('/history', authMiddleware, getTestHistory);

module.exports = router;
