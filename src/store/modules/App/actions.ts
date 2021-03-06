import { TypeNames } from './enums';
import { AppActionTypes, PayloadTypes } from './types';

export const toChangeThemePropertyies = (
  payload: PayloadTypes[TypeNames.HANDLE_CHANGE_THEME_PROPERTYIES]
): AppActionTypes => ({
  type: TypeNames.HANDLE_CHANGE_THEME_PROPERTYIES,
  payload
});

export const toChangeUser = (payload: PayloadTypes[TypeNames.HANDLE_CHANGE_USER]): AppActionTypes => ({
  type: TypeNames.HANDLE_CHANGE_USER,
  payload
});

export const toChangeMessageMenuProperties = (
  payload: PayloadTypes[TypeNames.HANDLE_CHANGE_MESSAGE_MENU_PROPERTIES]
): AppActionTypes => ({
  type: TypeNames.HANDLE_CHANGE_MESSAGE_MENU_PROPERTIES,
  payload
});


export const toChangeCommentMenuProperties = (
  payload: PayloadTypes[TypeNames.HANDLE_CHANGE_COMMENT_MENU_PROPERTIES]
): AppActionTypes => ({
  type: TypeNames.HANDLE_CHANGE_COMMENT_MENU_PROPERTIES,
  payload
});

