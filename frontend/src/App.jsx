import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// --- CONFIGURATION ---
const API_URL = "https://vitask-backend.onrender.com/api/todos";
const APP_VERSION = "v2.2.1";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  
  // Check localStorage on startup to stay logged in
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  // --- 1. SESSION MANAGEMENT (5 Minute Idle Logout) ---
  const handleLogout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      // 5 minutes = 300,000ms
      timeout = setTimeout(handleLogout, 300000); 
    };

    // Track activity to reset the 5-minute timer
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);

    resetTimer(); 

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      clearTimeout(timeout);
    };
  }, [isLoggedIn, handleLogout]);

  // --- 2. DATA ACTIONS ---
  useEffect(() => {
    if (isLoggedIn) fetchTodos();
  }, [isLoggedIn]);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const addTask = async () => {
    if (!task) return;
    try {
      const res = await axios.post(API_URL, { task, status: 'pending' });
      setTodos([...todos, res.data]);
      setTask("");
    } catch (err) {
      console.error("Add task error:", err);
    }
  };

  const toggleTodo = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    try {
      await axios.put(`${API_URL}/${id}`, { status: newStatus });
      setTodos(todos.map(t => t._id === id ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // --- 3. LOGIN LOGIC ---
  const handleSocialLogin = (provider) => {
    console.log(`Connecting with ${provider}...`);
    // Note: If you have a real Firebase/Auth0 setup, trigger it here.
    // For now, this sets the persistence flag so refresh works.
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleSupport = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = "upi://pay?pa=YOURID@okaxis&pn=ViTask&cu=INR";
    } else {
      window.open('/qr-code.jpg', '_blank');
    }
  };

  // --- 4. RENDER LOGIC ---
  if (!isLoggedIn) {
    return (
      <div style={styles.loginContainer}>
        <h2 style={styles.header}>ViTask {APP_VERSION}</h2>
        <p style={{color: '#666', marginBottom: '40px'}}>Nothing is impossible</p>
        
        <div style={styles.socialGroup}>
          <button 
            onClick={() => handleSocialLogin('Google')} 
            style={styles.googleBtn}
          >
            Connect with Google
          </button>
          <button 
            onClick={() => handleSocialLogin('Microsoft')} 
            style={styles.msBtn}
          >
            Connect with Microsoft
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.topRow}>
        <h1 style={styles.header}>ViTask {APP_VERSION}</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>

      <div style={styles.inputGroup}>
        <input 
          value={task} 
          onChange={(e) => setTask(e.target.value)} 
          placeholder="What needs to be done?" 
          style={styles.input}
        />
        <button onClick={addTask} style={styles.button}>Add</button>
      </div>

      <div style={styles.list}>
        {todos.length === 0 ? (
          <p style={{textAlign: 'center', color: '#999'}}>No tasks yet!</p>
        ) : (
          todos.map(todo => (
            <div key={todo._id} style={styles.todoItem}>
              <span 
                onClick={() => toggleTodo(todo._id, todo.status)}
                style={{
                  ...styles.taskText, 
                  textDecoration: todo.status === 'completed' ? 'line-through' : 'none',
                  color: todo.status === 'completed' ? '#aaa' : '#000'
                }}
              >
                {todo.task}
              </span>
              <button onClick={() => deleteTodo(todo._id)} style={styles.deleteBtn}>Delete</button>
            </div>
          ))
        )}
      </div>

      <button onClick={handleSupport} style={styles.supportBtn}>
        Support ViTask 🇮🇳
      </button>
    </div>
  );
}

// --- 5. STYLES OBJECT ---
const styles = {
  container: { padding: '20px', maxWidth: '400px', margin: 'auto', fontFamily: 'Arial, sans-serif' },
  loginContainer: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
    height: '80vh',
    maxWidth: '350px',
    margin: 'auto',
    textAlign: 'center'
  },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  header: { color: '#333', margin: 0 },
  inputGroup: { display: 'flex', gap: '10px', marginBottom: '20px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', boxSizing: 'border-box' },
  button: { padding: '12px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  logoutBtn: { backgroundColor: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.9rem' },
  list: { backgroundColor: '#f9f9f9', borderRadius: '12px', padding: '10px', minHeight: '100px' },
  todoItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid #eee' },
  taskText: { cursor: 'pointer', flex: 1, fontSize: '1rem' },
  deleteBtn: { backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '5px', padding: '6px 12px', cursor: 'pointer' },
  supportBtn: {
    marginTop: '40px',
    width: '100%',
    padding: '14px',
    backgroundColor: '#ffcc00',
    color: '#000',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  socialGroup: { width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' },
  googleBtn: { padding: '14px', backgroundColor: '#fff', color: '#555', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' },
  msBtn: { padding: '14px', backgroundColor: '#2f2f2f', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }
};

export default App;