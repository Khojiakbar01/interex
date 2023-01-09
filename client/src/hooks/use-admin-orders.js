import { changeOrderStatus } from "../pages/Orders/orderFunctions";
import styles from "../pages/Orders/Orders/Orders.module.css";

const useAdminOrders = (styles) => {
  const [pagination, setPagination] = useState(null);
  const [value, setValue] = useState(null);
  const [ordersIdArr, setOrdersIdArr] = useState(null);
  const [info, setInfo] = useState(null);
  const [postStatus, setPostStatus] = useState(null);
  const [price, setPrice] = useState(null);
  const { id } = useParams();
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 10;
  const createdAt = searchParams.get("createdAt") || "";
  const orderStatus = searchParams.get("orderStatus") || "";
  const regionId = searchParams.get("regionId") || "";
  const districtId = searchParams.get("districtId") || "";
  const storeOwnerId = searchParams.get("storeOwnerId") || "";
  useEffect(() => {
    filterFn();
    getPrices();
  }, [page, info, createdAt, orderStatus, regionId, districtId, storeOwnerId]);
  const getPrices = async () => {
    const res = await http({
      url: "/orders/devprice",
    });
    setPrice(res.data);
  };
  const getAllOrders = async (data) => {
    setValue(data?.data?.content);
    setPagination(data?.data?.pagination);
    setOrdersIdArr(data?.data?.ordersArrInPost);
    setPostStatus(data?.data?.currentPostStatus?.postStatus);
  };
  const filterFn = async () => {
    const dateCreatedAt = new Date(createdAt ? createdAt : "");
    try {
      const res = await http({
        url: `/orders?page=${page}&size=${size}${
          orderStatus ? `&orderStatus=${orderStatus}` : ""
        }${regionId ? `&regionId=${regionId}` : ""}${
          districtId ? `&districtId=${districtId}` : ""
        }${
          !isStoreOwner
            ? storeOwnerId
              ? `&storeOwnerId=${storeOwnerId}`
              : ""
            : ""
        }${createdAt ? `&createdAt[eq]=${dateCreatedAt.toISOString()}` : ""}`,
      });
      getAllOrders(res.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
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
    navigate("/posts");
  };
  const cols = [
    {
      id: "id",
      Header: "ID",
      accessor: "id",
    },
    {
      id: "region",
      Header: "Manzil",
      accessor: (order) => {
        return (
          <>
            {order.region.name}
            <br />
            {order.district.name}
          </>
        );
      },
    },
    { id: "status", Header: "Holati", accessor: "orderStatus" },
    {
      id: "deliveryPrice",
      Header: "Yetkazish narxi",
      accessor: "deliveryPrice",
    },
    {
      id: "totalPrice",
      Header: "Mahsulotning narxi",
      accessor: (order) => {
        return <>{`${order.totalPrice.toLocaleString("Ru-Ru")} so'm`}</>;
      },
    },
    {
      id: "createdAt",
      Header: "Sanasi",
      accessor: (order) => {
        const dateNew = new Date(order.createdAt);
        return (
          <>
            {dateNew.getDay()}/{dateNew.getMonth()}/{dateNew.getFullYear()}
            <br />
            {dateNew.getHours()}:{dateNew.getMinutes()}:{dateNew.getSeconds()}
          </>
        );
      },
    },
    {
      id: "action",
      Header: "Tugma",
      accessor: (order) => {
        return (
          <div className={styles.actionContainer}>
            {((isAdmin && url.split("/")[1] !== "posts") || isStoreOwner) && (
              <div className={styles.actionContainer}>
                {isAdmin && id && (
                  <>
                    <Button
                      name="btn"
                      disabled={order.orderStatus === "NEW" ? false : true}
                      onClick={() => changeOrderStatus(order.id, "ACCEPTED")}
                    >
                      Qabul qilindi
                    </Button>

                    <Button
                      disabled={order.orderStatus === "NEW" ? false : true}
                      size="small"
                      name="btn"
                      onClick={() => changeOrderStatus(order.id, "NOT_EXIST")}
                    >
                      Qabul qilinmadi
                    </Button>
                  </>
                )}
              </div>
            )}
            <Button
              size="small"
              name="btn"
              onClick={() => {
                setInfo(order.id);
              }}
            >
              Ma'lumot
            </Button>
            {ordersIdArr && (
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

  const closeHandler = () => {
    setInfo(false);
  };

  return { cols, closeHandler, pagination, value, info };
};

export default useAdminOrders;
