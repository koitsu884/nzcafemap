import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../common/Spinner';
import Image from '../../common/CloudinaryImage';

const baseURL = process.env.REACT_APP_API_URL;

export default class LatestReviewPhotos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: null,
            loading: true
        }
    }

    componentDidMount() {
        const { cafeId } = this.props;
        this.axiosCancelSource = axios.CancelToken.source()

        axios.get(`cafes/${cafeId}/photos/latest`, { baseURL: baseURL, cancelToken: this.axiosCancelSource.token })
            .then(response => {
                this.setState({ photos: response.data, loading: false })
            })
            .catch(error => {
                console.log(error);
                // this.setState({loading: false})
            })
    }

    componentWillUnmount() {
        if(this.axiosCancelSource)
        {
            this.axiosCancelSource.cancel();
        }
    }

    renderImages = () => {
        return this.state.photos.map(photo => {
            return <Image className="latestReviewPhoto__image" key={photo._id} thumb={true} public_id={photo.public_id} version={photo.version} />
        })
    }

    render() {
        if (this.state.loading) return <Spinner />
        if (!this.state.photos || this.state.photos.length === 0) return null;
        return (
            <Fragment>
                <div className="latestReviewPhoto">
                    {this.renderImages()}
                </div>
                <Link to="/cafes/photos">全ての写真を見る</Link>
            </Fragment>
        )
    }
}
