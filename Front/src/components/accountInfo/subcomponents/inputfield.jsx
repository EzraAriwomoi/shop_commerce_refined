// eslint-disable-next-line no-unused-vars
import React from 'react';

// eslint-disable-next-line react/prop-types
const InputField = ({ type, name, value, onChange, placeholder, label }) => {
    return (
        <div className="input-field">
            <input
                placeholder={placeholder}
                required
                className="fN"
                type={type}
                value={value}
                id={`fi-${name}`}
                name={name}
                onChange={onChange}
            />
            <label className="lbl" htmlFor={`fi-${name}`}>{label}</label>
        </div>
    );
};

export default InputField;
