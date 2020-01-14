import React from 'react';
// import { useSelector } from 'react-redux';

const TwitterProfile = ({profile}) => {
    // const user = useSelector(state => state.myPage.user);

    // if (!user) return <div>Loading...</div>;
    if(!profile) return null;

    return (
        <div className="twitterProfile">
            <a className="twitterProfile__header" href={`https://twitter.com/${profile.userName}`}>
                {
                    profile.imageUrl
                        ? <div className="twitterProfile__header__image">
                            <img src={profile.imageUrl} alt="Profile" />
                        </div>
                        : null
                }
                <div>
                    <div >{profile.displayName}</div>
                    {/* <div>({user.twitterId})</div> */}
                </div>
            </a>
            <hr />
            <div className="twitterProfile__content">
                {profile.description}
            </div>
        </div>
    )
}

export default TwitterProfile
