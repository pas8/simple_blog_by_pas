import { colord } from 'colord';
import { FC, ReactNode } from 'react';
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
  padding: 1em;
  border: 1px solid ${({ theme: { text } }) => colord(text).alpha(0.42).toHex()};
  border-radius: 8px;
  margin: 20px;
  background: ${({ theme: { background } }) => background};
`;

const DialogContainer = styled.div`
  position: fixed;
  display: grid;
  place-items: center;
  z-index: 1000;
  inset: 0;
  background: ${({ theme: { background } }) => colord(background).alpha(0.8).toHex()};
`;

const Dialog: FC<{ isOpen: boolean; utilsChildren: ReactNode; contentChildren?: ReactNode; title: string }> = ({
  isOpen,
  title,
  utilsChildren,
  contentChildren
}) => {
  if (!isOpen) return <></>;
  return (
    <DialogContainer>
      <DialogContentContainer>
        <Subtitle>{title}</Subtitle>
        <DialogMainContainer>{contentChildren}</DialogMainContainer>

        <DialogUtilsContainer>{utilsChildren}</DialogUtilsContainer>
      </DialogContentContainer>
    </DialogContainer>
  );
};

export default Dialog;
