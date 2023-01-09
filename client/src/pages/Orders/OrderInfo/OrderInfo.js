import React, { useEffect, useMemo, useState } from "react";
import http from "../../../utils/axios-instance";
import { BasicTable } from "../../../components/Table/BasicTable";
import Modal from "../../../components/Modal/Modal";
import styles from "../Orders/Orders.module.css";
import stylesInfo from "./OrderInfo.module.css";
import { phoneNumberFormat } from "../../../utils/phoneNumberFormatter";
import Admin from "./Admin.png";
import AdminGreen from "./AdminGreen.png";
import Car from "./Car.png";
import CarYellow from "./CarYellow.png";
import Clock from "./Clock.png";
import ClockYellow from "./ClockYellow.png";
import Pochta from "./Pochta.png";
import PochtaQizil from "./PochtaQizil.png";
const OrderInfo = ({ id, onClose }) => {
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(null);
  useEffect(() => {
    getById();
  }, []);
  const getById = async () => {
    const res = await http({
      url: `/orders/${id}`,
    });
    setValue(res.data.data.orderById);
    setItems(res.data.data.orderById.items);
  };

  const itemsCols = [
    {
      id: "id",
      Header: "No",
      accessor: (e, i) => {
        return `${i + 1}`;
      },
    },
    { id: "productName", Header: "Maxsulot nomi", accessor: "productName" },
    { id: "quantity", Header: "Soni", accessor: "quantity" },
    {
      id: "Total Price",
      Header: "Umumiy narxi",
      accessor: (order) => {
        return (
          <>{`${order.orderItemTotalPrice.toLocaleString("Ru-Ru")} so'm`}</>
        );
      },
    },
  ];

  return (
    <Modal onClose={onClose}>
      <div className="div">
        <div className={styles.orderInfo}>
          <ul style={{ listStyle: "none", textAlign: "center" }}>
            <li className="h6">
              <p className="bold inline-block">Xaridor Ismi:</p>{" "}
              <span>{value?.recipient}</span>
            </li>
            <li className="h6">
              <p className="bold inline-block"> Xaridor telefon raqami:</p>
              <span>
                <a href={`tel:${value?.recipientPhoneNumber}`}>
                  {phoneNumberFormat(value?.recipientPhoneNumber)}
                </a>
              </span>
            </li>

            <li className="h6">
              <p className="bold inline-block">Mahsulot narxi:</p>{" "}
              <span>{value?.totalPrice.toLocaleString("Ru-Ru")} so'm</span>
            </li>
            <li className="h6">
              <p className="bold inline-block">Mahsulot holati:</p>{" "}
              {value?.orderStatusUz}
            </li>
            <li className="h6">
              <p className="bold inline-block"> Viloyat:</p>
              <span>{value?.region?.name}</span>
            </li>
            <li className="h6">
              <p className="bold inline-block"> Tuman:</p>
              <span>{value?.district?.name}</span>
            </li>
            <li className="h6">
              <p className="bold inline-block"> Firma nomi:</p>
              <span>
                <b> {value?.storeOwner?.storeName}</b>
              </span>
            </li>
            <li className="h6">
              <p className="bold inline-block"> Eslatma:</p>
              <span>{value?.note}</span>
            </li>
          </ul>
          {items?.length > 0 ? (
            <BasicTable
              columns={itemsCols}
              style={{ overflowY: "scroll" }}
              data={items}
            />
          ) : (
            <p>Malumotlar yoq</p>
          )}

          {/* 
           <div className={stylesInfo.ellipse}>
            <Tort />
          </div>
     */}

          <div className={stylesInfo.container}>
            <div className={stylesInfo.ellipse}>
              <img
                width="40"
                src={value?.orderStatusUz === "YANGI" ? CarYellow : Car}
                alt=""
                className={stylesInfo.svg}
              />
            </div>
            <div className={stylesInfo.rectangle}></div>
            <div className={stylesInfo.ellipse}>
              <img
                width="40"
                src={value?.orderStatusUz === "OLDI" ? AdminGreen : Admin}
                alt=""
                className={stylesInfo.svg}
              />
            </div>
            <div className={stylesInfo.rectangle}></div>
            <div className={stylesInfo.ellipse}>
              <img
                width="40"
                src={value?.orderStatusUz === "YO`LDA" ? PochtaQizil : Pochta}
                alt=""
                className={stylesInfo.svg}
              />
            </div>
            <div className={stylesInfo.rectangle}></div>
            <div className={stylesInfo.ellipse}>
              <img
                width="40"
                src={value?.orderStatusUz === "BORDI" ? ClockYellow : Clock}
                alt=""
                className={stylesInfo.svg}
              />
            </div>
          </div>


          <div className={stylesInfo.container}>
           <p className={stylesInfo.p}>Yangi</p>
           <p className={stylesInfo.p}>Admin Oldi</p>
           <p className={stylesInfo.p}>Admin Jonatdi</p>
           <p className={stylesInfo.p}>Kurierda</p>
          </div>

        </div>
      </div>
    </Modal>
  );
};

export default OrderInfo;
