import React, { Component } from 'react';
import Rater from 'react-rater';

export default class CafeRateEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cafeId: props.cafeId,
            rateCoffee: 0,
            rateFood: 0,
            rateVibe: 0
        }
    }

    componentDidMount(){
        if(this.props.initialRate){
            this.setState({
                rateCoffee:this.props.initialRate.rateCoffee,
                rateFood:this.props.initialRate.rateFood,
                rateVibe:this.props.initialRate.rateVibe,
            })
        }
    }

    // changeRate = ({rating, target}) => {
    changeRate = ({ rating, target }) => {
        this.setState({ [target.parentNode.parentElement.id]: rating });
    }

    onSubmit = () => {
        const{ rateCoffee, rateFood, rateVibe} = this.state;
        let newRate = {
            cafe: this.state.cafeId,
            rateCoffee: rateCoffee,
            rateFood: rateFood,
            rateVibe: rateVibe
        }

        this.props.onSubmit(newRate);
    }

    onCancel = () =>{
        this.props.onCancel();
    }

    render() {
        return (
            <div className="cafeRateEditor">
                <h2>評価編集</h2>
                <h3>コーヒー</h3>
                <Rater id="rateCoffee" total={5} onRate={this.changeRate} rating={this.state.rateCoffee} />
                <h3>食事</h3>
                <Rater id="rateFood" total={5} onRate={this.changeRate} rating={this.state.rateFood} />
                <h3>雰囲気・サービス</h3>
                <Rater id="rateVibe" total={5} onRate={this.changeRate} rating={this.state.rateVibe} />
                <div>
                    <button type="button" className="btn" onClick={this.onSubmit}>OK</button>
                    <button type="button" className="btn" onClick={this.onCancel}>Cancel</button>
                </div>
            </div>
        )
    }
}
