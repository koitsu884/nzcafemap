import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import { connect} from 'react-redux';

import {signOut} from '../actions/authActions';


class Header extends Component {
    onLogoutClick = (e) => {
        e.preventDefault();
        this.props.signOut();
    }

    renderLinks(className) {
        if(this.props.isSignedIn){
            return ( 
                <div className={className}>
                    <Link to = "/mypage" className = "header__link">マイページ</Link>
                    <a href="/#" className = "header__link" onClick={this.onLogoutClick}>ログアウト</a>
                </div>
            )
        } else {
            return ( 
                <div className={className}>
                    <Link to = "/signin" className = "header__link">ログイン</Link>
                    <Link to = "/signup" className = "header__link">新規登録</Link>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="header">
                <div className="header__logo">
                    <h1 className="header__logo"><Link to ="/">ニュージーカフェマップ</Link></h1>
                </div>
                <div className="header__content">
                    {this.renderLinks('header__content__auth')}
                </div>
            </div>

        )
    }
}

function mapStateToProps(state) {
    return {isSignedIn: state.user.isSignedIn}
}

export default connect( mapStateToProps, {signOut})(Header);