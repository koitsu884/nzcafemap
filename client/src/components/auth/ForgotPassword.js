import React, { useState } from 'react';
import axios from 'axios';
import Alert from '../../helper/Alert';

const baseURL = process.env.REACT_APP_API_URL;

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [sent, setFlag] = useState(false);
    const [sending, setSending] = useState(false);

    const handleChange = e => {
        setEmail(e.target.value);
    }

    const handleSubmit = e => {
        e.preventDefault();
        setSending(true);

        axios.post('auth/forgotpassword', { email: email }, { baseURL: baseURL })
            .then(result => {
                setFlag(true);
            })
            .catch(error => {
                Alert.error(error);
                setSending(false);
            })
    }

    const renderForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <p className="u-margin-bottom-medium">登録しているメールアドレスを入力してください</p>
                <fieldset>
                    <input className="form__input" onChange={handleChange} type="email" value={email} placeholder="メールアドレスを入力してください" />
                </fieldset>
                <div class="field u-margin-top-small">
                    <div class="control">
                        <button class="btn" type="submit" disabled={!email || sending}>リセットリンクを送信する</button>
                    </div>
                </div>
            </form>
        );
    }

    return (
        <div className="signin">
            <div className="signIn__form form">
                <form>
                    <h1 className="heading">パスワードリセット</h1>
                    {
                        sent ? (
                            <div>
                                <p>パスワードリセットリンクを送信しました。</p>
                                <p className="u-margin-top-medium">メールボックスをご確認ください。</p>
                            </div>
                        )
                            : renderForm()
                    }
                </form>
            </div>
        </div>
    )
}
