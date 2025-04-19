import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createTask } from './api';

function AddTask() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Task name is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Task description is required';
    }
    
    if (!deadline) {
      newErrors.deadline = 'Deadline is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        setSubmitError(null);
        
        // Create new task with initial status as pending and attach userId
        await createTask({
          name,
          description,
          deadline,
          status: 'pending', // Default status for new tasks
          userId: user.id // Associate task with current user
        });
        
        // Navigate back to dashboard after successful submission
        navigate('/');
      } catch (err) {
        setSubmitError('Failed to create task. Please try again.');
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="add-task-container">
      <header className="app-header">
        <div className="logo">
          <h1>Task Master</h1>
        </div>
        <Link to="/" className="btn-back">
          Back to Dashboard
        </Link>
      </header>

      <div className="form-container">
        <h2>Add New Task</h2>
        
        {submitError && <div className="error-message">{submitError}</div>}
        
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="name">Task Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Task Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={errors.description ? 'error' : ''}
              rows="4"
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="deadline">Deadline</label>
            <input
              type="datetime-local"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={errors.deadline ? 'error' : ''}
            />
            {errors.deadline && <span className="error-message">{errors.deadline}</span>}
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTask;