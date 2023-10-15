const Modal = (props) => {
  return (
    <div className="modal-container">
      <div className="modal-2">
        <h1>{props.cameraDetected}</h1>
        <button className="modal-button" onClick={props.reset}>
          OK
        </button>
      </div>
    </div>
  );
};

export default Modal;
