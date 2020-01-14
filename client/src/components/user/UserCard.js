import React from 'react'
import PropTypes from 'prop-types'

import SvgTwitter from '../common/SvgIcons/SvgTwitter';
import Image from '../common/CloudinaryImage';

const UserCard = ({user}) => {
    return (
        <div className="userCard">
            <div className="userCard__image">
            {user.mainPhotoURL ? <Image public_id={user.mainPhotoURL} thumb={true} /> : <div>No Image</div>}
            </div>
            <div className="userCard__content">
                <div className="userCard__name">{user.displayName}</div>
                {
                    user.twitterId ? 
                    <SvgTwitter className="userCard__twitter" />
                    : null
                }
            </div>
        </div>
    )
}

UserCard.propTypes = {
    user: PropTypes.object.isRequired
}

export default UserCard
