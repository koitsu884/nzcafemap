import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PlaceSearch, convertPlaceToDetails } from '../googlemap/PlaceSearch';
import { getCafeDetails, createCafe, updateCafe } from '../../actions/cafeActions';
import AreaDropDown from '../common/AreaDropDown';

const apiKey = process.env.REACT_APP_GOOGLEAPI_KEY;

class CafeEditForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            usePlace: true,
            placeID: "",
            // placeDetails: null,
            name: '',
            address: '',
            area: '北島 - オークランド',
            long: 0.0,
            lat: 0.0,
            openingHours: '',
            tags: [],
            errors: {}
        };
    }

    onSubmit = () => {
        const newCafeData = {
            name: this.state.name,
            address: this.state.address,
            area: this.state.area
        };

        if(this.state.placeID) newCafeData.placeID = this.state.placeID;
        if(this.state.long !== 0.0) newCafeData.long = this.state.long;
        if(this.state.lat !== 0.0) newCafeData.lat = this.state.lat;
        if(this.state.openingHours) newCafeData.openingHours = this.state.openingHours;
        
        if(this.props.cafeID){
            this.props.updateCafe(this.props.cafeID, newCafeData);
        }
        else{
            this.props.createCafe(newCafeData);
        }
    }

    componentDidMount() {
        if (this.props.cafeID) {
            this.props.getCafeDetails(this.props.cafeID);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.cafeDetails) {
            let details = Object.assign({}, nextProps.cafeDetails);
            this.setState({
                name: details.name,
                area: details.area,
                placeID: details.placeID,
                address: details.address,
                long: details.long,
                lat: details.lat,
                openingHours: details.openingHours,
                tags: details.tags
            });
        }
    }

    clearField = () => {
        this.setState({
            name: '',
            placeID: "",
            address: '',
            long: 0.0,
            lat: 0.0,
            openingHours: '',
            tags: [],
            errors: {}
        });
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    togglePlace = () => {
        this.clearField();
        this.setState({ usePlace: !this.state.usePlace });
    }

    onPlaceChanged = place => {
        let details = convertPlaceToDetails(place);
        let address = `${details.street}, ${details.suburb}, ${details.city}`;

        this.setState({
            placeID: details.placeID,
            name: details.name,
            address: address,
            openingHours: details.openingHours,
            long: details.long,
            lat: details.lat
        })
    }

    renderMapSearch = () => {
        let className = "mapSearch" + (this.state.usePlace ? "" : " inactive");
        return (
            <div className={className}>
                <h3>店舗検索</h3>
                <PlaceSearch apiKey={apiKey} onPlaceChanged={this.onPlaceChanged} />
                <div>
                    <label>Place ID</label>
                    <input
                        className="form__input"
                        name="placeID"
                        type="text"
                        value={this.state.placeID}
                        onChange={this.onChange}
                        readOnly
                        disabled
                    />
                </div>
            </div>
        )
    }

    render() {
        return (
            <form className="form">
                <h2>エリア</h2>
                <AreaDropDown className="form__input" name="area" onChange={this.onChange} value={this.state.area} />
                <h2>基本情報</h2>
                {/* <h5>Google Place を使用する</h5>
                <div className="switch">
                    <input id="usePlace" name="usePlace" type="checkbox" onChange={this.togglePlace} checked={this.state.usePlace}></input>
                    <label htmlFor="usePlace" />
                </div> */}
                {this.renderMapSearch()}
                <div className="cafeEditForm__inputFields">
                    <div>
                        <label>店名</label>
                        <input
                            className="form__input"
                            name="name"
                            type="text"
                            value={this.state.name}
                            onChange={this.onChange}
                            disabled={this.state.usePlace}
                        />
                        <label>経度</label>
                        <input
                            className="form__input"
                            name="long"
                            type="number"
                            value={this.state.long}
                            onChange={this.onChange}
                        />
                        <label>緯度</label>
                        <input
                            className="form__input"
                            name="lat"
                            type="number"
                            value={this.state.lat}
                            onChange={this.onChange}
                        />
                        <label>住所</label>
                        <input
                            className="form__input"
                            name="address"
                            type="text"
                            value={this.state.address}
                            onChange={this.onChange}
                            disabled={this.state.usePlace}
                        />
                    </div>
                    <div>
                        <label>営業時間</label>
                        <textarea
                            className="form__input"
                            name="openingHours"
                            value={this.state.openingHours}
                            onChange={this.onChange}
                            disabled={this.state.usePlace}
                        />
                    </div>
                </div>
                <button type="button" className="btn" onClick={this.onSubmit}>{this.props.cafeID ? "更新" : "登録"}</button>
            </form>
        )
    }
}

const mapStateToProps = state => ({
    cafeDetails: state.cafe.cafeDetails
})

export default connect(mapStateToProps, { getCafeDetails, createCafe, updateCafe })(CafeEditForm);
