import http from "../../utils/axios-instance";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AppContext";
import styles from "./Posts.module.css";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Button from "../../components/Form/FormComponents/Button/Button";
const PostCreate = () => {
  const [regionValue, setRegionValue] = useState([]);
  const { user } = useContext(AppContext);
  const location = useLocation();
  const url = location.pathname;
  const navigate = useNavigate();
    useEffect(() => {
        user.userRole !== "COURIER" && getAllRegions();
      }, []);
    const getAllRegions = async () => {
        try {
          const res = await http({
            url: `/posts/new/regions`,
          });
          setRegionValue(res.data.data);
        } catch (error) {
          toast.error(error.response.data.message);
        }
      };
    return (
    <Layout pageName="Post Yaratish">
  {user.userRole === "ADMIN" && ( <div style={{ width: "100%", display: "flex", gap: "2rem" }}>
          <Button
            name="btn"
            type="button"
            onClick={() => {
              navigate("/posts");
            }}
          >
           Pochtalar
          </Button>
      
          <Button
            name="btn"
            type="button"
            onClick={() => {
              navigate("/rejected/posts");
            }}
          >
           Qaytarilgan pochtalar
          </Button>
          <Button
            name="btn"
            type="button"
            disabled={url==="/post/create"}
            onClick={() => {
              navigate("/post/create");
            }}
          >
            Pochta Yaratish
          </Button>
        </div>
      )}
    <>{ user.userRole === "ADMIN" ? (
        <>
          {regionValue?.length > 0 ? (
            <div className={styles.div} >
            {regionValue.map((e)=>
              <div className={styles.divbox}  onClick={() => {
                navigate(`/posts/${e.id}/regionorders`);
              }}>{e.name}
              </div>
            )}
            </div>
          ) : (
            <p
              style={{ width: "50%", margin: "2rem auto", textAlign: "center" }}
            >
              Yuborilishi kerak bo'lgan po'chtalar yo'q
            </p>
          )}
        </>
      ) : (
        ""
      )}</> 
      </Layout>);
}
 
export default PostCreate;