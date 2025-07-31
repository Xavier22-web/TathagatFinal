const express = require('express');
const router = express.Router();
const {
  upload,
  uploadStudyMaterial,
  getAllStudyMaterials,
  getStudentStudyMaterials,
  downloadStudyMaterial,
  updateStudyMaterial,
  deleteStudyMaterial,
  getStudyMaterialById
} = require('../controllers/StudyMaterialController');

const { authMiddleware } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/permissionMiddleware');

// Student routes (protected by auth)
router.get('/student', authMiddleware, getStudentStudyMaterials);
router.get('/download/:id', authMiddleware, downloadStudyMaterial);
router.get('/student/:id', authMiddleware, getStudyMaterialById);

// Admin routes (protected by auth and admin permission)
router.post('/admin/upload', 
  authMiddleware, 
  checkPermission(['admin', 'sub-admin']), 
  upload.single('file'), 
  uploadStudyMaterial
);

router.get('/admin', 
  authMiddleware, 
  checkPermission(['admin', 'sub-admin']), 
  getAllStudyMaterials
);

router.get('/admin/:id', 
  authMiddleware, 
  checkPermission(['admin', 'sub-admin']), 
  getStudyMaterialById
);

router.put('/admin/:id', 
  authMiddleware, 
  checkPermission(['admin', 'sub-admin']), 
  updateStudyMaterial
);

router.delete('/admin/:id', 
  authMiddleware, 
  checkPermission(['admin', 'sub-admin']), 
  deleteStudyMaterial
);

module.exports = router;
