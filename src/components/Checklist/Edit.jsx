import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { toastr } from 'react-redux-toastr';

import OptionModal from '../Modals/OptionModal';

import './index.css';

const MAX_COLUMNS = 100;
const ColumnTypes = [
  { value: 'TEXT', label: 'Textbox' },
  { value: 'BOOLEAN', label: 'Checkbox' },
  { value: 'DATETIME', label: 'Date Time' },
  { value: 'RATING', label: 'Rating' },
  { value: 'NUMBER', label: 'Number' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'RADIO', label: 'Radio' },
  { value: 'SELECT', label: 'Select' },
];

const getColumnOption = (value) => {
  for (let i = 0, l = ColumnTypes.length; i < l; i += 1) {
    if (ColumnTypes[i].value === value) {
      return ColumnTypes[i];
    }
  }

  return { value };
};

export default class CreateChecklistTemplate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checklist_name: '',
      checklist_columns: [],
      static_column_values: {},
      is_template: false,
      isMaxColumnsReached: false,
      showOptionModal: false,
      columnOptions: [''],
      columnInfo: {},
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.renderChecklistColumn = this.renderChecklistColumn.bind(this);
    this.renderChecklistRow = this.renderChecklistRow.bind(this);
    this.handleRowChange = this.handleRowChange.bind(this);
    this.handleColumnChange = this.handleColumnChange.bind(this);
    this.onAddRow = this.onAddRow.bind(this);
    this.onAddColumn = this.onAddColumn.bind(this);
    this.onRowRemove = this.onRowRemove.bind(this);
    this.onColumnRemove = this.onColumnRemove.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onCancelOptionModal = this.onCancelOptionModal.bind(this);
    this.onSubmitOptionModal = this.onSubmitOptionModal.bind(this);
    this.onOpenOptionModal = this.onOpenOptionModal.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;

    this.props.getSingleChecklistStart();
    this.props.getSingleChecklist({
      checklistId: match.params.checklistId,
    });
    this.props.updateChecklistTemplateStart();
  }

  componentDidUpdate(prevProps) {
    const { match, checklist } = this.props;
    const checklistDetails = checklist.details[match.params.checklistId];

    if (checklistDetails && +match.params.checklistId !== this.state.checklist_id) {
      this.setState({
        checklist_id: checklist.details[match.params.checklistId].checklist_info.checklist_id,
        checklist_name: checklist.details[match.params.checklistId].checklist_info.checklist_name,
        is_template: checklist.details[match.params.checklistId].checklist_info.is_template,
        checklist_columns: checklist.details[match.params.checklistId].column_headers,
        static_column_values: checklist.details[match.params.checklistId].row_headers,
      });
    }

    if (!prevProps.checklist.templateUpdateStatus && checklist.templateUpdateStatus === 'success') {
      toastr.success('', 'Checklist updated successfully');
      if (
        checklist.details[match.params.checklistId].checklist_info.checklist_type === 'supplier'
      ) {
        this.props.history.push(
          `/r/checklist/list/${
            checklist.details[match.params.checklistId].checklist_info.campaign_id
          }/${checklist.details[match.params.checklistId].checklist_info.supplier_id}`
        );
      } else {
        this.props.history.push(
          `/r/checklist/list/${
            checklist.details[match.params.checklistId].checklist_info.campaign_id
          }`
        );
      }
    } else if (
      !prevProps.checklist.templateUpdateStatus &&
      this.props.checklist.templateUpdateStatus === 'error'
    ) {
      toastr.error('', 'Could not update checklist. Please try again later.');
    }
  }

  onBack() {
    const { match, checklist } = this.props;
    if (checklist.details[match.params.checklistId].checklist_info.checklist_type === 'supplier') {
      this.props.history.push(
        `/r/checklist/list/${
          checklist.details[match.params.checklistId].checklist_info.campaign_id
        }/${checklist.details[match.params.checklistId].checklist_info.supplier_id}`
      );
    } else {
      this.props.history.push(
        `/r/checklist/list/${
          checklist.details[match.params.checklistId].checklist_info.campaign_id
        }`
      );
    }
  }

  handleInputChange(event) {
    if (event.target.type === 'checkbox') {
      event.target.value = event.target.checked ? true : false;
    }
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleColumnChange(column, index) {
    const checklistColumns = this.state.checklist_columns.slice();

    checklistColumns.splice(index, 1, column);

    this.setState({
      checklist_columns: checklistColumns,
    });
  }

  handleRowChange(event, columnIndex, rowIndex) {
    let rows = Object.assign({}, this.state.static_column_values);

    rows[columnIndex + 1][rowIndex].cell_value = event.target.value;

    this.setState({
      static_column_values: rows,
    });
  }

  onOpenOptionModal(options, columnType, column, columnIndex) {
    this.setState({
      showOptionModal: true,
      columnOptions: options,
      columnInfo: {
        columnType,
        column,
        columnIndex,
      },
    });
  }

  onCancelOptionModal() {
    this.setState({
      showOptionModal: false,
      columnOptions: [''],
      columnInfo: {},
    });
  }

  onSubmitOptionModal(options, columnInfo) {
    this.setState({
      showOptionModal: false,
      columnOptions: [''],
      columnInfo: {},
    });

    let newColumn = Object.assign({}, columnInfo.column, {
      column_type: columnInfo.columnType.value
        ? columnInfo.columnType.value
        : columnInfo.columnType,
      column_options: options,
    });
    this.handleColumnChange(newColumn, columnInfo.columnIndex);
  }

  onAddRow() {
    const rows = Object.assign({}, this.state.static_column_values);

    let columnLength = Object.values(rows).length;
    let rowLength = rows['1'].length;

    for (let i = 0; i < columnLength; i++) {
      if (rows[i + 1]) {
        rows[i + 1].push({
          row_id: rowLength + 1,
          cell_value: '',
          disabled: i === 0 ? false : true,
          status: 'create',
        });
      }
    }

    this.setState({
      static_column_values: rows,
    });
  }

  onAddColumn() {
    const checklistColumns = this.state.checklist_columns.slice();

    if (checklistColumns.length < MAX_COLUMNS) {
      const rows = Object.assign({}, this.state.static_column_values);

      for (let i = 0; i < rows['1'].length; i++) {
        if (rows[checklistColumns.length + 1]) {
          rows[checklistColumns.length + 1].push({
            row_id: i + 1,
            cell_value: '',
            disabled: true,
            status: 'create',
          });
        } else {
          rows[checklistColumns.length + 1] = [
            {
              row_id: i + 1,
              cell_value: '',
              disabled: true,
              status: 'create',
            },
          ];
        }
      }

      checklistColumns.push({
        column_name: '',
        column_type: 'TEXT',
        order_id: checklistColumns.length + 1,
        status: 'create',
      });

      this.setState({
        static_column_values: rows,
        checklist_columns: checklistColumns,
      });
    } else {
      this.setState({
        isMaxColumnsReached: true,
      });
    }
  }

  onRowRemove(index) {
    const rows = Object.assign({}, this.state.static_column_values);
    const deleteRows = this.state.delete_rows ? this.state.delete_rows : [];

    if (rows[index].status !== 'create') {
      deleteRows.push(index + 1);
    }

    for (let i = 0; i < Object.values(rows).length; i++) {
      rows[i + 1].splice(index, 1);
      for (let j = 0; j < rows[i + 1].length; j++) {
        rows[i + 1][j].row_id = j + 1;
      }
    }

    this.setState({
      static_column_values: rows,
      delete_rows: deleteRows,
    });
  }

  onColumnRemove(index) {
    const rows = this.state.static_column_values;
    const checklistColumns = this.state.checklist_columns.slice();
    let deleteColumns = this.state.delete_columns ? this.state.delete_columns : [];

    if (checklistColumns[index].status !== 'create') {
      deleteColumns.push(checklistColumns[index].column_id);
    }

    checklistColumns.splice(index, 1);

    if (!checklistColumns.length) {
      checklistColumns.concat(this.state.checklist_columns);
    }

    for (let i = index + 1; i <= Object.values(rows).length; i++) {
      rows[i] = rows[i + 1];
    }

    delete rows[Object.values(rows).length];

    this.setState({
      checklist_columns: checklistColumns,
      delete_columns: deleteColumns,
      static_column_values: rows,
    });
  }

  onSubmit(event) {
    event.preventDefault();

    let new_checklist_columns = [];
    let new_static_column_values = {};
    let templateValue = this.state.is_template;

    if (typeof templateValue === 'string') {
      templateValue = templateValue === 'true' ? true : false;
    }

    let staticRowData = Object.assign({}, this.state.static_column_values),
      staticDataError = false;

    let staticRowKeys = Object.keys(staticRowData);

    staticRowKeys.forEach((i) => {
      if (staticRowData[i]) {
        staticRowData[i] = staticRowData[i].filter((staticData) => {
          let rowFlag = true;
          let newRowFlag = false;
          if (staticData.status === 'create' && !staticData.disabled) {
            delete staticData.status;
            staticData.order_id = staticData.row_id;
            delete staticData.row_id;
            newRowFlag = true;
            rowFlag = false;
          }
          if (staticData.disabled) {
            rowFlag = false;
          } else {
            if (staticData.cell_value === '') {
              staticDataError = true;
            } else {
              delete staticData.disabled;
            }
          }
          if (newRowFlag) {
            if (new_static_column_values[i]) {
              new_static_column_values[i].push(staticData);
            } else {
              new_static_column_values[i] = [staticData];
            }
          }
          return rowFlag;
        });

        if (!staticRowData[i].length) {
          delete staticRowData[i];
        }
      }
    });

    const data = {
      is_template: templateValue,
      checklist_columns: this.state.checklist_columns.filter((item) => {
        let newColumnFlag = true;
        if (item.status === 'create') {
          newColumnFlag = false;
          delete item.status;
          new_checklist_columns.push(item);
        }
        return newColumnFlag;
      }),
      static_column_values: staticRowData,
    };
    data.new_checklist_columns = new_checklist_columns;
    data.new_static_column_values = new_static_column_values;
    data.delete_rows = this.state.delete_rows;
    data.delete_columns = this.state.delete_columns;
    if (staticDataError) {
      toastr.error('', 'Please fill all the static data input field');
      return;
    }

    // Send request to create template
    this.props.updateChecklistTemplate({
      checklistId: this.props.match.params.checklistId,
      data,
    });
  }

  renderChecklistColumn(column, columnIndex) {
    const onColumnNameChange = (event) => {
      const newColumn = Object.assign({}, column, {
        column_name: event.target.value,
      });

      this.handleColumnChange(newColumn, columnIndex);
    };

    const onColumnTypeChange = (item) => {
      if (item.value === 'RADIO' || item.value === 'SELECT') {
        this.setState({
          showOptionModal: true,
          columnOptions: [''],
          columnInfo: {
            columnType: item,
            column,
            columnIndex,
          },
        });
        return;
      }
      const newColumn = Object.assign({}, column, {
        column_type: item.value,
      });

      this.handleColumnChange(newColumn, columnIndex);
    };

    const onRemove = () => {
      this.onColumnRemove(columnIndex);
    };

    return (
      <div className="createform__form__column" key={`col-${columnIndex}`}>
        <div className="createform__form__inline">
          <div className="form-control">
            <div>
              <input
                type="text"
                placeholder="Column Name"
                value={column.column_name}
                onChange={onColumnNameChange}
              />
              <Select
                options={ColumnTypes}
                classNamePrefix="form-select"
                value={getColumnOption(column.column_type)}
                onChange={onColumnTypeChange}
              />
              {columnIndex > 1 ? (
                <button type="button" className="btn btn--danger" onClick={onRemove}>
                  Remove column
                </button>
              ) : (
                undefined
              )}{' '}
              {column.column_type &&
              (column.column_type === 'RADIO' || column.column_type === 'SELECT') ? (
                <button
                  type="button"
                  className="btn btn--danger"
                  onClick={() =>
                    this.onOpenOptionModal(
                      column.column_options,
                      column.column_type,
                      column,
                      columnIndex
                    )
                  }
                >
                  Show Options
                </button>
              ) : (
                undefined
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderChecklistRow(row, rowIndex) {
    const onRemove = () => {
      this.onRowRemove(rowIndex);
    };
    let static_value = Object.assign({}, this.state.static_column_values);

    return (
      <div className="createform__form__row" key={`row-${rowIndex}`}>
        {this.state.checklist_columns.map((column, columnIndex) => {
          return (
            <div className="createform__form__column" key={`row-${rowIndex}-column-${columnIndex}`}>
              <div className="createform__form__inline">
                <div className="form-control">
                  <input
                    type="text"
                    placeholder="Static Data"
                    onChange={(event) => this.handleRowChange(event, columnIndex, rowIndex)}
                    value={
                      static_value[columnIndex + 1] && static_value[columnIndex + 1][rowIndex]
                        ? static_value[columnIndex + 1][rowIndex].cell_value
                        : ''
                    }
                    disabled={
                      static_value[columnIndex + 1] && static_value[columnIndex + 1][rowIndex]
                        ? static_value[columnIndex + 1][rowIndex].disabled
                        : true
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}
        <div className="form-action">
          <button type="button" className="btn btn--link" onClick={onRemove}>
            &times;
          </button>
        </div>
      </div>
    );
  }

  render() {
    let templateValue = this.state.is_template;
    if (typeof templateValue === 'string') {
      templateValue = templateValue === 'true' ? true : false;
    }

    return (
      <div className="createform">
        <div className="createform__title">
          <h3>Edit Checklist Form</h3>
        </div>
        <div className="createform__form">
          <form onSubmit={this.onSubmit}>
            <div className="createform__form__inline">
              <div className="form-control">
                <label>*Checklist Form</label>
                <input
                  type="text"
                  name="checklist_name"
                  value={this.state.checklist_name}
                  disabled
                />
              </div>
            </div>
            <table>
              <tbody>
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      className="input-checkbox"
                      name="is_template"
                      checked={templateValue}
                      onChange={this.handleInputChange}
                    />
                  </td>
                  <td>Is it template?</td>
                </tr>
              </tbody>
            </table>
            <div className="createform__form__header">
              {this.state.checklist_columns.length
                ? this.state.checklist_columns.map(this.renderChecklistColumn)
                : undefined}
            </div>
            {this.state.static_column_values['1']
              ? this.state.static_column_values['1'].map(this.renderChecklistRow)
              : undefined}
            <div className="createform__form__inline">
              <div className="createform__form__action">
                <button type="button" className="btn btn--danger" onClick={this.onAddRow}>
                  Add Row
                </button>
              </div>
              <div className="createform__form__action">
                <button
                  type="button"
                  className="btn btn--danger"
                  onClick={this.onAddColumn}
                  disabled={this.state.isMaxColumnsReached}
                >
                  Add Column
                </button>
              </div>
              <div className="createform__form__action">
                <button type="submit" className="btn btn--danger">
                  Submit
                </button>
              </div>

              <div className="createform__form__action">
                <button type="button" className="btn btn--danger" onClick={this.onBack}>
                  Back
                </button>
              </div>
            </div>
            {this.state.isMaxColumnsReached ? (
              <p className="message message--error">
                Sorry! You can add a maximum of {MAX_COLUMNS} columns
              </p>
            ) : (
              undefined
            )}
          </form>
        </div>
        <OptionModal
          showOptionModal={this.state.showOptionModal}
          onCancel={this.onCancelOptionModal}
          onSubmit={this.onSubmitOptionModal}
          options={this.state.columnOptions}
          columnInfo={this.state.columnInfo}
        />
      </div>
    );
  }
}

CreateChecklistTemplate.defaultProps = {
  postChecklistTemplate: () => {},
};

CreateChecklistTemplate.propTypes = {
  postChecklistTemplate: PropTypes.func,
};
