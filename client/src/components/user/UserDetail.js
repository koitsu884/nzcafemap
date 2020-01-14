import React, { useState, useEffect } from 'react';
import client from '../../utils/client';
import Spinner from '../common/Spinner';
import Image from '../common/CloudinaryImage';
import TwitterProfile from './MyPage/TwitterProfile';

const UserDetail = (props) => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const { userId } = props.match.params;
        if (userId) {
            client.get('users/' + userId)
                .then(result => {
                    console.log(result);
                    setUser(result.data);
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => {
                    setLoading(false);
                })
        }
    }, [props.match.params])


    const renderContents = () => {
        if (loading) {
            return <Spinner />
        }
        else if (!user) {
            return <div>No data</div>
        }

        return (
            <div className="userDetail">
                <h1 className="u-margin-bottom-medium">{user.displayName}</h1>
                <div className="u-flex-responsive u-margin-bottom-medium">
                    <div className="userDetail__image">
                        {user.mainPhotoURL ? <Image public_id={user.mainPhotoURL} thumb={true} /> : <div>No Image</div>}
                    </div>
                    {
                        user.twitterId ? <div><h3>Twitter</h3><TwitterProfile profile={user.twitterProfile} /></div> : null
                    }
                </div>
                <div>
                    <h3 className="u-margin-bottom-medium heading--primary">自己紹介文</h3>
                    <div className="u-text-wrap">
                        {user.introduction}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            {renderContents()}
        </div>
    )
}

export default UserDetail
