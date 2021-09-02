import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/dist/client/router';
import { FC, MutableRefObject, useRef } from 'react';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import CenteredContainerWithBackButton from '../../src/components/CenteredContainerWithBackButton';
import PostMasonry from '../../src/components/PostMasonry';
import Title from '../../src/components/Title';
import { db } from '../../src/layouts/FirebaseLayout';
import { PostType } from '../../src/models/types';
import { getUser } from '../../src/store/modules/App/selectors';
const ProfileContainer = dynamic(() => import('../../src/components/ProfileContainer'), { ssr: false });

const Img = styled.img`
  width: 4rem;
  margin-right: 10px;
  height: 4rem;
  border-radius: 50%;
`;
const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const Profile: FC<{ posts: PostType[] }> = ({ posts }) => {
  const user = useSelector(getUser);
  const { query } = useRouter();

  return (
    <CenteredContainerWithBackButton>
      <ProfileContainer>
        <Title>
          <TitleWrapper>
            {' '}
            {query.id === user?.uid ? <Img src={user?.photoURL || ''} /> : <>$</>}
            {user?.displayName || user?.email}{' '}
          </TitleWrapper>
        </Title>
      </ProfileContainer>
      <PostMasonry posts={posts} />
    </CenteredContainerWithBackButton>
  );
};

export default Profile;

export const getServerSideProps = async (context: any) => {
  const { id } = context.query;

  const posts: PostType[] = [];
  const q = query(collection(db, 'posts'), where('by.id', '==', id));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(async doc => {
    posts.push({ ...doc.data(), id: doc.id } as PostType);
  });
  return {
    props: { posts: posts.sort(({ created }, __) => __.created - created) }
  };
};
