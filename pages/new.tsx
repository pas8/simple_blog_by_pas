import { ChangeEventHandler, useCallback, useRef } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from 'react-toastify';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/dist/client/router';
import { getStorage, listAll, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { every, values } from 'lodash';
import { useDropzone } from 'react-dropzone';
import { colord } from 'colord';

import IconButton from '../src/components/IconButton';
import CenteredContainerWithBackButton from '../src/components/CenteredContainerWithBackButton';
import Title from '../src/components/Title';
import { db } from '../src/layouts/FirebaseLayout';
import Button from '../src/components/Button';
import { useSelector } from 'react-redux';
import { getUser } from '../src/store/modules/App/selectors';
import Input from '../src/components/Input';

const TitleInput = styled(Input)`
  width: calc(100% - 0.96em);
`;

const TextArea = styled(TextareaAutosize)`
  margin-bottom: 16px;
  width: calc(100% - 0.96em);
  resize: none;
  outline: none;
  font-size: 1.42em;
  padding: 0.4em 0.4em;
  color: ${({ theme: { text } }) => text};
  background: transparent;
  border:1px solid ${({ theme: { text } }) => colord(text).alpha(0.42).toHex()}};
  caret-color: ${({ theme: { primary } }) => primary};
  border-radius: 8px; 
  &:hover{
    border-color: ${({ theme: { text } }) => text};
  }
  &:focus {
    border-color: ${({ theme: { primary } }) => primary};
  }
`;

const AddPostButton = styled(Button)``;

const ImgPreview = styled.img`
  border-radius: 8px;
  margin-bottom: 20px;
  width: 100%;
`;
const DragPlaceholder = styled.div`
  display: ${({
    //@ts-ignore
    isDragActive
  }) => (!isDragActive ? 'none' : 'block')};
  position: absolute;
  font-size: 1.42em;
  inset: 0;
  background: ${({ theme: { primary } }) => colord(primary).alpha(0.16).toHex()};
`;

const New = () => {
  const inputsNames = { TITLE: 'Title', TEXT: 'Text' };
  const nullityState = { [inputsNames.TITLE]: '', [inputsNames.TEXT]: '', bg_image: '' };

  const [state, setState] = useState(nullityState);
  const { push } = useRouter();
  const titleRef = useRef<HTMLDivElement>() as any;
  const user = useSelector(getUser);
  const onDrop = useCallback(async acceptedFiles => {
    const file = acceptedFiles?.[0];

    if (!file) return;
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `posts/${Math.random().toString(36)}_${Math.random().toString(36)}`);

      await uploadBytes(storageRef, file);

      const bg_image = await getDownloadURL(storageRef);
      setState(state => ({ ...state, bg_image }));
    } catch (error) {
      toast(error, { type: 'error', theme: 'dark', position: 'bottom-right' });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png, image/svg',
    maxFiles: 1
  });

  const handleAddNewPost = async () => {
    if (!every(values(state), el => !!el))
      return toast('You should add photo, title and text', {
        type: 'error',
        theme: 'colored',
        position: 'bottom-right'
      });

    const { id } = await addDoc(collection(db, 'posts'), {
      ...state,
      created: Date.now(),
      likes: [],
      comments: [],
      by: user?.displayName || user?.email
    });
    if (!id) return;

    toast('New posts was successfully added', { type: 'success', theme: 'colored', position: 'bottom-right' });
    setState(nullityState);
    push('/');
  };
  const onChange: ChangeEventHandler<HTMLInputElement> = ({ target: { value, name } }) => {
    setState(state => ({ ...state, [name]: value }));
  };

  return (
    <CenteredContainerWithBackButton>
      {
        //@ts-ignore
        <DragPlaceholder isDragActive={isDragActive}></DragPlaceholder>
      }
      <div>
        <Title ref={titleRef}>
          Create new post
          <div {...getRootProps()}>
            <IconButton
              dimensions={{ top: '32%', right: 0 }}
              d={'M9,10V16H15V10H19L12,3L5,10H9M12,5.8L14.2,8H13V14H11V8H9.8L12,5.8M19,18H5V20H19V18Z'}
            ></IconButton>
            <input {...getInputProps()} />
          </div>
        </Title>
        <div style={{ width: titleRef?.current?.offsetWidth }}>
          {!!state.bg_image && <ImgPreview src={state.bg_image} />}{' '}
        </div>
        <TitleInput
          autoFocus
          placeholder={inputsNames.TITLE}
          name={inputsNames.TITLE}
          value={state[inputsNames.TITLE]}
          onChange={onChange}
        ></TitleInput>
        <TextArea
          placeholder={inputsNames.TEXT}
          name={inputsNames.TEXT}
          value={state[inputsNames.TEXT]}
          //@ts-ignore
          onChange={onChange}
          minRows={8}
        />
        <AddPostButton onClick={handleAddNewPost}>Add New Post</AddPostButton>
      </div>
    </CenteredContainerWithBackButton>
  );
};

export default New;
