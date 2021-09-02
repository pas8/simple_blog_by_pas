import { ChangeEventHandler, FC, useCallback, useRef } from 'react';
import styled from 'styled-components';
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from 'react-toastify';
import { getStorage, listAll, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useDropzone } from 'react-dropzone';
import { colord } from 'colord';
import { CreatingPostPartPropsType } from '../../models/types';
import { InputsNames } from '../../models/denotation';
import Input from '../Input';
import Button from '../Button';
import CenteredContainerWithBackButton from '../CenteredContainerWithBackButton';
import Title from '../Title';
import IconButton from '../IconButton';

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

const CreatingPostPart: FC<CreatingPostPartPropsType> = ({
  submitButtonText = 'Add New Post',
  onClickOfSubmitButton,
  setState,
  state,
  children,
  title = 'Create new post'
}) => {
  const titleRef = useRef<HTMLDivElement>() as any;

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
      toast('Something went wrond', { type: 'error', theme: 'dark', position: 'bottom-right' });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png, image/svg',
    maxFiles: 1
  });
  const onChange: ChangeEventHandler<HTMLInputElement> = ({ target: { value, name } }) => {
    setState(state => ({ ...state, [name]: value }));
  };

  return (
    <CenteredContainerWithBackButton>
      {children}
      {
        //@ts-ignore
        <DragPlaceholder isDragActive={isDragActive}></DragPlaceholder>
      }
      <div>
        <Title ref={titleRef}>
          {title}
          <div {...getRootProps()}>
            <IconButton
              dimensions={{ top: '28%', right: 0 }}
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
          placeholder={InputsNames.TITLE}
          name={InputsNames.TITLE}
          value={state[InputsNames.TITLE]}
          onChange={onChange}
        ></TitleInput>
        <TextArea
          placeholder={InputsNames.TEXT}
          name={InputsNames.TEXT}
          value={state[InputsNames.TEXT]}
          //@ts-ignore
          onChange={onChange}
          minRows={8}
        />
        <AddPostButton onClick={onClickOfSubmitButton}>{submitButtonText}</AddPostButton>
      </div>
    </CenteredContainerWithBackButton>
  );
};

export default CreatingPostPart;
