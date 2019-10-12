import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getNewCafes, getNewReviews} from '../actions/homeActions';

import Spinner from './common/Spinner';
import CafeCardSimple from './cafe/CafeCardSimple';
import ReviewCafeCard from './review/ReviewCafeCard';

class Home extends Component {
    componentDidMount(){
        // if(!this.props.newCafe)
        //     this.props.getNewCafes();
        if(!this.props.newReviews)
            this.props.getNewReviews();
    }

    renderNewCafes = () =>  {
        if(!this.props.newCafes){
            return <Spinner />
        }
        return this.props.newCafes.map(newCafe => {
            return (
                <CafeCardSimple key={newCafe._id} cafe={newCafe} />
            )
        })
    }

    renderNewReviews = () => {
        if(!this.props.newReviews){
            return <Spinner />
        }
        return this.props.newReviews.map(newReview => {
            return (
                <ReviewCafeCard key={newReview._id} reviewWithCafe={newReview} />
            )
        })
    }

    render() {
        return (
            <div className="home">
                <div className="home__header">
                     <h1 className="home__header__title">ニュージーランドでカフェ巡り！</h1>
                    <div className="home__header__description">
                        <p>ニュージーカフェマップは、ニュージーランドののカフェ情報・レビューを検索する事ができるサイトです。</p>
                        <p>お気に入りのカフェを見つけて、NZのカフェ文化をもっと楽しもう！</p>
                    </div>
                </div>

                <h2>新着レビュー</h2>
                <div className="home__newcafes">
                    {this.renderNewReviews()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => (
    {
        newCafes: state.home.newCafes,
        newReviews: state.home.newReviews
    }
)

export default connect(mapStateToProps, {getNewCafes, getNewReviews})(Home);