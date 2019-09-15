import React from 'react'
import image1 from '../../../img/help/Help_search_1.jpg';
import image2 from '../../../img/help/Help_search_2.jpg';

export default function Search() {
    return (
        <div>
            <h2>カフェ情報の検索</h2>
            <div className="section">
                <h3>エリア検索</h3>
                <div className="section__content">
                    <div className="section__content__image">
                        <img src={image1} alt="area_search" />
                    </div>
                    <p>『エリア』ドロップダウンから検索したい地域を選択してください。</p>
                </div>
            </div>
            <div className="section">
                <h3>並べ替え</h3>
                <div className="section__content">
                    <div className="section__content__image">
                        <img src={image2} alt="order" />
                    </div>
                    <p>『新着』ボタンをクリックすれば新着情報順、『コーヒー』、『障子』、『雰囲気』ボタンをクリックすれば平均評価の高い順に並べ替える事ができます。</p>
                </div>
            </div>
        </div>
    )
}
