import React, { Component } from 'react';
import { Helmet} from "react-helmet";
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { setFilter } from '../../actions/cafeActions';
import CafeCard from './CafeCard';
import AreaDropDown from '../common/AreaDropDown';
import Ogp from '../common/Ogp';
import siteImage from '../../img/ogpImage.jpg';

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

    handlePageClick = data => {
        let selected = data.selected;
        let filter = {
            area: this.state.area ? this.state.area : undefined
        };
        this.props.setFilter(filter, this.state.order, selected + 1);
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
                <Ogp 
                    isRoot = {true}
                    title={"ニュージーランドカフェマップ | ＮＺのカフェ検索サイト"}
                    url={"https://www.nzcafemap.com"}
                    description={"ニュージーランド各地のカフェの位置情報、営業時間、レビュー等を検索・投稿できます"}
                    imageUrl={siteImage}
                />
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
                    <ul>
                        <li id="order-new" className="btn" onClick={this.handleOrderClick}>新着</li>
                        <li id="order-coffee" className="btn" onClick={this.handleOrderClick}>コーヒー</li>
                        <li id="order-food" className="btn" onClick={this.handleOrderClick}>食事</li>
                        <li id="order-vibe" className="btn" onClick={this.handleOrderClick}>雰囲気</li>
                    </ul>
                    {/* <select className="form__input" name="order" onChange={this.onChange} value={this.state.order}>
                        <option value=""></option>
                        <option value="coffee">コーヒーの評価が高い順</option>
                        <option value="food">食事の評価が高い順</option>
                        <option value="vibe">雰囲気の評価が高い順</option>
                    </select> */}
                </div>
                <div className="cafeSearch__result">
                    <TransitionGroup component={null}>
                        {this.renderCafes()}
                    </TransitionGroup>
                </div>
                {
                    this.props.pageCount > 1 ?
                        <ReactPaginate
                            previousLabel={'前のページ'}
                            nextLabel={'次のページ'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={this.props.pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                        />
                        : null
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    filters: state.cafe.filters,
    pageCount: state.cafe.pageCount,
    cafes: state.cafe.cafes,
    loading: state.cafe.loading
})

export default connect(mapStateToProps, { setFilter })(CafeSearch);
