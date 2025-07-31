import React, { useState, useEffect } from 'react';
import './MockTestManagement.css';
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiSearch,
  FiFilter,
  FiBarChart2,
  FiClock,
  FiUsers,
  FiFileText,
  FiSettings,
  FiPlay,
  FiPause,
  FiRefreshCw
} from 'react-icons/fi';

const MockTestManagement = () => {
  const [activeTab, setActiveTab] = useState('series');
  const [series, setSeries] = useState([]);
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    search: ''
  });

  // Fetch series
  const fetchSeries = async () => {
    setLoading(true);
    try {
      const adminToken = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams({
        page: 1,
        limit: 20,
        category: filters.category !== 'all' ? filters.category : '',
        search: filters.search
      });

      const response = await fetch(`/api/admin/mock-tests/series?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setSeries(data.series);
      } else {
        console.error('Failed to fetch series:', data.message);
      }
    } catch (error) {
      console.error('Error fetching series:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const adminToken = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams({
        page: 1,
        limit: 20,
        section: filters.section || '',
        search: filters.search
      });

      const response = await fetch(`/api/admin/mock-tests/questions?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setQuestions(data.questions);
      } else {
        console.error('Failed to fetch questions:', data.message);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'series') {
      fetchSeries();
    } else if (activeTab === 'questions') {
      fetchQuestions();
    }
  }, [activeTab, filters]);

  // Toggle series publication
  const toggleSeriesPublication = async (seriesId, publish) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/mock-tests/series/${seriesId}/publish`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ publish })
      });

      const data = await response.json();
      if (data.success) {
        fetchSeries();
        alert(`Series ${publish ? 'published' : 'unpublished'} successfully`);
      } else {
        alert(data.message || 'Failed to update series');
      }
    } catch (error) {
      console.error('Error toggling series publication:', error);
      alert('Failed to update series');
    }
  };

  const CreateSeriesModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      category: 'CAT',
      freeTests: 0,
      price: 0,
      validity: 365,
      tags: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);

      try {
        const adminToken = localStorage.getItem('adminToken');
        const response = await fetch('/api/admin/mock-tests/series', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          alert('Mock test series created successfully!');
          setShowCreateModal(false);
          setFormData({
            title: '',
            description: '',
            category: 'CAT',
            freeTests: 0,
            price: 0,
            validity: 365,
            tags: ''
          });
          fetchSeries();
        } else {
          alert(data.message || 'Failed to create series');
        }
      } catch (error) {
        console.error('Error creating series:', error);
        alert('Failed to create series');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Create Mock Test Series</h3>
            <button onClick={() => setShowCreateModal(false)} className="close-btn">×</button>
          </div>
          
          <form onSubmit={handleSubmit} className="create-form">
            <div className="form-group">
              <label>Series Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., CAT 2026 Mock Test Series"
                required
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the mock test series"
                rows={3}
                maxLength={500}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  required
                >
                  <option value="CAT">CAT</option>
                  <option value="XAT">XAT</option>
                  <option value="SNAP">SNAP</option>
                  <option value="NMAT">NMAT</option>
                  <option value="CMAT">CMAT</option>
                  <option value="MAT">MAT</option>
                  <option value="GMAT">GMAT</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="form-group">
                <label>Free Tests</label>
                <input
                  type="number"
                  value={formData.freeTests}
                  onChange={(e) => setFormData(prev => ({ ...prev, freeTests: parseInt(e.target.value) || 0 }))}
                  min="0"
                  placeholder="Number of free tests"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                  min="0"
                  placeholder="Price for full series"
                />
              </div>

              <div className="form-group">
                <label>Validity (Days)</label>
                <input
                  type="number"
                  value={formData.validity}
                  onChange={(e) => setFormData(prev => ({ ...prev, validity: parseInt(e.target.value) || 365 }))}
                  min="1"
                  placeholder="Validity in days"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Add tags separated by commas (e.g., beginner, advanced, latest pattern)"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setShowCreateModal(false)} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="submit-btn">
                {submitting ? 'Creating...' : 'Create Series'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const SeriesCard = ({ series: seriesItem }) => (
    <div className="management-card">
      <div className="card-header">
        <div className="series-info">
          <h4>{seriesItem.title}</h4>
          <div className="series-meta">
            <span className="category-tag">{seriesItem.category}</span>
            <span className={`status-badge ${seriesItem.isPublished ? 'published' : 'draft'}`}>
              {seriesItem.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
          <p className="series-description">{seriesItem.description}</p>
        </div>
        <div className="card-actions">
          <div className="action-buttons">
            <button
              className="action-btn"
              onClick={() => toggleSeriesPublication(seriesItem._id, !seriesItem.isPublished)}
              title={seriesItem.isPublished ? 'Unpublish' : 'Publish'}
            >
              {seriesItem.isPublished ? <FiEyeOff /> : <FiEye />}
            </button>
            <button className="action-btn" title="Edit">
              <FiEdit3 />
            </button>
            <button className="action-btn delete" title="Delete">
              <FiTrash2 />
            </button>
          </div>
        </div>
      </div>
      
      <div className="card-content">
        <div className="series-stats">
          <div className="stat-item">
            <FiFileText />
            <span>{seriesItem.actualTestCount || 0} Tests</span>
          </div>
          <div className="stat-item">
            <FiUsers />
            <span>{seriesItem.enrolledCount || 0} Enrolled</span>
          </div>
          <div className="stat-item">
            <FiClock />
            <span>{seriesItem.validity} Days</span>
          </div>
          <div className="stat-item">
            <span className="price">₹{seriesItem.price || 'Free'}</span>
          </div>
        </div>
        
        {seriesItem.tags && seriesItem.tags.length > 0 && (
          <div className="series-tags">
            {seriesItem.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const QuestionCard = ({ question }) => (
    <div className="management-card">
      <div className="card-header">
        <div className="question-info">
          <h4>{question.questionText.substring(0, 100)}...</h4>
          <div className="question-meta">
            <span className="section-tag">{question.section}</span>
            <span className="type-tag">{question.questionType}</span>
            <span className={`difficulty-badge ${question.difficulty.toLowerCase()}`}>
              {question.difficulty}
            </span>
          </div>
        </div>
        <div className="card-actions">
          <div className="action-buttons">
            <button className="action-btn" title="Edit">
              <FiEdit3 />
            </button>
            <button className="action-btn delete" title="Delete">
              <FiTrash2 />
            </button>
          </div>
        </div>
      </div>
      
      <div className="card-content">
        <div className="question-details">
          <div className="detail-item">
            <strong>Topic:</strong> {question.topic || 'Not specified'}
          </div>
          <div className="detail-item">
            <strong>Marks:</strong> +{question.marks.positive}, {question.marks.negative}
          </div>
          <div className="detail-item">
            <strong>Options:</strong> {question.options.length}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mocktest-management">
      <div className="management-header">
        <h1>Mock Test Management</h1>
        <div className="header-actions">
          <button 
            className="primary-btn"
            onClick={() => setShowCreateModal(true)}
          >
            <FiPlus /> Create {activeTab === 'series' ? 'Series' : activeTab === 'tests' ? 'Test' : 'Question'}
          </button>
          <button onClick={() => {
            if (activeTab === 'series') fetchSeries();
            else if (activeTab === 'questions') fetchQuestions();
          }} className="refresh-btn">
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      <div className="management-tabs">
        <button 
          className={`tab-btn ${activeTab === 'series' ? 'active' : ''}`}
          onClick={() => setActiveTab('series')}
        >
          <FiFileText /> Series
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tests' ? 'active' : ''}`}
          onClick={() => setActiveTab('tests')}
        >
          <FiPlay /> Tests
        </button>
        <button 
          className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          <FiEdit3 /> Questions
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <FiBarChart2 /> Analytics
        </button>
      </div>

      <div className="management-filters">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
        
        {activeTab === 'series' && (
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="all">All Categories</option>
            <option value="CAT">CAT</option>
            <option value="XAT">XAT</option>
            <option value="SNAP">SNAP</option>
            <option value="NMAT">NMAT</option>
            <option value="CMAT">CMAT</option>
            <option value="MAT">MAT</option>
            <option value="GMAT">GMAT</option>
            <option value="General">General</option>
          </select>
        )}

        {activeTab === 'questions' && (
          <select
            value={filters.section || 'all'}
            onChange={(e) => setFilters(prev => ({ ...prev, section: e.target.value === 'all' ? '' : e.target.value }))}
          >
            <option value="all">All Sections</option>
            <option value="VARC">VARC</option>
            <option value="DILR">DILR</option>
            <option value="QA">QA</option>
          </select>
        )}
      </div>

      <div className="management-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'series' && (
              <div className="series-grid">
                {series.length === 0 ? (
                  <div className="empty-state">
                    <FiFileText size={48} />
                    <h3>No Mock Test Series</h3>
                    <p>Create your first mock test series to get started.</p>
                    <button 
                      className="primary-btn"
                      onClick={() => setShowCreateModal(true)}
                    >
                      Create Series
                    </button>
                  </div>
                ) : (
                  series.map((seriesItem) => (
                    <SeriesCard key={seriesItem._id} series={seriesItem} />
                  ))
                )}
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="questions-grid">
                {questions.length === 0 ? (
                  <div className="empty-state">
                    <FiEdit3 size={48} />
                    <h3>No Questions</h3>
                    <p>Add questions to build your mock tests.</p>
                    <button 
                      className="primary-btn"
                      onClick={() => setShowCreateModal(true)}
                    >
                      Add Question
                    </button>
                  </div>
                ) : (
                  questions.map((question) => (
                    <QuestionCard key={question._id} question={question} />
                  ))
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="analytics-content">
                <div className="analytics-placeholder">
                  <FiBarChart2 size={48} />
                  <h3>Analytics Dashboard</h3>
                  <p>Detailed analytics and reports will be available here.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showCreateModal && activeTab === 'series' && <CreateSeriesModal />}
    </div>
  );
};

export default MockTestManagement;
