import React, { Component } from 'react'
import { Link } from 'react-router-dom';

class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <div className="footer__container">
                    <div className="footer__link">
                        <Link to="/static/terms">利用規約</Link>
                        <Link to="/static/privacy">個人情報保護方針</Link>
                        <Link to="/contact">お問い合わせ</Link>
                    </div>
                    <div className="footer__copy">Copyright &copy; nzcafemap All Right Reserved. </div>
                </div>
            </div>
        )
    }
}

export default Footer;