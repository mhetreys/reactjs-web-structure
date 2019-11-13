import React from 'react';
import { Link } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';

export default class List extends React.Component {
  constructor(props) {
    super(props);

    this.renderSupplierTypeRow = this.renderSupplierTypeRow.bind(this);
  }

  componentWillMount() {
    this.props.getSupplierTypeList();
  }

  renderSupplierTypeRow(supplierType, index) {
    const onRemove = () => {
      this.props.deleteSupplierType(supplierType.id, () => {
        toastr.error('', 'Supplier Type deleted successfully');
      });
    };

    return (
      <tr key={supplierType.id}>
        <td>{index + 1}</td>
        <td>{supplierType.name}</td>
        <td>
          <button type="button" className="btn btn--danger" onClick={onRemove}>
            Remove
          </button>
        </td>
        <td>
          <Link to={`/r/supplier/type/edit/${supplierType.id}`} className="btn btn--danger">
            Edit Supplier Type
          </Link>
        </td>
      </tr>
    );
  }

  render() {
    let { supplierTypeList } = this.props.supplierType;
    return (
      <div className="createform">
        <div className="createform__title">
          <h3>Supplier Template</h3>
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
                {supplierTypeList.length ? (
                  supplierTypeList.map(this.renderSupplierTypeRow)
                ) : (
                  <tr>
                    <td colSpan="5">No supplier types available. Create your first one now!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="list__actions">
          <Link to={'/r/supplier/type/create'} className="btn btn--danger">
            Create Supplier Type
          </Link>
        </div>
      </div>
    );
  }
}
