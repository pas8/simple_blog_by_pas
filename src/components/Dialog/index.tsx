import { colord } from 'colord';
import { FC, KeyboardEventHandler, MouseEventHandler, ReactNode, useEffect } from 'react';
import styled from 'styled-components';
import Subtitle from '../Subtitle';

const DialogUtilsContainer = styled.div`
  display: flex;
  gap: 12px;
  float: right;
  margin-top: 12px;
`;

const DialogMainContainer = styled.div`
  display: flex;
  margin: 12px 0;
`;

const DialogContentContainer = styled.div`
  padding: 1rem;
  transition: 0.4s easy all;
  position: relative;
  border: 1px solid ${({ theme: { text } }) => colord(text).alpha(0.42).toHex()};
  border-radius: 8px;
  margin: 20px;
  background: ${({ theme: { background } }) => background};
`;

const DialogContainer = styled.div`
  position: fixed;
  display: grid;
  place-items: center;
  z-index: 100;
  inset: 0;
  background: ${({
    theme: { background },
    //@ts-ignore
    isIsolated
  }) =>
    colord(background)
      .alpha(isIsolated ? 1 : 0.8)
      .toHex()};
`;

const Dialog: FC<{
  isOpen: boolean;
  utilsChildren: ReactNode;
  contentChildren?: ReactNode;
  title: string;
  plusZIndex?: number;
  isIsolated?: boolean;
  handleCloseDialog?: () => void;
}> = ({ isOpen, title, plusZIndex = 0, utilsChildren, contentChildren, isIsolated = false, handleCloseDialog }) => {
  const handleCloseOnEsc: KeyboardEventHandler<Document> = ({ key }) => {
    if (key === 'Escape') handleCloseDialog && handleCloseDialog();
  };

  useEffect(() => {
    document && document.addEventListener('keydown', handleCloseOnEsc as any, false);

    return () => {
      document && document.removeEventListener('keydown', handleCloseOnEsc as any, false);
    };
  }, []);

  if (!isOpen) return <></>;

  return (
    //@ts-ignore
    <DialogContainer style={{ zIndex: 100 + plusZIndex }} isIsolated={isIsolated}>
      <DialogContentContainer>
        <Subtitle>{title}</Subtitle>
        <DialogMainContainer>{contentChildren}</DialogMainContainer>

        <DialogUtilsContainer>{utilsChildren}</DialogUtilsContainer>
      </DialogContentContainer>
    </DialogContainer>
  );
};

export default Dialog;
