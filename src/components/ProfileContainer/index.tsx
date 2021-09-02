import { FC } from 'react';

const ProfileContainer: FC = ({ children }) => {
  return <div style={{ width: document.getElementById('main-container')?.offsetWidth }}>{children}</div>;
};
export default ProfileContainer
