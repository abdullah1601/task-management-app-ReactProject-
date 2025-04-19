const API_URL = 'http://localhost:3000';

// User authentication
export const loginUser = async (email, password) => {
  try {
    // First check if user exists
    const users = await fetch(`${API_URL}/users?email=${email}`).then(res => res.json());
    
    if (users.length === 0 || users[0].password !== password) {
      throw new Error('Invalid credentials');
    }
    
    return users[0];
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// User registration
export const registerUser = async (userData) => {
  try {
    // Check if email already exists
    const existingUsers = await fetch(`${API_URL}/users?email=${userData.email}`).then(res => res.json());
    
    if (existingUsers.length > 0) {
      throw new Error('Email already registered');
    }
    
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Get all tasks for specific user
export const fetchTasks = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/tasks?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Get a single task by ID
export const fetchTaskById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching task ${id}:`, error);
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Update task status
export const updateTaskStatus = async (id, status) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (id) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    throw error;
  }
};
export const deleteUserAccount = async (userId) => {
  try {
    // 1. Get all tasks for this user
    const tasks = await fetch(`${API_URL}/tasks?userId=${userId}`).then(res => res.json());

    // 2. Delete each task individually
    for (const task of tasks) {
      await fetch(`${API_URL}/tasks/${task.id}`, {
        method: 'DELETE',
      });
    }

    // 3. Delete the user
    const userResponse = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
    });

    if (!userResponse.ok) {
      throw new Error(`Failed to delete user. Status: ${userResponse.status}`);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting user ${userId} and their tasks:`, error);
    throw error;
  }
};