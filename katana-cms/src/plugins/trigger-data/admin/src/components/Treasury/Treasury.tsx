import React, { useState } from 'react';
import { AccordionContent, AccordionToggle, Grid, TextInput, Button, GridItem, Stack } from '@strapi/design-system';
import { fetchInstance } from '../../services/fetch';

type ResponseServer = {
  error: string | null;
  data: string | null;
};

export default function Notification() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ResponseServer['error'] | null>(null);
  const [projectId, setProjectId] = useState<string>('');

  const fetchDataProject = async () => {
    if (!projectId) return setError('Please insert a value');
    setLoading(true);
    try {
      await fetchInstance.get(`/api/treasuries/${projectId}/update-transactions`);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AccordionToggle
        togglePosition="left"
        title="Update transactions for projects"
        description="Refresh or initialize data from treasury project"
      />
      <AccordionContent>
        <Grid
          gap={4}
          padding={4}
          style={{
            alignItems: 'flex-end'
          }}
        >
          <GridItem col={12}>
            <TextInput
              name="projectId"
              value={projectId}
              label="Project ID"
              placeholder="E.g. 1"
              error={error || undefined}
              onChange={(e: any) => {
                setError(null);
                setProjectId(e.target.value);
              }}
            />
          </GridItem>

          <GridItem col={12}>
            <Stack alignItems="flex-end">
              <Button loading={loading} onClick={fetchDataProject}>
                Start update data
              </Button>
            </Stack>
          </GridItem>
        </Grid>
      </AccordionContent>
    </>
  );
}
