import React, { Component } from 'react';
import { Link} from 'react-router-dom';

export default class GlobalNav extends Component {
    render() {
        return (
         <nav className="globalNav">
            <Link className="globalNav__item" to ="/cafes">サーチ</Link>
            <Link className="globalNav__item" to="/static/help">使い方</Link>
            <Link className="globalNav__item" to="/contact">お問い合わせ</Link>
        </nav>
        )
    }
}
