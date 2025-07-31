const express = require('express');
const router = express.Router();
const {
  getAllDiscussions,
  moderateDiscussion,
  deleteDiscussion,
  getAllReplies,
  moderateReply,
  deleteReply,
  getDiscussionStats
} = require('../controllers/AdminDiscussionController');
const authMiddleware = require('../middleware/authMiddleware');

// Admin routes for discussion moderation
router.get('/discussions', authMiddleware, getAllDiscussions);
router.get('/discussions/stats', authMiddleware, getDiscussionStats);
router.put('/discussions/:id/moderate', authMiddleware, moderateDiscussion);
router.delete('/discussions/:id', authMiddleware, deleteDiscussion);

router.get('/replies', authMiddleware, getAllReplies);
router.put('/replies/:id/moderate', authMiddleware, moderateReply);
router.delete('/replies/:id', authMiddleware, deleteReply);

module.exports = router;
