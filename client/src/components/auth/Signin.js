import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { signIn } from '../../actions/authActions';
import { clearError } from '../../actions/errorActions';
import { required, minLength, maxLength, email } from '../../helper/validation';
import FormInput from '../common/FormInput';

//To avoid infinite loop error
const minLength5 = minLength(5);
const maxLength30 = maxLength(30);

class Signin extends Component {
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
        }
    }

    onSubmit = formProps => {
        this.props.signIn(formProps);
    }

    render() {
        const { handleSubmit, submitting, invalid } = this.props;
        const { authError } = this.state;
        // console.log(authError);
        const errorContent = authError ? (
            <div className="form__error">
                {authError}
            </div>
        ) : null;

        return (
            <div className="signIn">
                <form className="signIn__form form" onSubmit={handleSubmit(this.onSubmit)}>
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
                            label="パスワード"
                            name="password"
                            type="password"
                            component={FormInput}
                            autoComplete="none"
                            validate={[required, minLength5, maxLength30]}
                        />
                    </fieldset>
                    {errorContent}
                    <button className="btn" type="submit" disabled={submitting || invalid} >ログイン</button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = state => (
    {
        authError: state.error
    }
)

export default compose(
    connect(mapStateToProps, { signIn, clearError }),
    reduxForm({ form: 'signin' })
)(Signin);