import { User } from 'firebase/auth';
import { ThemeType, ProfileType } from './../../../models/types';
import { $Values, Optional } from 'utility-types';
import { TypeNames } from './enums';

export type PayloadTypes = {
  [TypeNames.HANDLE_CHANGE_THEME_PROPERTYIES]: {
    themePropertyies: ThemeType;
  };
  [TypeNames.HANDLE_CHANGE_USER]: {
    user: ProfileType | null;
  };
};

export type ActionsValueTypes = {
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

export type AppInitialStateType = {
  themePropertyies: ThemeType;
  user: ProfileType | null;
};
