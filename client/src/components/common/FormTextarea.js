import React from 'react';

const FormInput = ({
    input,
    label,
    disabled,
    meta: { touched, error, warning }
}) => {
    return (
        <div>
            <label className="form__label">{label}</label>
            <div>
                <textarea {...input} className="form__input" disabled={disabled} ></textarea>
                {touched &&
                    ((error && <span className="form__error">{error}</span>) ||
                        (warning && <span className="form__warning">{warning}</span>))}
            </div>
        </div>
    );
};

export default FormInput;