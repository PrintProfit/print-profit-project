import { Box, Button, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
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
    to_name: 'Print Profit',
    to_email: 'printprofitproject@gmail.com',
    message: `${email} has registered to Print Profit! `,
  };

  const registerUser = (event) => {
    event.preventDefault();
    if (
      password !== confirmedPassword ||
      password === '' ||
      password === null ||
      password.length < 8
    ) {
      dispatch({ type: 'REGISTRATION_FAILED_PASSWORDS_DONT_MATCH' });
    } else {
      // emailjs
      //   .send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_REGISTERED_AND_APPROVED_TEMPLATE_ID, templateParams, {
      //     publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
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
    }
  }; // end registerUser

  const onLogin = (event) => {
    history.push('/login');
  };

  return (
    <Box sx={{ width: '400px' }}>
      <Paper>
        <h2>Print Profit </h2>
        <img
          width={50}
          height={50}
          src="public/images/printProfitLogoV3.svg"
          alt="printProfitLogo"
        />
        {errors.registrationMessage && (
          <h3 className="alert" role="alert">
            {errors.registrationMessage}
          </h3>
        )}
        <Box
          // flexDirection={'column'}
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
            flexDirection: 'column',
            display: 'flex',
            alignItems: 'center',
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
      </Paper>
    </Box>
  );
}

export default RegisterForm;
