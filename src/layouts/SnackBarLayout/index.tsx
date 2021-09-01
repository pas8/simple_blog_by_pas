import NextNProgress from 'nextjs-progressbar';
import { FC } from 'react';
import { useTheme } from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeType } from '../../models/types';
import { ToastContainer } from 'react-toastify';

const SnackBarLayout: FC = ({ children }) => {
  const theme = useTheme() as ThemeType;
  return (
    <>

      <NextNProgress color={theme?.primary} />
      {children}
      <ToastContainer />

    </>
  );
};

export default SnackBarLayout;
