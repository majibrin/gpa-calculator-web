import React, { useState } from 'react';
import { Plus, Trash2, Calculator, BookOpen, Award, RotateCcw } from 'lucide-react';
import './GpaCalculator.css';

const GpaCalculator = () => {
  const [courses, setCourses] = useState([{ id: Date.now(), grade: '5', units: '' }]);
  const [result, setResult] = useState(null);

  return (
    <div className="calc-container">
      {/* Note: Header.jsx handles the top bar now. We just need the card here. */}
      
      <div className="calculator-card">
        <div className="blue-accent"></div>
        
        <h2 className="calc-title">
          <BookOpen size={20} color="#3b82f6" /> Semester GPA
        </h2>

        <div className="calc-body">
          {courses.map((course, index) => (
            <div key={course.id} className="input-row">
              <span className="row-num">C{index + 1}</span>
              
              {/* RESTORED A-F */}
              <select className="form-select">
                <option value="5">A</option>
                <option value="4">B</option>
                <option value="3">C</option>
                <option value="2">D</option>
                <option value="1">E</option>
                <option value="0">F</option>
              </select>

              {/* FIXED: Added className form-select to the Unit input too */}
              <input 
                type="number" 
                placeholder="Unit" 
                className="form-select" 
              />
              
              <button 
                className="btn-delete"
                onClick={() => setCourses(courses.filter(c => c.id !== course.id))}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <button className="btn-secondary" onClick={() => setCourses([...courses, {id: Date.now(), grade: '5', units: ''}])}>
          <Plus size={18} /> Add Course
        </button>

        <button className="btn-primary" onClick={() => setResult({gpa: "5.00", standing: "First Class"})}>
          <Calculator size={18} /> Calculate
        </button>

        {result && (
          <div className="result-area">
            <div className="gpa-score">{result.gpa}</div>
            <div className="standing-badge"><Award size={16} /> {result.standing}</div>
            <button className="btn-reset" onClick={() => setResult(null)}>
               <RotateCcw size={14} /> Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GpaCalculator;
