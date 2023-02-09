import React from 'react';
import PropTypes from 'prop-types';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import styled from 'styled-components';

/**
 * CKEditor
 * Used as an override Wysiwyg editor for the admin
 */
const Wrapper = styled.div`
  .ck-editor__main {
    min-height: 200px;
    > div {
      min-height: 200px;
    }
  }
`;

const Editor = ({ onChange, name, value }) => {
  return (
    <Wrapper>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
            removePlugins: ['Image', 'ImageUpload', 'ImageCaption', 'ImageToolbar', 'ImageStyle', 'MediaEmbed']
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange({ target: { name, value: data } });
        }}
      />
    </Wrapper>
  );
};

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default Editor;
