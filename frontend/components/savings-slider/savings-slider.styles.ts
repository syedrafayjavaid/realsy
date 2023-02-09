import Fonts from 'styles/fonts';
import Colors from 'styles/colors';
import Dimensions from "styles/dimensions";
import {createUseStyles} from "react-jss";

export const savingsSliderStyles = {
    savingsSlider: {
        backgroundColor: '#fff',
        margin: `-46px ${Dimensions.defaultPageMargin} 12px`,
        borderRadius: 5,
        overflow: 'hidden',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
        fontFamily: Fonts.mainSerifFont,
        fontSize: '22px',
        textAlign: 'center',

        '& label': {
            fontFamily: Fonts.mainSerifFont,
            fontSize: '22px',
            fontWeight: 300,
            margin: 0,
            padding: '30px 20px 8px',

            '& span': {
                display: 'block',
                marginBottom: 30,
                marginTop: 22,
            },

            '&:first-of-type': {
                backgroundColor: Colors.offWhite,
                paddingTop: 38,
            },

            '&:last-of-type': {
                backgroundColor: Colors.mediumBlue,
                color: '#fff',

                '& span:first-of-type': {
                    borderBottom: '1px solid #fff',
                    paddingBottom: 10,
                    width: 200,
                    margin: '0 auto 10px',
                },

                '& span:last-of-type': {
                    fontFamily: Fonts.mainSerifFont,
                    fontSize: '14px',
                }
            }
        },

        '& .savings-amount': {
            fontSize: '62px',
            margin: '10px 0 8px',
            display: 'block',
            paddingTop: 10,
        },

        '& input': {
            width: '100%',
        },
    },

    homeValue: {
        display: 'block',
        marginBottom: 28,
    },

    rangeInput: {
        '-webkit-appearance': 'none',
        appearance: 'none',
        width: '100%',
        height: 3,
        border: 'none',
        borderRadius: 3,
        background: Colors.mediumBlue,
        outline: 'none',
        padding: 0,
        margin: '49px 0 40px',

        '&::-webkit-slider-thumb': {
            '-webkit-appearance': 'none',
            appearance: 'none',
            width: 36,
            height: 41,
            border: 0,
            background: "url('/house-slider.svg')",
            cursor: 'pointer',
            '&:after': {
                content: 'TEST',
                display: 'block',
                backgroundColor: '#c00',
                color: '#f00',
                position: 'absolute',
                width: 100,
                height: 100
            }
        },
        '&::-moz-range-thumb': {
            '-webkit-appearance': 'none',
            appearance: 'none',
            width: 36,
            height: 41,
            border: 0,
            background: "url('/house-slider.svg')",
            cursor: 'pointer',
            '&:after': {
                content: 'TEST',
                display: 'block',
                backgroundColor: '#c00',
                color: '#f00',
                position: 'absolute',
                width: 100,
                height: 100
            }
        },
    },

    [`@media (min-width: ${Dimensions.breakpointSmall})`]: {
        savingsSlider: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            width: 750,
            maxWidth: '90%',
            marginTop: '-80px',
            marginLeft: 'auto',
            marginRight: 'auto'
        }
    }
}

export const useSavingsSliderStyles = createUseStyles(savingsSliderStyles);
