/*
 *
 * HomePage
 *
 */

import React, { useState } from 'react';
import { Box, BaseHeaderLayout, ContentLayout, Accordion } from '@strapi/design-system';
import Treasury from '../../components/Treasury';
import Notification from '../../components/Notification';

const KeysAccordion = {
  PROJECTS: 'PROJECTS',
  NOTIFICATIONS: 'NOTIFICATIONS'
} as const;

const HomePage = () => {
  const [expandedID, setExpandedID] = useState<string | null>(null);

  const handleToggle = (id: string) => () => {
    setExpandedID((s) => (s === id ? null : id));
  };

  return (
    <div>
      <Box background="neutral100">
        <BaseHeaderLayout as="h2" title="Trigger Data" subtitle="Fetch data from Projects" />
      </Box>

      <ContentLayout>
        <Accordion
          id={KeysAccordion.PROJECTS}
          expanded={expandedID === KeysAccordion.PROJECTS}
          onToggle={handleToggle(KeysAccordion.PROJECTS)}
        >
          <Treasury />
        </Accordion>
        <Accordion
          id={KeysAccordion.NOTIFICATIONS}
          expanded={expandedID === KeysAccordion.NOTIFICATIONS}
          onToggle={handleToggle(KeysAccordion.NOTIFICATIONS)}
        >
          <Notification />
        </Accordion>
      </ContentLayout>
    </div>
  );
};

export default HomePage;
