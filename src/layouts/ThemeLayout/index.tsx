import { colord, extend } from 'colord';
import { mapValues } from 'lodash';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import MainContainer from '../../components/MainContainer';
import { device } from '../../models/denotation';
import { toChangeThemePropertyies } from '../../store/modules/App/actions';
import { getThemePropertyies, getUser } from '../../store/modules/App/selectors';
import mixPlugin from 'colord/plugins/mix';

const GlobalStyle = createGlobalStyle`*{
  word-break: break-word;
  &::selection{
    color:${({ theme: { background } }) => background};
    background: ${({ theme: { primary } }) => primary};
  }
  &::-webkit-scrollbar              { 
    background:transparent;
    width:8px;
  };
  &::-webkit-scrollbar-button       {
    display:none;
  }
  &::-webkit-scrollbar-thumb {  
    background: ${({ theme: { background, primary } }) => {
      extend([mixPlugin]);
      return colord(background).alpha(0.16).mix(primary, 0.8).toHex();
    }};
    border-radius:8px;
    &:hover{
    background: ${({ theme: { primary } }) => primary};
     
    }
  }
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
