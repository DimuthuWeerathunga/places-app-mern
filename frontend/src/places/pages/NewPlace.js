import React from 'react';
import { useCallback } from 'react';

import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
import './NewPlace.css';

function NewPlace() {
  const titleInputHandler = useCallback((id, value, isValid) => {}, []);

  return (
    <form className='place-form'>
      <Input
        id='title'
        element='input'
        type='text'
        label='Title'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Please enter a valid title'
        onInput={titleInputHandler}
      ></Input>
      <Input
        id='description'
        element='input'
        type='text'
        label='Title'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Please enter a valid title'
        onInput={titleInputHandler}
      ></Input>
    </form>
  );
}

export default NewPlace;
