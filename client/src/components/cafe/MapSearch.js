import React, { Component } from 'react'
import { connect } from 'react-redux';
import { setFilter } from '../../actions/mapSearchActions';
import GoogleMapReact from 'google-map-react';
import { Helmet } from "react-helmet";

import AreaDropDown from '../common/AreaDropDown';
import MapSearchResultList from './MapSearch/MapSearchResultList';
import history from '../../history';

const apiKey = process.env.REACT_APP_GOOGLEAPI_KEY;
const latlngList = require('../../utils/Latlng');

const Marker = ({
    rate,
    name,
    hover = false,
    selected = false
}) => {
    let markerClass = "mapSearch__marker" + (hover || selected ? ' active' : '');
    let hintClass = "mapSearch__marker__hint" + (hover || selected ? ' active' : '');

    let rateClass = '';
    if(rate){
        if(+rate >= 4){
            rateClass = 'font-red';
        }
        else if(+rate < 3){
            rateClass = 'font-blue';
        }
    }

    return (
        <div className={markerClass}>
            <p className={rateClass}>{rate ? rate : '-'}</p>
            <span className={hintClass}>{name}</span>
        </div>
    )
}

class MapSearch extends Component {
    constructor(props) {
        super(props);

        this.defaultCenter = { lat: -36.858461, lng: 174.763336 };

        this.state = {
            center: this.defaultCenter,
            filter: null,
            displayRate: 'coffee',
            hoverKey: null,
            selectedKey: null
        }
    }

    componentDidMount() {
        this.setState({ filter: Object.assign({}, this.props.filter) })
    }

    handleClickCurrentPosition = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({ center: {lat: position.coords.latitude, lng: position.coords.longitude} });
        })
    }

    handleAreaChange = e => {
        this.setState({ area: e.target.value });
        let area = latlngList.find(item => item.area === e.target.value)
        if (area) {
            this.setState({ center: area.location });
        }
    }

    handleDisplayRateChange = e => {
        this.setState({
            displayRate: e.target.value
        });
    }

    _onChange = (props) => {
        let filter = Object.assign({}, this.props.filter);
        filter.nw = props.bounds.nw;
        filter.se = props.bounds.se;
        this.setState({ filter: filter }, () => {
            this.props.setFilter(this.state.filter)
        });
    }

    _onChildClick = (key /*, childProps*/) => {
        this.setState({ selectedKey: key})
    }

    _onChildMouseEnter = (key/*, childProps*/) => {
        this.setState({ hoverKey: key })
    }

    _onChildMouseLeave = (/* key, childProps */) => {
        this.setState({ hoverKey: null })
    }

    renderMarkers = (cafes) => {
        if (!cafes || cafes.length === 0) return null;

        return cafes.map(cafe => {
            let rate;
            switch (this.state.displayRate) {
                case 'food':
                    rate = cafe.rateFoodAve;
                    break;
                case 'vibe':
                    rate = cafe.rateVibeAve;
                    break;
                default:
                    rate = cafe.rateCoffeeAve
            }
            return (
                <Marker
                    key={cafe._id}
                    lat={cafe.lat}
                    lng={cafe.long}
                    rate={rate}
                    name={cafe.name}
                    hoverDistance={0}
                    hover={this.state.hoverKey === cafe._id}
                    selected={this.state.selectedKey === cafe._id}
                />
            )
        })
    }

    render() {
        return (
            <div className="mapSearch">
                <Helmet>
                    <title>カフェ検索</title>
                    <meta name="description" content="ニュージーランドのカフェを検索できます。特にオークランド、ウェリントン、クライストチャートと言った都市部の情報が豊富！" />
                </Helmet>
                <h1>カフェ検索</h1>
                <div>
                    <button type="button" className="btn" onClick={this.handleClickCurrentPosition}>現在地周辺を調べる</button>
                </div>
                <div className="mapSearch__config">
                    <h3>絞り込み</h3>
                    <div>
                        <label>エリア</label>
                        <AreaDropDown className="form__input" name="area" onChange={this.handleAreaChange} allowEmpty={true} />
                    </div>
                    <h3>平均評価表示</h3>
                    <div className="mapSearch__config__rateDisplay">
                        <label className="radioButton">
                            <input
                                type="radio"
                                name="displayRate"
                                value="coffee"
                                checked={this.state.displayRate === "coffee"}
                                onChange={this.handleDisplayRateChange}
                            />
                            <span>コーヒー</span>
                        </label>
                        <label className="radioButton">
                            <input
                                type="radio"
                                name="displayRate"
                                value="food"
                                checked={this.state.displayRate === "food"}
                                onChange={this.handleDisplayRateChange}
                            />
                            <span>食事</span>
                        </label>

                        <label className="radioButton">
                            <input
                                type="radio"
                                name="displayRate"
                                value="vibe"
                                checked={this.state.displayRate === "vibe"}
                                onChange={this.handleDisplayRateChange}
                            />
                            <span>雰囲気・サービス</span>
                        </label>
                    </div>
                </div>
                <div className="mapSearch__map">
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: apiKey }}
                        defaultCenter={this.defaultCenter}
                        center={this.state.center}
                        defaultZoom={13}
                        onChange={this._onChange}
                        onChildClick={this._onChildClick}
                        onChildMouseEnter={this._onChildMouseEnter}
                        onChildMouseLeave={this._onChildMouseLeave}
                    >
                        {this.renderMarkers(this.props.cafes)}
                    </GoogleMapReact>
                </div>
                <div>
                    <MapSearchResultList
                        cafes={this.props.cafes}
                        hoverId={this.state.hoverKey}
                        selectedId={this.state.selectedKey}
                        onChildMouseEnter={this._onChildMouseEnter}
                        onChildMouseLeave={this._onChildMouseLeave}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    filter: state.map.filter,
    cafes: state.map.cafes,
    loading: state.map.loading,
})

export default connect(mapStateToProps, { setFilter })(MapSearch);