const mongoose = require('mongoose');
require('dotenv').config();

const MockTestSeries = require('../models/MockTestSeries');
const MockTest = require('../models/MockTest');
const MockTestQuestion = require('../models/MockTestQuestion');
const Admin = require('../models/Admin');

const sampleMockTestSeries = [
  {
    title: 'CAT 2026 Mock Test Series',
    description: 'Comprehensive mock test series designed as per the latest CAT pattern with detailed analysis and explanations.',
    category: 'CAT',
    freeTests: 3,
    price: 499,
    validity: 365,
    isPublished: true,
    tags: ['CAT', 'latest-pattern', 'comprehensive', 'analysis']
  },
  {
    title: 'XAT 2026 Complete Series',
    description: 'Full-length XAT mock tests with decision-making and essay writing practice.',
    category: 'XAT',
    freeTests: 2,
    price: 399,
    validity: 365,
    isPublished: true,
    tags: ['XAT', 'decision-making', 'essay', 'complete']
  },
  {
    title: 'Free CAT Practice Tests',
    description: 'Free mock tests for CAT preparation with basic analysis.',
    category: 'CAT',
    freeTests: 5,
    price: 0,
    validity: 180,
    isPublished: true,
    tags: ['free', 'practice', 'CAT', 'basic']
  }
];

const sampleMockTests = [
  {
    title: 'CAT Mock Test 1 - Foundation Level',
    description: 'Foundation level mock test covering all three sections with moderate difficulty.',
    duration: 180,
    difficulty: 'Medium',
    isFree: true,
    isPublished: true,
    sections: [
      {
        name: 'VARC',
        duration: 60,
        totalQuestions: 24,
        totalMarks: 72
      },
      {
        name: 'DILR',
        duration: 60,
        totalQuestions: 20,
        totalMarks: 60
      },
      {
        name: 'QA',
        duration: 60,
        totalQuestions: 22,
        totalMarks: 66
      }
    ],
    instructions: {
      general: [
        'This test contains 66 questions across three sections: VARC, DILR, and QA.',
        'Each section has a time limit of 60 minutes.',
        'You cannot switch between sections once you move to the next section.',
        'Each correct answer carries 3 marks.',
        'Each incorrect answer carries -1 mark.',
        'There is no negative marking for unanswered questions.',
        'Use of calculator is not allowed.',
        'Rough work can be done on the provided sheets.'
      ],
      sectionSpecific: {
        VARC: [
          'This section contains Reading Comprehension passages and Verbal Ability questions.',
          'Read the passages carefully before attempting questions.',
          'Manage your time effectively between RC and VA questions.'
        ],
        DILR: [
          'This section contains Data Interpretation and Logical Reasoning questions.',
          'DI questions are based on charts, graphs, and tables.',
          'LR questions test your logical thinking and reasoning ability.'
        ],
        QA: [
          'This section contains Quantitative Ability questions.',
          'Questions cover topics like Arithmetic, Algebra, Geometry, and Number Systems.',
          'Use mental calculations and shortcuts to save time.'
        ]
      }
    }
  },
  {
    title: 'CAT Mock Test 2 - Intermediate Level',
    description: 'Intermediate level mock test with increased difficulty and time pressure.',
    duration: 180,
    difficulty: 'Medium',
    isFree: true,
    isPublished: true,
    sections: [
      {
        name: 'VARC',
        duration: 60,
        totalQuestions: 24,
        totalMarks: 72
      },
      {
        name: 'DILR',
        duration: 60,
        totalQuestions: 20,
        totalMarks: 60
      },
      {
        name: 'QA',
        duration: 60,
        totalQuestions: 22,
        totalMarks: 66
      }
    ],
    instructions: {
      general: [
        'This test contains 66 questions across three sections: VARC, DILR, and QA.',
        'Each section has a time limit of 60 minutes.',
        'You cannot switch between sections once you move to the next section.',
        'Each correct answer carries 3 marks.',
        'Each incorrect answer carries -1 mark.',
        'There is no negative marking for unanswered questions.',
        'Use of calculator is not allowed.',
        'Rough work can be done on the provided sheets.'
      ]
    }
  },
  {
    title: 'CAT Mock Test 3 - Advanced Level',
    description: 'Advanced level mock test simulating actual CAT difficulty.',
    duration: 180,
    difficulty: 'Hard',
    isFree: true,
    isPublished: true,
    sections: [
      {
        name: 'VARC',
        duration: 60,
        totalQuestions: 24,
        totalMarks: 72
      },
      {
        name: 'DILR',
        duration: 60,
        totalQuestions: 20,
        totalMarks: 60
      },
      {
        name: 'QA',
        duration: 60,
        totalQuestions: 22,
        totalMarks: 66
      }
    ],
    instructions: {
      general: [
        'This test contains 66 questions across three sections: VARC, DILR, and QA.',
        'Each section has a time limit of 60 minutes.',
        'You cannot switch between sections once you move to the next section.',
        'Each correct answer carries 3 marks.',
        'Each incorrect answer carries -1 mark.',
        'There is no negative marking for unanswered questions.',
        'Use of calculator is not allowed.',
        'Rough work can be done on the provided sheets.'
      ]
    }
  }
];

const sampleQuestions = [
  {
    questionText: 'If the sum of first n natural numbers is 210, find the value of n.',
    questionType: 'MCQ',
    section: 'QA',
    topic: 'Sequences and Series',
    options: [
      { optionText: '18', isCorrect: false },
      { optionText: '19', isCorrect: false },
      { optionText: '20', isCorrect: true },
      { optionText: '21', isCorrect: false }
    ],
    correctAnswer: '20',
    explanation: 'Sum of first n natural numbers = n(n+1)/2 = 210. Solving: n(n+1) = 420. By trial, n = 20 gives 20×21 = 420.',
    marks: { positive: 3, negative: -1 },
    difficulty: 'Medium'
  },
  {
    questionText: 'What is the next term in the sequence: 2, 6, 12, 20, 30, ?',
    questionType: 'MCQ',
    section: 'QA',
    topic: 'Number Patterns',
    options: [
      { optionText: '40', isCorrect: false },
      { optionText: '42', isCorrect: true },
      { optionText: '44', isCorrect: false },
      { optionText: '46', isCorrect: false }
    ],
    correctAnswer: '42',
    explanation: 'The differences are 4, 6, 8, 10... (increasing by 2). Next difference is 12, so 30 + 12 = 42.',
    marks: { positive: 3, negative: -1 },
    difficulty: 'Easy'
  },
  {
    questionText: 'In the word "MANAGEMENT", how many different ways can the letters be arranged?',
    questionType: 'MCQ',
    section: 'QA',
    topic: 'Permutations and Combinations',
    options: [
      { optionText: '453600', isCorrect: true },
      { optionText: '362880', isCorrect: false },
      { optionText: '604800', isCorrect: false },
      { optionText: '518400', isCorrect: false }
    ],
    correctAnswer: '453600',
    explanation: 'MANAGEMENT has 10 letters with M-2, A-2, N-2, E-2, G-1, T-1. Arrangements = 10!/(2!×2!×2!×2!) = 453600.',
    marks: { positive: 3, negative: -1 },
    difficulty: 'Hard'
  },
  {
    questionText: 'Which of the following words is most similar in meaning to "VERBOSE"?',
    questionType: 'MCQ',
    section: 'VARC',
    topic: 'Vocabulary',
    options: [
      { optionText: 'Concise', isCorrect: false },
      { optionText: 'Wordy', isCorrect: true },
      { optionText: 'Silent', isCorrect: false },
      { optionText: 'Clear', isCorrect: false }
    ],
    correctAnswer: 'Wordy',
    explanation: 'Verbose means using more words than needed, which is synonymous with wordy.',
    marks: { positive: 3, negative: -1 },
    difficulty: 'Easy'
  },
  {
    questionText: 'The author\'s tone in the passage can best be described as:',
    questionType: 'MCQ',
    section: 'VARC',
    topic: 'Reading Comprehension',
    passage: 'Despite the overwhelming evidence supporting climate change, there are still those who choose to ignore the scientific consensus. This willful blindness to facts is not just disappointing—it is dangerous for our planet\'s future.',
    options: [
      { optionText: 'Neutral and objective', isCorrect: false },
      { optionText: 'Critical and concerned', isCorrect: true },
      { optionText: 'Humorous and light-hearted', isCorrect: false },
      { optionText: 'Apologetic and uncertain', isCorrect: false }
    ],
    correctAnswer: 'Critical and concerned',
    explanation: 'The author uses strong words like "willful blindness" and "dangerous" showing criticism and concern.',
    marks: { positive: 3, negative: -1 },
    difficulty: 'Medium'
  }
];

const addSampleMockTests = async () => {
  try {
    console.log('🚀 Starting to add sample mock tests...');

    // Connect to database only if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ Connected to MongoDB');
    } else {
      console.log('✅ Using existing MongoDB connection');
    }

    // Check if mock test series already exist
    const existingSeries = await MockTestSeries.countDocuments();
    if (existingSeries > 0) {
      console.log(`📚 ${existingSeries} mock test series already exist in database`);
      console.log('🔄 Skipping sample data creation to avoid duplicates');
      return;
    }

    // Get admin user
    let admin = await Admin.findOne();
    if (!admin) {
      console.log('👨‍💼 Creating sample admin...');
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      admin = new Admin({
        name: 'MockTest Admin',
        email: 'admin@mocktest.com',
        password: hashedPassword,
        phoneNumber: '9876543201'
      });
      await admin.save();
      console.log('✅ Sample admin created');
    }

    // Create mock test series
    console.log('📝 Creating sample mock test series...');
    const createdSeries = [];
    
    for (const seriesData of sampleMockTestSeries) {
      const series = new MockTestSeries({
        ...seriesData,
        createdBy: admin._id,
        publishedAt: seriesData.isPublished ? new Date() : null
      });
      await series.save();
      createdSeries.push(series);
    }

    console.log(`✅ Created ${createdSeries.length} mock test series`);

    // Create sample questions
    console.log('❓ Creating sample questions...');
    const createdQuestions = [];

    for (const questionData of sampleQuestions) {
      const question = new MockTestQuestion({
        ...questionData,
        createdBy: admin._id
      });
      await question.save();
      createdQuestions.push(question);
    }

    console.log(`✅ Created ${createdQuestions.length} sample questions`);

    // Create mock tests and assign questions
    console.log('📋 Creating sample mock tests...');
    const catSeries = createdSeries.find(s => s.title.includes('CAT 2026'));
    
    for (let i = 0; i < sampleMockTests.length; i++) {
      const testData = sampleMockTests[i];
      
      // Assign questions to sections
      const sectionsWithQuestions = testData.sections.map(section => {
        const sectionQuestions = createdQuestions
          .filter(q => q.section === section.name)
          .slice(0, Math.min(section.totalQuestions, createdQuestions.filter(q => q.section === section.name).length));
        
        return {
          ...section,
          questions: sectionQuestions.map(q => q._id)
        };
      });

      const test = new MockTest({
        ...testData,
        seriesId: catSeries._id,
        testNumber: i + 1,
        totalQuestions: testData.sections.reduce((sum, s) => sum + s.totalQuestions, 0),
        totalMarks: testData.sections.reduce((sum, s) => sum + s.totalMarks, 0),
        sections: sectionsWithQuestions,
        createdBy: admin._id,
        publishedAt: testData.isPublished ? new Date() : null
      });

      await test.save();
    }

    // Update series total tests count
    await MockTestSeries.findByIdAndUpdate(catSeries._id, {
      totalTests: sampleMockTests.length
    });

    console.log(`✅ Created ${sampleMockTests.length} mock tests`);

    // Display summary
    const totalSeries = await MockTestSeries.countDocuments();
    const totalTests = await MockTest.countDocuments();
    const totalQuestions = await MockTestQuestion.countDocuments();

    console.log('\n📊 Summary:');
    console.log(`📚 Total Mock Test Series: ${totalSeries}`);
    console.log(`📋 Total Mock Tests: ${totalTests}`);
    console.log(`❓ Total Questions: ${totalQuestions}`);
    console.log('\n🎉 Sample mock test data added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding sample mock tests:', error);
  } finally {
    // Don't disconnect when called from main server
    if (require.main === module) {
      await mongoose.disconnect();
      console.log('👋 Disconnected from MongoDB');
    }
  }
};

// Run the script
if (require.main === module) {
  addSampleMockTests();
}

module.exports = addSampleMockTests;
