import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import MainContainer from '../../components/MainContainer';
import { device } from '../../models/denotation';
import { getThemePropertyies } from '../../store/modules/App/selectors';



const GlobalStyle = createGlobalStyle`body{margin:0;fontFamily;display:flex;justify-content:center;background:${({
  theme: { background }
}: any) => background};}`;

const ThemeLayout: FC = ({ children }) => {
  const theme = useSelector(getThemePropertyies);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <MainContainer id={'main-container'}>{children}</MainContainer>
    </ThemeProvider>
  );
};

export default ThemeLayout;
