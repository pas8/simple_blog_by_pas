import { TypeNames } from './enums';
import { AppActionTypes, PayloadTypes } from './types';

export const toChangeThemePropertyies = (
  payload: PayloadTypes[TypeNames.HANDLE_CHANGE_THEME_PROPERTYIES]
): AppActionTypes => ({
  type: TypeNames.HANDLE_CHANGE_THEME_PROPERTYIES,
  payload
});

export const toChangeUser = (
  payload: PayloadTypes[TypeNames.HANDLE_CHANGE_USER]
): AppActionTypes => ({
  type: TypeNames.HANDLE_CHANGE_USER,
  payload
});

