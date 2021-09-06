import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/dist/client/router';
import { FC, useRef } from 'react';
import CenteredContainerWithBackButton from '../../src/components/CenteredContainerWithBackButton';
import CommentMenu from '../../src/components/CommentMenu';
import Post from '../../src/components/Post';
import { useFindUser } from '../../src/hooks/useFindUser.hook';
import { useUploadUsersTheme } from '../../src/hooks/useUploadUsersTheme.hook';
import { db } from '../../src/layouts/FirebaseLayout';
import { PostType } from '../../src/models/types';
import { NextSeo, BlogJsonLd } from 'next-seo';

const PostPage: FC<{ post: PostType }> = ({ post }) => {
  const maintainerUser = useFindUser(post.maintainer);
  useUploadUsersTheme(maintainerUser);
  return (
    <>
      <BlogJsonLd
        url={`https://simple-blog-by-pas.vercel.app/post/${post.id}`}
        title={post.Title}
        images={[post.bg_image]}
        datePublished={new Date(post?.created).toLocaleString()}
        dateModified={new Date(post?.created).toLocaleString()}
        authorName={maintainerUser?.displayName!}
        description={post.Text}
      />
      <NextSeo
        title={post.Title}
        description={post.Text}
        canonical={`https://simple-blog-by-pas.vercel.app/post/${post.id}`}
        openGraph={{
          url: `https://simple-blog-by-pas.vercel.app/post/${post.id}`,
          title: post.Title,
          description: post.Text,
          images: [
            {
              url: post.bg_image,

              alt: post.Title
            }
          ],
          site_name: 'Simple blog'
        }}
      />

      <CommentMenu />
      <CenteredContainerWithBackButton>
        <div style={{ marginTop: 16 }}>
          <Post {...post} />
        </div>
      </CenteredContainerWithBackButton>
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  const { id } = context.query;

  const docRef = doc(db, 'posts', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return { props: { redirect: '/' } };

  return {
    props: { post: { ...docSnap.data(), id } }
  };
};

export default PostPage;
