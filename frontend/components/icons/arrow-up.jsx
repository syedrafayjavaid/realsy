import React from 'react';
import PropTypes from "prop-types";

export default function ArrowUpIcon(props) {
    return <svg className={props.className} xmlns="http://www.w3.org/2000/svg" width="13" height="7" viewBox="0 0 13 7">
        <path id="Polygon_30" data-name="Polygon 30" d="M6.5,0,13,7H0Z" />
    </svg>
};

ArrowUpIcon.propTypes = {
    className: PropTypes.string.isRequired
};

ArrowUpIcon.defaultProps = {
    className: ''
};
