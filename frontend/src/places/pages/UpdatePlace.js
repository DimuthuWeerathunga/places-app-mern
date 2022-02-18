import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../shared/components/FormElements/Button';

import Input from '../../shared/components/FormElements/Input';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import Card from '../../shared/components/UIElements/Card';
import './PlaceForm.css';

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

const UpdatePlace = () => {
  const placeId = useParams().placeId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const identifiedPlace = DUMMY_PLACES.find((place) => place.id === placeId);

  useEffect(() => {
    if (identifiedPlace) {
      setFormData(
        {
          title: {
            value: identifiedPlace.title,
            isValid: true,
          },
          description: {
            value: identifiedPlace.description,
            isValid: true,
          },
        },
        true
      );
    }
  }, [setFormData, identifiedPlace]);

  // const placeUpdateSubmitHandler = (event) => {
  //   event.preventDefault();
  // };

  if (!identifiedPlace) {
    return (
      <div className='center'>
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <form className='place-form'>
      <Input
        id='title'
        element='input'
        type='text'
        label='Title'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Please enter valid title'
        onInput={inputHandler}
        value={formState.inputs.title.value}
        valid={formState.inputs.title.isValid}
      ></Input>
      <Input
        id='description'
        element='textarea'
        label='Description'
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText='Please enter a valid description(min. 5 characters long)'
        onInput={inputHandler}
        value={formState.inputs.description.value}
        valid={formState.inputs.description.isValid}
      ></Input>
      <Button type='submit' disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;
