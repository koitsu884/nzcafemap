import React from 'react'

export default function Account() {
    return (
        <div>
            <h2>ユーザー登録</h2>
            <div className="section">
                <h3>新規登録</h3>
                <p>ホームページ右上、『新規登録』リンクからユーザー登録してください。</p>
                <p>ユーザー登録をしなくてもカフェ情報の検索は可能ですが、カフェ情報の新規追加、カフェのレビュー及び評価をする際にはアカウントが必要となります。</p>
            </div>
            <div className="section">
                <h3>ユーザー情報の編集</h3>
                <p>ログイン後、ページ右上の『マイページ』リンクからマイページに移動して編集してください。</p>
            </div>
        </div>
    )
}
