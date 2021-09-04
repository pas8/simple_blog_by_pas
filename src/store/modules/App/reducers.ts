import { colord } from 'colord';
import { TypeNames } from './enums';
import { AppActionTypes, AppInitialStateType } from './types';

export const initialState: AppInitialStateType = {
  themePropertyies: {
    background: '#161616',
    text: '#fff',
    primary: '#FFEA00'
  },
  commentMenuProperties: null,
  user: null,
  messageMenuProperties: null
};

export const AppReducer = (state = initialState, action: AppActionTypes): AppInitialStateType => {
  switch (action.type) {
    case TypeNames.HANDLE_CHANGE_USER:
    case TypeNames.HANDLE_CHANGE_MESSAGE_MENU_PROPERTIES:
    case TypeNames.HANDLE_CHANGE_COMMENT_MENU_PROPERTIES:
    case TypeNames.HANDLE_CHANGE_THEME_PROPERTYIES: {
      return { ...state, ...action.payload };
    }

    default:
      return state;
  }
};
