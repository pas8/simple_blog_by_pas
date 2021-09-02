import styled from 'styled-components';
import { device } from '../../models/denotation';

export default styled.main`
  font-family: 'system-ui';
  color: ${({ theme: { text } }) => text};

  @media ${device.desktopL} {
    width: 56vw;
  }
  @media ${device.desktop} {
    width: 60vw;
  }
  @media ${device.desktop} {
    width: 60vw;
  }
  @media ${device.laptopL} {
    width: 70vw;
  }
  @media ${device.laptop} {
    width: 80vw;
  }
  @media ${device.tablet} {
    width: 90vw;
  }
  @media ${device.mobileM} {
    width: 96vw;
  }
`;
