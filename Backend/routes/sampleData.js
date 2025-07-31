const express = require('express');
const router = express.Router();
const StudyMaterial = require('../models/StudyMaterial');
const Admin = require('../models/Admin');

// Add sample study materials
router.post('/add-sample-materials', async (req, res) => {
  try {
    console.log('🚀 Adding sample study materials...');

    // Get first admin user
    const admin = await Admin.findOne();
    
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: 'No admin user found. Please create an admin user first.'
      });
    }

    // Sample materials data
    const sampleMaterials = [
      {
        title: 'Quantitative Aptitude Formula Book',
        description: 'Complete formula book covering all topics of Quantitative Aptitude including Arithmetic, Algebra, Geometry, and Number Systems.',
        subject: 'Quantitative Aptitude',
        type: 'PDF',
        fileName: 'QA_Formula_Book.pdf',
        filePath: 'uploads/study-materials/sample-qa-formulas.txt',
        fileSize: '5.2 MB',
        tags: ['formulas', 'QA', 'reference', 'mathematics'],
        downloadCount: 1234,
        uploadedBy: admin._id,
        isActive: true
      },
      {
        title: 'Verbal Ability Video Lectures Series',
        description: 'Comprehensive video lecture series covering Reading Comprehension, Para Jumbles, Critical Reasoning, and Grammar.',
        subject: 'Verbal Ability',
        type: 'Video',
        fileName: 'VA_Video_Lectures.mp4',
        filePath: 'uploads/study-materials/sample-va-videos.txt',
        fileSize: '850 MB',
        tags: ['video', 'verbal', 'lectures', 'comprehension'],
        downloadCount: 856,
        uploadedBy: admin._id,
        isActive: true
      },
      {
        title: 'Data Interpretation Practice Sets',
        description: 'Collection of 50 practice sets for Data Interpretation covering Tables, Charts, Graphs, and Caselets.',
        subject: 'Data Interpretation',
        type: 'Practice Sets',
        fileName: 'DI_Practice_Sets.pdf',
        filePath: 'uploads/study-materials/sample-di-practice.txt',
        fileSize: '3.8 MB',
        tags: ['practice', 'DI', 'charts', 'graphs'],
        downloadCount: 945,
        uploadedBy: admin._id,
        isActive: true
      },
      {
        title: 'Logical Reasoning Shortcuts & Tricks',
        description: 'Quick shortcuts and time-saving tricks for solving Logical Reasoning questions efficiently.',
        subject: 'Logical Reasoning',
        type: 'Notes',
        fileName: 'LR_Shortcuts.pdf',
        filePath: 'uploads/study-materials/sample-lr-shortcuts.txt',
        fileSize: '2.1 MB',
        tags: ['shortcuts', 'tricks', 'logical reasoning', 'time-saving'],
        downloadCount: 672,
        uploadedBy: admin._id,
        isActive: true
      },
      {
        title: 'CAT Previous Year Papers (2010-2023)',
        description: 'Complete collection of CAT previous year question papers with detailed solutions and explanations.',
        subject: 'All Subjects',
        type: 'PDF',
        fileName: 'CAT_Previous_Papers.pdf',
        filePath: 'uploads/study-materials/sample-cat-papers.txt',
        fileSize: '12.5 MB',
        tags: ['previous papers', 'CAT', 'solutions', 'practice'],
        downloadCount: 2156,
        uploadedBy: admin._id,
        isActive: true
      },
      {
        title: 'Reading Comprehension Passages',
        description: 'Collection of high-quality Reading Comprehension passages from various topics with detailed explanations.',
        subject: 'Verbal Ability',
        type: 'PDF',
        fileName: 'RC_Passages.pdf',
        filePath: 'uploads/study-materials/sample-rc-passages.txt',
        fileSize: '7.3 MB',
        tags: ['reading comprehension', 'passages', 'verbal', 'practice'],
        downloadCount: 789,
        uploadedBy: admin._id,
        isActive: true
      },
      {
        title: 'Quantitative Aptitude Video Solutions',
        description: 'Video solutions for complex QA problems with step-by-step explanations and alternative methods.',
        subject: 'Quantitative Aptitude',
        type: 'Video',
        fileName: 'QA_Video_Solutions.mp4',
        filePath: 'uploads/study-materials/sample-qa-solutions.txt',
        fileSize: '1.2 GB',
        tags: ['video solutions', 'QA', 'problem solving', 'mathematics'],
        downloadCount: 543,
        uploadedBy: admin._id,
        isActive: true
      },
      {
        title: 'General Knowledge Current Affairs',
        description: 'Latest current affairs and general knowledge updates for competitive exam preparation.',
        subject: 'General Knowledge',
        type: 'PDF',
        fileName: 'GK_Current_Affairs.pdf',
        filePath: 'uploads/study-materials/sample-gk-current.txt',
        fileSize: '4.6 MB',
        tags: ['current affairs', 'GK', 'general knowledge', 'updates'],
        downloadCount: 421,
        uploadedBy: admin._id,
        isActive: true
      }
    ];

    // Clear existing materials to avoid duplicates
    await StudyMaterial.deleteMany({});
    console.log('🗑️ Cleared existing study materials');

    // Insert all materials
    const insertedMaterials = await StudyMaterial.insertMany(sampleMaterials);
    
    console.log(`✅ Successfully added ${insertedMaterials.length} study materials`);

    // Create summary
    const totalMaterials = await StudyMaterial.countDocuments();
    const bySubject = await StudyMaterial.aggregate([
      { $group: { _id: '$subject', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      message: `Successfully added ${insertedMaterials.length} study materials`,
      data: {
        totalMaterials,
        materialsBySubject: bySubject,
        materials: insertedMaterials
      }
    });

  } catch (error) {
    console.error('❌ Error adding sample materials:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding sample materials',
      error: error.message
    });
  }
});

// Get study materials count
router.get('/materials-count', async (req, res) => {
  try {
    const count = await StudyMaterial.countDocuments();
    const bySubject = await StudyMaterial.aggregate([
      { $group: { _id: '$subject', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalMaterials: count,
        materialsBySubject: bySubject
      }
    });
  } catch (error) {
    console.error('❌ Error getting materials count:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting materials count',
      error: error.message
    });
  }
});

module.exports = router;
