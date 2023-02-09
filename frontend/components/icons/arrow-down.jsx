import React from 'react';
import PropTypes from 'prop-types';

export default function ArrowDownIcon(props) {
    return <svg className={props.className} style={props.style} xmlns="http://www.w3.org/2000/svg" width="13" height="7" viewBox="0 0 13 7">
        <path id="Polygon_29" data-name="Polygon 29" d="M6.5,0,13,7H0Z" transform="translate(13 7) rotate(-180)" />
    </svg>
};

ArrowDownIcon.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

ArrowDownIcon.defaultProps = {
    className: '',
    style: {}
};
