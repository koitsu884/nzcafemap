import React from 'react';
import { useSelector } from 'react-redux';

const TwitterProfile = () => {
    const user = useSelector(state => state.myPage.user);

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <a className="twitterProfile" href={`https://twitter.com/${user.twitterProfile.userName}`}>
                {
                    user.twitterProfile.imageUrl
                        ? <div className="twitterProfile__image">
                            <img src={user.twitterProfile.imageUrl} alt="Profile" />
                        </div>
                        : null
                }
                <div>
                    <div >{user.twitterProfile.displayName}</div>
                    <div>({user.twitterId})</div>
                </div>
            </a>
        </div>
    )
}

export default TwitterProfile
