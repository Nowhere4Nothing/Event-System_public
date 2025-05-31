import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import './LoginPage.css';
import {useNavigate} from "react-router-dom";

function LoginPage() {
  // site function
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [dbAccounts, setDbAccounts] = useState([]);
  const [loadingDbAccounts, setLoadingDbAccounts] = useState(true);
  const [cookies, setCookie] = useCookies(['userCookie']);
  const navigate = useNavigate();
  // form
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [accType, setAccType] = useState('Guest');
  


  useEffect(() => {
      if(cookies.userCookie){
      navigate('/account'); // If they somehow get to the login while already logged in, push them through.
    }


    fetch('http://localhost:5000/users', {credentials: 'include'}) 
    .then(res => res.json())
    .then(data => {
    //  console.log('Fetched user details:', data); -- commented this out unless needed, this WAS printing user passwords in plaintext.
      setLoadingDbAccounts(false);
      setDbAccounts(data);
    })
    .catch(err => {
      console.error('Error fetching user details from DB:', err);
    });

  }, []);

  function handleLogin(e) {
    e.preventDefault();
    if(loadingDbAccounts) {
      console.log('Login attempted before accounts loaded');
      return;
    }
    const user = dbAccounts.find((user) => user.username === username && user.password === password);
    if (!user) {
      setErrorMessage('Invalid username or password!');
      return;
    }
    setErrorMessage('');
    setCookie('userCookie', user, { path: '/' });
    navigate('/account');
  }

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    } else {
      setErrorMessage('');
    }
    // Check if username already exists
    const existingUser = dbAccounts.find((user) => user.username === username);
    if (existingUser) {
      setErrorMessage('Username is not available!');
      return;
    }

    // Save account to DB
    const newUser = {
      username,
      email,
      password,
      userType: accType,
      address: userAddress,
      phone
    };
    console.log('Registering new user:', newUser);
    fetch('http://localhost:5000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
      .then(res => res.json())
      .then(data => {
        console.log('User registered:', data);
        setCookie('userCookie', newUser, { path: '/' });
        navigate('/account');
      })
      .catch(err => {
        console.error('Error registering user:', err);
        setErrorMessage('Registration failed. Please try again.');
      });

  };

  return (
    <div className="login-page">
      <div className="login-outer-container">
        <div className="login-box">
          <h1 className="login-title">{isRegistering ? 'Register' : 'Login'}</h1>
          {isRegistering ? (
            // Registration Form
            <form className="login-form" onSubmit={handleRegister}>
              <label className="login-label">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <br />
              <label className="login-label">Email:</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <br />
              <label className="login-label">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <br />
              <label className="login-label">Confirm Password:</label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <br />
              <label className="login-label">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                required
              />
              <br />
              <label className="login-label">Phone:</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <br />
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <p className="login-label">I am a(n)...{' '}
              <select
                  id="account-type"
                  value={accType}
                  onChange={(e) => setAccType(e.target.value)}
                >
                  <option value="Guest">Guest</option>
                  <option value="Organizer">Organizer</option>
                </select>
              </p>
              <button type="submit" className="login-button">Register</button>
            </form>
          ) : (
            // Login Form
            <form className="login-form" onSubmit={handleLogin}>
              <label className="login-label">Username:</label>
              <input
                type="text"
                data-testid="username-input"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <br />
              <label className="login-label">Password:</label>
              <input
                type="password"
                id="password"
                data-testid="password-input"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <br />
              {errorMessage && <p className="error-message" data-testid="login-error">{errorMessage}</p>}
              <button type="submit" className="login-button" data-testid="login-button">Login</button>
            </form>
          )}
          <div className="login-footer">
            {isRegistering ? (
              <p>
                Already have an account?{' '}
                <a
                  href="#"
                  onClick={() => setIsRegistering(false)}
                >
                  Login here
                </a>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <a
                  href="#"
                  onClick={() => setIsRegistering(true)}
                >
                  Register here
                </a>
              </p>
            )}
            <p>Forgot your password?{' '}
              <a href="/contact">Get in touch!</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;