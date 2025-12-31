import { auth, googleProvider, microsoftProvider } from './firebase';
import { signInWithPopup } from 'firebase/auth';

const Login = ({ setUser }) => {
  const handleLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div style={loginStyles.container}>
      <div style={loginStyles.card}>
        <h1 style={loginStyles.logo}>ViTask</h1>
        <p style={loginStyles.tagline}>Nothing is impossible</p>
        
        <button onClick={() => handleLogin(googleProvider)} style={loginStyles.googleBtn}>
          Continue with Google
        </button>
        <button onClick={() => handleLogin(microsoftProvider)} style={loginStyles.msBtn}>
          Continue with Microsoft
        </button>
      </div>
    </div>
  );
};

const loginStyles = {
  container: { height: '100vh', background: '#c0392b', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  card: { background: '#fff', padding: '50px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' },
  logo: { fontFamily: '"Brush Script MT", cursive', fontSize: '3.5rem', margin: 0, color: '#c0392b' },
  tagline: { marginBottom: '30px', color: '#666', fontStyle: 'italic' },
  googleBtn: { display: 'block', width: '100%', padding: '12px', marginBottom: '10px', background: '#fff', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  msBtn: { display: 'block', width: '100%', padding: '12px', background: '#00a4ef', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Login;