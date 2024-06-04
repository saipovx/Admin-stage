import s from '../pages/statistics/Statistics.module.scss'

export default function PaginationTwo ({ pageTwo , handlePageChange, count_documents}) {

  const totalPages = Math.ceil(count_documents / 20);

  const pagesArray = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        
      <div className={s.paginationButtons__flex}>
      <div className={s.paginationButtons}>

      <button
          onClick={() => handlePageChange(pageTwo - 5)}
          className={s.paginationButtons__btn}
          style={{ opacity: pageTwo <= 5 ? 0.2 : 1 }}
        >
          -5
        </button>

        <button
          onClick={() => handlePageChange(pageTwo - 1)}
          className={s.paginationButtons__btn}
          style={{ opacity: pageTwo <= 1 ? 0.4 : 1 }}
        >
           &laquo;
        </button>

        {pagesArray.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`${s.paginationButtons__btnk} ${pageNumber === pageTwo ? s.paginationButtons__btnk__active : ''}`}
          >
            {pageNumber}

          </button>
        ))}

        <button
          onClick={() => handlePageChange(pageTwo + 1)}
          className={s.paginationButtons__btn}
          style={{ opacity: pageTwo >= totalPages ? 0.4 : 1 }}
        >
                  &raquo;
        </button>

        <button
          onClick={() => handlePageChange(pageTwo + 5)}
          className={s.paginationButtons__btn}
          style={{ opacity: pageTwo + 5 > totalPages ? 0.2 : 1 }}
        >
          +5
        </button>


      </div>
    </div>

    )
}