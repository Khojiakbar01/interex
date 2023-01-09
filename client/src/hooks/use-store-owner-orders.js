import { changeOrderStatus } from "../pages/Orders/orderFunctions";
import styles from "../pages/Orders/Orders/Orders.module.css";

const useStoreOwner = () => {
  const [pagination, setPagination] = useState(null);
  const [value, setValue] = useState(null);
  const [ordersIdArr, setOrdersIdArr] = useState(null);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 10;
  const createdAt = searchParams.get("createdAt") || "";
  const orderStatus = searchParams.get("orderStatus") || "";
  const regionId = searchParams.get("regionId") || "";
  const districtId = searchParams.get("districtId") || "";
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    filterFn();
    getPrices();
  }, [page, info, regionId, districtId, storeOwnerId, createdAt]);
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
        url: `${url}?page=${page}&size=${size}${
          orderStatus ? `&orderStatus=${orderStatus}` : ""
        }${regionId ? `&regionId=${regionId}` : ""}${
          districtId ? `&districtId=${districtId}` : ""
        }${createdAt ? `&createdAt[eq]=${dateCreatedAt.toISOString()}` : ""}`,
      });
      getAllOrders(res.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
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
      id: "createdAt",
      Header: "Sanasi",
      accessor: (order) => {
        const newDate = formatDate(order.createdAt);
        const dateNew = new Date(newDate);
        return (
          <>
            {dateNew.getDay()}/{dateNew.getMonth().toString()}/
            {dateNew.getFullYear()}
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
            {((isAdmin && url.split("/")[1] !== "posts") || isStoreOwner) && (
              <div className={styles.actionContainer}>
                <Button
                  size="small"
                  disabled={order.orderStatus !== "NEW" ? true : false}
                  name="btn"
                  onClick={() => {
                    navigate(`/orders/${order.id}`);
                  }}
                >
                  O'zgartirish
                </Button>

                {/* {
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
                } */}
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
};

export default useStoreOwner;
