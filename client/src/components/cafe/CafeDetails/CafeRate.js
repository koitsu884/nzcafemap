import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import CafeRateEditor from '../CafeRateEditor';

import SvgCoffee from '../../common/SvgIcons/SvgCoffee';
import SvgFood from '../../common/SvgIcons/SvgFood';
import SvgVibe from '../../common/SvgIcons/SvgVibe';

const baseURL = process.env.REACT_APP_API_URL;
Modal.setAppElement("#root")

export default class CafeRate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            myRate: null
        };
    }

    componentDidMount() {
        this.axiosCancelSource = axios.CancelToken.source()

        axios.get(`cafes/${this.props.cafeId}/rate/user/${this.props.userId}`, {
            baseURL: baseURL,
            cancelToken: this.axiosCancelSource.token
        })
        .then(res => {
            this.setState({ myRate: res.data });
        })
        .catch(error => {
            //Do nothing
        })
    }

    componentWillUnmount(){
        this.axiosCancelSource.cancel();
    }

    openModal = () => {
        this.setState({ modalIsOpen: true });
    }

    closeModal = () => {
        this.setState({ modalIsOpen: false });
    }

    handleUpdate = (newRate) => {
        if (!this.state.myRate) {
            axios.post(`cafes/${this.props.cafeId}/rate`, newRate, {
                baseURL: baseURL
            })
                .then(res => {
                    this.setState({ myRate: newRate });
                    this.closeModal();
                })
        }
        else {
            axios.put(`cafes/${this.props.cafeId}/rate`, newRate, {
                baseURL: baseURL
            })
                .then(res => {
                    this.setState({ myRate: newRate });
                    this.closeModal();
                })
        }
    }

    render() {
        return (
            <div className="cafeRate">
                {this.state.myRate ? (
                    <div>
                        <span className="cafeRate__row"><SvgCoffee />: {this.state.myRate.rateCoffee}</span>
                        <span className="cafeRate__row"><SvgFood />: {this.state.myRate.rateFood}</span>
                        <span className="cafeRate__row"><SvgVibe />: {this.state.myRate.rateVibe}</span>
                    </div>
                ) : <div>まだ評価していません</div>}

                <span className = "cafeRate__rate" onClick={this.openModal}>評価を付ける</span>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    // onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    contentLabel="レート編集"
                    style={{
                        content: {
                            width: '40rem',
                            height: '52rem',
                            margin: 'auto'
                        }
                    }}
                >
                    <CafeRateEditor
                        initialRate={this.state.myRate}
                        cafeId={this.props.cafeId}
                        onSubmit={this.handleUpdate}
                        onCancel={this.closeModal} />
                </Modal>
            </div>
        )
    }
}
