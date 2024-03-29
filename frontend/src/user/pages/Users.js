import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

// const USERS = [
//   {
//     id: 'u1',
//     name: 'Tom Holland',
//     image:
//       'https://www.pinkvilla.com/files/styles/amp_metadata_content_image/public/tom_holland_instagram.jpeg',
//     places: 3,
//   },
// ];

function Users() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users`
        );

        setLoadedUsers(responseData.users);
      } catch (error) {}
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner></LoadingSpinner>
        </div>
      )}
      {loadedUsers && <UsersList items={loadedUsers} />}
    </>
  );
}

export default Users;
