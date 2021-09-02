import styled from 'styled-components';

export default styled.button`
outline: none;
border: none;
text-transform: uppercase;
padding: 0.8rem 1.8rem;
border-radius: 8px;
cursor: pointer;
font-size: 1.16rem;
border: 1px solid;
float: right;
color: ${({ theme: { primary } }) => primary};
background:  ${({ theme: { background } }) => background};
border-color: ${({ theme: { primary } }) => primary};
transition: 0.4s ease all;
&:hover {
  color: ${({ theme: { background } }) => background};
  border-color: transparent;
  background: ${({ theme: { primary } }) => primary};
}
`;