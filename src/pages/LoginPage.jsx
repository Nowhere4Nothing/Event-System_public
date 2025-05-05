import React, { useState } from 'react';
import './LoginPage.css';



function LoginPage() {
  const [accType, setAccType] = useState('guest');
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="login-page">
      <div className="login-outer-container">
        <div className="login-box">
          <h1 className="login-title">{isRegistering ? 'Register' : 'Login'}</h1>
          {isRegistering ? (
            // Registration Form
            <form className="login-form">
              <label className="login-label">Username:</label>
              <input type="text" id="username" name="username" required />
              <br />
              <label className="login-label">Email:</label>
              <input type="email" id="email" name="email" required />
              <br />
              <label className="login-label">Password:</label>
              <input type="password" id="password" name="password" required />
              <br />
              <button type="submit" className="login-button">Register</button>
            </form>
          ) : (
            // Login Form
            <form className="login-form">
              <label className="login-label">Username:</label>
              <input type="text" id="username" name="username" required />
              <br />
              <label className="login-label">Password:</label>
              <input type="password" id="password" name="password" required />
              <br />
              <button type="submit" className="login-button">Login</button>
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
/*             <div className="form-group">
<label htmlFor="account-type">Account Type:</label>
<select
  id="account-type"
  value={accType}
  onChange={(e) => setAccType(e.target.value)}
>
  <option value="guest">Guest</option>
  <option value="admin">Admin</option>
  <option value="organizer">Organizer</option>
</select>
</div> 

*/