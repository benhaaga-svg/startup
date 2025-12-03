import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Signup(props) {
  const navigate = useNavigate();
  const [errors, setErrors] = React.useState({
    firstName: false,
    lastName: false,
    dob: false,
    username: false,
    password: false,
    passwordAgain: false
  });
  const [showErrorMessage, setShowErrorMessage] = React.useState(false);
  const [displayError, setDisplayError] = React.useState('');

  async function createUser() {
    const firstName = document.querySelector('input[placeholder="First Name"]').value;
    const lastName = document.querySelector('input[placeholder="Last Name"]').value;
    const dob = document.querySelector('input[type="date"]').value;
    const username = document.querySelector('input[placeholder="Username"]').value;
    const password = document.querySelector('input[placeholder="Password"]').value;
    const passwordAgain = document.querySelector('input[placeholder="Password Again"]').value;

    // Validate each field
    const newErrors = {
      firstName: firstName === "" || firstName.length < 3 || !/^[a-zA-Z]+$/.test(firstName),
      lastName: lastName === "" || lastName.length < 3 || !/^[a-zA-Z]+$/.test(lastName),
      dob: dob === "" || !dob.match(/^\d{4}-\d{2}-\d{2}$/),
      username: username === "" || username.length < 3 || !/^[a-zA-Z0-9]+$/.test(username),
      password: password === "" || password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password),
      passwordAgain: passwordAgain === "" || password !== passwordAgain
    };

    setErrors(newErrors);

    // Check if any errors exist
    const hasErrors = Object.values(newErrors).some(error => error);

    if (!hasErrors) {
      await createUserCall(`/api/auth/create`, { userName: username, password: password, firstName: firstName, lastName: lastName, dob: dob });
    } else {
      setShowErrorMessage(true);
    }
  }

  async function createUserCall(endpoint, userData) {
    const response = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify(userData),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      const userObj = { user: { userName: userData.userName, firstName: userData.firstName, lastName: userData.lastName, dob: userData.dob } };
      localStorage.setItem('user', JSON.stringify(userObj));
      console.log("Logging in user after signup:", userData.userName);
      props.onLogin(userObj);
      navigate("/home");
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }

  return (
    <main>
      <h1>Sign Up</h1>
      <div className="sign-in-square">
        <div>
          <p>First Name:</p>
          <input
            placeholder="First Name"
            className={errors.firstName ? 'error' : ''}
          />
        </div>
        <div>
          <p>Last Name:</p>
          <input
            placeholder="Last Name"
            className={errors.lastName ? 'error' : ''}
          />
        </div>
        <div>
          <p>Date of Birth:</p>
          <input
            placeholder="MM/DD/YYYY"
            type='date'
            className={errors.dob ? 'error' : ''}
          />
        </div>
        <div>
          <p>Username:</p>
          <input
            placeholder="Username"
            className={errors.username ? 'error' : ''}
          />
        </div>
        <div>
          <p>Password:</p>
          <input
            placeholder="Password"
            type="password"
            className={errors.password ? 'error' : ''}
          />
        </div>
        <div>
          <p>Password Again:</p>
          <input
            placeholder="Password Again"
            type="password"
            className={errors.passwordAgain ? 'error' : ''}
          />
        </div>
        {showErrorMessage && (
          <div id="error-message">Please make sure all fields are filled out correctly</div>
        )}
        {displayError && (
          <div id="error-message">{displayError}</div>
        )}
        <div>
          <button onClick={() => createUser()}>Sign Up</button>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    </main>
  );
}
