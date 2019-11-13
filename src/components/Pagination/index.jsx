import React from 'react';
import ReactPaginate from 'react-paginate';

const Pagination = (props) => {
  const { pageSize, totalItems, handlePageClick } = props;
  const numOfPages = Math.ceil(totalItems / pageSize);
  if (numOfPages <= 1) return null;
  return (
    <ReactPaginate
      pageCount={numOfPages}
      initialPage={0}
      onPageChange={handlePageClick}
      activeClassName={'active'}
      disableInitialCallback={true}
    />
  );
};

export default Pagination;
