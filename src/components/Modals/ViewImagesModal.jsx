import React from 'react';
import Modal from 'react-modal';
import ImageGallery from 'react-image-gallery';

import './index.css';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: '50%',
    maxHeight: '500px',
    transform: 'translate(-50%, -50%)',
  },
};

export default function ViewImageModal({ isVisible, onClose, item }) {
  const url = 'https://s3.ap-northeast-1.amazonaws.com/androidtokyo/';
  const { inventory_images } = item;
  const imagesArray = (inventory_images || []).map((image) => ({
    original: `${url}${image.image_path}`,
    originalClass: 'originalStyle',
  }));
  return (
    <Modal isOpen={isVisible} style={customStyles} ariaHideApp={false}>
      <div className="modal modal-view-image">
        <div className="modal__body">
          {inventory_images && inventory_images.length ? (
            <ImageGallery
              items={imagesArray}
              showPlayButton={false}
              showFullscreenButton={false}
              showThumbnails={false}
            />
          ) : (
            <p className="message message--empty ">No images available.</p>
          )}
        </div>
        <div className="modal__action">
          <button type="button" className="btn btn--link" onClick={onClose}>
            &#10005;
          </button>
        </div>
      </div>
    </Modal>
  );
}
