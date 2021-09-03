import { ProfileType } from './../models/types';
import { db } from './../layouts/FirebaseLayout/index';
import { getDoc, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export const useFindUser = (id: string): ProfileType | null => {
  const [user, setUser] = useState<ProfileType | null>(null);

  useEffect(() => {
    const uploadUser = async () => {
      try {
        const profileDoc = doc(db, 'users', id);
        const profileUser = await getDoc(profileDoc);
        setUser(profileUser.data() as ProfileType);
      } catch (error) {
        setUser(null);

        console.log(error);
      }
    };
    uploadUser();
  }, [id]);

  return user;
};
