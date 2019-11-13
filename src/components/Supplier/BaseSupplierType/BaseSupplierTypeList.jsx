import React from 'react';
import { Link } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';

export default class List extends React.Component {
  constructor(props) {
    super(props);

    this.renderBaseSupplierTypeRow = this.renderBaseSupplierTypeRow.bind(this);
  }

  componentWillMount() {
    this.props.getBaseSupplierTypeList();
  }

  renderBaseSupplierTypeRow(baseSupplierType, index) {
    const onRemove = () => {
      this.props.deleteBaseSupplierType(baseSupplierType.id, () => {
        toastr.error('', 'Base Supplier Type deleted successfully');
      });
    };

    return (
      <tr key={baseSupplierType.id}>
        <td>{index + 1}</td>
        <td>{baseSupplierType.name}</td>
        <td>
          <button type="button" className="btn btn--danger" onClick={onRemove}>
            Remove
          </button>
        </td>
        <td>
          <Link
            to={`/r/supplier/base-type/edit/${baseSupplierType.id}`}
            className="btn btn--danger"
          >
            Edit Base Supplier Type
          </Link>
        </td>
      </tr>
    );
  }

  render() {
    let { baseSupplierTypeList } = this.props.baseSupplierType;
    return (
      <div className="createform">
        <div className="createform__title">
          <h3>Standard Template List</h3>
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
                {baseSupplierTypeList.length ? (
                  baseSupplierTypeList.map(this.renderBaseSupplierTypeRow)
                ) : (
                  <tr>
                    <td colSpan="5">
                      No base supplier types available. Create your first one now!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="list__actions">
          <Link to={'/r/supplier/base-type/create'} className="btn btn--danger">
            Create Base Supplier Type
          </Link>
        </div>
      </div>
    );
  }
}
