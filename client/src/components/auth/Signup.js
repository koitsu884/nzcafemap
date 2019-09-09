import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { required, minLength, maxLength, minLength2, email, confirmPassword} from '../../helper/validation';

import {signUp} from '../../actions/authActions';
import FormInput from '../common/FormInput';

//To avoid infinite loop error
const minLength5 = minLength(5);
const maxLength30 = maxLength(30);
const maxLength50 = maxLength(50);

class Signup extends Component {
    onSubmit = formProps => {
        let fd = Object.assign({}, formProps);
        fd.confirmPassword = undefined;
        this.props.signUp(fd);
    }

    render() {
        const { handleSubmit, submitting, invalid } = this.props;

        return (
            <div className="signUp">
                <form className="signUp__form form" onSubmit={handleSubmit(this.onSubmit)}>
                    <fieldset>
                        <label>Email</label>
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
                            label="パスワード"
                            name="password"
                            type="password"
                            component={FormInput}
                            autoComplete="none"
                            validate={[required, minLength5, maxLength30]}
                        />
                    </fieldset>
                    <fieldset>
                        <Field
                            label="パスワード確認"
                            name="confirmPassword"
                            type="password"
                            component={FormInput}
                            autoComplete="none"
                            validate={[required, (value, values)=>(confirmPassword(value)(values.password))]}
                        />
                    </fieldset>
                    <fieldset>
                        <Field
                            name="displayName"
                            label="表示名"
                            type="text"
                            component={FormInput}
                            autoComplete="none"
                            validate={[minLength2, maxLength50]}
                        />
                    </fieldset>
                    <button type="submit" disabled={submitting || invalid} className="btn" >新規登録</button>
                </form>
            </div>
        )
    }
}

export default compose(
    connect(null, { signUp }),
    reduxForm({ form: 'signUp' })
)(Signup);