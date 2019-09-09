import React, { Component } from 'react'
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { getProfile, updateProfile } from '../../../actions/myPageActions';

import Alert from '../../../helper/Alert';
import ToggleInput from '../../common/ToggleInput';
import { clearError } from '../../../actions/errorActions';
import { required, email, minLength2 } from '../../../helper/validation';
import PasswordEditor from './PasswordEditor';
import SvgEdit from '../../common/SvgIcons/SvgEdit';

class EditUserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            displayName: '',
            modalIsOpen: false
        }
    }

    componentDidMount() {
        this.props.getProfile();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            Alert.error(nextProps.error);
            this.props.clearError();
            if(this.props.user)
            {
                this.setState({
                    email: this.props.user.email,
                    displayName: this.props.user.displayName
                })
            }
        }
        else {
            this.setState({
                email: nextProps.user.email,
                displayName: nextProps.user.displayName,
            })
        }
    }

    openModal = () => {
        this.setState({ modalIsOpen: true });
    }

    closeModal = () => {
        this.setState({ modalIsOpen: false });
    }

    onUpdate = (name, value) => {
        let user = Object.assign({}, this.props.user);
        user[name] = value;
        user.photo = undefined;
        this.props.updateProfile(user);
        this.closeModal();
    }

    render() {
        return (
            <div className="myPage__section__container editUserProfile form">
                {/* <div className="form"> */}
                <div className="editUserProfile__item">
                    <label>Eメールアドレス</label>
                    <ToggleInput
                        label="Eメールアドレス"
                        name="email"
                        type="email"
                        value={this.state.email}
                        onUpdate={this.onUpdate}
                        validate={[required, email]}
                    />
                </div>
                <div className="editUserProfile__item">
                    <label>表示名</label>
                    <ToggleInput
                        label="表示名"
                        name="displayName"
                        type="text"
                        value={this.state.displayName}
                        onUpdate={this.onUpdate}
                        validate={[minLength2]}
                    />
                </div>
                <div className="editUserProfile__item">
                    <label>パスワード</label>
                    <div className="toggleInput">
                        <input
                            className="form__input"
                            label="password"
                            name="displayName"
                            type="text"
                            value="******"
                            disabled={'disabled'}
                        />
                        <span onClick={this.openModal}>
                            <SvgEdit className="ibtn" />
                        </span>
                    </div>
                </div>
                {/* <button type="button" className="btn" onClick={this.openModal}>パスワードを変更する</button> */}
                {/* </div> */}
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    className="passwordEditor"
                >
                    <PasswordEditor onUpdate={this.onUpdate} onCancel={this.closeModal} />
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.myPage.user,
    error: state.error,
})

export default connect(mapStateToProps, { getProfile, updateProfile, clearError })(EditUserProfile);