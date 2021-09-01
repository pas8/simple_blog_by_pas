import { RootStoreType } from './../../../models/types';
import { createSelector } from 'reselect';

export const getThemePropertyies = createSelector(
  [(state: RootStoreType) => state.app.themePropertyies],
  themePropertyies => themePropertyies
);
export const getUser = createSelector([(state: RootStoreType) => state.app.user], user => user);






