import { Badge } from 'antd';
import styled from 'styled-components';

export const BadgeStyle = styled(Badge)`
  sup.ant-scroll-number.ant-badge-count {
    color: inherit;
    font-weight: bold;
    font-size: 0.7rem;
  }
`;

export const MenuStyle = styled.div`
  width: 500px;
  max-width: 100%;

  .menu-custom {
    li.ant-dropdown-menu-item {
      padding: 12px 12px;
    }
  }
`;

export const MenuHeaderStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  margin-bottom: 15px;
`;

export const MenuItemStyle = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const MenuItemContentStyle = styled.div`
  width: calc(100% - 20px);
`;

export const MenuItemNewStyle = styled.div`
  width: 10px;
  height: 10px;
  margin-top: 10px;
  margin-right: 0;
  margin-left: auto;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.colors.info};
`;
