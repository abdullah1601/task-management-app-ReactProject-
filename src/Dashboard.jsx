import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { fetchTasks, deleteTask,deleteUserAccount, updateTaskStatus } from './api';
import TaskCard from './TaskCard';


function Dashboard({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  
  const user = JSON.parse(localStorage.getItem('user'));

  
  useEffect(() => {
    const loadTasks = async () => {
      if (!user || !user.id) return;
      
      try {
        setLoading(true);
        
        const data = await fetchTasks(user.id);
        setTasks(data);
        setFilteredTasks(data);
      } catch (err) {
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadTasks();
   
  }, []);

 
  useEffect(() => {
    if (filter === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.status === filter));
    }
  }, [filter, tasks]);

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    
    const savedMode = localStorage.getItem('dark-mode') === 'true';
    setIsDarkMode(savedMode);
    if (savedMode) document.body.classList.add('dark-mode');
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };


  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task. Please try again later.');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTaskStatus(id, newStatus);
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, status: newStatus } : task
      ));
    } catch (err) {
      setError('Failed to update task status. Please try again later.');
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: ' Deleteing Account',
      text: "Are you sure you want to delete your account and all your tasks?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes,Delete my account ',
      cancelButtonText: 'Cancel'
    });
  
    if (result.isConfirmed) {
      try {
        await deleteUserAccount(user.id);
        onLogout();
        navigate('/register');
  
        Swal.fire(
          'Done',
          'success'
        );
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'An Error has occurred, try again please', 'error');
      }
    }
  };
  

  return (
    <div className="dashboard-container">
      <header className="app-header">
        <button id="toggle-dark" onClick={toggleDarkMode}>
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
        <div className="logo">
          <h1>Task Master</h1>
        </div>
        <div className="user-controls">
          <span className="welcome-text">Welcome, {user?.username || 'User'}</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
          <button 
            onClick={handleDeleteAccount} 
            className="btn-delete-account">
            🗑️ Delete Account
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-controls">
          <div className="filters">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button 
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`filter-btn ${filter === 'finished' ? 'active' : ''}`}
              onClick={() => setFilter('finished')}
            >
              Finished
            </button>
          </div>
          
          <Link to="/add-task" className="btn-add">
            Add New Task
          </Link>
        </div>

        {loading && <div className="loading-spinner">Loading tasks</div>}
        
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && filteredTasks.length === 0 && (
          <div className="no-tasks">
            <h2>No tasks available</h2>
            <p>Start by adding a new task!</p>
          </div>
        )}

        <div className="tasks-grid">
          {filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
