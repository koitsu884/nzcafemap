import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';

import { required, minLength, maxLength, confirmPassword} from '../../helper/validation';
import FormInput from '../common/FormInput';
import client from '../../utils/client';
import Alert from '../../helper/Alert';
import history from '../../history';

const minLength5 = minLength(5);
const maxLength30 = maxLength(30);

class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            token: props.match.params.token,   
            loading: false 
        };
    }

    componentDidMount(){
        if(!this.state.token){
            console.log('No token');
            history.push('/');
        }
    }
    
    onSubmit = formProps => {
        this.setState({loading: true});
        // this.props.signUp(fd);
        client.post('auth/resetpassword', {password:formProps.password}, {params:{token: this.state.token}})
            .then(response => {
                Alert.success("パスワードを変更しました");
                history.push('/signin');
            })
            .catch(error => {
                this.setState({loading: false});
                Alert.error(error);
            })
    }
    
    
    render() {
        const { handleSubmit, submitting, invalid } = this.props;

        return (
            <div className="signIn">
                <form className="signIn__form form" onSubmit={handleSubmit(this.onSubmit)}>
                    <fieldset>
                        <Field
                            label="新しいパスワード"
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
                    <button type="submit" disabled={submitting || invalid} className="btn" >パスワード変更</button>
                </form>
            </div>
        )
    }
}

export default reduxForm({ form: 'resetPassword' })(ResetPassword);
