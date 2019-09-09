import React, { Component } from 'react';
import withOutsideClickHandler from '../../hoc/withOutsideClickHandler';

class DevWithOutsideClickHandler extends Component {
    render() {
        return (
            <div className={this.props.className} ref={this.props.setWrapperRef}>
                {this.props.children}
            </div>
        )
    }
}

export default withOutsideClickHandler(DevWithOutsideClickHandler);
