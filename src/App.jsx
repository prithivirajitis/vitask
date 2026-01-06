import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';

// --- 1. CONFIGURATION (Paste your actual keys from Firebase Console) ---
const firebaseConfig = {
  apiKey: "AIzaSyAi720VMbw3VNWxgoH3lWQICNqHO0OVn-A",
  authDomain: "vitaskfamily-213e0.firebaseapp.com",
  projectId: "vitaskfamily-213e0",
  storageBucket: "vitaskfamily-213e0.firebasestorage.app",
  messagingSenderId: "797356912580",
  appId: "1:797356912580:web:6b7da9f563768361397e91",
  measurementId: "G-2DQECPZ78K"
};

const API_URL = "https://vitask-backend.onrender.com";
const APP_VERSION = "v2.3.1";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

function App() {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  // --- 2. PERSISTENCE LOGIC ---
  useEffect(() => {
    // This handles keeping you logged in even after refresh
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchTodos();
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Auth Error:", error);
    }
  };

  const logout = () => signOut(auth);

  // --- 3. DATA LOGIC ---
  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) { console.error("Fetch failed", err); }
  };

  const addTask = async () => {
    if (!task) return;
    const res = await axios.post(API_URL, { task, status: 'pending' });
    setTodos([...todos, res.data]);
    setTask("");
  };

  // --- 4. RENDER ---
  if (!user) {
    return (git add src/App.jsx
      git commit -m "fix: point to actual render backend"
      git push origin main
      <div style={styles.center}>
        <h1 style={styles.mainTitle}>ViTaskFamily</h1>
        <p style={styles.tagline}>Shared tasks for a stronger home.</p>
        <button onClick={loginWithGoogle} style={styles.googleBtn}>
          Connect with Google
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2 style={styles.brand}>ViTaskFamily <span style={styles.ver}>{APP_VERSION}</span></h2>
        <button onClick={logout} style={styles.linkBtn}>Logout</button>
      </div>
      
      <p>Hello, {user.displayName}!</p>

      <div style={styles.inputGroup}>
        <input 
          value={task} 
          onChange={(e) => setTask(e.target.value)} 
          placeholder="Add a family task..." 
          style={styles.input} 
        />
        <button onClick={addTask} style={styles.addBtn}>Add</button>
      </div>

      <div style={styles.list}>
        {todos.map(t => (
          <div key={t._id} style={styles.item}>{t.task}</div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#fdfdfd' },
  mainTitle: { fontSize: '2.5rem', color: '#2c3e50', marginBottom: '0.5rem' },
  tagline: { color: '#7f8c8d', marginBottom: '2rem' },
  container: { padding: '20px', maxWidth: '500px', margin: 'auto', fontFamily: 'sans-serif' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', pb: '10px' },
  brand: { color: '#2c3e50' },
  ver: { fontSize: '0.7rem', color: '#bdc3c7' },
  inputGroup: { display: 'flex', gap: '10px', margin: '20px 0' },
  input: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' },
  googleBtn: { padding: '15px 40px', backgroundColor: '#4285F4', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  addBtn: { padding: '10px 25px', backgroundColor: '#6c5ce7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  linkBtn: { background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontWeight: 'bold' },
  list: { background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', padding: '15px', borderRadius: '12px' },
  item: { padding: '12px', borderBottom: '1px solid #f1f1f1', color: '#34495e' }
};

export default App;