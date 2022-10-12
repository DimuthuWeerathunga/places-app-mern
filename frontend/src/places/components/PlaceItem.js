import React, { useContext, useState } from 'react';

import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import Map from '../../shared/components/UIElements/Map';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './PlaceItem.css';

const PlaceItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarnignHandler = () => {
    setShowConfirmModal(true);
  };
  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };
  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        'DELETE'
      );
      props.onDelete(props.id);
    } catch (error) {}
  };
  let description = <p>{props.description}</p>;

  if (props.description.includes('blockquote')) {
    // const embeddedCode = props.description.split('</blockquote>');
    // const embeddedCodeBlockQuote = embeddedCode[0] + '</blockquote>';
    // const embeddedCodeScript = embeddedCode[1];
    // const embeddedHtmlEl = document.createElement('div');
    // embeddedHtmlEl.innerHTML = embeddedCodeBlockQuote;
    // description = embeddedHtmlEl;
    description = (
      <div dangerouslySetInnerHTML={{ __html: props.description }}></div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass='place-item__modal-content'
        footerClass='place-item__modal-actions'
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className='map-container'>
          <Map center={props.coordinates} zoom={8}></Map>
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header='Are you sure?'
        footerClass='place-item__modal-actions'
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>Do you want to procede and delete this place</p>
      </Modal>
      <li className='place-item'>
        <Card className='place-item__content'>
          {isLoading && <LoadingSpinner></LoadingSpinner>}
          <div className='place-item__image'>
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
              alt={props.title}
            ></img>
          </div>
          <div className='place-item__info'>
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            {description}
          </div>
          <div className='place-item__actions'>
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarnignHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
