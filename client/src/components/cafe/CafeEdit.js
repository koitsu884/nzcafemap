import React, { Component } from 'react';
import CafeEditForm from './CafeEditForm';
import CafePhotoEditor from './CafePhotoEditor';

// import { getCafeDetails } from '../../actions/cafeActions';

class CafeEdit extends Component {
    render() {
        return (
            <div className="cafeEditForm">
                <h1>カフェ情報編集</h1>
                <CafePhotoEditor cafeID={this.props.match.params.id} />
               <CafeEditForm cafeID={this.props.match.params.id} />
            </div>
        )
    }
}

export default CafeEdit;