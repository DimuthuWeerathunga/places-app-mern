import React from 'react';
import { useParams } from 'react-router-dom';
import PlaceList from '../components/PlaceList';

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire state building',
    description: 'One of the most famous sky scrapers in the world',
    imageUrl:
      'https://www.thoughtco.com/thmb/Vc_NzNjjvF7WufBlHVKnRPNeFmo=/2000x1333/filters:fill(auto,1)/187410874_HighRes-resize-56a48d293df78cf77282efa6.jpg',
    address: '20 W 34th St, New York, NY 10001, United States',
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: 'u1',
  },
  {
    id: 'p2',
    title: 'Empire state building',
    description: 'One of the most famous sky scrapers in the world',
    imageUrl:
      'https://www.thoughtco.com/thmb/Vc_NzNjjvF7WufBlHVKnRPNeFmo=/2000x1333/filters:fill(auto,1)/187410874_HighRes-resize-56a48d293df78cf77282efa6.jpg',
    address: '20 W 34th St, New York, NY 10001, United States',
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: 'u2',
  },
];
const UserPlaces = () => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);

  return <PlaceList items={loadedPlaces}></PlaceList>;
};

export default UserPlaces;
