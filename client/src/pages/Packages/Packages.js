import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { BasicTable } from "../../components/Table/BasicTable";
import http from "../../utils/axios-instance";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/Form/FormComponents/Button/Button";
import styles from "./Packages.module.css";
function Package() {
  const [packages, setPackages] = useState(null);
  const [sNew, setSNew] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchParams] = useSearchParams();
  let page = searchParams.get("page") || 1;
  let size = searchParams.get("size") || 10;
  const location = useLocation();
  const url = location.pathname;
  const navigate=useNavigate()
  useEffect(() => {
    getAllPackages();
  }, [page, sNew]);
  useState(()=>{
    page=1
    size=10
   },[])
  const getAllPackages = async () => {
    try {
      const res = await http({
        url:`/packages?page=${page}&size=${size}${sNew?"&new=new":""}`
      });
      setPackages(res.data.data.content);
      setPagination(res.data.data.pagination);
    } catch (error) {
      console.log(error);
    }
  };


  const packageCols = [
    {
      id: "id",
      Header: "id",
      accessor: "id",
    },
    {
      id: "storeOwner",
      Header: "Paket",
      accessor: "storeOwner.storeName",
    },
    {
      id: "status",
      Header: "Holati",
      accessor: "packageStatusUz",
    },
    {
      id: "totalPrice",
      Header: "Paketlar umumiy narxi",
      accessor: (packag) => {
        return <>{packag.packageTotalPrice?.toLocaleString("Ru-Ru")}</>;
      },
    },
    {
      Header: "Sanasi",
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
      id:"tugma",
      Header: "",
      accessor: (pack) => {
        return (
          <Link to={`/packages/${pack.id}/orders`} className={styles.link}>
            <Button name="btn"> Ochish</Button>
          </Link>
        );
      },
    },
  ];

  return (
    <Layout>  <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem"}}>
          
   
    <Button name="btn" disabled={url==="/packages"} onClick={() => navigate("/packages")}>
    Paketlar
    </Button>
    <Button name="btn" disabled={url==="/packagback"} onClick={() => navigate("/packageback")}>
      Qaytarilgan Paketlar
    </Button>
    
    </div>
      <div style={{ display: "flex", gap: "1rem", width: "100%" ,justifyContent:"center",alignItems: "center"}}>
       <Button name="btn" disabled={sNew} btnStyle={{width: "25%"}}onClick={() => setSNew(true)}>
          Yangi
        </Button>
        <Button name="btn"disabled={!sNew}  btnStyle={{width: "25%"}} onClick={() => setSNew(false)}>
          Barchasi
        </Button>
      </div>
      {packages?.length > 0 ? (
        <BasicTable
          columns={packageCols}
          data={packages}
          url="/packages"
          pagination={pagination}
        />
      ) : (
        <p>Malumotlar yoq</p>
      )}
    </Layout>
  );
}

export default Package;
