import React from 'react';
import ReactPaginate from 'react-paginate';

export default function Pagination({ itemCount, pageSize, onPageChange, className }) {
    let pageCount = Math.ceil(itemCount / pageSize);
    if (pageCount <= 1) return null;

    const handlePageClick = data => {
        let selected = data.selected + 1;
        onPageChange(selected);
    }

    return (
        <div className={className}>
            <ReactPaginate
                previousLabel={'<'}
                nextLabel={'>'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                pageClassName={'pagination__page'}
                pageLinkClassName={'pagination__pageLink'}
                nextClassName={'pagination__next'}
                nextLinkClassName={'pagination__nextLink'}
                previousClassName={'pagination__previous'}
                previousLinkClassName={'pagination__previousLink'}
                breakClassName={'ellipsis'}
                activeClassName={'active'}
            />
        </div>
    )
}
