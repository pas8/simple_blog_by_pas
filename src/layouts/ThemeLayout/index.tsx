import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { device } from '../../models/denotation';
import { getThemePropertyies } from '../../store/modules/App/selectors';

const MainContainer = styled.main`
  min-height: 100vh;
  font-family: 'system-ui';
  // position:relative;
  color: ${({ theme: { text } }) => text};
  
  @media ${device.desktopL} {
    width: 56vw;
  }
  @media ${device.desktop} {
    width: 60vw;
  }
  @media ${device.desktop} {
    width: 60vw;
  }
  @media ${device.laptopL} {
    width: 70vw;
  }
  @media ${device.laptop} {
    width: 80vw;
  }
  @media ${device.tablet} {
    width: 90vw;
  }
  @media ${device.mobileM} {
    width: 96vw;
  }
`;

const GlobalStyle = createGlobalStyle`body{margin:0;fontFamily;display:flex;justify-content:center;background:${({
  theme: { background }
}: any) => background};}`;

const ThemeLayout: FC = ({ children }) => {
  const theme = useSelector(getThemePropertyies);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <MainContainer>{children}</MainContainer>
    </ThemeProvider>
  );
};

export default ThemeLayout;
