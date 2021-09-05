import { db } from './../layouts/FirebaseLayout/index';
import { deleteDoc, doc } from 'firebase/firestore';
import { RankVariants } from '../models/types';
import { toast } from 'react-toastify';

export const useRestoreProfile = async (id: string, userRank: RankVariants, push: any) => {
  const kickedUserRef = doc(db, 'kicked', id);
  if (userRank !== RankVariants.TRIARII && userRank !== RankVariants.IMPERATOR)
    return toast(`Only ${RankVariants.IMPERATOR} or  ${RankVariants.TRIARII}     can  restore profile`, {
      type: 'error',
      theme: 'colored',
      position: 'bottom-right'
    });

  try {
    await deleteDoc(kickedUserRef);
    toast('You sucssesfully restored this account!', {
      type: 'success',
      theme: 'colored',
      position: 'bottom-right'
    });
    push(`/profile/${id}`);
  } catch (error) {
    console.log(error);
    toast('Something went wrong, try again ', {
      type: 'error',
      theme: 'colored',
      position: 'bottom-right'
    });
  }
};
