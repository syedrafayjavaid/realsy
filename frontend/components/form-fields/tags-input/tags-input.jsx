import ReactTagsInput from "react-tagsinput";
import React from "react";
import {bool, func, string} from "prop-types";
import {ToolTip} from "components/tool-tip/tool-tip";
import {useTagsInputsStyles} from "components/form-fields/tags-input/tags-input.styles";

/**
 * A "tags" input, with multiple boxed inputs
 */
const TagsInput = (props) => {
    const styleClasses = useTagsInputsStyles();

    return (
        <div className={styleClasses.tagsInput}>
            <label
                children={props.label}
                style={{display: 'inline'}}
                // click needs to be disabled, as otherwise focusing the input hides tooltips immediately after opening
                onClick={e => e.preventDefault()}
            />
            {props.tooltip && <>{' '}<ToolTip htmlContent={props.tooltip}/></>}
            <ReactTagsInput
                value={props.value}
                onChange={props.onChange}
                required={props.required}
                inputProps={{
                    placeholder: props.placeholder,
                    style: {width: 200}
                }}
                addKeys={[',', 9, 13]} // 9 and 13 are enter and tab
                addOnBlur={true}
            />
        </div>
    );
};

/**
 * Props
 */
TagsInput.propTypes = {
    label: string,
    placeholder: string,
    value: string,
    required: bool,
    onChange: func,
    tooltip: string,
};

TagsInput.defaultProps = {
    required: false,
    tooltip: null,
    onChange: () => {}
};

export default TagsInput;
