import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MyAccountPageForm from '../MyAccountPageForm/MyAccountPageForm';
import './MyAccountPage.css';

export default function MyAccountPage() {
  const dispatch = useDispatch();

  const profileUser = useSelector((store) => store.user.profileUserReducer);
  const currentUser = useSelector((store) => store.user.currentUser);

  useEffect(() => {
    dispatch({ type: 'SAGA_FETCH_PROFILE_PAGE_USER' });
  }, [dispatch]);

  const [isForm, setIsForm] = useState(false);

  const toggleForm = () => {
    setIsForm(true);
  };

  const displayText = () => {
    if (isForm) {
      return (
        <>
          <MyAccountPageForm setIsForm={setIsForm} />
        </>
      );
    }
    if (isForm === false) {
      return (
        <>
          <p>Name: {currentUser.name}</p>
          <p>Email: {currentUser.email} </p>
          <p>Company Name: {profileUser.company_name}</p>

          <Button
            aria-label="edit info"
            className="editInfoButton"
            onClick={toggleForm}
            type="button"
          >
            <EditIcon sx={{ color: 'black' }} />
          </Button>
        </>
      );
    }
  };

  return (
    <div className="myAccountPageCss">
      <h1>My Account Page</h1>
      <div className="accountPageFormArea">{displayText()}</div>
    </div>
  );
}
