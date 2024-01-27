import React, { useState } from 'react';
import {
  AccordionContent,
  AccordionToggle,
  Grid,
  TextInput,
  Button,
  GridItem,
  Stack,
  Alert,
  Textarea,
  Select,
  Option
} from '@strapi/design-system';
import { fetchInstance } from '../../services/fetch';

type ResponseServer = {
  error: string | null;
  data: string | null;
};

const defaultValues = {
  body: '',
  link: '',
  type: 'info',
  date: new Date().toISOString(),
  title: ''
};

export default function Notification() {
  const [loading, setLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<ResponseServer['error'] | null>(null);
  const [values, setValues] = useState<{ title: string; body: string; type: string; date: string; link?: string }>(
    defaultValues
  );

  const onChangeInput = (event: any) => {
    const { name, value } = event.target;
    setError(null);
    setIsSuccess(false);
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitForm = async (event: any) => {
    event.preventDefault();
    setIsSuccess(false);

    if (!values?.title) return setError('Please insert a title');
    if (!values?.body) return setError('Please insert a body');
    setLoading(true);
    try {
      await fetchInstance.post(`/api/notifyAll`, values);
      setIsSuccess(true);
    } catch (e: any) {
      if (e?.response?.status === 500) {
        setIsSuccess(true);
        return setValues(defaultValues);
      }
      setError(e?.response?.data?.error?.message || e?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AccordionToggle
        togglePosition="left"
        title="Notification projects"
        description="Refresh or initialize data from treasury project"
      />
      <AccordionContent>
        <form onSubmit={onSubmitForm} method="POST">
          <Grid
            gap={4}
            padding={4}
            style={{
              alignItems: 'flex-end'
            }}
          >
            {isSuccess && (
              <GridItem col={12}>
                <Alert title="Success" variant="success">
                  Notification has been sent
                </Alert>
              </GridItem>
            )}

            <GridItem col={6}>
              <TextInput
                value={values.title}
                onChange={onChangeInput}
                name="title"
                label="Title"
                placeholder="Announcement to Katana"
              />
            </GridItem>

            <GridItem col={6}>
              <Select
                value={values.type}
                name="type"
                label="Type"
                onChange={(selected: string) => setValues((prev) => ({ ...prev, type: selected }))}
              >
                <Option value="info">Info</Option>
                <Option value="news">New</Option>
              </Select>
            </GridItem>

            <GridItem col={12}>
              <Textarea name="body" label="Content" onChange={onChangeInput} placeholder="Content notification here!">
                {values.body}
              </Textarea>
            </GridItem>

            <GridItem col={12}>
              <TextInput
                value={values.link}
                name="link"
                label="Link(optional)"
                onChange={onChangeInput}
                placeholder="https://www.google.com"
              />
            </GridItem>

            {error && (
              <GridItem col={12}>
                <Alert title="Validations" variant="danger">
                  {error}
                </Alert>
              </GridItem>
            )}

            <GridItem col={12}>
              <Stack alignItems="flex-end">
                <Button disabled={!values.body && !values.title} type="submit" loading={loading}>
                  Create notification
                </Button>
              </Stack>
            </GridItem>
          </Grid>
        </form>
      </AccordionContent>
    </>
  );
}
