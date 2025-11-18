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

  function createUser() {
    const firstName = document.querySelector('input[placeholder="First Name"]').value;
    const lastName = document.querySelector('input[placeholder="Last Name"]').value;
    const dob = document.querySelector('input[placeholder="MM/DD/YYYY"]').value;
    const username = document.querySelector('input[placeholder="Username"]').value;
    const password = document.querySelector('input[placeholder="Password"]').value;
    const passwordAgain = document.querySelector('input[placeholder="Password Again"]').value;

    // Validate each field
    const newErrors = {
      firstName: firstName === "" && firstName.length >= 3 && /^[a-zA-Z]+$/.test(firstName),
      lastName: lastName === "" && lastName.length >= 3 && /^[a-zA-Z]+$/.test(lastName),
      dob: !dob.match(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/),
      username: username === "" && username.length >= 3 && /^[a-zA-Z0-9]+$/.test(username),
      password: password === "" && password.length >= 6 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password),
      passwordAgain: passwordAgain === "" || password !== passwordAgain
    };

    setErrors(newErrors);

    // Check if any errors exist
    const hasErrors = Object.values(newErrors).some(error => error);


  async function createUser() {
    createUserCall(`/api/auth/create`);
  }
  


  async function createUserCall(endpoint) {
    
    
    const response = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify({ userName: username, password: password, firstName: firstName, lastName: lastName, dob: dob }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      localStorage.setItem('userName', username);
      console.log("Logging in user after signup:", username);
      props.onLogin(username);
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }




    if (!hasErrors) {
       createUser()
      .finally(() => navigate("/"))
    } else {
      setShowErrorMessage(true);
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
        <div>
          <button onClick={() => createUser()}>Sign Up</button>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    </main>
  );
}