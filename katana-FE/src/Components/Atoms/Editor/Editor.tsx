import { useEffect, useState } from 'react';
// @ts-ignore
import { CKEditor } from '@ckeditor/ckeditor5-react';
// @ts-ignore
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { EditorWrapperStyle } from './style';

export default function Editor({
  value,
  onChange
}: {
  value?: string;
  onChange?(value: string): void;
}) {
  const [data, setData] = useState('');

  useEffect(() => {
    setData(value || '');
  }, [value]);

  return (
    <EditorWrapperStyle>
      <CKEditor
        data={data}
        editor={ClassicEditor}
        onChange={(event: any, editor: CKEditor) => {
          const data = editor.getData();
          onChange && onChange(data);
        }}
      />
    </EditorWrapperStyle>
  );
}
