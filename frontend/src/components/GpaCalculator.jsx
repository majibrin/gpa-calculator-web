// src/components/GpaCalculator.jsx
import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Calculator,
  RotateCcw,
  X,
  GraduationCap,
  BookOpen,
  Loader as LoaderIcon
} from 'lucide-react';
import './GpaCalculator.css';

function GpaCalculator({ onHide }) {
  const [calcMode, setCalcMode] = useState('GPA');
  const [courses, setCourses] = useState([{ grade: 'A', credits: 3, id: Date.now() }]);
  const [semesters, setSemesters] = useState([{ gpa: '', credits: '', id: Date.now() }]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const gradePoints = { 
    'A': 5.0, 
    'B': 4.0, 
    'C': 3.0, 
    'D': 2.0, 
    'E': 1.0, 
    'F': 0.0 
  };
  
  const gradeOptions = ['A', 'B', 'C', 'D', 'E', 'F'];

  const addCourse = () => {
    setCourses([...courses, { 
      grade: 'A', 
      credits: 3, 
      id: Date.now() + Math.random() 
    }]);
  };

  const removeCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id, field, value) => {
    setCourses(courses.map(c => {
      if (c.id === id) {
        if (field === 'credits') {
          return { ...c, [field]: value === '' ? '' : Number(value) };
        }
        return { ...c, [field]: value };
      }
      return c;
    }));
  };

  const addSemester = () => {
    setSemesters([...semesters, { 
      gpa: '', 
      credits: '', 
      id: Date.now() + Math.random() 
    }]);
  };

  const removeSemester = (id) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter(s => s.id !== id));
    }
  };

  const updateSemester = (id, field, value) => {
    setSemesters(semesters.map(s => {
      if (s.id === id) {
        return { ...s, [field]: value === '' ? '' : Number(value) };
      }
      return s;
    }));
  };

  const getClassificationInfo = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return { text: 'Invalid', color: '#6c757d' };
    
    if (num >= 4.5) return { text: 'First Class', color: '#28a745' };
    if (num >= 3.5) return { text: 'Second Class Upper (2:1)', color: '#17a2b8' };
    if (num >= 2.5) return { text: 'Second Class Lower (2:2)', color: '#ffc107' };
    if (num >= 1.5) return { text: 'Third Class', color: '#fd7e14' };
    if (num >= 1.0) return { text: 'Pass', color: '#dc3545' };
    return { text: 'Fail', color: '#721c24' };
  };

  const handleCalculate = () => {
    setLoading(true);
    setError('');
    
    // Simulate async calculation
    setTimeout(() => {
      try {
        if (calcMode === 'GPA') {
          const totalPoints = courses.reduce((total, course) => {
            const points = gradePoints[course.grade] || 0;
            const credits = Number(course.credits) || 0;
            return total + (points * credits);
          }, 0);
          
          const totalCredits = courses.reduce((total, course) => {
            return total + (Number(course.credits) || 0);
          }, 0);
          
          if (totalCredits === 0) {
            throw new Error('Total credits cannot be zero');
          }
          
          const calculatedGPA = totalPoints / totalCredits;
          setResult(calculatedGPA.toFixed(2));
          
        } else {
          let totalQualityPoints = 0;
          let totalCredits = 0;
          
          semesters.forEach(semester => {
            const gpa = Number(semester.gpa) || 0;
            const credits = Number(semester.credits) || 0;
            
            if (!isNaN(gpa) && !isNaN(credits)) {
              totalQualityPoints += gpa * credits;
              totalCredits += credits;
            }
          });
          
          if (totalCredits === 0) {
            throw new Error('Please enter credits for at least one semester');
          }
          
          const calculatedCGPA = totalQualityPoints / totalCredits;
          setResult(calculatedCGPA.toFixed(2));
        }
      } catch (err) {
        setError(err.message);
        setResult(null);
      } finally {
        setLoading(false);
      }
    }, 500); // Simulate 500ms delay for calculation
  };

  const reset = () => {
    setCourses([{ grade: 'A', credits: 3, id: Date.now() }]);
    setSemesters([{ gpa: '', credits: '', id: Date.now() }]);
    setResult(null);
    setError('');
    setLoading(false);
  };

  const handleModeChange = (mode) => {
    if (loading) return;
    setCalcMode(mode);
    setResult(null);
    setError('');
  };

  return (
    <div className="gpa-container" role="dialog" aria-label="GPA Calculator">
      <div className="gpa-header">
        <div className="mode-tabs">
          <button
            type="button"
            className={calcMode === 'GPA' ? 'active' : ''}
            onClick={() => handleModeChange('GPA')}
            disabled={loading}
            aria-label="Switch to GPA mode"
            aria-pressed={calcMode === 'GPA'}
          >
            <BookOpen size={14} style={{ marginRight: '6px' }} aria-hidden="true" />
            GPA
          </button>
          <button
            type="button"
            className={calcMode === 'CGPA' ? 'active' : ''}
            onClick={() => handleModeChange('CGPA')}
            disabled={loading}
            aria-label="Switch to CGPA mode"
            aria-pressed={calcMode === 'CGPA'}
          >
            <GraduationCap size={14} style={{ marginRight: '6px' }} aria-hidden="true" />
            CGPA
          </button>
        </div>
        
        <button
          type="button"
          className="close-x"
          onClick={onHide}
          disabled={loading}
          aria-label="Close GPA calculator"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      {error && (
        <div className="gpa-error" role="alert" aria-live="assertive">
          <span className="error-icon" aria-hidden="true">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="gpa-scroll-area">
        {calcMode === 'GPA' ? (
          <>
            {courses.map((course, index) => (
              <div 
                key={course.id} 
                className="course-row"
                role="group"
                aria-label={`Course ${index + 1}`}
              >
                <span className="row-label" aria-hidden="true">
                  C{index + 1}
                </span>
                
                <select
                  value={course.grade}
                  onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                  disabled={loading}
                  aria-label={`Grade for course ${index + 1}`}
                >
                  {gradeOptions.map(grade => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
                
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="Units"
                  value={course.credits}
                  onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                  disabled={loading}
                  aria-label={`Credit units for course ${index + 1}`}
                />
                
                <button
                  type="button"
                  className="del-btn"
                  onClick={() => removeCourse(course.id)}
                  disabled={courses.length <= 1 || loading}
                  aria-label={`Remove course ${index + 1}`}
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              className="add-btn"
              onClick={addCourse}
              disabled={loading}
              aria-label="Add new course"
            >
              <Plus size={14} aria-hidden="true" />
              Add Course
            </button>
          </>
        ) : (
          <>
            {semesters.map((semester, index) => (
              <div 
                key={semester.id} 
                className="course-row sem-row"
                role="group"
                aria-label={`Semester ${index + 1}`}
              >
                <span className="row-label" aria-hidden="true">
                  S{index + 1}
                </span>
                
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="5.0"
                  placeholder="GPA"
                  value={semester.gpa}
                  onChange={(e) => updateSemester(semester.id, 'gpa', e.target.value)}
                  disabled={loading}
                  aria-label={`GPA for semester ${index + 1}`}
                />
                
                <input
                  type="number"
                  min="0"
                  placeholder="Units"
                  value={semester.credits}
                  onChange={(e) => updateSemester(semester.id, 'credits', e.target.value)}
                  disabled={loading}
                  aria-label={`Total units for semester ${index + 1}`}
                />
                
                <button
                  type="button"
                  className="del-btn"
                  onClick={() => removeSemester(semester.id)}
                  disabled={semesters.length <= 1 || loading}
                  aria-label={`Remove semester ${index + 1}`}
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              className="add-btn"
              onClick={addSemester}
              disabled={loading}
              aria-label="Add new semester"
            >
              <Plus size={14} aria-hidden="true" />
              Add Semester
            </button>
          </>
        )}
      </div>

      <div className="gpa-footer-actions">
        <button
          type="button"
          className="main-calc-btn"
          onClick={handleCalculate}
          disabled={loading}
          aria-label={`Calculate ${calcMode}`}
        >
          {loading ? (
            <div className="gpa-calc-loading">
              <LoaderIcon 
                size={18} 
                className="gpa-loading-spinner" 
                aria-hidden="true" 
              />
              <span>Calculating...</span>
            </div>
          ) : (
            <>
              <Calculator size={18} style={{ marginRight: '8px' }} aria-hidden="true" />
              {`Calculate ${calcMode}`}
            </>
          )}
        </button>
        
        <button
          type="button"
          className="reset-btn"
          onClick={reset}
          disabled={loading}
          aria-label="Reset calculator"
        >
          <RotateCcw size={18} aria-hidden="true" />
        </button>
      </div>

      {result !== null && (
        <div 
          className="gpa-result-box" 
          role="status"
          aria-live="polite"
          aria-label={`Calculation result: ${result}`}
        >
          <div className="result-val">
            {result}
          </div>
          <div 
            className="result-tag"
            style={{ backgroundColor: getClassificationInfo(result).color }}
          >
            {getClassificationInfo(result).text}
          </div>
        </div>
      )}
    </div>
  );
}

export default GpaCalculator;
