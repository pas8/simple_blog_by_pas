import { useRef } from 'react';
import useEffectOnce from './useEffectOnce.hook';

const useUnmount = (fn: () => any): void => {
  const fnRef = useRef(fn);

  fnRef.current = fn;

  useEffectOnce(() => () => fnRef.current());
};

export default useUnmount;
