import React from 'react';
import ReactPaginate from 'react-paginate';

export default function Pagination({ itemCount, pageSize, onPageChange, className }) {
    if(pageSize >= itemCount) return null;
    let pageCount = Math.ceil(itemCount / pageSize);

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
