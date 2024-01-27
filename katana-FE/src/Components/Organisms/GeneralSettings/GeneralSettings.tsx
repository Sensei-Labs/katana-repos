import { useSWRConfig } from 'swr';
import { useEffect, useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  AutoComplete,
  Col,
  Form,
  Input,
  List,
  message,
  notification,
  Row
} from 'antd';

import Text from '@/Components/Atoms/Text';
import Title from '@/Components/Atoms/Title';
import Button from '@/Components/Atoms/Button';
import useTraceSync from '@/hooks/useTraceSync';
import { editTreasury } from '@/fetches/treasury';
import { useProjectOne } from '@/Contexts/ProjectOne';
import UploadForm from '@/Components/Atoms/UploadForm';
import { formatErrorMessage } from '@/utils/formatError';
import GridTwoColumn from '@/Components/Atoms/GridColumn';
import SelectTagProject from '@/Components/Atoms/SelectTagProject';
import SelectIcons from '@/Components/Atoms/SelectIcons';

type SettingsProps = {};

const requiredRule = {
  required: true
};

const GeneralSettings = (props: SettingsProps) => {
  const [form] = Form.useForm();
  const [isLoading, traceSync] = useTraceSync();
  const { mutate } = useSWRConfig();
  const { loading, treasury, internalPath } = useProjectOne();
  const [autoCompleteResult, setAutoCompleteResult] = useState<string[]>([]);

  const onWebsiteChange = (value: string) => {
    if (!value) {
      setAutoCompleteResult([]);
    } else {
      const length = value.length;
      const formatValue =
        value.at(length - 1) === '.' ? value.slice(0, length - 1) : value;

      setAutoCompleteResult(
        ['.com', '.app', '.org', '.net'].map(
          (domain) => `${formatValue}${domain}`
        )
      );
    }
  };

  const websiteOptions = autoCompleteResult.map((website) => ({
    label: website,
    value: website
  }));

  const onUpdateProject = async (values: any) => {
    if (!treasury?.id) return null;
    try {
      await traceSync(async () => {
        await editTreasury(treasury.id, values);
        await mutate(internalPath);
      });
      message.success('Successfully');
    } catch (e) {
      notification.error({
        message: 'Error to save data',
        description: formatErrorMessage(e)
      });
    }
  };

  useEffect(() => {
    if (treasury) {
      const fields = Object.entries(treasury).map(([key, value]) => {
        if (key === 'tags') {
          return {
            name: key,
            value: treasury?.tags?.map((tag) => tag?.id)
          };
        }
        if (key === 'thumbnail' || key === 'frontPage') {
          return {
            name: key,
            value: treasury?.[key]?.id
          };
        }
        return {
          name: key,
          value
        };
      });
      form.setFields(fields);
    }
  }, [form, treasury]);

  return (
    <div>
      <GridTwoColumn
        first={
          <div>
            <Title fontFamily="font-sans">General</Title>
            <Text>General Information.</Text>
          </div>
        }
        second={<></>}
      />

      <Form form={form} layout="vertical" onFinish={onUpdateProject}>
        <Row gutter={[20, 20]} align="middle">
          <Col span={10} />
          <Col span={4}>
            <Form.Item
              rules={[requiredRule]}
              name="thumbnail"
              className="text-center"
            >
              <UploadForm height={175} width={175} raw={treasury?.thumbnail} />
            </Form.Item>
          </Col>
          <Col span={10} />
          <Col xs={24} md={12}>
            <Form.Item required rules={[requiredRule]} label="Name" name="name">
              <Input disabled placeholder="Treasury name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              required
              rules={[requiredRule]}
              label="Status"
              name="status"
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              required
              name="description"
              label="Description"
              rules={[requiredRule]}
            >
              <Input.TextArea rows={8} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              required
              name="frontPage"
              label="Front Page"
              rules={[requiredRule]}
            >
              <UploadForm height={200} raw={treasury?.frontPage} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item required rules={[requiredRule]} label="Tags" name="tags">
              <SelectTagProject />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Discord Link" name="discordLink">
              <AutoComplete
                options={websiteOptions}
                onChange={onWebsiteChange}
                placeholder="discord.com/seneseilabs"
              >
                <Input />
              </AutoComplete>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Twitter User" name="twitterUser">
              <Input placeholder="@senseilabs" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Website" name="websiteLink">
              <AutoComplete
                options={websiteOptions}
                onChange={onWebsiteChange}
                placeholder="https://katana.com"
              >
                <Input />
              </AutoComplete>
            </Form.Item>
          </Col>
          {/*<Col xs={24}>*/}
          {/*  <List*/}
          {/*    dataSource={treasury?.moreLinks}*/}
          {/*    renderItem={(item) => <Text>{item.label}: {item.link}</Text>}*/}
          {/*  />*/}
          {/*</Col>*/}
          <Col xs={24}>
            <Form.List
              name="moreLinks"
              initialValue={treasury?.moreLinks}
              key={`${treasury?.id}-${treasury?.moreLinks?.length}`}
            >
              {(fields, { add, remove }, { errors }) => (
                <div className="w-full">
                  {fields.map((field, index) => (
                    <Form.Item key={field.key} label="Add link">
                      <Row className="mb-5" gutter={[20, 10]}>
                        <Col xs={20} md={6}>
                          <Form.Item
                            {...field}
                            className="flex-1"
                            name={[field.name, 'label']}
                            label={index === 0 ? `Label` : ''}
                            validateTrigger={['onChange', 'onBlur', '']}
                            rules={[
                              {
                                required: true,
                                whitespace: true
                              }
                            ]}
                            noStyle
                          >
                            <Input placeholder="Label" />
                          </Form.Item>
                        </Col>

                        <Col xs={20} md={8}>
                          <Form.Item
                            {...field}
                            className="flex-1"
                            name={[field.name, 'link']}
                            label={index === 0 ? `Link` : ''}
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[
                              {
                                required: true,
                                whitespace: true
                              }
                            ]}
                            noStyle
                          >
                            <Input placeholder="https://katana.org" />
                          </Form.Item>
                        </Col>

                        <Col xs={20} md={6}>
                          <Form.Item
                            {...field}
                            className="flex-1"
                            name={[field.name, 'icon']}
                            label={index === 0 ? `Icon` : ''}
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[
                              {
                                required: true,
                                whitespace: true
                              }
                            ]}
                            noStyle
                          >
                            <SelectIcons />
                          </Form.Item>
                        </Col>

                        <Col xs={4} md={2}>
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)}
                          />
                        </Col>
                      </Row>
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      block
                      color="text-primary"
                      bgColor="bg-transparent"
                      className="justify-center"
                      borderColor="border-primary"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      Add Link
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </div>
              )}
            </Form.List>
          </Col>
          <Col xs={24}>
            <Form.Item className="text-right">
              <Button htmlType="submit" disabled={loading} loading={isLoading}>
                Update
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default GeneralSettings;
