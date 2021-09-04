import { User } from 'firebase/auth';
import { ThemeType, ProfileType, MessageType, CommentType } from './../../../models/types';
import { $Values, Optional } from 'utility-types';
import { TypeNames } from './enums';

export type PayloadTypes = {
  [TypeNames.HANDLE_CHANGE_THEME_PROPERTYIES]: {
    themePropertyies: ThemeType;
  };
  [TypeNames.HANDLE_CHANGE_USER]: {
    user: ProfileType | null;
  };
  [TypeNames.HANDLE_CHANGE_MESSAGE_MENU_PROPERTIES]: {
    messageMenuProperties: MessageMenuPropertiesType | null;
  };
  [TypeNames.HANDLE_CHANGE_COMMENT_MENU_PROPERTIES]: {
    commentMenuProperties: CommentMenuPropertiesType | null;
  };
};

export type ActionsValueTypes = {
  toChangeCommentMenuProperties: {
    type: typeof TypeNames.HANDLE_CHANGE_COMMENT_MENU_PROPERTIES;
    payload: PayloadTypes[TypeNames.HANDLE_CHANGE_COMMENT_MENU_PROPERTIES];
  };
  toChangeMessageMenuProperties: {
    type: typeof TypeNames.HANDLE_CHANGE_MESSAGE_MENU_PROPERTIES;
    payload: PayloadTypes[TypeNames.HANDLE_CHANGE_MESSAGE_MENU_PROPERTIES];
  };
  toChangeThemePropertyies: {
    type: typeof TypeNames.HANDLE_CHANGE_THEME_PROPERTYIES;
    payload: PayloadTypes[TypeNames.HANDLE_CHANGE_THEME_PROPERTYIES];
  };
  toChangeChangeUser: {
    type: typeof TypeNames.HANDLE_CHANGE_USER;
    payload: PayloadTypes[TypeNames.HANDLE_CHANGE_USER];
  };
};
export type AppActionTypes = $Values<ActionsValueTypes>;
export type MessageMenuPropertiesType = MessageType &
  {
    [Property in 'x' | 'y']: number;
  } & { isSelfMessage: boolean };

export type CommentMenuPropertiesType = CommentType &
  {
    [Property in 'x' | 'y']: number;
  } & { isSelfComment: boolean; postId: string };

export type AppInitialStateType = {
  themePropertyies: ThemeType;
  user: ProfileType | null;
  messageMenuProperties: MessageMenuPropertiesType | null;
  commentMenuProperties: CommentMenuPropertiesType | null;
};
