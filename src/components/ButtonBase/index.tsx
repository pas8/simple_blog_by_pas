import { colord } from 'colord';
import styled from 'styled-components';

export default styled.button`
  outline: none;
  border: none;
  text-transform: uppercase;
  padding: 0.8rem 1.8rem;
  border-radius: 8px;
  display:flex;
  align-items:center;
  cursor: pointer;
  font-size: 1.16rem;
  border: 1px solid;
  justify-content:center;
  float: right;
  color: ${({
    theme: { primary, text },
    //@ts-ignore
    isDangerous = false,
    //@ts-ignore
    isDefault = false
  }) => (isDefault ? text : isDangerous ? 'red' : primary)};
  background: ${({ theme: { background } }) => background};
  border-color: ${({
    theme: { primary, text },
    //@ts-ignore
    isDangerous = false,
    //@ts-ignore
    isDefault = false
  }) => (isDefault ? text : isDangerous ? 'red' : primary)};

  transition: 0.4s ease all;
  &:hover {
    color: ${({ theme: { background } }) => background};
    border-color: transparent;
    background: ${({
      theme: { primary, text },
      //@ts-ignore
      isDangerous = false,
      //@ts-ignore
      isDefault = false
    }) => (isDefault ? text : isDangerous ? 'red' : primary)};
  }
  &:focus {
    border-color:transparent;
    outline:solid 2px  currentColor;
  }

  & .ripple {
    background: ${({ theme: { background } }) => colord(background).alpha(0.42).toHex()};
    position: absolute;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: animate 0.80s linear infinite;
  }
  overflow:hidden;
  position:relative;
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
