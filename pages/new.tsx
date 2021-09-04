import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'next/dist/client/router';
import { useSelector } from 'react-redux';
import { getUser } from '../src/store/modules/App/selectors';
import CreatingPostPart from '../src/components/CreatingPostPart';
import { InputsNames } from '../src/models/denotation';
import { db } from '../src/layouts/FirebaseLayout';

const New = () => {
  const nullityState = { [InputsNames.TITLE]: '', [InputsNames.TEXT]: '', bg_image: '', collaborators: [] as string[] };
  const user = useSelector(getUser);

  const [state, setState] = useState(nullityState);
  const { push } = useRouter();

  const handleAddNewPost = async () => {
    if (state[InputsNames.TEXT].length > 2000)
      return toast('Max lenght of text is 2000 letters', {
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
