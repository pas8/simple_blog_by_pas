import { FC } from 'react';
import { initializeApp ,} from 'firebase/app';
import { getFirestore } from "firebase/firestore"
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.DB_KEY,
  authDomain: 'simpleblog-ae929.firebaseapp.com',
  projectId: 'simpleblog-ae929',
  storageBucket: 'simpleblog-ae929.appspot.com',
  messagingSenderId: '644668083130',
  appId: '1:644668083130:web:62de25f7d788f7e19bab83',
  measurementId: 'G-V9M8FMKGFN'
};
export const app = initializeApp(firebaseConfig);
export const db = getFirestore( )
export const storage = getStorage(app);

const FirebaseLayout: FC = ({ children }) => {
  return <>{children}</>;
};

export default FirebaseLayout;
