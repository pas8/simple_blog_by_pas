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
  comments: { by: string; value: string; name: string }[];
};

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


export type MessageType = { id: string; created: number; value: string; by: string }