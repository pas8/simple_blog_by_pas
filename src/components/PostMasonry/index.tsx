import { FC } from 'react';
//@ts-ignore
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import styled from 'styled-components';
import { PostType } from '../../models/types';
import Post from '../Post';

const PostWrapper = styled.div` 
  width: 100%;
  displat: block;
`;

const PostMasonry: FC<{ posts: PostType[] }> = ({ posts }) => {
  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 600: 1, 900: 2, 1400: 3, 1900: 4 }}>
      <Masonry gutter={'10px'}>
        {posts.map(props => (
          <PostWrapper key={props?.id}>
            <Post {...props} />
          </PostWrapper>
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default PostMasonry;
