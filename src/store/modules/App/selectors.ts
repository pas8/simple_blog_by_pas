import { RootStoreType } from './../../../models/types';
import { createSelector } from 'reselect';

export const getThemePropertyies = createSelector(
  [(state: RootStoreType) => state.app.themePropertyies],
  themePropertyies => themePropertyies
);
export const getUser = createSelector([(state: RootStoreType) => state.app.user], user => user);
export const getMessageMenuProperties = createSelector(
  [(state: RootStoreType) => state.app.messageMenuProperties],
  messageMenuProperties => messageMenuProperties
);
export const getCommentMenuProperties = createSelector(
  [(state: RootStoreType) => state.app.commentMenuProperties],
  commentMenuProperties => commentMenuProperties
);
