import React, { Component, Fragment } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { connect } from 'react-redux';

import history from '../../history';
import { multiplePhotoUpload } from '../../actions/photoActions';

import Alert from '../../helper/Alert';
import MultipleImageUploader from '../common/MultipleImageUploader';
import resizeFile from '../../helper/ResizeImage';
import { url } from '../../helper/validation';
import Spinner from '../common/Spinner';
import LinkCard from '../common/LinkCard';

const baseURL = process.env.REACT_APP_API_URL;
Modal.setAppElement("#root")

class ReviewEditForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cafeName: this.props.cafeName,
            cafeId: this.props.cafeId,
            title: '',
            comment: '',
            articleURL: '',
            articlePreviewLoading: false,
            articleInfo: null,
            selectedFiles: [],
            modalIsOpen: false,
            errors: {}
        }
    }

    componentDidMount() {
        this.axiosCancelSource = axios.CancelToken.source()
    }

    componentWillUnmount() {
        this.axiosCancelSource.cancel();
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.modalIsOpen) return;

        if (nextProps.photoCount === 0) {
            this.setState({ modalIsOpen: false }, () => {
                Alert.success("レビューを追加しました", () => {
                    history.push('/cafes/' + this.props.cafeId);
                })
            })
        }
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = () => {
        let errors = {};
        let isValid = true;

        if(!this.state.title){
            errors.title = 'タイトルは必須項目です';
            isValid = false;
        }

        if(!this.state.comment){
            errors.comment = 'レビューは必須項目です'
            isValid = false;
        }

        if(!isValid){
            this.setState({errors: errors});
            return;
        }
         
        this.setState({errors: {}});

        let newReview = {
            cafe: this.props.cafeId,
            title: this.state.title,
            comment: this.state.comment,
            articleInfo: this.state.articleInfo ? JSON.stringify(this.state.articleInfo) : undefined
        };


        axios.post('/reviews', newReview, { baseURL: baseURL })
            .then(response => {
                //Send photos
                if (this.state.selectedFiles.length > 0) {
                    this.setState({
                        modalIsOpen: true
                    })
                    this.props.multiplePhotoUpload('reviews', response.data._id, this.state.selectedFiles);
                }
                else {
                    this.setState({ modalIsOpen: false }, () => {
                        Alert.success("レビューを追加しました", () => {
                            history.push('/cafes/' + this.props.cafeId);
                        })
                    })
                }
            })
            .catch(error => {
                Alert.error(error.response ? error.response.data : error);
                this.setState({
                    modalIsOpen: false
                })
                //TODO: Should dispatch delete review
            })
    }

    onImagesSelected = async (selectedFiles) => {
        let resizedFiles = [];
        let maxSize = 600;
        for (var file of selectedFiles) {
            let resizedFile = await resizeFile(file, maxSize);
            resizedFiles.push(resizedFile);
        }

        this.setState({ selectedFiles: resizedFiles })
    }

    getLinkPreview = () => {
        if (!this.state.articleURL) {
            this.setState({
                articlePreviewLoading: false,
                articleInfo: null
            })
            return;
        }

        let encodedURL = encodeURI(this.state.articleURL);
        let error = url(encodeURI(encodedURL));
        if (error) {
            this.setState({ articleInfo: error });
            return;
        }

        this.setState({ articlePreviewLoading: true });
        axios.post('reviews/linkPreview', { url: encodedURL }, {
            baseURL: baseURL
        })
        .then(response => {
            let articleInfo = Object.assign({}, response.data);
            if (articleInfo.description && articleInfo.description.length > 160)
                articleInfo.description = articleInfo.description.substr(0, 160);

            this.setState({
                articlePreviewLoading: false,
                articleInfo: articleInfo,
            })
        })
        .catch(error => {
            Alert.error(error.response ? error.response.data : error);
            this.setState({
                articleInfo: null,
                articlePreviewLoading: false
            })
        })

    }

    renderArticlePreview = () => {
        if (!this.state.articleInfo && !this.state.articlePreviewLoading) return null;
        return (
            <div className="reviewForm__articlePreview">
                {
                    this.state.articlePreviewLoading
                        ? <Spinner />
                        : <LinkCard linkInfo={this.state.articleInfo} />
                }
            </div>
        )
    }

    render() {
        const { errors } = this.state;

        return (
            <Fragment>
                <h2>{this.state.cafeName} のレビューを{this.props.id ? "編集" : "追加"}</h2>
                <form className="form">
                    <label>タイトル(必須)</label>
                    <input
                        className="form__input"
                        name="title"
                        type="text"
                        value={this.state.title}
                        onChange={this.onChange}
                    />
                    {errors.title ? <div className="form__error">{errors.title}</div> : null}
                    <label>レビュー記事URL（ブログ等）</label>
                    <input
                        className="form__input"
                        name="articleURL"
                        type="url"
                        value={this.state.articleURL}
                        onChange={this.onChange}
                        onBlur={this.getLinkPreview}
                    />
                    {this.renderArticlePreview()}
                    <label>レビュー(必須)</label>
                    <textarea
                        className="form__input"
                        name="comment"
                        value={this.state.comment}
                        onChange={this.onChange}
                    />
                    {errors.comment ? <div className="form__error">{errors.comment}</div> : null}
                    <label>画像アップロード（５つまで）</label>
                    <MultipleImageUploader maxNum={5} maxSize={640} onImagesSelected={this.onImagesSelected} />
                    <button 
                        type="button" 
                        className="btn" 
                        onClick={this.onSubmit} 
                        disabled={this.state.loading || this.state.articlePreviewLoading || (this.state.articleURL && !this.state.articleInfo)}
                    >レビューを追加</button>
                </form>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    style={{
                        content: {
                            width: '40rem',
                            height: '30rem',
                            margin: 'auto'
                        }
                    }}
                >
                    <div>{this.props.photoCount} 枚目の写真をアップロード中です</div>
                </Modal>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    uploadingPhotos: state.photo.uploadings,
    photoCount: state.photo.count
})

export default connect(mapStateToProps, { multiplePhotoUpload })(ReviewEditForm);
