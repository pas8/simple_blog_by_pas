import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/dist/client/router';
import { useDispatch } from 'react-redux';
import { toChangeUser } from '../store/modules/App/actions';

export const useSignOut = (): (() => void) => {
  const dispatch = useDispatch();
  const auth = getAuth();
  const { push } = useRouter();
  const handleSignOut = () => {
    dispatch(toChangeUser({ user: null }));
    signOut(auth);
    push('/');
  };

  return handleSignOut;
};
