import { FC } from 'react';
import styled from 'styled-components';

const Button = styled.svg`
  cursor: pointer;
  width: 2rem;
  padding: 0.4rem;
  border-radius: 50%;
  border: 1px solid ${({ theme: { text } }) => text};
  background: ${({ theme: { background } }) => background};
  z-index:100000;
  &:hover {
    border-color: ${({ theme: { primary } }) => primary};
    & path {
      fill: ${({ theme: { primary } }) => primary};
    }
  }
  & path {
    fill: ${({ theme: { text } }) => text};
  }
`;

const IconButton: FC<{
  d: string;
  position?: string;
  onClick?: (e?: any) => void;
  dimensions?: { [Property in 'top' | 'left' | 'right' | 'bottom']?: string | number };
}> = ({ d, onClick, dimensions = {}, children, position = 'absolute', ...props }) => {
  return (
    //@ts-ignore
    <Button viewBox={'0 0 24 24'} onClick={onClick} style={{ position, ...dimensions }}>
      <path d={d}></path>
      {children}
    </Button>
  );
};

export default IconButton;
