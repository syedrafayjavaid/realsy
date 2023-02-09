import React from 'react';
import {bool, string, any, func} from "prop-types";
import Select from 'components/form-fields/select';
import states from './states';

/**
 * A dropdown menu to select US states
 * @param props
 * @returns {*}
 * @constructor
 */
const UsStatesInput = props => {
    return <Select
        label={props.label}
        backgroundColor={props.backgroundColor}
        options={
            states.map(state => {return {value: state.abbreviation, label: props.fullLabels ? state.name : state.abbreviation}})
        }
        value={props.value}
        onChange={props.onChange}
        required={props.required}
        searchable={true}
        padding={'2px 0 1px'}
    />
};

/**
 * Props
 */
UsStatesInput.propTypes = {
    label: string,
    fullLabels: bool,
    required: bool,
    value: any,
    onChange: func,
    backgroundColor: string,
};

UsStatesInput.defaultProps = {
    label: 'State',
    fullLabels: false,
    required: false,
    onChange: () => {},
    backgroundColor: '#fff',
};

export default UsStatesInput;
