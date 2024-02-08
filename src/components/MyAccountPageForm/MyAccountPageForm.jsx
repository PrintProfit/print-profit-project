import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

export default function MyAccountPageForm({ setIsForm }) {
  const dispatch = useDispatch();

  const profileUser = useSelector((store) => store.user.profileUserReducer);

  const userEmail = useSelector((store) => store.user.editUserEmail);
  const userName = useSelector((store) => store.user.editUserName);
  const [invalidText, setInvalidText] = useState('');

  useEffect(() => {
    dispatch({ type: 'SAGA_FETCH_PROFILE_PAGE_USER' });
  }, [dispatch]);

  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [newVerifyPasswordInput, setNewVerifyPasswordInput] = useState('');

  const [openComfirmation, setOpenComfirmation] = useState(false);
  const [openDiscard, setOpenDiscard] = useState(false);

  // Opens Discard Dialog
  const handleDiscardClickOpen = () => {
    setOpenDiscard(true);
  };

  // Closes Discard Dialog
  const handleDiscardClose = () => {
    setOpenDiscard(false);
  };

  // Opens Comfirmation Dialog
  const handleComfirmationClickOpen = () => {
    if (
      userName.name &&
      userEmail.email &&
      newPasswordInput === newVerifyPasswordInput &&
      (newPasswordInput.length >= 8 || newPasswordInput.length === 0)
    ) {
      setOpenComfirmation(true);
      // setInvalidText('');
    } else {
      setInvalidText('Invalid, please insert valid information');
    }
  };

  // Closes Comfirmation Dialog
  const handleComfirmationClose = () => {
    setOpenComfirmation(false);
  };

  // sends you back to users info
  const discardChanges = () => {
    dispatch({
      type: 'FETCH_USER',
    });
    setOpenDiscard(false);
    setIsForm(false);
  };

  // changes email redux state when entering info
  const handleEmailChange = (newEmail) => {
    dispatch({
      type: 'CHANGE_EMAIL',
      payload: newEmail,
    });
  };

  // changes name redux state when entering info
  const handleNameChange = (newName) => {
    dispatch({
      type: 'CHANGE_NAME',
      payload: newName,
    });
  };

  // Sends dispatch to save the users info
  const saveNewUserInfo = () => {
    if (newPasswordInput === '' || newPasswordInput.length < 8) {
      console.log('no password');
      dispatch({
        type: 'SAGA_EDIT_USERS_INFO',
        payload: {
          newEmailInput: userEmail.email,
          newNameInput: userName.name,
        },
      });
    } else {
      console.log('password');
      dispatch({
        type: 'SAGA_EDIT_USERS_INFO',
        payload: {
          newEmailInput: userEmail.email,
          newNameInput: userName.name,
          newPasswordInput: newPasswordInput,
        },
      });
    }
    setNewPasswordInput('');
    setNewVerifyPasswordInput('');
    setOpenComfirmation(false);
    setIsForm(false);
  };

  return (
    <div className="">
      <form>
        <h3 className="invalidHeader">{invalidText}</h3>
        <section>
          Name:
          <TextField
            variant="standard"
            type="text"
            name="name"
            placeholder={profileUser.name}
            value={userName.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            label="New Name"
          />
        </section>

        <section>
          Email:
          <TextField
            variant="standard"
            type="email"
            name="email"
            placeholder={profileUser.email}
            value={userEmail.email}
            onChange={(e) => handleEmailChange(e.target.value)}
            required
            label="New Email"
          />
        </section>

        <section>
          New Password:
          <TextField
            variant="standard"
            type="password"
            name="password"
            placeholder={'password'}
            // onClick={() => setNewPasswordInput('')}
            value={newPasswordInput}
            onChange={(e) => setNewPasswordInput(e.target.value)}
            label="New Password"
          />
        </section>

        <section>
          Verify New Password:
          <TextField
            variant="standard"
            type="password"
            name="Verify New Password"
            placeholder={'verify new password'}
            // onClick={() => setNewVerifyPasswordInput('')}
            value={newVerifyPasswordInput}
            onChange={(e) => setNewVerifyPasswordInput(e.target.value)}
            label="Verify New Password"
          />
        </section>

        <Button
          onClick={handleComfirmationClickOpen}
          variant="contained"
          type="button"
          sx={{
            mb: 5,
            mr: 2,
          }}
        >
          <SaveIcon /> Save Changes
        </Button>
        <Button
          color="error"
          onClick={handleDiscardClickOpen}
          variant="outlined"
          type="button"
          sx={{
            mb: 5,
            ml: 2,
          }}
        >
          <DeleteIcon /> Discard Changes
        </Button>
        <h5 className="nameErrorText">
          {userName.name === '' ? 'you must enter a valid name' : ''}
        </h5>

        <h5 className="emailErrorText">
          {userEmail.email === '' ? 'you must enter a valid email' : ''}
        </h5>

        <h5 className="passwordErrorText">
          {' '}
          {newPasswordInput.length < 8 && newPasswordInput !== ''
            ? 'password must be 8 or more characters'
            : newPasswordInput !== newVerifyPasswordInput
              ? 'passwords do not match'
              : ''}
        </h5>
      </form>

      {/* Discard Dialog */}
      <Dialog
        open={openDiscard}
        onClose={handleDiscardClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Are you sure you want to discard these changes?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You can change this information again if need be.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={discardChanges} autoFocus>
            <DeleteIcon /> Discard
          </Button>
          <Button sx={{ color: 'black' }} onClick={handleDiscardClose}>
            <CloseIcon /> Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={openComfirmation}
        onClose={handleComfirmationClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Are you sure you want to save the new information?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You can change this information again if need be.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={saveNewUserInfo} autoFocus>
            <SaveIcon /> Save Changes
          </Button>
          <Button sx={{ color: 'black' }} onClick={handleComfirmationClose}>
            <CloseIcon /> Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
