import { useState } from 'react';

function TaskCard({ task, onDelete, onStatusChange }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(task.id);
    setIsDeleting(false);
    setShowConfirm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'pending':
        return 'status-pending';
      case 'finished':
        return 'status-finished';
      default:
        return '';
    }
  };

  const isPastDeadline = () => {
    const now = new Date();
    const deadline = new Date(task.deadline);
    return deadline < now && task.status !== 'finished';
  };

  // Function to cycle through statuses
  const cycleStatus = () => {
    const statusOrder = ['pending', 'active', 'finished'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    const nextStatus = statusOrder[nextIndex];
    onStatusChange(task.id, nextStatus);
  };

  // Get button class based on current status (not next status)
  const getButtonClass = () => {
    switch (task.status) {
      case 'pending':
        return 'pending-btn';
      case 'active':
        return 'active-btn';
      case 'finished':
        return 'finished-btn';
      default:
        return '';
    }
  };

  return (
    <div className={`task-card ${isPastDeadline() ? 'past-deadline' : ''}`}>
      <div className="task-header">
        <h3 className="task-title">{task.name}</h3>
        <div className={`task-status ${getStatusColor(task.status)}`}>
          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </div>
      </div>
      
      <div className="task-description">
        <p>{task.description}</p>
      </div>
      
      <div className="task-deadline">
        <span className="deadline-label">Deadline:</span>
        <span className="deadline-value">{formatDate(task.deadline)}</span>
      </div>
      
      <div className="task-actions">
        {/* Status circle button */}
        <div className="status-circle-container">
          <button 
            className={`status-circle ${getButtonClass()}`}
            onClick={cycleStatus}
            title={`Click to change status (Currently: ${task.status})`}
          >
            {task.status.charAt(0).toUpperCase()}
          </button>
          
        </div>
        
        <div className="delete-container">
          {!showConfirm ? (
            <button 
              className="delete-btn"
              onClick={() => setShowConfirm(true)}
            >
              Delete
            </button>
          ) : (
            <div className="confirm-delete">
              <span>Are you sure?</span>
              <div className="confirm-buttons">
                <button 
                  className="confirm-yes" 
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Yes'}
                </button>
                <button 
                  className="confirm-no"
                  onClick={() => setShowConfirm(false)}
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;