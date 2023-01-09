import {
  postCreateOrUpdateFn,
  postRejectedCreateOrUpdateFn,
} from "../pages/Orders/orderFunctions";

const useCourierOrders = () => {
  const { user } = useContext(AppContext);
  const isAdmin = user.userRole === "ADMIN";
  const isStoreOwner = user.userRole === "STORE_OWNER";
  const isCourier = user.userRole === "COURIER";
  const [pagination, setPagination] = useState(null);
  const [value, setValue] = useState(null);
  const [ordersIdArr, setOrdersIdArr] = useState(null);
  const [info, setInfo] = useState(null);
  const [postStatus, setPostStatus] = useState(null);
  const [price, setPrice] = useState(null);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 10;
  const createdAt = searchParams.get("createdAt") || "";
  const orderStatus = searchParams.get("orderStatus") || "";
  const { id } = useParams();
  const navigate = useNavigate();
  const url = location.pathname;
  useEffect(() => {
    filterFn();
    getPrices();
  }, [page, info, regionId, districtId, storeOwnerId, createdAt]);
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
  const dailyOrders = async () => {
    const res = await http({
      url: "/orders/delivered/daily",
    });
    setValue(res.data.data.content);
    setPagination(res.data.data.pagination);
  };
  const cols = [
    {
      id: "id",
      Header: "ID",
      accessor: "id",
    },
    {
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
      id: "updatedAt",
      Header: "Sanasi",
      accessor: (order) => {
        const dateNew = new Date(order?.updatedAt);
        return (
          <>
            {dateNew.getDate()}/{dateNew.getMonth() + 1}/{dateNew.getFullYear()}
            <br />
            {dateNew.getHours()}:{dateNew.getMinutes()}
          </>
        );
      },
    },
    {
      Header: "Tugma",
      accessor: (order) => {
        return (
          <div className={styles.actionContainer}>
            {(order.orderStatus === "DELIVERED" ||
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
                    onClick={() => {
                      setInfo({ id: order.id, status: "SOLD" });
                    }}
                  >
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
                    onClick={() => {
                      setInfo({ id: order.id, status: "PENDING" });
                    }}
                  >
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
                    onClick={() => {
                      setInfo({ id: order.id, status: "REJECTED" });
                    }}
                  >
                    Qaytdi
                  </Button>
                </>
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

  return { cols, dailyOrders };
};

export default useCourierOrders;
