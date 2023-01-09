import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Form/FormComponents/Button/Button";
import Layout from "../../components/Layout/Layout";
import { BasicTable } from "../../components/Table/BasicTable";
import AppContext from "../../context/AppContext";
import http from "../../utils/axios-instance";
import { formatDate } from "../../utils/dateFormatter";

function RejectedPosts() {
  const { user } = useContext(AppContext);
  const [value, setValue] = useState([]);
  const location = useLocation();
  const url = location.pathname;
  const navigate = useNavigate();
  useEffect(() => {
    getAllRejectedPosts();
  }, []);

  const getAllRejectedPosts = async () => {
    try {
      const res = await http("/postback/rejectedposts");
      setValue(res?.data?.data?.content);
    } catch (error) {}
  };

  const cols = [
    {
      id: "id",
      Header: "ID",
      accessor: "id",
    },
    {
      id: "region",
      Header: "Viloyat",
      accessor: "region.name",
    },
    {
      id: "note",
      Header: "Eslatma",
      accessor: "note",
    },
    {
      id: "postStatus",
      Header: "Holati",
      accessor: "postStatusUz",
    },
    {
      id: "updateAt",
      Header: "Oxirgi o'zgarish",
      accessor: (post) => {
        return formatDate(post.updatedAt);
      },
    },
    {
      id: "action",
      Header: "Tugma",
      accessor: (post) => {
        return (
          <Button
            name="btn"
            type="button"
            btnStyle={{ width: "8rem", margin: "0 auto" }}
            onClick={() => {
              navigate(`/rejected/post/${post.id}/orders`);
            }}
          >
            Ochish
          </Button>
        );
      },
    },
  ];

  return (
    <Layout pageName="Qaytarilgan pochtalar">
            {user.userRole === "ADMIN" && (
        <div style={{ width: "100%", display: "flex", gap: "2rem" }}>
          <Button
            name="btn"
            type="button"
            disabled={url==="/posts"}
            onClick={() => {
              navigate("/posts");
            }}
          >
           Pochtalar
          </Button>
          <Button
            name="btn"
            type="button"
            disabled={url==="/rejected/posts"}
            onClick={() => {
              navigate("/rejected/posts");
            }}
          >
            Qaytarilgan pochtalar
          </Button>
          <Button
            name="btn"
            type="button"
            onClick={() => {
              navigate("/post/create");
            }}
          >
            Pochta Yaratish
          </Button>
        </div>
      )}
      {value.length > 0 ? (
        <BasicTable data={value} columns={cols} />
      ) : (
        <p>Ma'lumotlar topilmadi</p>
      )}
    </Layout>
  );
}

export default RejectedPosts;
