import React, { Component } from 'react'
import { minLength } from '../../../helper/validation';
import Alert from '../../../helper/Alert';

const minLength5 = minLength(5);

export default class PasswordEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            password2: '',
            error: null
        }
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handlePasswordChange = () => {
        this.setState({ error: null }, () => {
            if(!this.state.password){
                this.setState({error: "パスワードを入力してください"});
                return;
            }
            let result = minLength5(this.state.password);
            if ( result) {
                this.setState({ error: result });
                return;
            }
    
            if (this.state.password !== this.state.password2) {
                this.setState({ error: "パスワードが一致しません" });
                return;
            }
     
            Alert.success("パスワードを変更しました");
            this.props.onUpdate('password', this.state.password);
        });
    }

    onCancel = () => {
        this.setState({
            password: '',
            password2: '',
            error: null
        });
        this.props.onCancel();
    }

    render() {
        return (
            <div className="form">
                <h3>パスワード変更</h3>
                <input
                    className="form__input"
                    name="password"
                    type="password"
                    placeholder="新しいパスワードを入力してください"
                    value={this.state.password}
                    onChange={this.onChange}
                />
                <br />
                <h3>パスワード確認</h3>
                <input
                    className="form__input"
                    name="password2"
                    type="password"
                    placeholder="確認の為パスワードを再入力してください"
                    value={this.state.password2}
                    onChange={this.onChange}
                />
                {
                    this.state.error
                        ? (<div className="error">{this.state.error}</div>)
                        : ""
                }
                <button type="button" className="btn" onClick={this.handlePasswordChange}>OK</button>
                <button type="button" className="btn" onClick={this.onCancel}>キャンセル</button>
            </div>
        )
    }
}
