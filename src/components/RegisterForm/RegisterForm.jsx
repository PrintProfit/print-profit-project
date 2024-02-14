// import emailjs from '@emailjs/browser';
import {
  Box,
  Button,
  Paper,
  TextField,
  Tooltip,
  Typography,
  tooltipClasses,
} from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

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
    } else if (
      email === '' ||
      name === '' ||
      email === null ||
      name === null ||
      companyName === '' ||
      companyName === null
    ) {
      dispatch({ type: 'REGISTRATION_FAILED' });
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
      dispatch({ type: 'CLEAR_REGISTRATION_ERROR' });
      history.push('/waiting-page');
    }
  }; // end registerUser

  const onLogin = (event) => {
    history.push('/login');
  };

  return (
    <Box sx={{ width: '500px', padding: '30px' }}>
      <Paper>
        <Typography
          align="center"
          sx={{
            fontSize: 20,
            fontWeight: 'bold',
            p: 3,
          }}
        >
          Print Profit
        </Typography>
        {errors.registrationMessage && (
          <h3 className="alert" role="alert">
            {errors.registrationMessage}
          </h3>
        )}
        <Box
          // flexDirection={'column'}
          component="form"
          sx={{
            pt: 5,
            '& > :not(style)': { m: 1, width: '25ch' },
            flexDirection: 'column',
            display: 'flex',
            alignItems: 'center',
          }}
          noValidate
          autoComplete="off"
          onSubmit={registerUser}
        >
          <Box
            sx={{
              pb: 10,
              flexDirection: 'column',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img
              width={50}
              height={50}
              src="public/images/printProfitLogoV3.svg"
              alt=""
            />
          </Box>
          <TextField
            id="email"
            type="text"
            label="E-mail"
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

          <Tooltip
            title={
              password.length < 8 ? 'password must be 8 or more characters' : ''
            }
            placement="top"
            slotProps={{
              popper: {
                sx: {
                  [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                    {
                      marginTop: '0px',
                    },
                  [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
                    {
                      marginBottom: '1px',
                    },
                  [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
                    {
                      marginLeft: '0px',
                    },
                  [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]:
                    {
                      marginRight: '0px',
                    },
                },
              },
            }}
          >
            <TextField
              id="password"
              type="password"
              label="Password"
              variant="outlined"
              value={password}
              color={password.length < 8 && password !== '' ? 'error' : ''}
              required
              onChange={(event) => setPassword(event.target.value)}
            />
          </Tooltip>

          <Tooltip
            title={
              confirmedPassword.length < 8
                ? 'password must be 8 or more characters'
                : ''
            }
            placement="top"
            slotProps={{
              popper: {
                sx: {
                  [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                    {
                      marginTop: '0px',
                    },
                  [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
                    {
                      marginBottom: '1px',
                    },
                  [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
                    {
                      marginLeft: '0px',
                    },
                  [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]:
                    {
                      marginRight: '0px',
                    },
                },
              },
            }}
          >
            <TextField
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              variant="outlined"
              value={confirmedPassword}
              color={
                confirmedPassword.length < 8 && confirmedPassword !== ''
                  ? 'error'
                  : confirmedPassword !== password
                    ? 'error'
                    : ''
              }
              required
              onChange={(event) => setConfirmedPassword(event.target.value)}
            />
          </Tooltip>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50%"
          >
            <Button
              sx={{ mt: 3, mb: 10 }}
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
              Log in
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default RegisterForm;
