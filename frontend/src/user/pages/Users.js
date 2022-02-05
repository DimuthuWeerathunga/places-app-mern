import React from 'react';
import UsersList from '../components/UsersList';

function Users() {
  const USERS = [
    {
      id: 'u1',
      name: 'Tom Holland',
      image:
        'https://www.pinkvilla.com/files/styles/amp_metadata_content_image/public/tom_holland_instagram.jpeg',
      places: 3,
    },
  ];
  return <UsersList items={USERS} />;
}

export default Users;
