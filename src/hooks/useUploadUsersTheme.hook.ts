import { ProfileType } from './../models/types';
import { toChangeThemePropertyies } from './../store/modules/App/actions';
import { getThemePropertyies } from './../store/modules/App/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { colord } from 'colord';
import { ThemeType } from '../models/types';
import { useValidateColor } from './useValidateColor.hook';

export const useUploadUsersTheme = (profileUser: ProfileType | null) => {
  const themePropertyies = useSelector(getThemePropertyies);
  const [maintheme, setMainTheme] = useState<ThemeType>(themePropertyies);

  const dispatch = useDispatch();
  const primary = useValidateColor(profileUser?.primaryColor || '');
  useEffect(() => {
    if (!profileUser) return;

    dispatch(
      toChangeThemePropertyies({
        themePropertyies: {
          ...themePropertyies,
          primary
        }
      })
    );
    return () => {
      dispatch(toChangeThemePropertyies({ themePropertyies: maintheme }));
    };
  }, [profileUser, primary]);
};
