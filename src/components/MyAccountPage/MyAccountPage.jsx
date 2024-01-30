import { useSelector } from 'react-redux';
export default function MyAccountPage() {
  const user = useSelector((store) => store.user);
  console.log(user.currentUser);
  return (
    <div>
      <h1>My Account Page:</h1>
      <p>Email: {user.currentUser.email} </p>
      <p>Username: {user.currentUser.name}</p>
    </div>
  );
}
