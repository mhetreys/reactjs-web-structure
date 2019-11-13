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

// Get column option from string
const getColumnOption = (value) => {
  for (let i = 0, l = ColumnTypes.length; i < l; i += 1) {
    if (ColumnTypes[i].value === value) {
      return ColumnTypes[i];
    }
  }

  return { value };
};

const getDefaultColumns = () => {
  return [
    {
      column_name: '',
      column_type: getColumnOption('TEXT'),
      order_id: 1,
    },
    {
      column_name: '',
      column_type: getColumnOption('TEXT'),
      order_id: 2,
    },
  ];
};

export default class CreateChecklistTemplate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checklist_type: 'supplier',
      checklist_name: '',
      is_template: 'false',
      checklist_columns: getDefaultColumns(),
      showOptionModal: false,
      columnOptions: [''],
      columnInfo: {},
      static_column_values: {
        '1': [
          {
            row_id: 1,
            cell_value: '',
            disabled: false,
          },
        ],
        '2': [
          {
            row_id: 1,
            cell_value: '',
            disabled: true,
          },
        ],
      },
      existingChecklistOptions: [],
      selectedChecklist: {},
      isMaxColumnsReached: false,
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
    this.handleSelectChecklist = this.handleSelectChecklist.bind(this);
    this.handleStaticColumnChange = this.handleStaticColumnChange.bind(this);
  }

  componentWillMount() {
    if (!this.props.match.params.supplierId) {
      this.setState({
        checklist_type: 'campaign',
      });
    }
    this.props.getChecklistTemplate();
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;

    if (
      !prevProps.checklist.templateCreateStatus &&
      this.props.checklist.templateCreateStatus === 'success'
    ) {
      toastr.success('', 'Checklist created successfully');
      if (this.state.checklist_type === 'supplier') {
        this.props.history.push(
          `/r/checklist/list/${match.params.campaignId}/${match.params.supplierId}`
        );
      } else {
        this.props.history.push(`/r/checklist/list/${match.params.campaignId}`);
      }
    } else if (
      !prevProps.checklist.templateCreateStatus &&
      this.props.checklist.templateCreateStatus === 'error'
    ) {
      toastr.error('', 'Could not create checklist. Please try again later.');
    }

    if (this.state.existingChecklistOptions.length !== this.props.checklist.templateList.length) {
      let checklistOptions = [];
      this.props.checklist.templateList.forEach((checklist) => {
        checklistOptions.push({
          value: checklist.checklist_info.checklist_id,
          label: checklist.checklist_info.checklist_name,
        });
      });
      this.setState({
        existingChecklistOptions: checklistOptions,
      });
    }
  }

  onBack() {
    const { match } = this.props;

    if (this.state.checklist_type === 'supplier') {
      this.props.history.push(
        `/r/checklist/list/${match.params.campaignId}/${match.params.supplierId}`
      );
    } else {
      this.props.history.push(`/r/checklist/list/${match.params.campaignId}`);
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

  onAddRow() {
    const rows = Object.assign({}, this.state.static_column_values);

    let columnLength = Object.values(rows).length;
    let rowLength = rows['1'].length;

    for (let i = 0; i < columnLength; i++) {
      rows[i + 1].push({
        row_id: rowLength + 1,
        cell_value: '',
        disabled: i === 0 ? false : true,
      });
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
          });
        } else {
          rows[checklistColumns.length + 1] = [
            {
              row_id: i + 1,
              cell_value: '',
              disabled: true,
            },
          ];
        }
      }

      checklistColumns.push({
        column_name: '',
        column_type: 'TEXT',
        order_id: checklistColumns.length + 1,
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

    for (let i = 0; i < Object.values(rows).length; i++) {
      rows[i + 1].splice(index, 1);
      for (let j = 0; j < rows[i + 1].length; j++) {
        rows[i + 1][j].row_id = j + 1;
      }
    }

    this.setState({
      static_column_values: rows,
    });
  }

  onColumnRemove(index) {
    const rows = this.state.static_column_values;
    const checklistColumns = this.state.checklist_columns.slice();

    checklistColumns.splice(index, 1);

    if (!checklistColumns.length) {
      checklistColumns.concat(getDefaultColumns());
    }

    for (let i = index + 1; i <= Object.values(rows).length; i++) {
      rows[i] = rows[i + 1];
    }

    delete rows[Object.values(rows).length];

    for (let i = 0; i < checklistColumns.length; i++) {
      checklistColumns[i].order_id = i + 1;
    }

    this.setState({
      checklist_columns: checklistColumns,
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
      column_type: columnInfo.columnType,
      column_options: options,
    });
    this.handleColumnChange(newColumn, columnInfo.columnIndex);
  }

  onSubmit(event) {
    event.preventDefault();

    let error = false;
    let checklist_columns = this.state.checklist_columns;
    checklist_columns.forEach((item) => {
      if (typeof item.column_type !== 'string') {
        item.column_type = item.column_type.value;
      }
    });

    let staticRowData = Object.assign({}, this.state.static_column_values),
      staticDataError = false;
    let staticRowKeys = Object.keys(staticRowData);

    staticRowKeys.forEach((i) => {
      staticRowData[i] = staticRowData[i].filter((staticData) => {
        if (staticData.disabled) {
          return false;
        } else {
          if (staticData.cell_value === '') {
            staticDataError = true;
          } else {
            delete staticData.disabled;
          }
          return true;
        }
      });

      if (!staticRowData[i].length) {
        delete staticRowData[i];
      }
    });

    if (staticDataError) {
      toastr.error('', 'Please fill all the static data input field');
      return;
    }

    const data = {
      checklist_name: this.state.checklist_name,
      checklist_type: this.state.checklist_type,
      supplier_id: this.props.match.params.supplierId,
      is_template: this.state.is_template === 'true' ? true : false,
      checklist_columns,
      static_column_values: staticRowData,
    };

    data.checklist_columns.forEach((column) => {
      if (!column.column_type) {
        error = true;
        toastr.error('', 'Please select column type for each column');
        return false;
      }
    });

    if (error) {
      return;
    }

    // Send request to create template
    this.props.postChecklistTemplate({
      campaignId: this.props.match.params.campaignId,
      data,
    });
  }

  handleStaticColumnChange(event, columnIndex) {
    let rows = Object.assign({}, this.state.static_column_values);

    for (let i = 0; i < rows[columnIndex + 1].length; i++) {
      rows[columnIndex + 1][i].disabled = !event.target.checked;
    }

    this.setState({
      static_column_values: rows,
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
      if (item.value !== 'TEXT') {
        let rows = Object.assign({}, this.state.static_column_values);
        if (rows[columnIndex + 1][0].disabled === false) {
          toastr.error('', 'Cannot change type for Static Columns');
          return;
        }
      }
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
        column_type: item,
      });

      this.handleColumnChange(newColumn, columnIndex);
    };

    const onRemove = () => {
      this.onColumnRemove(columnIndex);
    };

    return (
      <div className="createform__form__column" key={`col-${columnIndex}`}>
        <div className="createform__form__inline column-data">
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
                value={
                  typeof column.column_type === 'object'
                    ? column.column_type
                    : getColumnOption(column.column_type)
                }
                onChange={onColumnTypeChange}
              />
              <div>
                {columnIndex !== 0 ? (
                  <div className="checkbox-data">
                    <input
                      className="input-checkbox"
                      type="checkbox"
                      onClick={(event) => this.handleStaticColumnChange(event, columnIndex)}
                    />

                    <p className="main-text">
                      Static Data
                      <em>(Field entered in static column cannot be changed later)</em>
                    </p>
                  </div>
                ) : (
                  undefined
                )}
                {columnIndex > 1 ? (
                  <button type="button" className="btn btn--danger" onClick={onRemove}>
                    Remove column
                  </button>
                ) : (
                  undefined
                )}{' '}
                {column.column_type &&
                (column.column_type.value === 'RADIO' || column.column_type.value === 'SELECT') ? (
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
      </div>
    );
  }

  handleSelectChecklist(selectedChecklist) {
    this.setState({
      selectedChecklist,
    });

    let { checklist } = this.props;

    checklist.templateList.forEach((checklist) => {
      if (checklist.checklist_info.checklist_id === selectedChecklist.value) {
        this.setState({
          checklist_columns: checklist.column_headers,
          static_column_values: checklist.row_headers,
        });
        return;
      }
    });
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
                    value={
                      static_value[columnIndex + 1] && static_value[columnIndex + 1][rowIndex]
                        ? static_value[columnIndex + 1][rowIndex].cell_value
                        : ''
                    }
                    onChange={(event) => this.handleRowChange(event, columnIndex, rowIndex)}
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
        {rowIndex > 0 ? (
          <div className="form-action">
            <button type="button" className="btn btn--link" onClick={onRemove}>
              &times;
            </button>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }

  render() {
    return (
      <div className="createform">
        <div className="createform__title">
          <h3>Create Checklist Form</h3>
        </div>
        <div className="createform__form">
          <form onSubmit={this.onSubmit}>
            <div className="createform__form__inline">
              <div className="form-control">
                <label>*Select from existing checklist template</label>
                <Select
                  options={this.state.existingChecklistOptions}
                  value={this.state.selectedChecklist}
                  onChange={this.handleSelectChecklist}
                />
              </div>
            </div>
            <div className="createform__form__inline">
              <div className="form-control">
                <label>*Enter Name For Checklist Form</label>
                <input
                  type="text"
                  name="checklist_name"
                  value={this.state.checklist_name}
                  onChange={this.handleInputChange}
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
                      value={this.state.is_template}
                      onChange={this.handleInputChange}
                    />
                  </td>
                  <td>Is it template?</td>
                </tr>
              </tbody>
            </table>
            <div className="createform__form__header">
              {this.state.checklist_columns.map(this.renderChecklistColumn)}
            </div>
            {this.state.static_column_values['1'].map(this.renderChecklistRow)}
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
