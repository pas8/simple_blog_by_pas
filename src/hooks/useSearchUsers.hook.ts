import { db } from './../layouts/FirebaseLayout/index';
import { ProfileType } from './../models/types';
import { collection, getDocs, query, startAt, where, orderBy, endAt } from 'firebase/firestore';
import { Dispatch, SetStateAction } from 'react';
export const useSearchUsers = async (
  value: string,
  setSearchValue: Dispatch<SetStateAction<string>>,
  setQueryUsers: Dispatch<SetStateAction<ProfileType[]>>
) => {
  setSearchValue(value);
  const isName = value.startsWith('$');
  const isEmail = value.startsWith('@');
  if ((!isEmail && !isName) || value.length === 1) return setQueryUsers([]);
  const str = value.slice(1);
  const q = query(collection(db, 'users'), orderBy(isName ? 'displayName' : 'email'), startAt(str), endAt(str + '~'));
  const querySnapshot = await getDocs(q);
  const users: ProfileType[] = [];

  querySnapshot.forEach(async doc => {
    users.push({ ...doc.data(), id: doc.id } as ProfileType);
  });
  setQueryUsers(users);
};
