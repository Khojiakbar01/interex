import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import http from "../../../utils/axios-instance";
import { string, array, object } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../../components/Layout/Layout";
import OrderFieldArray from "./OrderFieldArray";
import Button from "../../../components/Form/FormComponents/Button/Button";
import styles from "./OrderMutation.module.css";
import { phoneNumberFormat } from "../../../utils/phoneNumberFormatter";
import { formatDate } from "../../../utils/dateFormatter";
import OrderInfo from "../OrderInfo/OrderInfo";
import { BasicTable } from "../../../components/Table/BasicTable";
import StoreOwnerTrueFalseNumber from "./StoreOwnerTrueFalseNumber";

const schema = object().shape({
  orders: array()
    .of(
      object().shape({
        recipient: string().trim().required("Xaridor ismini kriting"),
        // note: string().trim().required("Izoh kriting"),
        recipientPhoneNumber: string()
          .trim()
          .required("Telefon raqamini kriting"),
        regionId: string().trim().required("Viloyatni tanlag"),
        districtId: string().trim().required("Tumanni tanlang"),
        orderItems: array()
          .of(
            object().shape({
              productName: string().trim().required("Mahsulot nomini kriting"),
              quantity: string().trim().required("Mahsulot sonini kriting"),
              price: string().trim().required("Mahsulot narxini kriting"),
            })
          )
          .min(1, "Mahsulotlar kamida 1ta bolishi kerak"),
      })
    )
    .min(1, "Buyurtmalar soni kamida 1ta bolishi kerak"),
});

function OrderMutation() {
  const [regions, setRegions] = useState(null);
  const [rId, setRId] = useState(null);
  const [dId, setDId] = useState(null);
  const [regionId, setRegionId] = useState(null);
  const [updateData, setUpdateData] = useState(null);
  const [value, setValue] = useState(null);
  const [btn, setBtn] = useState(null);
  const { id } = useParams();
  const [info, setInfo] = useState(null);
  const [info2, setInfo2] = useState(null);
  const [isTrue, setIsTrue] = useState(false);


  const isUpdate = id !== "new";
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
useEffect(()=>{
filterFn()
},[])
  useEffect(() => {
    getAllRegions();
    if (isUpdate && !updateData) {
      getById();
    }

    !isUpdate &&
      !regionId &&
      !updateData &&
      append({
        recipient: "",
        note: "",
        recipientPhoneNumber: "+998",
        regionId: "",
        districtId: "",
        orderItems: [
          {productName: '', quantity: '', price: ''}],
      });
  }, [regionId]);
  useEffect(() => {
    isUpdate && updateData && append({ ...updateData });
  }, [updateData]);
  const formSubmit = async (data,e) => {
    try {
      const res = await http({
        url: isUpdate ? `/orders/${id}` : `/orders${isTrue?`?phone=free`:""}`,
        method: isUpdate ? "PUT" : "POST",
        data: isUpdate ? data.orders[0] : data,
      });
      setInfo2(null)
      setIsTrue(false)
      toast.success(res.data.message);
     btn?window.location.reload(): navigate("/orders/myorders");

    } catch (error) {
      console.log(error);
      if(error.response.status===400){
      setInfo2(error.response.data.message);
      }else{
        return (error.response.data.message.map((error) => toast.error(error)))
      }
    }
  };

  const getById = async () => {
    const res = await http({
      url: `/orders/${id}/edit`,
    });
    const orderById = res.data.data;
    setRId(orderById.regionId);
    setDId(orderById.districtId);
    setUpdateData(orderById);
  };

  const getAllRegions = async () => {
    const res = await http({
      url: "/regions",
      method: "GET",
    });
    setRegions(res.data.data.content);
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
  const filterFn = async () => {

    try {
        let res = await http(
          `/orders/myorders?orderStatus=NEW`
        );
   console.log(res);
        setValue(res.data?.data?.content)

    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const cols = [
    {
      id: "NO",
      Header: "NO",
      accessor: (order, i) => {
        return (
          <>
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
              <div>
             
                {(order.status !== "NEW" &&
                  order.deliveryPrice?.toLocaleString(
                    "Ru-Ru"
                  )) ||
                  0}{" "}
                so'm
              </div>
          
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
              <div className={styles.actionContainer}>
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
              </div>
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
  const closeHandler = () => {
    setInfo(false);
  };
  const { fields, append, remove } = useFieldArray({
    control,
    name: "orders",
  });
  return (
    <Layout>
         {info && typeof info !== "object" && (
        <OrderInfo id={info} onClose={closeHandler} />
      )}

      <form onSubmit={handleSubmit((data,e) => formSubmit(data,e))}>
        <ul style={{ overflowY: "avto", listStyle: "none" }}>
          {errors.orders?.type === "min" && (
            <p style={{ color: "red" }}>{errors.orders.message}</p>
          )}
          {fields.map((item, index) => (
            <OrderFieldArray
              key={item.id}
              rId={rId}
              item={item}
              register={register}
              index={index}
              errors={errors}
              watch={watch}
              regions={regions}
              control={control}
              remove={remove}
              dId={dId}
              reset={(obj) => reset(obj)}
            />
          ))}
        </ul>
        <div className={styles.btnBox}>
          <div className={styles.btnContainer}>
            {!isUpdate && (
              <div
                className={styles.btnIconTextContainer}
                onClick={() =>
                  setBtn(true)
                }
              >
                <Button
                nameBtn="a"
                  name="iconText"
                  iconName="plus"
                  btnStyle={{ width: "13rem" }}
                  type="submit"
                >
                  Buyurtma
                </Button>
              </div>
            )}
            <Button
              size="normal"
              name="iconText"
              type="submit"
              btnStyle={{ width: "13rem" }}
            >
              {isUpdate ? "Buyurtmani o'zgartirish" : "Saqlash"}
            </Button>
          </div>
        </div>
      </form>
      {info2&&<StoreOwnerTrueFalseNumber message={info2} set={(data)=>setIsTrue(data)} onClose={() => {
            setInfo2(false);
          }}/>}
      {value?.length > 0 ? (
        <BasicTable
          columns={cols}
          data={value}
         
        />
      ) : (
        <p>Malumotlar yoq</p>
      )}
    </Layout>
  );
}
export default OrderMutation;
