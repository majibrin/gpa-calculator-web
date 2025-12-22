import React, { useState } from 'react';
import './GpaCalculator.css'; // external styles for maintainability
import axios from 'axios';

function GpaCalculator({ onHide }) {
const [courses, setCourses] = useState([{ grade: 'A', credits: 3, id: 1 }]);
const [gpaResult, setGpaResult] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// Nigerian 5.00 Scale Grade Points
const gradePoints = { 'A': 5.0, 'B': 4.0, 'C': 3.0, 'D': 2.0, 'E': 1.0, 'F': 0.0 };
const gradeOptions = ['A', 'B', 'C', 'D', 'E', 'F'];

const addCourse = () => {
setCourses([...courses, { grade: 'A', credits: 3, id: Date.now() }]);
};

const removeCourse = (id) => {
if (courses.length > 1) setCourses(courses.filter(course => course.id !== id));
};

const updateCourse = (id, field, value) => {
setCourses(courses.map(course => course.id === id ? { ...course, [field]: value } : course));
};

const calculateTotalPoints = () => {
return courses.reduce((total, course) => {
const points = gradePoints[course.grade] || 0;
const credits = parseFloat(course.credits) || 0;
return total + (points * credits);
}, 0);
};

const calculateTotalCredits = () => {
return courses.reduce((total, course) => total + (parseFloat(course.credits) || 0), 0);
};

// Nigerian classification
const getClassificationInfo = (gpa) => {
if (gpa >= 4.50) return { text: 'First Class Honours 🥇', color: '#28a745', description: 'Excellent! Outstanding achievement' };
if (gpa >= 3.50) return { text: 'Second Class Upper (2:1) 🥈', color: '#17a2b8', description: 'Very good performance' };
if (gpa >= 2.50) return { text: 'Second Class Lower (2:2) 🥉', color: '#ffc107', description: 'Good performance' };
if (gpa >= 1.50) return { text: 'Third Class 📖', color: '#fd7e14', description: 'Satisfactory performance' };
if (gpa >= 1.00) return { text: 'Pass Degree 🎯', color: '#dc3545', description: 'Minimum passing grade' };
return { text: 'Fail ❌', color: '#721c24', description: 'Below minimum requirements' };
};

const calculateGPAOffline = () => {
const totalPoints = calculateTotalPoints();
const totalCredits = calculateTotalCredits();
const gpa = totalCredits ? totalPoints / totalCredits : 0;
setGpaResult({
gpa,
total_credits: totalCredits,
total_points: totalPoints,
grades_count: courses.length,
});
};

const calculateGPA = async () => {
setLoading(true);
setError('');
setGpaResult(null);

const credits = courses.map(c => parseFloat(c.credits) || 0);  

for (let i = 0; i < credits.length; i++) {  
  if (!credits[i] || credits[i] <= 0 || credits[i] > 10) {  
    setError(`Course ${i + 1}: Enter valid credit hours (1-10)`);  
    setLoading(false);  
    return;  
  }  
}  

try {  
  const response = await fetch('http://localhost:8000/api/calculate-gpa/', {  
    method: 'POST',  
    headers: { 'Content-Type': 'application/json' },  
    body: JSON.stringify({  
      grades: courses.map(c => c.grade),  
      credits,  
    }),  
  });  

  const data = await response.json();  
  if (data.success) {  
    setGpaResult(data);  
  } else {  
    setError(data.error || 'Failed to calculate GPA, using offline calculation');  
    calculateGPAOffline();  
  }  
} catch (err) {  
  setError('Backend not responding. Using offline calculation.');  
  calculateGPAOffline();  
  console.error('GPA calculation error:', err);  
} finally {  
  setLoading(false);  
}

};

const resetCalculator = () => {
setCourses([{ grade: 'A', credits: 3, id: 1 }]);
setGpaResult(null);
setError('');
};

return (
<div className="gpa-container">
<header className="gpa-header">
<div>
<h3>📊 GPA Calculator</h3>
<p>Nigerian 5.00 Scale: A=5, B=4, C=3, D=2, E=1, F=0</p>
</div>
<button onClick={onHide} aria-label="Close Calculator" title="Close Calculator">Close</button>
</header>

{error && <div className="gpa-error">⚠️ <strong>Error:</strong> {error}</div>}  

  <section className="gpa-courses">  
    <div className="gpa-courses-header">  
      <strong>Course Details</strong>  
      <div>{courses.length} course(s) • {calculateTotalCredits()} total units</div>  
      <button onClick={addCourse} aria-label="Add Course" title="Add Course">+ Add Course</button>  
    </div>  

    {courses.map((course, idx) => {  
      const points = gradePoints[course.grade] || 0;  
      const credits = parseFloat(course.credits) || 0;  
      return (  
        <div key={course.id} className="gpa-course-row">  
          <div>Course {idx + 1}</div>  
          <select value={course.grade} onChange={e => updateCourse(course.id, 'grade', e.target.value)} aria-label={`Select grade for course ${idx+1}`} title={`Select grade for course ${idx+1}`}>  
            {gradeOptions.map(g => <option key={g} value={g}>{g} ({gradePoints[g]} pts)</option>)}  
          </select>  
          <input type="number" min="1" max="10" step="1" value={course.credits} onChange={e => updateCourse(course.id, 'credits', e.target.value)} aria-label={`Units for course ${idx+1}`} title={`Units for course ${idx+1}`} />  
          <div>{(points * credits).toFixed(1)}</div>  
          <button onClick={() => removeCourse(course.id)} disabled={courses.length <= 1} aria-label={`Remove course ${idx+1}`} title={`Remove course ${idx+1}`}>Remove</button>  
        </div>  
      );  
    })}  
  </section>  

  <div className="gpa-actions">  
    <button onClick={calculateGPA} disabled={loading}>  
      {loading ? 'Calculating...' : '📊 Calculate GPA'}  
    </button>  
    <button onClick={resetCalculator}>🔄 Reset</button>  
  </div>  

  {gpaResult && (  
    <section className="gpa-result">  
      <h3>GPA Result</h3>  
      <div className="gpa-score">{gpaResult.gpa.toFixed(2)} / 5.00</div>  
      <div className="gpa-classification" style={{ background: getClassificationInfo(gpaResult.gpa).color }}>  
        {getClassificationInfo(gpaResult.gpa).text}  
      </div>  
      <p>{getClassificationInfo(gpaResult.gpa).description}</p>  
    </section>  
  )}  
</div>

);
}

export default GpaCalculator;
