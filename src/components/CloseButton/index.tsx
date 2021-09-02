import { FC } from 'react';
import Button from '../Button';

const CloseButton: FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <>
      {
        //@ts-ignore
        <Button isDefault onClick={onClick}>
          <svg viewBox="0 0 24 24" width={24} style={{ marginLeft: -4 }}>
            <path
              fill={'currentcolor'}
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
            ></path>
          </svg>
          Close
        </Button>
      }
    </>
  );
};

export default CloseButton;
