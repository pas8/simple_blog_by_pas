import useWindowSize from '../../hooks/useWindowSize.hook';

const MainTitle = () => {
  const { width } = useWindowSize();
  return <> {width > 1224 ? 'Simple blog' : 'SB'}</>;
};

export default MainTitle;
