import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/dist/client/router';
import { FC, useRef } from 'react';
import CenteredContainerWithBackButton from '../../src/components/CenteredContainerWithBackButton';
import Post from '../../src/components/Post';
import { db } from '../../src/layouts/FirebaseLayout';
import { PostType } from '../../src/models/types';

const PostPage: FC<{ post: PostType }> = ({ post }) => {
  return (
    <CenteredContainerWithBackButton>
      <Post {...post}/>
    </CenteredContainerWithBackButton>
  );
};

export const getServerSideProps = async (context: any) => {
  const { id } = context.query;

  const docRef = doc(db, 'posts', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return { props: { redirect: '/' } };
  return {
    props: { post: docSnap.data() }
  };
};

export default PostPage;
