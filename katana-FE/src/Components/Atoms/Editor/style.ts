import styled from 'styled-components';

export const EditorWrapperStyle = styled.div`
  .ck {
    --ck-color-toolbar-background: var(--colors-black);
    --ck-color-text: rgb(165, 165, 186);
    --ck-color-editor-base-text: rgb(255, 255, 255);
    --ck-color-toolbar-border: rgb(74, 74, 106);
    --ck-color-base-border: rgb(74, 74, 106);
    --ck-color-base-background: var(--colors-ckEditor);
    --ck-color-button-default-background: var(--colors-black);
    --ck-color-list-button-hover-background: var(--colors-darker);
    --ck-color-button-default-hover-background: rgb(33, 33, 52);
    --ck-color-button-on-background: rgb(33, 33, 52);
    --ck-color-button-on-hover-background: rgb(33, 33, 52);
    --ck-color-button-default-active-background: rgb(33, 33, 52);
  }

  .ck-word-count {
    color: rgb(165, 165, 186);
  }

  .ck-editor__editable {
    min-height: 400px;
  }
`;
