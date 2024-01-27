import { useMemo, useState } from 'react';
import { message, UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import { API_UPLOAD_FILE, AUTH_RESPONSE_SCOPE } from '@/config';
import Image from '@/Components/Atoms/Image';
import { uploadFile } from '@/fetches/upload';
import useTraceSync from '@/hooks/useTraceSync';

import { UploadStyle } from './style';

type RawType = {
  url: string;
};

type UploadFormProps = {
  raw?: RawType;
  value?: string;
  returnKey?: keyof FileServerType;
  width?: number | string;
  height?: number | string;
  onChange?: (value: string, raw: RawType) => void;
};

const UploadForm = ({
  raw,
  onChange,
  height,
  width,
  returnKey = 'id'
}: UploadFormProps) => {
  const previewImage = raw?.url || '';
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, traceSync] = useTraceSync();

  const beforeUpload = async (file: File) => {
    try {
      const { data } = await traceSync(() => uploadFile(file));
      if (data?.length) {
        setImageUrl(data?.[0]?.url || '');
        onChange && onChange(data?.[0]?.[returnKey] || '', data?.[0]);
      }
    } catch (e) {
      await message.error(`File upload failed.`);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{loading ? 'Loading' : 'Upload'}</div>
    </div>
  );

  const propsUpload = (): UploadProps => {
    const session = localStorage.getItem(AUTH_RESPONSE_SCOPE);
    const token = JSON.parse(session || '{}')?.jwt || '';

    return {
      beforeUpload,
      showUploadList: false,
      listType: 'picture-card',
      headers: {
        authorization: `Authorization ${token}`
      },
      action: API_UPLOAD_FILE
    };
  };

  const resolveWidth = useMemo(() => {
    if (typeof width === 'number') return `${width}px`;
    if (typeof width === 'string') return width;
    return '100%';
  }, [width]);

  const resolveHeight = useMemo(() => {
    if (typeof height === 'number') return `${height}px`;
    if (typeof height === 'string') return height;
  }, [height]);

  return (
    <UploadStyle
      $width={resolveWidth}
      $height={resolveHeight}
      {...propsUpload()}
    >
      {!loading && (imageUrl || previewImage) ? (
        <Image
          alt="avatar"
          width="100%"
          height="100%"
          className="rounded-lg"
          src={imageUrl || previewImage}
          objectFit="contain"
        />
      ) : (
        uploadButton
      )}
    </UploadStyle>
  );
};

export default UploadForm;
