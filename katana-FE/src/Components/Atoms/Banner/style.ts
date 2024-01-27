import styled from 'styled-components';
import { Avatar, Skeleton } from 'antd';

export const AvatarAStyle = styled(Avatar)`
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(77, 86, 107);
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, transparent 75%);
  }
`;

export const SkeletonAvatarStyle = styled(Skeleton.Avatar)`
  width: 100% !important;
  height: 100%;
`;

export const SkeletonStyle = styled(Skeleton.Input)`
  width: 100% !important;
  height: 100%;

  span {
    height: 100% !important;
    border-radius: inherit !important;
  }
`;
