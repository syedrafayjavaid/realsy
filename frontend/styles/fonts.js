import Colors from 'styles/colors';

const families = {
    mainSerifFont: '"Noticia Text", Georgia, "Times New Roman", serif',
    mainSansFont: 'Roboto, "Open Sans", sans-serif',
};

const defaultHeading = {
    fontFamily: families.mainSerifFont
};

const bodyDefaults = {
    lineHeight: '1.7em',
    color: '#666',
    fontFamily: families.mainSansFont,
    fontSize: '16px',

    '& p': {
        marginBottom: 30,
    },

    '& h1, & h2, & h3, & h4, & h5, & h6': {
        ...defaultHeading,
        color: Colors.mediumBlue,
        lineHeight: '1.2em'
    },
};

const Fonts = {
    ...families,
    defaultHeading,
    bodyDefaults
};

export default Fonts;
