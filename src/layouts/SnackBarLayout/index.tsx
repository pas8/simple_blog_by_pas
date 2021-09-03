import NextNProgress from 'nextjs-progressbar';
import { FC } from 'react';
import { useTheme } from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeType } from '../../models/types';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getThemePropertyies } from '../../store/modules/App/selectors';

const SnackBarLayout: FC = ({ children }) => {
  const themePropertyies = useSelector(getThemePropertyies);
  return (
    <>
      <NextNProgress color={themePropertyies?.primary} />
      {children}
      <ToastContainer />
    </>
  );
};

export default SnackBarLayout;
