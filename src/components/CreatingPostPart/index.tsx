import { ChangeEventHandler, FC, useCallback, useRef, useState } from 'react';
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
import Dialog from '../Dialog';
import CloseButton from '../CloseButton';
import SaveButton from '../SaveButton';

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

const T = styled(Title)`
  padding-right: 60px;
`;
const UtilsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
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
  const [isSearchingDialogOpen, setIsSearchingDialogOpen] = useState(false);

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
  // const handleSave

  return (
    <>
      <Dialog
        isOpen={isSearchingDialogOpen}
        title={'Add collobarators'}
        contentChildren={
          <>
            <TitleInput />
          </>
        }
        utilsChildren={
          <>
            <CloseButton onClick={() => setIsSearchingDialogOpen(false)} />
            <SaveButton onClick={() => {}} />
          </>
        }
      />
      <CenteredContainerWithBackButton>
        {children}
        {
          //@ts-ignore
          <DragPlaceholder isDragActive={isDragActive}></DragPlaceholder>
        }
        <div>
          <T ref={titleRef}>
            {title}
            <div {...getRootProps()}>
              <IconButton
                dimensions={{ top: '28%', right: 0 }}
                d={'M9,10V16H15V10H19L12,3L5,10H9M12,5.8L14.2,8H13V14H11V8H9.8L12,5.8M19,18H5V20H19V18Z'}
              ></IconButton>
              <input {...getInputProps()} />
            </div>
          </T>
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
          <UtilsContainer>
            <IconButton
              position={'relative'}
              onClick={() => setIsSearchingDialogOpen(true)}
              d="M5 15v-3h3v-2H5V7H3v3H0v2h3v3zm7-1.25c-2.34 0-7 1.17-7 3.5V19h14v-1.75c0-2.33-4.66-3.5-7-3.5zM7.34 17c.84-.58 2.87-1.25 4.66-1.25s3.82.67 4.66 1.25H7.34zM12 12c1.93 0 3.5-1.57 3.5-3.5S13.93 5 12 5 8.5 6.57 8.5 8.5 10.07 12 12 12zm0-5c.83 0 1.5.67 1.5 1.5S12.83 10 12 10s-1.5-.67-1.5-1.5S11.17 7 12 7zm5 5c1.93 0 3.5-1.57 3.5-3.5S18.93 5 17 5c-.24 0-.48.02-.71.07.76.94 1.21 2.13 1.21 3.43 0 1.3-.47 2.48-1.23 3.42.24.05.48.08.73.08zm2.32 2.02c1 .81 1.68 1.87 1.68 3.23V19h3v-1.75c0-1.69-2.44-2.76-4.68-3.23z"
            />
            <AddPostButton onClick={onClickOfSubmitButton}>{submitButtonText}</AddPostButton>
          </UtilsContainer>
        </div>
      </CenteredContainerWithBackButton>
    </>
  );
};

export default CreatingPostPart;
