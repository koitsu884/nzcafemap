import React from 'react'
import image1 from '../../../img/help/Help_cafe_1.jpg';
import image2 from '../../../img/help/Help_cafe_2.jpg';
import image3 from '../../../img/help/Help_cafe_3.jpg';
import review_image1 from '../../../img/help/Help_review_1.jpg';
import review_image2 from '../../../img/help/Help_review_2.jpg';
import review_image3 from '../../../img/help/Help_review_3.jpg';
import rate_image1 from '../../../img/help/Help_rate_1.jpg';

export default function Cafe() {
    return (
        <div>
            <h2>カフェ情報、レビュー・評価の追加</h2>
            <div className="section">
                <h2>カフェ情報登録</h2>
                <div className="section__content">
                    <div className="section__content__image">
                        <img src={image1} alt="cafe_add" />
                    </div>
                    <p>（１）マイページに移動し、カフェ情報管理セクションにある『カフェ情報を追加』ボタンをクリックします</p>
                </div>
                <div className="section__content">
                    <div className="section__content__image">
                        <img src={image2} alt="cafe_add_place" />
                    </div>
                    <div>
                        <p>（２）エリアを選択してください。</p>
                        <p>（３）『店舗検索』テクストボックスに店名を入力すると、候補が表示されるのでそこから追加したいお店を選択してください。</p>
                    </div>
                </div>
                <div className="section__content">
                    <div className="section__content__image">
                        <img src={image3} alt="cafe_add_submit" />
                    </div>
                    <div>
                        （４）各情報が自動的に入力されるので、内容を確認して間違いなければ登録ボタンをクリックしてください。
                    </div>
                </div>
            </div>
            <div className="section">
                <h2>レビューの追加</h2>
                <div>（１）カフェ検索ページから、レビューをしたいカフェを選択してください。</div>
                <hr />
                <div className="section__content">
                    <div className="section__content__image">
                        <img src={review_image1} alt="review_add" />
                    </div>
                    <p>（２）カフェ情報ページ下部にある、『レビューを書く』ボタンをクリックします</p>
                </div>
                <hr />
                <div className="section__content">
                    <div className="section__content__image">
                        <img src={review_image2} alt="review_add_form" />
                    </div>
                    <div>
                        <p>（３）各情報を入力します。</p>
                        <p>ブログ等にレビュー記事を書いている場合、『レビュー記事URL』に該当URLを入力するとレビューにリンクカードが表示されるようになります。</p>
                        <p>すべて入力したら『レビューを追加』ボタンをクリックします。</p>
                        <br />
                        <p className="error">※一部ブログサービス（FC2ブログ等）はURLを入力してもリンクカードが表示されない場合があります</p>
                        <p className="error">※レビューは一度投稿したら編集できませんので（削除は可）、投稿前に必ず内容の確認をお願いします。</p>
                    </div>
                </div>
                <hr />
                <div className="section__content">
                    <div className="section__content__image">
                        <img src={review_image3} alt="review_add_result" />
                    </div>
                    <p>カフェ詳細ページにレビューが追加されました</p>
                </div>
            </div>
            <div className="section">
                <h2>カフェの評価</h2>
                <div className="section__content">
                    <div className="section__content__image">
                        <img src={rate_image1} alt="rate_add" />
                    </div>
                    <div>
                        <p>（１）カフェ詳細ページにある『評価を付ける』リンクをクリックしてください。</p>
                        <p>（２）ポップアップページが表示されるので、そこで各評価を５段階で選択した後にOKボタンをクリックしてください。</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
