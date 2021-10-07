import { FC, useRef } from 'react';
import ButtonBase from '../ButtonBase';

const Button: FC<any> = ({ onClick, children, ...props }) => {
  const rippleRef = useRef({} as HTMLSpanElement);

  return (
    <ButtonBase
      {...props}
      onClick={({ clientX, currentTarget, clientY }) => {
        const x = clientX - currentTarget.getBoundingClientRect().left;
        const y = clientY - currentTarget.getBoundingClientRect().top;

        rippleRef.current.style.display = 'flex';
        rippleRef.current.style.left = x + 'px';
        rippleRef.current.style.top = y + 'px';
        setTimeout(() => {
          if (!!rippleRef?.current?.style?.display) rippleRef.current.style.display = 'none';
        }, 800);

        onClick && onClick();
      }}
    >
      {children}
      <span className={'ripple'} ref={rippleRef} style={{ display: 'none' }}></span>
    </ButtonBase>
  );
};

export default Button;
