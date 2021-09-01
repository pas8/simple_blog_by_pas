import type { AppProps } from 'next/app';
import { ComposeLayouts } from '../src/layouts';
import FirebaseLayout from '../src/layouts/FirebaseLayout';
import SnackBarLayout from '../src/layouts/SnackBarLayout';
import StoreLayout from '../src/layouts/StoreLayout';
import ThemeLayout from '../src/layouts/ThemeLayout';

const _App = ({ Component, pageProps }: AppProps) => {
  return (
    <StoreLayout>
      <ComposeLayouts layouts={[SnackBarLayout, FirebaseLayout, ThemeLayout]}>
        <Component {...pageProps} />
      </ComposeLayouts>
    </StoreLayout>
  );
};
export default _App;
