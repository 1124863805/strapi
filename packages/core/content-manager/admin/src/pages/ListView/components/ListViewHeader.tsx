import { Layouts } from '@leao1/admin/leao-admin';
import { styled } from 'styled-components';

const LayoutsHeaderCustom = styled(Layouts.Header)`
  overflow-wrap: anywhere;
`;

interface ListViewHeaderProps {
  title: string;
  subtitle: string;
  primaryAction: React.ReactNode | null;
  navigationAction: React.ReactNode;
}

const ListViewHeader = ({
  title,
  subtitle,
  primaryAction,
  navigationAction,
}: ListViewHeaderProps) => (
  <LayoutsHeaderCustom
    primaryAction={primaryAction}
    subtitle={subtitle}
    title={title}
    navigationAction={navigationAction}
  />
);

export { ListViewHeader };
