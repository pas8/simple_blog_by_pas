import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/dist/client/router';
import { useDispatch } from 'react-redux';
import { useSignOut } from '../../hooks/useSignOut.hook';
import { toChangeUser } from '../../store/modules/App/actions';
import IconButton from '../IconButton';

const SignOutIconButton = () => {
  const handeSignOut = useSignOut();
  return (
    <IconButton
      onClick={handeSignOut}
      position={'relative'}
      d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
    />
  );
};

export default SignOutIconButton;
