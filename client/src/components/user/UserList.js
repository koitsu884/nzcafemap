import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../utils/client';
import Alert from '../../helper/Alert';
import Spinner from '../common/Spinner';
import Pagination from '../common/Pagination';
import UserCard from './UserCard';

const DEFAULT_PAGE_SIZE = 10;

const UserList = () => {
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemCount, setItemCount] = useState(0);

    useEffect(() => {
        setLoading(true);
        client.get('/users', { params:{
            page:currentPage,
            pageSize:DEFAULT_PAGE_SIZE
        }})
            .then(result => {
                setUserList(result.data.users);
                setItemCount(result.data.totalCount);
            })
            .catch(error => {
                console.log(error);
                Alert.error(error);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [currentPage])

    const handlePageClick = selectedPage => {
        // dispatch(changePage(selectedPage));
        setCurrentPage(selectedPage);
    }

    const renderUserList = () => {
        if(loading) return <Spinner />

        return userList.map(user => {
            return <Link to={`/users/${user._id}`} key={user._id} className="userList__item"><UserCard user={user} /></Link>
        })
    }

    return (
        <div className="container">
            <h1>レビュアー一覧</h1>
            <div className="userList">
                {renderUserList()}
            </div>
            <Pagination
                itemCount={itemCount}
                pageSize={DEFAULT_PAGE_SIZE}
                onPageChange={handlePageClick}
                className='bg-secondary-light'
            />
        </div>
    )
}

export default UserList
