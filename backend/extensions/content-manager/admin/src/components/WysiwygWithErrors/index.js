import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Label, InputDescription, InputErrors } from 'strapi-helper-plugin';
import Editor from '../CKEditor';

/**
 * Override of the default Wysiwyg editor
 * the default editor is a markdown editor. we override this to use CKEditor, an HTML Wysiwyg
 */
const WysiwygWithErrors = ({
                             inputDescription,
                             errors,
                             label,
                             name,
                             noErrorsDescription,
                             onChange,
                             value,
                           }) => {
  let spacer = !isEmpty(inputDescription) ? (
    <div style={{ height: '.4rem' }} />
  ) : (
    <div />
  );

  if (!noErrorsDescription && !isEmpty(errors)) {
    spacer = <div />;
  }

  return (
    <div
      className="col-12"
      style={{
        marginBottom: '1.6rem',
        fontSize: '1.3rem',
        fontFamily: 'Lato',
      }}
    >
      <Label htmlFor={name} message={label} style={{ marginBottom: 10 }} />
      <Editor name={name} onChange={onChange} value={value} />
      <InputDescription
        message={inputDescription}
        style={!isEmpty(inputDescription) ? { marginTop: '1.4rem' } : {}}
      />
      <InputErrors
        errors={(!noErrorsDescription && errors) || []}
        name={name}
      />
      {spacer}
    </div>
  );
};

WysiwygWithErrors.defaultProps = {
  errors: [],
  label: '',
  noErrorsDescription: false,
};

WysiwygWithErrors.propTypes = {
  errors: PropTypes.array,
  inputDescription: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.shape({
      id: PropTypes.string,
      params: PropTypes.object,
    }),
  ]),
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.shape({
      id: PropTypes.string,
      params: PropTypes.object,
    }),
  ]),
  name: PropTypes.string.isRequired,
  noErrorsDescription: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default WysiwygWithErrors;
