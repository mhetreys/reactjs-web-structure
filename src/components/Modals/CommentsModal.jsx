import React from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import moment from 'moment';

import './index.css';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: '50%',
    transform: 'translate(-50%, -50%)',
  },
};

const CommentTypes = [
  { label: 'Internal', value: 'INTERNAL' },
  { label: 'External', value: 'EXTERNAL' },
];

// Get comment type option from string
const getCommentTypeOption = (value) => {
  for (let i = 0, l = CommentTypes.length; i < l; i += 1) {
    if (CommentTypes[i].value === value) {
      return CommentTypes[i];
    }
  }

  return { value };
};

export default class CommentsModal extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);

    this.state = {
      type: props.commentType,
      comment: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.renderCommentRow = this.renderCommentRow.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.onCommentAdd = this.onCommentAdd.bind(this);
  }

  onTypeChange(option) {
    this.setState({
      type: option.value,
    });
  }

  onCommentAdd(event) {
    event.preventDefault();

    const { comments, onChange, user } = this.props;
    const { comment, type } = this.state;

    comments.push({
      comment,
      timestamp: moment().valueOf(),
      user_id: user.id,
      type,
    });

    onChange(comments);
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleCommentRemove(index) {
    const { comments, onChange } = this.props;

    comments.splice(index, 1);

    onChange(comments);
  }

  renderCommentRow(comment, index) {
    const onRemove = () => {
      this.handleCommentRemove(index);
    };

    return (
      <div>
        {comment.type === this.state.type ? (
          <div className="comment" key={index}>
            <p className="comment__text">{comment.comment}</p>
            <div className="comment__details">
              <p className="comment__details__type">
                {comment.type.toLowerCase()}
                &nbsp;&bull;&nbsp;
              </p>
              <p className="comment__details__date">
                {moment(comment.timestamp).format('DD MMM, YYYY HH:mm')}
              </p>
              <button type="button" className="btn btn--link" onClick={onRemove}>
                Remove
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  render() {
    const { isVisible, comments, onClose } = this.props;
    const { type, comment, CommentType } = this.state;

    return (
      <Modal isOpen={isVisible} style={customStyles} ariaHideApp={false}>
        <div className="modal modal-comments">
          <div className="modal__header">
            <h3>Comments</h3>
          </div>
          <div className="modal__body">
            <div className="modal-comments__list">
              {comments.length ? (
                comments.map(this.renderCommentRow)
              ) : (
                <p className="message message--empty">No comments yet</p>
              )}
            </div>

            <div className="modal-comments__add">
              <h5>Add comment</h5>
              <form onSubmit={this.onCommentAdd}>
                <div className="form-control">
                  <Select
                    className="select"
                    options={CommentTypes}
                    value={getCommentTypeOption(type)}
                    onChange={this.onTypeChange}
                  />
                </div>
                <div className="form-control">
                  <input
                    type="text"
                    name="comment"
                    placeholder="Type something here..."
                    value={comment}
                    onChange={this.handleInputChange}
                  />
                </div>
                <div>
                  <button type="submit" className="btn btn--danger">
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="modal__footer">
            <button type="button" className="btn btn--danger" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}
