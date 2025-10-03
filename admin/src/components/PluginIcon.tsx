import styled from 'styled-components';
import { Phone } from '@strapi/icons';
import { Flex } from '@strapi/design-system';

const IconBox = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.primary100};
  border: 1px solid ${({ theme }) => theme.colors.primary100};
  padding: 4px;
  margin-top: 4px;

  svg > path {
    fill: ${({ theme }) => theme.colors.primary600};
  }
`;

export const PluginIcon = () => {
  return (
    <IconBox justifyContent="center" alignItems="center" width={7} height={6} hasRadius aria-hidden>
      <Phone />
    </IconBox>
  );
};
