import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Alert from '../../helper/Alert';
import history from '../../history';

import { signOut } from '../../actions/authActions';
import UserPhotoEditor from './MyPage/UserPhotoEditor';
import MyCafeList from './MyPage/MyCafeList';
import MyReviewList from './MyPage/MyReviewList';
import EditAccountInfo from './MyPage/EditAccountInfo';
import TwitterProfile from './MyPage/TwitterProfile';
import ToggleInput from '../common/ToggleInput';
import EditIntroduction from './MyPage/EditIntroduction';

const baseURL = process.env.REACT_APP_API_URL;

class MyPage extends Component {

    handleDeleteAccount = () => {
        Alert.confirm('アカウントを本当に削除しますか？')
            .then((result) => {
                if (result.value) {
                    axios.delete('users/', { baseURL: baseURL }).then(response => {
                        Alert.success("アカウントを削除しました")
                        this.props.signOut();
                        history.push('/');
                    })
                        .catch(errors => {
                            console.log(errors);
                        })
                }
            })
    }

    render() {
        return (
            <div className="myPage">
                <h2>マイページ</h2>
                <div className="myPage__account u-margin-bottom-medium">
                    <UserPhotoEditor/>
                    {
                        this.props.user.twitterId ?
                            (
                                <div>
                                    <h3>ツイッタープロファイル</h3>
                                    <TwitterProfile profile={this.props.user.twitterProfile} />
                                </div>
                            )
                            : null
                    }
                </div>
                <div className="myPage__section u-margin-bottom-medium">
                    <h2>アカウント管理</h2>
                    <div className="myPage__section__container editAccountInfo form">
                    <EditAccountInfo />
                    <EditIntroduction />
                    </div>
                </div>
                <div className="myPage__section u-margin-bottom-medium">
                    <h2>カフェ情報管理</h2>
                    <div className="myPage__section__container">
                        <h3>マイカフェ</h3>
                        <Link to="/cafes/add" className="btn">カフェ情報を追加</Link>
                        <MyCafeList userId={this.props.user._id} />
                        <h3>マイレビュー</h3>
                        <MyReviewList userId={this.props.user._id} />
                    </div>
                </div>
                <div className="myPage__section">
                    <h2>アカウント削除</h2>
                    <button type="button" className="btn" onClick={this.handleDeleteAccount}>アカウントを削除する</button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user.user
})

export default connect(mapStateToProps, { signOut })(MyPage);