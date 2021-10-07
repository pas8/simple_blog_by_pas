import { colord } from 'colord';
import { FC, useRef } from 'react';
import styled from 'styled-components';

const Button = styled.button`
  cursor: pointer;
  width: 3.08rem;
  padding: 0.4rem;
  border-radius: 50%;
  display: grid;
  height: 3.08rem;
  place-items: center;
  border: 1px solid ${({ theme: { text } }) => text};
  background: ${({ theme: { background } }) => background};
  z-index: 10;
  &:hover {
    border-color: ${({ theme: { primary } }) => primary};
    & path {
      fill: ${({ theme: { primary } }) => primary};
    }
  }
  & path {
    fill: ${({ theme: { text } }) => text};
  }
  overflow: hidden;
  & .ripple {
    background: ${({ theme: { primary } }) => colord(primary).alpha(0.42).toHex()};
    position: absolute;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: animate 1s linear infinite;
  }
  @keyframes animate {
    0% {
      width: 0px;
      height: 0px;
    }
    100% {
      width: 420px;
      height: 420px;
      opacity: 0;
    }
  }
`;

const IconButton: FC<{
  d: string;
  caption?: string;
  position?: string;
  onClick?: (e?: any) => void;
  dimensions?: { [Property in 'top' | 'left' | 'right' | 'bottom']?: string | number };
}> = ({ d, onClick, dimensions = {}, children, position = 'absolute', caption, ...props }) => {
  const rippleRef = useRef({} as HTMLSpanElement);

  return (
    <Button
      //@ts-ignore
      style={{ position, ...dimensions }}
      onClick={({ clientX, currentTarget, clientY }) => {
        const x = clientX - currentTarget.getBoundingClientRect().left;
        const y = clientY - currentTarget.getBoundingClientRect().top;

        rippleRef.current.style.display = 'flex';
        rippleRef.current.style.left = x + 'px';
        rippleRef.current.style.top = y + 'px';
        setTimeout(() => {
          if (!!rippleRef?.current?.style?.display) rippleRef.current.style.display = 'none';
        }, 1000);

        onClick && onClick();
      }}
    >
      <svg viewBox={'0 0 24 24'} aria-label={caption}>
        <path d={d}></path>
        {children}
      </svg>
      <span className={'ripple'} ref={rippleRef} style={{ display: 'none' }}></span>
    </Button>
  );
};

export default IconButton;
