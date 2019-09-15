import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import axios from 'axios';

import history from '../../history';
import Alert from '../../helper/Alert';
import { required, minLength2, minLength, maxLength, email } from '../../helper/validation';
import FormInput from '../common/FormInput';
import FormTextArea from '../common/FormTextarea';

const baseURL = process.env.REACT_APP_API_URL;
const minLength5 = minLength(5);
const minLength10 = minLength(10);
const maxLength100 = maxLength(100);

class Contact extends Component {
    onSubmit = async formProps => {
        await axios.post('/feedbacks', formProps, {
            baseURL: baseURL
        })
        .then( response => {
            Alert.success("送信しました")
            history.push('/');
        })
        .catch(error => {
            Alert.error(error.response ? error.response.data : error)
        })
        
    }


    render() {
        const { handleSubmit, submitting, invalid } = this.props;

        return (
            <div className="contact">
                <h1>お問い合わせフォーム</h1>
                <div><p>各種お問い合わせ、不具合報告等は以下のフォームをご使用ください。（ご意見・ご要望も受け付け中です。）</p></div>
                <form className="form" onSubmit={handleSubmit(this.onSubmit)}>
                    <fieldset>
                        <Field
                            name="title"
                            label="タイトル"
                            type="text"
                            component={FormInput}
                            autoComplete="none"
                            validate={[required, minLength5, maxLength100]}
                        />
                    </fieldset>
                    <fieldset>
                        <Field
                            name="name"
                            label="お名前"
                            type="text"
                            component={FormInput}
                            autoComplete="none"
                            validate={[required, minLength2, maxLength100]}
                        />
                    </fieldset>
                    <fieldset>
                        <Field
                            label="Eメールアドレス"
                            name="email"
                            type="text"
                            component={FormInput}
                            autoComplete="none"
                            validate={[required, email]}
                        />
                    </fieldset>
                    <fieldset>
                        <Field
                            name="content"
                            label="お問い合わせ内容"
                            component={FormTextArea}
                            autoComplete="none"
                            validate={[minLength10]}
                        />
                    </fieldset>
                    <button type="submit" className="btn" disabled={submitting || invalid} >送信</button>
                </form>
            </div>
        )
    }
}

export default reduxForm({ form: 'contact' })(Contact);
