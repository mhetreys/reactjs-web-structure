import React from 'react';
import { Link } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';

export default class List extends React.Component {
  constructor(props) {
    super(props);

    this.renderInventoryItemRow = this.renderInventoryItemRow.bind(this);
  }

  componentWillMount() {
    this.props.getInventoryList();
  }

  renderInventoryItemRow(inventoryItem, index) {
    const onRemove = () => {
      this.props.deleteInventory(inventoryItem._id, () => {
        toastr.error('', 'Inventory deleted successfully');
      });
    };

    return (
      <tr key={inventoryItem._id}>
        <td>{index + 1}</td>
        <td>{inventoryItem.name}</td>
        <td>
          <button type="button" className="btn btn--danger" onClick={onRemove}>
            Remove
          </button>
        </td>
        <td>
          <Link to={`/r/inventory/edit/${inventoryItem._id}`} className="btn btn--danger">
            Edit Inventory
          </Link>
        </td>
      </tr>
    );
  }

  render() {
    const { inventoryList } = this.props.baseInventory;

    return (
      <div className="createform">
        <div className="createform__title">
          <h3>Inventory List</h3>
        </div>
        <div className="list">
          <div className="list__table">
            <table cellPadding="0" cellSpacing="0">
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Name</th>
                  <th>Action</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {inventoryList.length ? (
                  inventoryList.map(this.renderInventoryItemRow)
                ) : (
                  <tr>
                    <td colSpan="5">No inventory available. Create your first one now!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="list__actions">
          <Link to={'/r/inventory/create'} className="btn btn--danger">
            Create Inventory
          </Link>
        </div>
      </div>
    );
  }
}
