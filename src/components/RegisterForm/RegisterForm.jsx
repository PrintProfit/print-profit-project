import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import emailjs from '@emailjs/browser';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();
  const history = useHistory();

  const templateParams = {
    from_name: name,
    from_email: email,
  };

  const registerUser = (event) => {
    event.preventDefault();
    if (password !== confirmedPassword) {
      dispatch({ type: 'REGISTRATION_FAILED_PASSWORDS_DONT_MATCH' });
    }

    // emailjs
    //   .send('service_596xcui', 'template_98dektt', templateParams, {
    //     publicKey: 'AHgPPyj4SiCZqSRfw',
    //   })
    //   .then(
    //     () => {
    //       console.log('SUCCESS!');
    //     },
    //     (error) => {
    //       console.log('FAILED...', error.text);
    //     },
    //   );

    dispatch({
      type: 'REGISTER',
      payload: {
        email: email,
        name: name,
        companyName: companyName,
        password: password,
      },
    });
    history.push('/waiting-page');
  }; // end registerUser

  const onLogin = (event) => {
    history.push('/login');
  };

  return (
    <Box className="formPanel">
      <h2>Print Profit </h2>
      {errors.registrationMessage && (
        <h3 className="alert" role="alert">
          {errors.registrationMessage}
        </h3>
      )}
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={registerUser}
      >
        <TextField
          id="email"
          type="text"
          label="e-mail"
          variant="outlined"
          value={email}
          required
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          id="name"
          type="text"
          label="Full Name"
          variant="outlined"
          value={name}
          required
          onChange={(event) => setName(event.target.value)}
        />
        <TextField
          id="companyName"
          type="text"
          label="Company Name"
          variant="outlined"
          value={companyName}
          required
          onChange={(event) => setCompanyName(event.target.value)}
        />
        <TextField
          id="password"
          type="password"
          label="password"
          variant="outlined"
          value={password}
          required
          onChange={(event) => setPassword(event.target.value)}
        />
        <TextField
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          variant="outlined"
          value={confirmedPassword}
          required
          onChange={(event) => setConfirmedPassword(event.target.value)}
        />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50%"
        >
          <Button
            sx={{ mb: 10 }}
            variant="contained"
            type="submit"
            name="submit"
            value="Register"
          >
            Register
          </Button>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ color: '#646765' }}
        >
          Already a member?
          <Button type="button" onClick={onLogin}>
            Login
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default RegisterForm;
