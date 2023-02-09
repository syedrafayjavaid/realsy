import {createUseStyles} from "react-jss";
import {RadioButtonGroupProps} from "components/form-fields/radio-button-group/radio-button-group";

/**
 * Styles for radio button groups
 */
export const radioButtonGroupStyles = {
    radioButtonGroup: {

    },

    buttonContainer: {
        display: (props: RadioButtonGroupProps) => props.inlineOptions ? 'inline' : 'block',
        marginRight: (props: RadioButtonGroupProps) => props.inlineOptions ? 20 : 0,
    }
};

export const useRadioButtonGroupStyles = createUseStyles(radioButtonGroupStyles);
