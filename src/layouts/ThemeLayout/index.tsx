import { colord } from 'colord';
import { mapValues } from 'lodash';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import MainContainer from '../../components/MainContainer';
import { device } from '../../models/denotation';
import { toChangeThemePropertyies } from '../../store/modules/App/actions';
import { getThemePropertyies, getUser } from '../../store/modules/App/selectors';

const GlobalStyle = createGlobalStyle`*{
  word-break: break-word;

};
a {
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
body{overflow-x:hidden;margin:0;fontFamily;display:flex;justify-content:center;background:${({
  theme: { background }
}: any) => background};}`;

const ThemeLayout: FC = ({ children }) => {
  const theme = useSelector(getThemePropertyies);
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) return;

    const themePropertyies = user.isThemeDark ? theme : mapValues(theme, el => colord(el).invert().toHex());
    dispatch(toChangeThemePropertyies({ themePropertyies: { ...themePropertyies, primary: user.primaryColor } }));
  }, [user?.primaryColor]);
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <MainContainer id={'main-container'}>{children}</MainContainer>
    </ThemeProvider>
  );
};

export default ThemeLayout;
