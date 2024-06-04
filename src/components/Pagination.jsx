import React from 'react';
import s from '../pages/statistics/Statistics.module.scss';

export default function Pagination({ page, handlePageChange, count_documents }) {

  const itemsPerPage = 25;
  const maxDisplayedPages = 10;

  const totalPages = Math.ceil(count_documents / itemsPerPage);
  const currentPageGroup = Math.ceil(page / maxDisplayedPages);
  const firstPageInGroup = (currentPageGroup - 1) * maxDisplayedPages + 1;
  const lastPageInGroup = Math.min(currentPageGroup * maxDisplayedPages, totalPages);
  
  const pagesArray = Array.from({ length: lastPageInGroup - firstPageInGroup + 1 }, (_, index) => index + firstPageInGroup);

  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  const handleNextClick = () => {
    if (!isLastPage) {
      handlePageChange(page + 1);
    }
  };

  const handlePreviousClick = () => {
    if (!isFirstPage) {
      handlePageChange(page - 1);
    }
  };

  return (
    <div className={s.paginationButtons__flex}>
      <div className={s.paginationButtons}>
        <button
          onClick={handlePreviousClick}
          className={s.paginationButtons__btn}
          disabled={isFirstPage}
        >
          &laquo;
        </button>
        {pagesArray.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`${s.paginationButtons__btnk} ${
              pageNumber === page ? s.paginationButtons__btnk__active : ''
            }`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          onClick={handleNextClick}
          className={s.paginationButtons__btn}
          disabled={isLastPage}
        >
          &raquo;
        </button>
      </div>
    </div>
  );
}

