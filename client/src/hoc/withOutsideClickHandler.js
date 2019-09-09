import React, { Component } from 'react';

export default function withOutsideClickHandler(WrappedComponent) {
    return class extends Component {
        componentDidMount() {
            document.addEventListener('mousedown', this.windowClicked);
        }
    
        componentWillUnmount() {
            document.removeEventListener('mousedown', this.windowClicked);
        }
    
        setWrapperRef = (node) => {
            this.wrapperRef = node;
        }

        windowClicked = (event) => {
            if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
                // this.handleClickOutside();
                // console.log("OUtside clicked!!");
                // console.log(this.wrapperRef);
                // console.log(this.props);
                this.props.handleClickOutside();
            }
        }


         render() {
             return (
                // <div ref={this.setWrapperRef} >
                    <WrappedComponent  {...this.props} setWrapperRef = {this.setWrapperRef} />
                // </div>
             )
         }
    }
}