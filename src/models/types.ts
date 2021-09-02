import { AppInitialStateType } from '../store/modules/App/types';

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
  by: { id: string; name: string };
  likes: string[];
  comments: { by: string; value: string; name: string }[];
};

export type PostItemStateType = { [key: string]: { [Property in 'isLiked' | 'isWritingComment']: boolean } };
