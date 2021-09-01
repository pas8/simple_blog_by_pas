import { FC } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import configureStore from '../../store';

const StoreLayout: FC = ({ children }) => {
  return <ReduxProvider store={configureStore}>{children}</ReduxProvider>;
};

export default StoreLayout;
