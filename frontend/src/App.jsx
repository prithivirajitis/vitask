import { useEffect, useState } from 'react'
import Login from './Login'; 

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [isGlobalEdit, setIsGlobalEdit] = useState(false);
  const [editValues, setEditValues] = useState({}); 
  const [user, setUser] = useState(null);

  const fetchTodos = async () => {
    // Note: Change localhost to your production URL later during deployment
    const API_URL = "https://vitask-backend.onrender.com"; // Replace with your ACTUAL Render URL
    const res = await fetch(`${API_URL}/api/todos`);
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => { fetchTodos(); }, []);

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    const res = await fetch(`${API_URL}/api/todos/delete-bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds })
    });
    setTodos(await res.json());
    setSelectedIds([]);
  };

  const handleBulkArchive = async () => {
    const res = await fetch(`${API_URL}/api/todos/archive-bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds })
    });
    setTodos(await res.json());
    setSelectedIds([]);
  };

  const handleBulkSave = async () => {
    const updates = Object.entries(editValues).map(([id, task]) => ({ id, task }));
    const res = await fetch(`${API_URL}/api/todos/bulk-save`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates })
    });
    setTodos(await res.json());
    setIsGlobalEdit(false);
    setEditValues({});
  };

  const handleLogout = () => {
    setUser(null); 
  };

  const activeTasks = todos.filter(t => t.status !== 'archived');
  const archivedTasks = todos.filter(t => t.status === 'archived');

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <div style={styles.container}>
      <nav style={styles.navBar}>
        <div style={styles.logoGroup}>
          <h1 style={styles.logoText}>ViTask</h1>
          <p style={styles.taglineText}>Nothing is impossible</p>
        </div>
        
        <div style={styles.profileGroup}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            <div style={styles.profileCircle}>
              <img 
                src={user.photoURL || "https://ui-avatars.com/api/?name=" + user.displayName} 
                alt="Profile" 
                style={styles.profileImg}
                onError={(e) => {
                  e.target.src = "https://ui-avatars.com/api/?name=Vi+Task&background=d35400&color=fff";
                }}
              />
            </div>
          </div>
        </div>
      </nav>

      <div style={styles.mainWrapper}>
        <div style={styles.card}>
          <h2 style={styles.title}>ACTIVE TASKS</h2>
          <div style={styles.globalActions}>
            <button onClick={() => setIsGlobalEdit(true)} style={styles.editBtn}>Edit All</button>
            <button onClick={handleBulkSave} style={styles.saveBtn}>Save</button>
            <button onClick={handleBulkArchive} style={styles.completeBtn}>Complete</button>
            <button onClick={handleBulkDelete} style={styles.deleteBtn}>Delete</button>
          </div>

          <ul style={styles.list}>
            {activeTasks.map(todo => (
              <li key={todo._id} style={styles.listItem}>
                <input 
                  type="checkbox" 
                  style={styles.checkbox}
                  checked={selectedIds.includes(todo._id)} 
                  onChange={() => toggleSelect(todo._id)} 
                />
                {isGlobalEdit ? (
                  <input 
                    style={styles.editInput}
                    defaultValue={todo.task}
                    onChange={(e) => setEditValues({...editValues, [todo._id]: e.target.value})}
                  />
                ) : (
                  <span style={styles.taskText}>{todo.task}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div style={styles.archiveCard}>
          <h3 style={styles.archiveTitle}>Archive</h3>
          <ul style={styles.list}>
            {archivedTasks.map(todo => (
              <li key={todo._id} style={styles.archiveItem}>• {todo.task}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { 
    minHeight: '100vh', 
    width: '100%', 
    background: '#c0392b', 
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden'
  },
  navBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 5%', 
    background: 'rgba(0,0,0,0.2)', 
    width: '100%',
    boxSizing: 'border-box'
  },
  logoGroup: { display: 'flex', flexDirection: 'column' },
  logoText: { 
    color: '#fff', 
    fontSize: '2rem', 
    margin: 0, 
    fontFamily: '"Brush Script MT", cursive' 
  },
  taglineText: { color: '#fdf2e9', margin: '-2px 0 0 2px', fontSize: '0.8rem' },
  profileGroup: { display: 'flex', alignItems: 'center' },
  profileCircle: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid #fff',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    backgroundColor: '#eee'
  },
  profileImg: { width: '100%', height: '100%', objectFit: 'cover' },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #ffffffaa',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  mainWrapper: { 
    display: 'flex', 
    gap: '20px', 
    padding: '20px 5%', 
    alignItems: 'flex-start',
    width: '100%',
    boxSizing: 'border-box'
  },
  card: { 
    backgroundColor: '#ffffff', 
    padding: '20px 30px', 
    borderRadius: '12px', 
    flex: '2', 
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    borderTop: '6px solid #d35400',
    maxWidth: '800px'
  },
  title: { fontSize: '1.2rem', color: '#2c3e50', marginBottom: '15px', fontWeight: '800' },
  globalActions: { 
    display: 'flex', 
    gap: '8px', 
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '1px solid #f0f0f0'
  },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { 
    display: 'flex', 
    gap: '10px', 
    alignItems: 'center', 
    padding: '6px 0', 
    borderBottom: '1px solid #f9f9f9' 
  },
  checkbox: { width: '14px', height: '14px', cursor: 'pointer' },
  taskText: { fontSize: '0.95rem', color: '#444', lineHeight: '1.2' },
  editInput: { padding: '4px', fontSize: '0.9rem', flex: 1, border: '1px solid #ddd' },
  archiveCard: { 
    backgroundColor: '#fdf2e9', 
    padding: '20px', 
    borderRadius: '12px', 
    flex: '0.8', 
    marginTop: '55px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
  },
  archiveTitle: { fontSize: '1rem', color: '#a04000', marginBottom: '10px' },
  archiveItem: { fontSize: '0.85rem', color: '#7f8c8d', padding: '4px 0' },
  editBtn: { background: '#e67e22', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  saveBtn: { background: '#27ae60', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  completeBtn: { background: '#2980b9', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  deleteBtn: { background: '#ff0000', color: '#fff', border: '1px solid #fff', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }
};

export default App;