import React, { Component } from 'react';
import withOutsideClickHandler from '../../hoc/withOutsideClickHandler';

class InputWithOutsideClickHandler extends Component {
    render() {
        const {
            className,
            name,
            placeholder,
            value,
            onChange,
            label,
            error,
            info,
            type,
            disabled
        } = this.props;

        return (
            <input
                className={className}
                name={name}
                type={type}
                label={label}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled ? "disabled" : ""}
            />
        )
    }
}

export default withOutsideClickHandler(InputWithOutsideClickHandler);
