import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import UserItem from './UserItem';
import './UsersList.css';

function UsersList(props) {
  if (props.items.length === 0) {
    return (
      <div className='centered'>
        <Card>
          <h2>No users found</h2>
        </Card>
      </div>
    );
  }
  return (
    <ul className='users-list'>
      {props.items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places}
        ></UserItem>
      ))}
    </ul>
  );
}

export default UsersList;
