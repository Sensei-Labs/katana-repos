import styled from 'styled-components';

export const BackgroundStyle = styled.div`
  background-image: url('/katana_bg.png');
  background-size: cover;
  background-repeat: no-repeat no-repeat;

  &:after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 1;
    background: rgba(0, 0, 0, 0.6);
  }
`;
