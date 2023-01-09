import React, { useContext, useEffect } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import http from "../../../utils/axios-instance";
import { useState } from "react";
import { BasicTable } from "../../../components/Table/BasicTable";
import Layout from "../../../components/Layout/Layout";
import AppContext from "../../../context/AppContext";
import { toast } from "react-toastify";
import Button from "../../../components/Form/FormComponents/Button/Button";
import { formatDate } from "../../../utils/dateFormatter";
import Filter from "../../../components/Filter/Filter";
import styles from "./Orders.module.css";
import Input from "../../../components/Form/FormComponents/Input/Input";
import Select from "../../../components/Form/FormComponents/Select/Select";
import OrderInfo from "../OrderInfo/OrderInfo";
import PostSendCourier from "../../Posts/PostSendCourier";
import Photo from "./photo.png";
import { phoneNumberFormat } from "../../../utils/phoneNumberFormatter";
import AdminRejectedModal from "../AdminRejectedModal";
function Orders() {
  const { user } = useContext(AppContext);
  const isAdmin = user.userRole === "ADMIN";
  const isStoreOwner = user.userRole === "STORE_OWNER";
  const isCourier = user.userRole === "COURIER";
  const [pagination, setPagination] = useState(null);
  const [value, setValue] = useState(null);
  const [ordersIdArr, setOrdersIdArr] = useState(null);
  const [info, setInfo] = useState(null);
  const [info2, setInfo2] = useState(null);
  const [postStatus, setPostStatus] = useState(null);
  const [price, setPrice] = useState(null);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  let page = searchParams.get("page") || 1;
  let size = searchParams.get("size") || 10;
  const createdAt = searchParams.get("createdAt[eq]") || "";
  const orderStatus = searchParams.get("orderStatus") || "";
  const regionId = searchParams.get("regionId") || "";
  const districtId = searchParams.get("districtId") || "";
  const storeOwnerId = !isStoreOwner
    ? searchParams.get("storeOwnerId")
    : "";
  const { id } = useParams();
  const [search, setSearch] = useState(null);
  const navigate = useNavigate();
  const url = location.pathname;
  useState(() => {
    page = 1;
    size = 10;
  }, []);
  useEffect(() => {
    filterFn();
    getPrices();
  }, [
    page,
    info,
    orderStatus,
    regionId,
    districtId,
    storeOwnerId,
    createdAt,
    url,
    search,
  ]);
  const getPrices = async () => {
    const res = await http({
      url: "/orders/devprice",
    });
    setPrice(res.data);
  };
  const getAllOrders = async data => {
    setValue(
      data?.data?.content ||
        data?.data?.allOrderbyPackageBack.rows
    );

    setPagination(data?.data?.pagination);
    setOrdersIdArr(
      data?.data?.ordersArrInPost || data?.data?.orderIdArr
    );
    setPostStatus(
      data?.data?.currentPostStatus?.postStatus ||
        data.data.packageBackStatus
    );
  };
  const changeOrderStatus = async (id, status) => {
    try {
      const res = await http({
        url: `/orders/${id}`,
        method: "PATCH",
        data: {
          orderStatus: status,
        },
      });
      filterFn();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const deleteOrder = async id => {
    try {
      const res = await http({
        url: `/orders/${id}`,
        method: "DELETE",
        data: {},
      });
      filterFn();
      toast.success(res.data?.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const statusChangeOrder = async id => {
    console.log(id);
    try {
      const res = await http({
        url: `/orders/${id}`,
        method: "PATCH",
        data: {},
      });
      filterFn();
      console.log(res);
      toast.success(res.data?.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const dailyOrders = async () => {
    const res = await http({
      url: "/orders/delivered/daily",
    });
    setValue(res.data.data.content);
    setPagination(res.data.data.pagination);
  };

  const getFile = async () => {
    const dateCreatedAt = new Date(
      createdAt ? createdAt : ""
    );
    http({
      url: `orders/download?page=${page}&size=${size}${
        orderStatus ? `&orderStatus=${orderStatus}` : ""
      }${regionId ? `&regionId=${regionId}` : ""}${
        districtId ? `&districtId=${districtId}` : ""
      }${
        !isStoreOwner
          ? storeOwnerId
            ? `&storeOwnerId=${storeOwnerId}`
            : ""
          : ""
      }${
        createdAt
          ? orderStatus === "SOLD"
            ? `&updatedAt[eq]=${dateCreatedAt.toISOString()}`
            : `&createdAt[eq]=${dateCreatedAt.toISOString()}`
          : ""
      }`,
      method: "GET",
      responseType: "blob",
    }).then(res => {
      const href = URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", "interEx.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
  };

  const getFileWord = async () => {
    http({
      url: `packages/${id}/download`,
      method: "GET",
      responseType: "blob",
    }).then(res => {
      const href = URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", "packages.docx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
  };

  const cols = [
    {
      id: "NO",
      Header: "NO",
      accessor: (order, i) => {
        return (
          <>
            {ordersIdArr &&
              (url.split("/")[1] === "postback" || id) &&
              url !== "/posts/1/orders" && (
                <div>
                  <Input
                    type="checkbox"
                    checked={ordersIdArr.includes(order.id)}
                    onClick={() => {
                      const index = ordersIdArr.includes(
                        order.id
                      );
                      if (index) {
                        let orderIsArr = ordersIdArr.filter(
                          i => i !== order.id
                        );
                        setOrdersIdArr(orderIsArr);
                      } else {
                        setOrdersIdArr(prev => [
                          ...prev,
                          order.id,
                        ]);
                      }
                    }}></Input>
                </div>
              )}
            <p style={{ textAligin: "center" }}>{i + 1}</p>
          </>
        );
      },
    },
    {
      Header: "Id",
      accessor: "id",
    },
    {
      Header: "Manzil",
      accessor: order => {
        return (
          <>
            {order.region.name}
            <br />
            {order.district.name}
          </>
        );
      },
    },
    {
      id: "status",
      Header: "Holati",
      accessor: order => {
        const colorStatusFn = () => {
          if (order.orderStatus === "SOLD") {
            return "lightgreen";
          }
          if (order.orderStatus === "REJECTED") {
            return "red";
          }
          if (order.orderStatus === "PENDING") {
            return "yellow";
          }
          return "";
        };

        return (
          <div style={{ backgroundColor: colorStatusFn() }}>
            <p> {order.orderStatusUz}</p>
          </div>
        );
      },
    },
    {
      id: "phoneNumber",
      Header: "Telefon Raqam",
      accessor: order => {
        return (
          <a href={`tel:${order?.recipientPhoneNumber}`}>
            <b>
              {phoneNumberFormat(
                order?.recipientPhoneNumber
              )}
            </b>
          </a>
        );
      },
    },
    {
      id: "deliveryPrice",
      Header: "Yetkazish narxi",
      accessor: order => {
        return (
          <>
            {!isCourier && (
              <div>
                {order.orderStatus === "NEW" &&
                  id &&
                  isAdmin && (
                    <Select
                      data={price?.map(e => {
                        return { id: e, name: e };
                      })}
                      onChange={async e => {
                        const res = await http({
                          url: `orders/${order.id}/devprice`,
                          method: "PATCH",
                          data: {
                            deliveryPrice: e.target.value,
                          },
                        });
                      }}>
                      Narxi
                    </Select>
                  )}
                {(order.status !== "NEW" &&
                  order.deliveryPrice?.toLocaleString(
                    "Ru-Ru"
                  )) ||
                  0}{" "}
                so'm
              </div>
            )}
            {isCourier && (
              <div>
                {`${
                  user.tariff?.toLocaleString("Ru-Ru") || 0
                } so'm`}
              </div>
            )}
          </>
        );
      },
    },
    {
      id: "totalPrice",
      Header: "Narxi",
      accessor: order => {
        return (
          <>{`${order.totalPrice?.toLocaleString(
            "Ru-Ru"
          )} so'm`}</>
        );
      },
    },
    {
      id: "createdAt",
      Header: "Sana",
      accessor: order => {
        return formatDate(order.createdAt);
      },
    },
    {
      id: "updatedAt",
      Header: "O'zgarish",
      accessor: order => {
        return formatDate(order.updatedAt);
      },
    },
    {
      id: "tugma",
      Header: "",
      accessor: order => {
        return (
          <div className={styles.actionContainer}>
            {user.userRole === "SUPER_ADMIN" &&
              (order.orderStatus === "SOLD" ||
                order.orderStatus === "REJECTED") && (
                <Button
                  size="small"
                  name="btn"
                  onClick={() =>
                    statusChangeOrder(order.id)
                  }>
                  Imkoniyat
                </Button>
              )}
            {((isAdmin && url.split("/")[1] !== "posts") ||
              isStoreOwner) && (
              <div className={styles.actionContainer}>
                {user.userRole === "STORE_OWNER" &&order.orderStatus === "NEW"&& (
                  <>
                    <Button
                      size="small"
                      disabled={
                        order.orderStatus !== "NEW"
                          ? true
                          : false
                      }
                      name="btn"
                      onClick={() => {
                        navigate(`/orders/${order.id}`);
                      }}>
                      O'zgartirish
                    </Button>
                    <Button
                      size="small"
                      disabled={
                        order.orderStatus !== "NEW"
                          ? true
                          : false
                      }
                      name="btn"
                      btnStyle={{
                        backgroundColor:
                          order.orderStatus === "NEW"
                            ? "red"
                            : "",
                      }}
                      onClick={() => deleteOrder(order.id)}>
                      O'chirish
                    </Button>
                  </>
                )}

                {isAdmin && id &&order.orderStatus==="NEW"&& (
                  <>
                    <Button
                      name="btn"
                      disabled={
                        order.orderStatus === "NEW"
                          ? false
                          : true
                      }
                      onClick={() =>
                        changeOrderStatus(
                          order.id,
                          "ACCEPTED"
                        )
                      }>
                      Qabul qilindi
                    </Button>

                    <Button
                      disabled={
                        order.orderStatus === "NEW"
                          ? false
                          : true
                      }
                      name="btn"
                      onClick={() =>
                        setInfo2({
                          id: order.id,
                          status: "NOT_EXIST",
                        })
                      }>
                      Qabul qilinmadi
                    </Button>
                  </>
                )}
              </div>
            )}
            {isCourier &&
              (order.orderStatus === "DELIVERED" ||
                order.orderStatus === "PENDING") &&
              (order.orderStatus === "DELIVERED" ||
                order.orderStatus === "SOLD" ||
                order.orderStatus !== "PENDING" ||
                order.orderStatus !== "REJECTED") &&
              order.orderStatus !== "DELIVERING" && (
                <>
                  <Button
                    name="btn"
                    disabled={
                      order.orderStatus === "SOLD" ||
                      order.orderStatus === "REJECTED" ||
                      order.orderStatus === "NOT_DELIVERED"
                        ? true
                        : false
                    }
                    btnStyle={{
                      backgroundColor:
                        order.orderStatus !== "SOLD"
                          ? "green"
                          : "",
                    }}
                    onClick={() => {
                      setInfo({
                        id: order.id,
                        status: "SOLD",
                        postId: id,
                        statusUz: "Buyurtma Sotildi",
                      });
                    }}>
                    Sotildi
                  </Button>

                  <Button
                    disabled={
                      order.orderStatus === "SOLD" ||
                      order.orderStatus === "REJECTED" ||
                      order.orderStatus === "PENDING" ||
                      order.orderStatus === "NOT_DELIVERED"
                        ? true
                        : false
                    }
                    size="small"
                    name="btn"
                    btnStyle={{
                      backgroundColor:
                        order.orderStatus !== "PENDING"
                          ? "rgb(255, 200, 0)"
                          : "",
                    }}
                    onClick={() => {
                      setInfo({
                        id: order.id,
                        status: "PENDING",
                        postId: id,
                        statusUz: "Buyurtma Kutilmoqda",
                      });
                    }}>
                    Kutilmoqda
                  </Button>
                  <Button
                    disabled={
                      order.orderStatus === "SOLD" ||
                      order.orderStatus === "REJECTED" ||
                      order.orderStatus === "NOT_DELIVERED"
                        ? true
                        : false
                    }
                    size="small"
                    name="btn"
                    btnStyle={{
                      backgroundColor:
                        order.orderStatus !== "REJECTED"
                          ? "red"
                          : "",
                    }}
                    onClick={() => {
                      setInfo({
                        id: order.id,
                        status: "REJECTED",
                        postId: id,
                        statusUz: "Buyurtma Qaytarildi",
                      });
                    }}>
                    Qaytdi
                  </Button>
                </>
              )}
            <Button
              size="small"
              name="btn"
              onClick={() => {
                setInfo(order.id);
              }}>
              Ma'lumot
            </Button>
          </div>
        );
      },
    },
  ];
  const postCreateOrUpdateFn = async () => {
    try {
      const res = await http({
        url: url
          ? url.split("/")[3] === "regionorders"
            ? "posts/new"
            : "posts/new/customized"
          : "",
        data: url
          ? url.split("/")[3] === "regionorders"
            ? { regionId: id, ordersArr: ordersIdArr }
            : { postId: id, ordersArr: ordersIdArr }
          : "",
        method: url
          ? url.split("/")[3] === "regionorders"
            ? "POST"
            : "PUT"
          : "",
      });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    navigate("/post/create");
  };
  const postRejectedCreateOrUpdateFn = async () => {
    try {
      const res = await http({
        url: "/postback/new/rejected",
        data: { ordersArr: ordersIdArr },
        method: "POST",
      });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    navigate("/postback");
  };
  const packageRejected = async () => {
    try {
      const res = await http({
        url: `/packageback/${id}/orders`,
        data: { orderIdArr: ordersIdArr },
        method: "PUT",
      });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    navigate("/packageback");
  };
  const filterFn = async () => {
    const dateCreatedAt = createdAt
      ? new Date(createdAt)
      : "";
    try {
    
      let res;
      if (
        url === "/orders" ||
        url === "/orders/delivered" ||
        url === "/orders/myorders"
      ) {
        res = await http(
          `${url ? url : ""}?${
            page ? `page=${search ? 1 : page}` : ""
          }${size ? `&size=${search ? 100 : size}` : ""}${
            search ? `&search=${search}` : ""
          }${
            orderStatus ? `&orderStatus=${orderStatus}` : ""
          }${
            !isStoreOwner
              ? storeOwnerId
                ? `&storeOwnerId=${storeOwnerId}`
                : ""
              : ""
          }${regionId ? `&regionId=${regionId}` : ""}${
            districtId ? `&districtId=${districtId}` : ""
          }${
            dateCreatedAt
              ? orderStatus === "SOLD"
                ? `&updatedAt[eq]=${dateCreatedAt.toISOString()}`
                : `&createdAt[eq]=${dateCreatedAt.toISOString()}`
              : ""
          }`
        );
      } else {
        res = await http(
          `${url ? url : ""}?${
            search ? `search=${search}` : ""
          }`
        );
      }

      getAllOrders(res.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const closeHandler = () => {
    setInfo(false);
  };
  return (
    <Layout
      pageName="Jo'natmalar Ro'yxati"
      setSearch={setSearch}
      info={info}>
      {url === "/new-post" && (
        <div
          style={{
            width: "100%",
            display: "flex",
            gap: "1rem",
          }}>
          {user.userRole === "COURIER" && (
            <div style={{ width: "100%" }}>
              <Button
                disabled={
                  url === "/new-post" ||
                  url === "/postback/rejected/orders"
                    ? true
                    : false
                }
                name="btn"
                onClick={() => {
                  url === "/postback"
                    ? navigate("/postback/rejected/orders")
                    : navigate("/new-post");
                }}>
                {url === "/postback"
                  ? "Pochta yaratish"
                  : "Bugungi pochta"}
              </Button>
            </div>
          )}
          {user.userRole === "COURIER" && (
            <div style={{ width: "100%" }}>
              <Button
                disabled={url === "/posts"}
                name="btn"
                onClick={() => {
                  navigate("/posts");
                }}>
                Hamma pochtalar
              </Button>
            </div>
          )}
          {user.userRole === "COURIER" && (
            <div style={{ width: "100%" }}>
              <Button
                disabled={url === "/postback"}
                name="btn"
                onClick={() => {
                  navigate("/postback");
                }}>
                Qaytgan pochtalar
              </Button>
            </div>
          )}
        </div>
      )}
      {(url === "/orders" ||
        url === "/orders/delivered" ||
        url === "/orders/myorders") && (
        <div
          style={{
            display: "flex",
            justifyContent: "end",
          }}>
          <img
            width="100"
            onClick={() => getFile()}
            style={{ cursor: "pointer" }}
            src={Photo}
            alt=""
          />
        </div>
      )}
      {url === `/packages/${id}/orders` && (
        <div
          style={{
            display: "flex",
            justifyContent: "end",
          }}>
          <h1
            style={{ cursor: "pointer" }}
            onClick={() => getFileWord()}>
            Word
          </h1>
        </div>
      )}
      <div>
        {isStoreOwner && url === "/orders/myorders" && (
          <Button
            name="iconText"
            iconName="plus"
            onClick={() => {
              navigate("/orders/new");
            }}
            btnStyle={{
              width: "13rem",
              marginBottom: "1rem",
            }}>
            Buyurtma
          </Button>
        )}
        {isCourier &&
          (url === "/orders" ||
            url === "/orders/delivered" ||
            url === "/orders/myorders") && (
            <div
              style={{
                display: "flex",
                gap: "2rem",
                width: "50%",
              }}>
              <Button
                style={{ width: "13rem" }}
                name="btn"
                onClick={dailyOrders}>
                Bugungilar
              </Button>
              <Button
                style={{ width: "13rem" }}
                name="btn"
                onClick={
                  url === "/postback/rejected/orders"
                    ? () => {
                        navigate("/postback");
                      }
                    : filterFn
                }>
                Hammasi
              </Button>
            </div>
          )}
      </div>
      {(url === "/orders" ||
        url === "/orders/delivered" ||
        url === "/orders/myorders") && (
        <Filter filterFn={filterFn} url={url} />
      )}
      {value?.length > 0 ? (
        <BasicTable
          columns={cols}
          data={value}
          pagination={
            (url === "/orders" ||
              url === "/orders/delivered" ||
              url === "/orders/myorders") &&
            pagination
          }
          search={location.search}
          url={url}
        />
      ) : (
        <p>Malumotlar yoq</p>
      )}
      {info && typeof info !== "object" && (
        <OrderInfo id={info} onClose={closeHandler} />
      )}
      {info && typeof info === "object" && (
        <PostSendCourier
          id={info}
          url={url}
          onClose={closeHandler}
        />
      )}
      {info2 && (
        <AdminRejectedModal
          id={info2}
          filter={filterFn}
          onClose={() => {
            setInfo2(false);
          }}
        />
      )}
      <div style={{ display: "flex", gap: 1 }}>
        {(url.split("/")[1] === "posts" ||
          url.split("/")[2] === "rejected") &&
          (postStatus === "NEW" ||
            url.split("/")[3] === "regionorders" ||
            url.split("/")[2] === "rejected") && (
            <Button
              type="submit"
              size="small"
              name="btn"
              disabled={value?.length === 0}
              onClick={
                url.split("/")[2] === "rejected"
                  ? postRejectedCreateOrUpdateFn
                  : postCreateOrUpdateFn
              }>
              {url.split("/")[3] === "regionorders" ||
              url.split("/")[2] === "rejected"
                ? url === "/postback/rejected/orders"
                  ? "Pochta Qaytarish"
                  : "Pochta yaratish"
                : "Yangilash"}
            </Button>
          )}
        {isStoreOwner &&
          id &&
          postStatus === "REJECTED_NEW" && (
            <Button
              type="submit"
              size="small"
              name="btn"
              disabled={value?.length === 0}
              onClick={packageRejected}>
              Qabul qildim
            </Button>
          )}
      </div>
    </Layout>
  );
}

export default Orders;
