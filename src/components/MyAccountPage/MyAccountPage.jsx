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

export default function MyAccountPage() {
  const dispatch = useDispatch();

  const profileUser = useSelector((store) => store.user.profileUserReducer);

  const userEmail = useSelector((store) => store.user.editUserEmail);
  const userName = useSelector((store) => store.user.editUserName);

  useEffect(() => {
    dispatch({ type: 'SAGA_FETCH_PROFILE_PAGE_USER' });
  }, [dispatch]);

  const [isForm, setIsForm] = useState(false);

  const [invalidText, setInvalidText] = useState('');

  // const [newEmailInput, setNewEmailInput] = useState(profileUser.email);
  // const [newNameInput, setNewNameInput] = useState(profileUser.name);
  const [newPasswordInput, setNewPasswordInput] = useState('*********');
  const [newVerifyPasswordInput, setNewVerifyPasswordInput] =
    useState('*********');

  console.log(newPasswordInput);

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
      newPasswordInput &&
      newPasswordInput === newVerifyPasswordInput
    ) {
      setOpenComfirmation(true);
    } else {
      setInvalidText('Invalid, please insert valid information');
    }
  };

  // Closes Comfirmation Dialog
  const handleComfirmationClose = () => {
    setOpenComfirmation(false);
  };

  const discardChanges = () => {
    dispatch({
      type: 'FETCH_USER',
    });
    setOpenDiscard(false);
    setIsForm(!isForm);
  };

  const toggleForm = () => {
    setOpenComfirmation(false);
    setOpenDiscard(false);
    setIsForm(!isForm);
  };

  const handleEmailChange = (newEmail) => {
    dispatch({
      type: 'CHANGE_EMAIL',
      payload: newEmail,
    });
  };

  const handleNameChange = (newName) => {
    dispatch({
      type: 'CHANGE_NAME',
      payload: newName,
    });
  };

  // Sends dispatch to save the users info
  const saveNewUserInfo = () => {
    // console.log('black password', newPasswordInput);
    if (newPasswordInput === '*********') {
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
    setNewPasswordInput('*********');
    setNewVerifyPasswordInput('*********');
    toggleForm();
  };

  const displayText = () => {
    if (isForm) {
      return (
        <>
          <form>
            <h2>{invalidText}</h2>

            <p>Name:</p>
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

            <p>Email:</p>
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

            <p>New Password:</p>
            <TextField
              variant="standard"
              type="password"
              name="password"
              placeholder={'password'}
              onClick={() => setNewPasswordInput('')}
              value={newPasswordInput}
              onChange={(e) => setNewPasswordInput(e.target.value)}
              required
              label="New Password"
            />

            {newPasswordInput === newVerifyPasswordInput ? '' : 'Invalid'}

            <p>Verify New Password:</p>
            <TextField
              variant="standard"
              type="password"
              name="Verify New Password"
              placeholder={'verify new password'}
              onClick={() => setNewVerifyPasswordInput('')}
              value={newVerifyPasswordInput}
              onChange={(e) => setNewVerifyPasswordInput(e.target.value)}
              required
              label="Verify New Password"
            />

            <Button onClick={handleDiscardClickOpen} type="button">
              Discard Changes
            </Button>
            <Button onClick={handleComfirmationClickOpen} type="button">
              Save Changes
            </Button>
          </form>
        </>
      );
    }
    if (isForm === false) {
      return (
        <>
          <Button onClick={toggleForm} type="button">
            <EditIcon />
          </Button>

          <p>Name: {profileUser.user_name}</p>
          <p>Email: {profileUser.email} </p>
          <p>Company Name: {profileUser.company_name}</p>
        </>
      );
    }
  };

  return (
    <div>
      <h1>My Account Page:</h1>

      {displayText()}

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
            This action cannot be undone. Please be careful!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={discardChanges} autoFocus>
            Discard
          </Button>
          <Button onClick={handleDiscardClose}>Cancel</Button>
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
            This action cannot be undone. Please be careful!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={saveNewUserInfo} autoFocus>
            Save Changes
          </Button>
          <Button onClick={handleComfirmationClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
