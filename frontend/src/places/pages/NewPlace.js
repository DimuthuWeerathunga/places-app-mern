import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';

function NewPlace() {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearEror } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      address: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    // send this to the backend
    try {
      await sendRequest(
        'http://localhost:8000/api/places',
        'POST',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          creator: auth.userId,
        }),
        { 'Content-Type': 'application/json' }
      );
      // Redirect the user to a different page
      history.push('/');
    } catch (error) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearEror}></ErrorModal>
      <form className='place-form' onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
        <Input
          id='title'
          element='input'
          type='text'
          label='Title'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a valid title'
          onInput={inputHandler}
        ></Input>

        <Input
          id='description'
          element='textarea'
          type='text'
          label='Description'
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText='Please enter a valid description(at least 5 characters long)'
          onInput={inputHandler}
        ></Input>
        <Input
          id='address'
          element='input'
          type='text'
          label='Address'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a valid address'
          onInput={inputHandler}
        ></Input>
        <Button type='submit' disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  );
}

export default NewPlace;
