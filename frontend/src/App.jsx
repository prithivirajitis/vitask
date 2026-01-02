import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = "https://your-backend-url.onrender.com/api/todos";
const APP_VERSION = "v2.2.0";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  // Check localStorage on startup to stay logged in
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [password, setPassword] = useState("");

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
      // 5 minutes = 5 * 60 * 1000 milliseconds
      timeout = setTimeout(handleLogout, 300000); 
    };

    // Listen for any user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);

    resetTimer(); // Start timer on login

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      clearTimeout(timeout);
    };
  }, [isLoggedIn, handleLogout]);

  // --- 2. DATA FETCHING ---
  useEffect(() => {
    if (isLoggedIn) fetchTodos();
  }, [isLoggedIn]);

  const fetchTodos = async () => {
    const res = await axios.get(API_URL);
    setTodos(res.data);
  };

  const handleLogin = () => {
    if (password === "YOUR_PASSWORD") {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
    } else {
      alert("Wrong password!");
    }
  };

  const handleSupport = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = "upi://pay?pa=YOURID@okaxis&pn=ViTask&cu=INR";
    } else {
      window.open('/qr-code.jpg', '_blank');
    }
  };

  // ... (Keep your addTask, toggleTodo, deleteTodo functions here) ...

  if (!isLoggedIn) {
    return (
      <div style={styles.loginContainer}>
        <h2 style={styles.header}>ViTask {APP_VERSION}</h2>
        <input 
          type="password" 
          placeholder="Enter Password" 
          style={styles.input}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} style={styles.button}>Login</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.topRow}>
        <h2 style={styles.header}>ViTask {APP_VERSION}</h2>
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
        {todos.map(todo => (
          <div key={todo._id} style={styles.todoItem}>
            <span 
              onClick={() => toggleTodo(todo._id, todo.status)}
              style={{...styles.taskText, textDecoration: todo.status === 'completed' ? 'line-through' : 'none'}}
            >
              {todo.task}
            </span>
            <button onClick={() => deleteTodo(todo._id)} style={styles.deleteBtn}>Delete</button>
          </div>
        ))}
      </div>

      <button onClick={handleSupport} style={styles.supportBtn}>
        Support ViTask 🇮🇳
      </button>
    </div>
  );
}

// --- 3. REFACTORED STYLES OBJECT ---
const styles = {
  container: { padding: '20px', maxWidth: '400px', margin: 'auto', fontFamily: 'Arial' },
  loginContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  header: { color: '#333' },
  inputGroup: { display: 'flex', gap: '10px', marginBottom: '20px' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', flex: 1 },
  button: { padding: '10px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  logoutBtn: { backgroundColor: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.8rem' },
  todoItem: { display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' },
  taskText: { cursor: 'pointer', flex: 1 },
  deleteBtn: { backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '3px', padding: '5px 10px', cursor: 'pointer' },
  supportBtn: {
    marginTop: '30px',
    width: '100%',
    padding: '12px',
    backgroundColor: '#ffcc00',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem'
  }
};

export default App;