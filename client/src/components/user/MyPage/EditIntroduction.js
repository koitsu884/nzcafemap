import React, { useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ToggleInput from '../../common/ToggleInput';
import {updateProfile} from '../../../actions/myPageActions';
import { maxLength } from '../../../helper/validation';
const maxLength1000 = maxLength(1000);

const EditIntroduction = () => {
    const user = useSelector(state => state.myPage.user);
    const [introduction, setIntroduction] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        if(user)
        {
            setIntroduction(user.introduction);
        }
    }, [user])

    const onUpdate = (name, value) => {
        dispatch(updateProfile({introduction: value}));
    }

    return (
        <div>
            <label>自己紹介(1000文字以内)</label>
            <ToggleInput
                label="自己紹介"
                name="introduction"
                type="textarea"
                value={introduction}
                onUpdate={onUpdate}
                validate={[maxLength1000]}
            />
        </div>
    )
}

export default EditIntroduction
