import { collection, query, getDocs, where } from 'firebase/firestore';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/dist/client/router';
import { FC } from 'react';
import styled from 'styled-components';
import CenteredContainerWithBackButton from '../../src/components/CenteredContainerWithBackButton';
import FlexContainerWithBorder from '../../src/components/FlexContainerWithBorder';
import IconButton from '../../src/components/IconButton';
import PostMasonry from '../../src/components/PostMasonry';
import SeachingUserItem from '../../src/components/SeachingUserItem';
import Title from '../../src/components/Title';
import { useUnLoginedUserDefender } from '../../src/hooks/useUnLoginedUserDefender.hook';
import { db } from '../../src/layouts/FirebaseLayout';
import { PostType, ProfileType } from '../../src/models/types';

const Container = styled.div`
  width: 100%;
`;

const Fired: FC<{ posts: PostType[]; id: string }> = ({ posts, id }) => {
  const { push } = useRouter();

  const [condition, placeholder, user] = useUnLoginedUserDefender(id);
  if (condition) return placeholder;

  return (
    <CenteredContainerWithBackButton divProps={{ style: { width: '100%' } as any } as any}>
      <IconButton
        dimensions={{ right: 0, top: 16 }}
        onClick={() => push(`/fired/users/${user?.id}`)}
        d={
          'M13.07 10.41A5 5 0 0 0 13.07 4.59A3.39 3.39 0 0 1 15 4A3.5 3.5 0 0 1 15 11A3.39 3.39 0 0 1 13.07 10.41M5.5 7.5A3.5 3.5 0 1 1 9 11A3.5 3.5 0 0 1 5.5 7.5M7.5 7.5A1.5 1.5 0 1 0 9 6A1.5 1.5 0 0 0 7.5 7.5M16 17V19H2V17S2 13 9 13 16 17 16 17M14 17C13.86 16.22 12.67 15 9 15S4.07 16.31 4 17M15.95 13A5.32 5.32 0 0 1 18 17V19H22V17S22 13.37 15.94 13Z'
        }
      />
      <Container>
        <Title>Posts of fired users</Title>
        <PostMasonry posts={posts} isPreviewMode />
      </Container>
    </CenteredContainerWithBackButton>
  );
};

export default Fired;

export const getServerSideProps: GetServerSideProps = async ({ query: { id } }) => {
  const users: string[] = [''];
  const posts: PostType[] = [];
  const q = query(collection(db, 'users'), where('crowns', 'array-contains-any', [id]));

  const queryUsersSnapshot = await getDocs(q);

  queryUsersSnapshot.forEach(async doc => {
    users.push(doc.id);
  });

  const qPosts = query(collection(db, 'posts'), where('maintainer', 'in', users));

  const querySnapshot = await getDocs(qPosts);

  querySnapshot.forEach(async doc => {
    posts.push({ ...doc.data(), id: doc.id } as PostType);
  });

  return {
    props: {
      posts,
      id
    }
  };
};
