/**
 * Default form stylees
 */

import Fonts from 'styles/fonts';
import Colors from 'styles/colors';

const defaultLabel = {
    display: 'block',
    fontFamily: Fonts.mainSerifFont,
    fontWeight: 'bold',
    marginBottom: 5
};

const defaultInput = {
    padding: 15,
    marginBottom: 10,
    fontFamily: Fonts.mainSansFont,
    fontSize: 16,
    width: '100%',
    border: `1px solid ${Colors.defaultInputBorderColor}`,
    borderRadius: 5,
    boxSizing: 'border-box',
    backgroundColor: Colors.offWhite,
    color: Colors.defaultInputTextColor,
    outline: 0,

    '&::placeholder': {
        color: '#999',
        opacity: 0.5,
    },

    '&[disabled]': {
        color: '#aaa'
    },

    '&[type="checkbox"], &[type="radio"]': {
        display: 'inline-block',
        width: 12,
        marginRight: 5
    },
};

export default {
    defaultLabel,
    defaultInput,

    defaultSelect: {
        ...defaultInput,
        backgroundImage: 'url("/arrow-down-blue.svg")',
        backgroundPosition: '93% center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#fff',
        appearance: 'none'
    },

    defaultTextArea: {
        ...defaultInput,
        resize: 'none',
        height: 140
    },

    defaultFieldset: {
        border: 'none',
        padding: 0,
        margin: '0 0 1em',
        '& legend': { ...defaultLabel }
    }
}
