import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Pagination.module.css";
import PaginationArrow from "../../assets/icons/PaginationArrow";
import PaginationDots from "../../assets/icons/PaginationDots";

function Pagination(props) {
  const { allPagesCount, isFirstPage, isLastPage } = props.pagination;
  const url = props.url;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
 let search=props.search?.split("&")
 search= search?.splice(2)
 search=search?.join("&")
 console.log(search);
  const [pagesCount, setPagesCount] = useState(6);
  const offset = pagesCount - 6;
  const page = searchParams.get("page") || 1;
  const sixPageChange = (num) => {
    if (num === 1) {
      setPagesCount(pagesCount + 6);
      navigate(`${url}?page=${+offset + 7}&${search}`);
    } else {
      setPagesCount(pagesCount - 6);
      navigate(`${url}?page=${+offset - 5}&${search}`);
    }
  };

  const arrowHandler = (num) => {
    if (num === 1) {
      if (+page === pagesCount) {
        setPagesCount(pagesCount + 6);
        navigate(`${url}?page=${+page + 1}&size=10&${search}`);
      } else {
        navigate(`${url}?page=${+page + 1}&size=10&${search}`);
      }
    } else {
      if (+page === offset) {
        setPagesCount(pagesCount - 6);
        navigate(`${url}?page=${+page - 1}&size=10&${search}`);
      } else {
        navigate(`${url}?page=${+page - 1}&size=10&${search}`);
      }
    }
  };

  return (
    <div className={styles.paginationContainer}>
      <button
        onClick={arrowHandler}
        className={`${styles.pageLinks} ${
          isFirstPage ? styles.disabledTrue : ""
        } ${styles.arrowLeft}`}
      >
        <PaginationArrow classname={`${styles.arrow}`} />
      </button>

      {/* {offset > 5 && (
        <Link to={`/${url}?page=1&size=2`} className={styles.pageLinks}>
          1
        </Link>
      )} */}

      {pagesCount > 7 && (
        <button className={styles.dots} onClick={sixPageChange}>
          <PaginationDots />
        </button>
      )}
      {allPagesCount &&
        Array.from({ length: allPagesCount }).map((_, i) => {
          if (i + 1 > offset && i + 1 <= pagesCount) {
            return (
              <Link
                className={`${styles.pageLinks}  ${
                  +page === i + 1 ? styles.active : ""
                }`}
                to={`${url}?page=${+i + 1}&size=10&${search}`} 
                key={i + "xksxskj"}
                style={page === i + 1 ? { pointerEvents: "none" } : null}
              >
                {i + 1}
              </Link>
            );
          }
        })}

      {allPagesCount > pagesCount && (
        <button className={styles.dots} onClick={sixPageChange.bind(null, 1)}>
          <PaginationDots />
        </button>
      )}

      {/* {pagesCount < allPagesCount - 5 && (
        <Link
          to={`/${url}?page=${allPagesCount}&size=2`}
          className={styles.pageLinks}
        >
          {allPagesCount}
        </Link>
      )} */}
      <button
        onClick={arrowHandler.bind(null, 1)}
        className={`${styles.pageLinks} ${
          isLastPage ? styles.disabledTrue : ""
        }`}
      >
        <PaginationArrow classname={`${styles.arrow}`} />
      </button>
    </div>
  );
}

export default Pagination;
