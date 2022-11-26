import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../misc/components/UIElements/ErrorModal';
import LoadingSpinner from '../../misc/components/UIElements/LoadingSpinner';
import Card from '../../misc/components/UIElements/Card';

import { useHttpClient } from '../../misc/hooks/http-hook';

function Users() {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/users'
                  );
                setLoadedUsers(responseData.users);  
            } catch (err) {
            }
        };
        
        fetchUsers();

    }, [sendRequest]);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <div className='center'>
                    <LoadingSpinner/>
            </div>}
            {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
            {!isLoading && !loadedUsers && <div className="center">
                <Card>
                    <h2>No users found.</h2>
                </Card>
            </div>}
        </React.Fragment>
    );
}

export default Users;