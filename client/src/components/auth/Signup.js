import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { required, minLength, maxLength, minLength2, email, confirmPassword} from '../../helper/validation';

import {signUp} from '../../actions/authActions';
import { clearError } from '../../actions/errorActions';
import FormInput from '../common/FormInput';
import TwitterLogin from './TwitterLogin';

//To avoid infinite loop error
const minLength5 = minLength(5);
const maxLength30 = maxLength(30);
const maxLength50 = maxLength(50);

class Signup extends Component {
    constructor() {
        super();
        this.state = {
            authError: null
        };
    }

    componentDidMount() {
        this.props.clearError();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.authError) {
            this.setState({ authError: nextProps.authError });
            this.props.clearError();
        }
    }

    onSubmit = formProps => {
        let fd = Object.assign({}, formProps);
        fd.confirmPassword = undefined;
        this.props.signUp(fd);
    }

    render() {
        const { handleSubmit, submitting, invalid } = this.props;
        const { authError } = this.state;

        const errorContent = authError ? (
            <div className="form__error">
                {authError}
            </div>
        ) : null;

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
                            validate={[required, confirmPassword]}
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
                    {errorContent}
                    <button type="submit" disabled={submitting || invalid} className="btn" >新規登録</button>
                    <hr />
                <h4>もしくは</h4>
                <TwitterLogin />
                </form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    authError: state.error
})

export default compose(
    connect(mapStateToProps, { signUp, clearError }),
    reduxForm({ form: 'signUp' })
)(Signup);