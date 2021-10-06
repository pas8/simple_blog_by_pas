import { useState } from 'react';
import { toast } from 'react-toastify';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/dist/client/router';
import CreatingPostPart from '../src/components/CreatingPostPart';
import { InputsNames } from '../src/models/denotation';
import { db } from '../src/layouts/FirebaseLayout';
import { useUnLoginedUserDefender } from '../src/hooks/useUnLoginedUserDefender.hook';

const New = () => {
  const nullityState = { [InputsNames.TITLE]: '', [InputsNames.TEXT]: '', bg_image: '', collaborators: [] as string[] };
  const [condition, placeholder, user] = useUnLoginedUserDefender();
  if (condition) return placeholder;
  const [state, setState] = useState(nullityState);
  const { push } = useRouter();

  const handleAddNewPost = async () => {
    if (state[InputsNames.TEXT].length > 8000)
      return toast('Max lenght of text is 8000 letters', {
        type: 'error',
        theme: 'colored',
        position: 'bottom-right'
      });
    if (state[InputsNames.TITLE].length > 200)
      return toast('Max lenght of title is 200 letters', {
        type: 'error',
        theme: 'colored',
        position: 'bottom-right'
      });
    if (!state.bg_image || !state[InputsNames.TITLE])
      return toast('You should add photo and title altghouth.', {
        type: 'error',
        theme: 'colored',
        position: 'bottom-right'
      });
    try {
      const { id } = await addDoc(collection(db, 'posts'), {
        ...state,
        created: Date.now(),
        likes: [],
        comments: [],
        maintainer: user?.id
      });

      if (!id) return;

      state.collaborators.forEach(async id => {
        const profileDoc = doc(db, 'users', id);
        const profileUser = await getDoc(profileDoc);
        const { email: toEmail } = profileUser.data() as any;

        fetch('/api/email', {
          method: 'POST',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ toEmail, byEmail: user?.email, postLink: `https://simple-blog-by-pas.vercel.app/post/${id}` })
        }).catch(err => {
          console.log(err)
          toast('Something went wrong', { type: 'error', theme: 'colored', position: 'bottom-right' });
        });
      });

      toast('New posts was successfully added', { type: 'success', theme: 'colored', position: 'bottom-right' });
      setState(nullityState);
      push('/');
    } catch (error) {
      console.log(error);
      toast('Something went wrong', { type: 'error', theme: 'colored', position: 'bottom-right' });
    }
  };

  return (
    <CreatingPostPart
      onClickOfSubmitButton={handleAddNewPost}
      state={state}
      setState={setState}
      maintainer={user?.id || ''}
    />
  );
};

export default New;
