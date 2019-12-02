import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { setFilter } from '../../actions/cafeActions';
import CafeCard from './CafeCard';
import AreaDropDown from '../common/AreaDropDown';
// import Ogp from '../common/Ogp';
import siteImage from '../../img/ogpImage.jpg';
import Spinner from '../common/Spinner';
import Pagination from '../common/Pagination';

class CafeSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            area: '',
            order: '',
            in: true
        }
    }

    componentDidMount() {
        if (this.props.filters.area) {
            this.setState({ area: this.props.filters.area })
        }
        this.props.setFilter(this.props.filters);
    }

    renderCafes = () => {
        return this.props.cafes.map(cafe => {
            return (
                <CSSTransition
                    in
                    timeout={300}
                    classNames="test"
                    unmountOnExit
                    // onEnter={() => this.setState({in: true})}
                    // onExited={() => this.setState({in: false})}
                    key={cafe._id}
                >
                    <CafeCard key={cafe._id} cafe={cafe} />
                </CSSTransition>
            )
        })
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value }, () => {
            let filter = {
                area: this.state.area ? this.state.area : undefined
            };
            this.props.setFilter(filter, this.state.order);
        });
    }

    handlePageClick = selectedPage => {
        let filter = {
            area: this.state.area ? this.state.area : undefined
        };
        this.props.setFilter(filter, this.state.order, selectedPage);
    }

    handleOrderClick = e => {
        let value = e.target.id.split('-')[1];
        this.setState({ order: value }, () => {
            let filter = {
                area: this.state.area ? this.state.area : undefined
            };
            this.props.setFilter(filter, this.state.order);
        });
    }

    render() {
        return (
            <div className="cafeSearch">
                <Helmet>
                    <title>カフェ検索</title>
                    <meta name="description" content="ニュージーランド各地のカフェの位置情報、営業時間、レビュー等を検索・投稿できます。特にオークランド、ウェリントン、クライストチャートと言った都市部の情報が豊富！" />
                </Helmet>
                {/* <Ogp 
                    isRoot = {true}
                    title={"ニュージーランドカフェマップ | ＮＺのカフェ検索サイト"}
                    url={"https://www.nzcafemap.com"}
                    description={"ニュージーランド各地のカフェの位置情報、営業時間、レビュー等を検索・投稿できます"}
                    imageUrl={siteImage}
                /> */}
                <div className="cafeSearch__header">
                    <h2>カフェ検索</h2>
                    <div className="cafeSearch__header__filter">
                        <div>
                            <label>エリア</label>
                            <AreaDropDown className="form__input" name="area" onChange={this.onChange} value={this.state.area} allowEmpty={true} />
                        </div>
                    </div>
                </div>
                <div className="cafeSearch__order">
                    <h4>並べ替え</h4>
                    <ul className="cafeSearch__order__buttons">
                        <li id="order-new" className="btn" onClick={this.handleOrderClick}>新着</li>
                        <li id="order-coffee" className="btn" onClick={this.handleOrderClick}>コーヒー</li>
                        <li id="order-food" className="btn" onClick={this.handleOrderClick}>食事</li>
                        <li id="order-sweets" className="btn" onClick={this.handleOrderClick}>スイーツ</li>
                        <li id="order-vibe" className="btn" onClick={this.handleOrderClick}>雰囲気</li>
                    </ul>
                </div>
                <div className="cafeSearch__result">
                    {this.props.loading ? <Spinner /> : null}
                    <TransitionGroup component={null}>
                        {this.renderCafes()}
                    </TransitionGroup>
                </div>
                <Pagination
                    itemCount={this.props.itemCount}
                    pageSize={this.props.pageSize}
                    onPageChange={this.handlePageClick}
                    className='bg-secondary-light'
                />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    filters: state.cafe.filters,
    cafes: state.cafe.cafes,
    itemCount: state.cafe.itemCount,
    pageSize: state.cafe.pageSize,
    loading: state.cafe.loading
})

export default connect(mapStateToProps, { setFilter })(CafeSearch);
