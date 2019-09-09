import React, { Component } from 'react'

export default class PasswordEditor extends Component {
    constructor(props){
        super(props)
        this.state = {
            value: '',
            confirm: '',
            disabled: true,
            error: null
        }
    }

    render() {
        const {
            name,
            placeholder,
            label,
        } = this.props;
        return (
            <div className="toggleInput">
                <DivWithOutsideClickHandler className="form" handleClickOutside = {this.handleClickOutside}>
                    <input
                        className="form__input"
                        name="password"
                        type="password"
                        label={label}
                        placeholder={placeholder}
                        value={this.state.value}
                        onChange={this.onChange}
                        disabled={this.state.disabled ? "disabled" : ""}
                    />
                    {this.state.error ? (<div className="error">{this.state.error}</div>) : ""}
                </DivWithOutsideClickHandler>
                {this.reunderButtons()}
            </div>
        )
    }
}
