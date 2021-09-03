import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/dist/client/router';
import { FC, MutableRefObject, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import CenteredContainerWithBackButton from '../../src/components/CenteredContainerWithBackButton';
import PostMasonry from '../../src/components/PostMasonry';
import Title from '../../src/components/Title';
import { db } from '../../src/layouts/FirebaseLayout';
import { PostType, ProfileDocType } from '../../src/models/types';
import { getUser } from '../../src/store/modules/App/selectors';

import dynamic from 'next/dynamic';
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
const Profile: FC<{ posts: PostType[]; profileUser: ProfileDocType }> = ({ posts, profileUser }) => {
  return (
    <CenteredContainerWithBackButton>
      <ProfileContainer>
        <Title>
          <TitleWrapper>
            {<Img src={profileUser.photoURL || ''} />}${profileUser?.displayName || profileUser?.email}
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

  const profileDoc = doc(db, 'users', id);
  const profileUser = await getDoc(profileDoc);

  const posts: PostType[] = [];
  const q = query(collection(db, 'posts'), where('maintainer', '==', id));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(async doc => {
    posts.push({ ...doc.data(), id: doc.id } as PostType);
  });
  return {
    props: { posts: posts.sort(({ created }, __) => __.created - created), profileUser: profileUser.data() }
  };
};
