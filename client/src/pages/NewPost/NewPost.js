import React, { useContext, useEffect, useState } from "react";
import { BasicTable } from "../../components/Table/BasicTable";
import Button from "../../components/Form/FormComponents/Button/Button";
import Layout from "../../components/Layout/Layout";
import Input from "../../components/Form/FormComponents/Input/Input";
import http from "../../utils/axios-instance";
import { useForm } from "react-hook-form";
import { formatDate } from "../../utils/dateFormatter";
import { useLocation, useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext";

function NewPost() {
  const { user } = useContext(AppContext);
  const [ordersIdArr, setOrdersIdArr] = useState([]);
  const [postData, setPostData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [orderCol, setOrderCol] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const url = location.pathname;
  useEffect(() => {
    getNewPost();
  }, []);

  const getNewPost = async () => {
    const res = await http("/posts/new/coming");
    setOrdersIdArr(res?.data?.data?.orderArr);
    setOrderData(res?.data?.data?.ordersOnTheWay?.content);
    setOrderCol(res?.data?.data?.ordersOnTheWay?.pagination?.allItemsCount);
    setPostData([res?.data?.data?.postOnTheWay]);
  };

  const postCols = [
    {
      id: "status",
      Header: "Post holati",
      accessor: "postStatusUz",
    },
    {
      id: "note",
      Header: "Eslatma",
      accessor: "note",
    },
    {
      id: "date",
      Header: "kun-oy-yil",
      accessor: (post) => {
        return formatDate(post.updatedAt);
      },
    },
    {
      id: "ordersoni",
      Header: "Buyurtmalar soni",
      accessor:()=><>{orderCol} ta</>
    },
    {
      id: "postTotalPrice",
      Header: "Post umumiy narxi",
      accessor: (posts) => {
        return <>{`${posts.postTotalPrice.toLocaleString("Ru-Ru")} so'm`}</>;
      },
    },
  ];

  const orderCols = [
    {
      id: "id",
      Header: "ID",
      accessor: "id",
    },
    {
      id: "recipient",
      Header: "Xaridor",
      accessor: "recipient",
    },
    {
      id: "note",
      Header: "Eslatma",
      accessor: "note",
    },
    {
      id: "orderStatus",
      Header: "Holati",
      accessor: "orderStatusUz",
    },
    {
      id: "district",
      Header: "Tuman",
      accessor: "district.name",
    },
    {
      id: "recipientPhoneNumber",
      Header: "Raqami",
      accessor: "recipientPhoneNumber",
    },
    {
      id: "createdAt",
      Header: "kun-oy-yil",
      accessor: (order) => {
        const dateNew = new Date(order.createdAt);
        return (
          <>
            {dateNew.getDate()}/{dateNew.getMonth() + 1}/{dateNew.getFullYear()}
            <br />
            {dateNew.getHours()}:{dateNew.getMinutes()}:{dateNew.getSeconds()}
          </>
        );
      },
    },
    {
      id: "totalPrice",
      Header: "Umumiy narx",
      accessor: (order) => {
        return <>{`${order.totalPrice?.toLocaleString("Ru-Ru")} so'm`}</>;
      },
    },
    {
      id: "action",
      Header: "Action",
      accessor: (order) => {
        return (
          <>
            {order.orderStatus === "DELIVERED" && (
              <Button type="button" size="btnSmall" name="dots" />
            )}
            {(order.orderStatus === "DELIVERING" ||
              order.orderStatus === "REJECTED_DELIVERING") && (
                <Input
                  type='checkbox'
                  checked={ordersIdArr.includes(order.id)}
                  onClick={() => {
                    const index = ordersIdArr.includes(order.id);
                    if (index) {
                      let orderIsArr = ordersIdArr.filter(
                        (i) => i !== order.id
                      );
                      setOrdersIdArr(orderIsArr);
                    } else {
                      setOrdersIdArr((prev) => [...prev, order.id]);
                    }
                  }}
                />
              )}
          </>
        );
      },
    },
  ];

  const postHandler = async () => {
    const res = await http({
      url: "/posts/new/recieve",
      data: {
        postStatus: "DELIVERED",
        ordersArr: ordersIdArr,
        postId: postData?.[0]?.id,
      },
      method: "PUT",
    });
    navigate("/posts");
  };

  return (
    <Layout pageName="Yangi kelgan Pochtalar">
      <div style={{width:"100%",display: "flex",gap:"1rem"}}>
          {user.userRole === "COURIER" && (
        <div style={{width:"100%"}}>
          <Button
          disabled={url==="/new-post"}
            name="btn"
            onClick={() => { navigate("/new-post");
            }}
          >
             Bugungi pochta
          </Button>
        </div>
      )}
      {user.userRole === "COURIER" && (
        <div style={{width:"100%"}} >
          <Button
          disabled={url==="/posts"}
            name="btn"
            onClick={() => {
              navigate("/posts");
            }}
          >
            Hamma pochtalar
          </Button>
        </div>
      )}
       {user.userRole === "COURIER" && (
        <div style={{width:"100%"}}>
          <Button
          disabled={url==="/postback"}

            name="btn"
            onClick={() => {
              navigate("/postback");
            }}
          >
           Qaytgan pochtalar
          </Button>
        </div>
      )}
      </div>
      {orderData.length > 0 ? (
        <>
          {postData && <BasicTable columns={postCols} data={postData} />}
          <br />
          <hr />
          <BasicTable columns={orderCols} data={orderData} />
          <Button onClick={postHandler} name="btn" size="small" type="button">
            Qabul qildim
          </Button>
        </>
      ) : (
        <p style={{ textAligin: "center" }}>Ma'lumotlar topilmadi</p>
      )}
    </Layout>
  );
}

export default NewPost;
