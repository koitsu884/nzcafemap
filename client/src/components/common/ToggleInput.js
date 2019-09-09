import React, { Component } from 'react';

import SvgEdit from '../common/SvgIcons/SvgEdit';
import DivWithOutsideClickHandler from './DivWithOutsideClickHandler';

export default class ToggleInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            confirm: '',
            disabled: true,
            error: null
        }
    }

    componentWillReceiveProps(nextProp) {
        this.setState({ value: nextProp.value })
    }

    handleClickOutside = () => {
        if (this.state.disabled) return;
        this.onChancel();
    }

    onUpdate = () => {
        let isValid = true;
        this.setState({ error: null });
        this.props.validate.forEach((validation) => {
            let result = validation(this.state.value);
            if (result) {
                this.setState({ error: result });
                isValid = false;
                return;
            }
        })

        if (this.props.type === "password") {
            if (this.state.value !== this.state.confirm) {
                this.setState({ error: "パスワードが一致しません" });
                isValid = false;
            }
        }

        if (isValid) {
            this.props.onUpdate(this.props.name, this.state.value);
            this.setState({ disabled: true });
        }
    }

    onChancel = () => {
        this.setState({
            value: this.props.value,
            confirm: '',
            disabled: true,
            error: ''
        });
    }

    onChange = e => {
        this.setState({ value: e.target.value });
    }

    onChangeConfirm = e => {
        this.setState({ confirm: e.target.value })
    }

    onStartEdit = () => {
        this.setState({ disabled: false });
        if (this.props.type === "password") {
            this.setState({ confirm: '', value: '' });
        }
    }

    reunderButtons = () => {
        if (this.state.disabled) {
            return (
                <span onClick={this.onStartEdit}>
                    <SvgEdit className="ibtn" />
                </span>
            )
        }
        return (
            <button className="btn" type="button" onClick={this.onUpdate}>更新</button>
        );
    }

    renderInputFields = () => {
        const {
            name,
            placeholder,
            label,
            error,
            info,
            type,
        } = this.props;

        return (
            <input
                className="form__input"
                name={name}
                type={type}
                label={label}
                placeholder={placeholder}
                value={this.state.value}
                onChange={this.onChange}
                disabled={this.state.disabled ? "disabled" : ""}
            />
        )
    }

    renderPasswordFields = () => {
        const {
            name,
            placeholder,
            label,
            error,
            info,
            type,
        } = this.props;

        return (
            <div>
                <input
                    className="form__input"
                    name={name}
                    type={type}
                    label={label}
                    placeholder={placeholder}
                    value={this.state.value}
                    onChange={this.onChange}
                    disabled={this.state.disabled ? "disabled" : ""}
                />
                <input
                    className="form__input"
                    name={name + "_confirm"}
                    type={type}
                    value={this.state.confirm}
                    onChange={this.onChangeConfirm}
                    disabled={this.state.disabled ? "disabled" : ""}
                />
            </div>
        )
    }

    render() {
        // const {
        //     name,
        //     placeholder,
        //     label,
        //     error,
        //     info,
        //     type,
        // } = this.props;
        return (
            <DivWithOutsideClickHandler className="toggleInput" handleClickOutside={this.handleClickOutside}>
                {
                    this.props.type === "password"
                        ? this.renderPasswordFields()
                        : this.renderInputFields()
                }
                {this.state.error ? (<div className="error">{this.state.error}</div>) : ""}
                {this.reunderButtons()}
            </DivWithOutsideClickHandler>
        )
    }
}
