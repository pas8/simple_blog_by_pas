import { Dispatch, SetStateAction } from 'react';
import { AppInitialStateType } from '../store/modules/App/types';
import { InputsNames } from './denotation';

export type ThemeType = {
  [Property in 'background' | 'text' | 'primary']: string;
};

export type RootStoreType = {
  app: AppInitialStateType;
};
export type PostType = {
  Title: string;
  Text: string;
  created: number;
  id: string;
  bg_image: string;
  maintainer: string;
  likes: string[];
  collaborators: string[];
};
// comments: CommentType[];

export type CommentType = { by: string; value: string; created: number; isEdited: boolean; id: string;  }
export type PostItemStateType = { [key: string]: { [Property in 'isLiked' | 'isWritingComment']: boolean } };
export type StateOfCreatingPostPartPropsType = { [Propety in InputsNames | 'bg_image']: string } & {
  collaborators: string[];
};

export type CreatingPostPartPropsType = {
  submitButtonText?: string;
  onClickOfSubmitButton: () => void;
  maintainer: string;
  title?: string;
  state: StateOfCreatingPostPartPropsType;
  setState: Dispatch<SetStateAction<StateOfCreatingPostPartPropsType>>;
};

export type ProfileDocType = {
  [Property in 'email' | 'photoURL' | 'displayName']: string;
} & {
  primaryColor: string;
  isThemeDark: boolean;
};

export type ProfileType = ProfileDocType & { id: string };

export type MessageType = { id: string; created: number; value: string; by: string; isEdited: boolean };
export type ChatMessageMenuPropsType = {
  isPrivateMode?: boolean;
  handleDeleteMessage: (id: string) => void;
  handleUpdateMessage: (id: string, value: string) => void;
};

export type ChatMainPartPropsType = {
  messages: MessageType[];
  title?: string;
  titleURL?:string;
  titlePhoto?: string;

  handleAddMessage: () => void;
  messageValue: string;
  setMessageValue: Dispatch<SetStateAction<string>>;
} & ChatMessageMenuPropsType;
