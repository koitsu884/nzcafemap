import React, { Component } from 'react';
import { Link} from 'react-router-dom';

export default class GlobalNav extends Component {
    render() {
        return (
         <nav className="globalNav">
            <Link className="globalNav__item" to ="/cafes">サーチ</Link>
            <Link className="globalNav__item" to="/">Menu 2</Link>
            <Link className="globalNav__item" to="/">Menu 3</Link>
        </nav>
        )
    }
}
