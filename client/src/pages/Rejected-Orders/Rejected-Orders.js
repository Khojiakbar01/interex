import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Form/FormComponents/Button/Button";
import Input from "../../components/Form/FormComponents/Input/Input";
import Layout from "../../components/Layout/Layout";
import { BasicTable } from "../../components/Table/BasicTable";
import http from "../../utils/axios-instance";
import { formatDate } from "../../utils/dateFormatter";
import styles from "./Rejected-Orders.module.css";
import { toast } from "react-toastify";
import AppContext from "../../context/AppContext";
import OrderInfo from "../Orders/OrderInfo/OrderInfo";
function RejectedOrders() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [info, setInfo] = useState(false);
  const [postStatus, setPostStatus] = useState(null);
  const [ordersIdArr, setOrdersIdArr] = useState(null);
  const [value, setValue] = useState([]);
  const location = useLocation();
  const { user } = useContext(AppContext);

  const url = location.pathname;
  useEffect(() => {
    getByIdPostOrders();
  }, []);
  const cols = [
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
      id: "region",
      Header: "Manzil",
      accessor: (order) => {
        return <>{order.district.name}</>;
      },
    },
    {
      id: "deliveryPrice",
      Header: "Yetkazish narxi",
      accessor: (order) => {
        return <>{`${order.deliveryPrice.toLocaleString("Ru-Ru")} so'm`}</>;
      },
    },
    {
      id: "totalPrice",
      Header: "Mahsulotning narxi",
      accessor: (order) => {
        return <>{`${order.totalPrice?.toLocaleString("Ru-Ru")} so'm`}</>;
      },
    },

    { id: "status", Header: "Holati", accessor: "orderStatusUz" },
    {
      id: "updatedAt",
      Header: "Oxirgi o'zgarish",
      accessor: (order) => {
        return formatDate(order.updatedAt);
      },
    },
    {
      id: "action",
      Header: "Tugma",
      accessor: (order) => {
        return (
          <div className={styles.actionContainer}>
            <Button
              size="small"
              name="btn"
              onClick={() => {
                setInfo(order.id);
              }}
            >
              Ma'lumot
            </Button>
            {ordersIdArr &&order.orderStatus==="REJECTED_DELIVERING"&& (
              <Input
                disabled={postStatus && postStatus !== "NEW"}
                type="checkbox"
                checked={ordersIdArr.includes(order.id)}
                onClick={() => {
                  const index = ordersIdArr.includes(order.id);
                  if (index) {
                    let orderIsArr = ordersIdArr.filter((i) => i !== order.id);
                    setOrdersIdArr(orderIsArr);
                  } else {
                    setOrdersIdArr((prev) => [...prev, order.id]);
                  }
                }}
              ></Input>
            )}
          </div>
        );
      },
    },
  ];

  const getByIdPostOrders = async () => {
    try {
      const res = await http(`/postback/rejectedposts/${id}`);
      setValue(res?.data?.data?.content);
      setOrdersIdArr(res?.data?.data?.content.map((o) => o.id));
    } catch (error) {}
  };
  const updatePostAndOrdersStatusHandler = async () => {
    try {
      const res = await http({
        url: "/postback/new/receiverejectedpost",
        data: { ordersArr: ordersIdArr, postBackId: id },
        method: "PUT",
      });
      navigate("/orders");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const closeHandler = () => {
    setInfo(false);
  };
  return (
    <Layout>
  
      {value.length > 0 ? (
        <>
          {info &&  (
        <OrderInfo id={info} onClose={closeHandler} />
      )}
          <BasicTable columns={cols} data={value} />
          <Button
            disabled={value[0].orderStatus==="REJECTED_NOT_DELIVERED"||value[0].orderStatus==="REJECTED_DELIVERED"}
            btnStyle={{ width: "13rem" }}
            name="btn"
            type="button"
            onClick={updatePostAndOrdersStatusHandler}
          >
            Qabul qildim
          </Button>
        </>
      ) : (
        <p>Ma'lumotlar yo'q</p>
      )}
    </Layout>
  );
}

export default RejectedOrders;
