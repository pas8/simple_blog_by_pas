import { colord } from 'colord';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/dist/client/router';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Button from '../../src/components/Button';
import CreatingPostPart from '../../src/components/CreatingPostPart';
import Dialog from '../../src/components/Dialog';
import IconButton from '../../src/components/IconButton';
import { db } from '../../src/layouts/FirebaseLayout';
import { InputsNames } from '../../src/models/denotation';
import { PostType } from '../../src/models/types';
import { getUser } from '../../src/store/modules/App/selectors';

const EditPostPage: FC<{ post: PostType }> = ({ post }) => {
  const nullityState = { [InputsNames.TITLE]: post.Title, [InputsNames.TEXT]: post.Text, bg_image: post.bg_image };

  const [state, setState] = useState(nullityState);
  const {
    push,
    query: { id }
  } = useRouter();
  const user = useSelector(getUser);
  const ref = doc(db, 'posts', id as string);

  const handleChangePost = async () => {
    // if (!every(values(state), el => !!el))
    if (!state.bg_image || !state[InputsNames.TITLE])
      return toast('You should add photo altghouth.', {
        type: 'error',
        theme: 'colored',
        position: 'bottom-right'
      });

    try {
      await updateDoc(ref, {
        ...state
      });
      toast('U successfully edited a blog)', {
        type: 'success',
        theme: 'colored',
        position: 'bottom-right'
      });
    } catch (error) {
      toast('Something  went wront!', {
        type: 'error',
        theme: 'colored',
        position: 'bottom-right'
      });
    }
  };

  const handleDeletePost = async () => {
    try {
      await deleteDoc(ref);
      toast('You just deleted a post(', {
        type: 'info',
        theme: 'colored',
        position: 'bottom-right'
      });
      push('/');
    } catch (error) {
      toast('Something  went wront!', {
        type: 'error',
        theme: 'colored',
        position: 'bottom-right'
      });
    }
  };

  const [isDefenderDialogOpen, setIsDefenderDialogOpen] = useState(false);

  return (
    <>
      <Dialog
        isOpen={isDefenderDialogOpen}
        title={'Are u sure that u want delete this post?'}
        utilsChildren={
          <>
            <Button onClick={() => setIsDefenderDialogOpen(false)}>Cancel</Button>
            {
              //@ts-ignore
              <Button isDangerous onClick={() => handleDeletePost()}>
                Delete
              </Button>
            }
          </>
        }
      />

      <CreatingPostPart
        onClickOfSubmitButton={handleChangePost}
        state={state}
        setState={setState}
        title={'Edit post'}
        submitButtonText={'Save changes'}
      >
        <IconButton
          d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"
          onClick={() => setIsDefenderDialogOpen(true)}
          dimensions={{ top: 16, right: 0 }}
        />
      </CreatingPostPart>
    </>
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

export default EditPostPage;
