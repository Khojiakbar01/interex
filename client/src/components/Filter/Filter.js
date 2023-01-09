import React, { useContext, useEffect, useState } from "react";
import styles from "./Filter.module.css";
import Select from "../Form/FormComponents/Select/Select";
import Input from "../Form/FormComponents/Input/Input";
import Button from "../Form/FormComponents/Button/Button";
import http from "../../utils/axios-instance";
import { useForm } from "react-hook-form";
import AppContext from "../../context/AppContext";
import { useNavigate, useSearchParams } from "react-router-dom";
function Filter({ url }) {
  const [searchParams] = useSearchParams();
  const { user } = useContext(AppContext);
  const isAdmin = user.userRole === "ADMIN";
  const isSuperAdmin = user.userRole === "SUPER_ADMIN";
  const isCourier= user.userRole === "COURIER";
  const { register, handleSubmit } = useForm();
  const [statuses, setStatuses] = useState(null);
  const [regions, setRegions] = useState(null);
  const [region, setRegion] = useState(null);
  const [filterShow, setFilterShow] = useState(false);
  const [districts, setDistricts] = useState(null);
  const [storeOwnerIds, setStoreOwner] = useState(null);
  const navigate = useNavigate();
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 10;
  useEffect(() => {
    getAllRegions();
    getAllStatuses();
    region && getAllDistricts(region);
    (isAdmin || isSuperAdmin) && getAllStoreOwner();
  }, []);

  const filterOpenClouseHandle = () => {
    setFilterShow(!filterShow);
  };

  const getAllStatuses = async () => {
    const res = await http({
      url: "/orders/status",
    });

    setStatuses(res.data.data.allOrderStatus);
  };
  const getAllRegions = async () => {
    const res = await http({
      url: "/regions",
    });
    setRegions(res.data.data.content);
  };

  const getAllDistricts = async (id) => {
    const res =
      id &&
      (await http({
        url: `/regions/${id}/districts`,
      }));
    id && setDistricts(res.data.data.getDistrictByRegion);
  };
  const getAllStoreOwner = async () => {
    const res = await http({
      url: "/users?userRole=STORE_OWNER",
    });

    setStoreOwner(
      res.data.data.content.map((s) => {
        return { id: s.id, name: s.storeName };
      })
    );
  };
  const filterHandler = async (data) => {
    console.log(data);
    navigate(
      `${url}?page=${page}&size=${size}${
        data?.status ? `&orderStatus=${data.status}` : ""
      }${data?.regionId ? `&regionId=${data.regionId}` : ""}${
        data?.districtId ? `&districtId=${data.districtId}` : ""
      }${
        user.userRole !== "STORE_OWNER"
          ? data?.storeOwnerId
            ? `&storeOwnerId=${data.storeOwnerId}`
            : ""
          : ""
      }${data?.createdAt ? `&createdAt[eq]=${data.createdAt}` : ""}`
    );
  };

  const regionHandler = (e) => {
    setRegion(e.target.value);
    getAllDistricts(e.target.value);
  };

  return (
    <>
      <div className={`${styles.filterBtn}`}>
        <Button
          name="btn"
          type="button"
          size="small"
          onClick={filterOpenClouseHandle}
        >
          Filter
        </Button>
      </div>
      <form
        onSubmit={handleSubmit(filterHandler)}
        className={`${styles.filterContainer} ${
          !filterShow ? styles.displayNone : ""
        }`}
      >
        <Select
          register={register.bind(null, "status")}
          data={statuses}
          placeholder="Barchasi"
          id="status"
        >
          Holati
        </Select>
        {(isAdmin || isSuperAdmin) && (
          <Select
            register={register.bind(null, "storeOwnerId")}
            data={storeOwnerIds}
            placeholder="Barcha Do'konlar"
            id="storeName"
          >
            Do'kon nomi
          </Select>
        )}
       {!isCourier&&<> <Select
          register={register.bind(null, "regionId")}
          data={regions}
          onChange={regionHandler}
          placeholder="Barcha viloyatlar"
          id="viloyatlar"
        >
          Viloyatlar
        </Select>
        <Select
          register={register.bind(null, "districtId")}
          data={districts}
          placeholder="Barcha tumanlar"
          id="tumanlar"
        >
          Tumanlar
        </Select></>}
        <Input type="date" register={register.bind(null, "createdAt")}>
          Sanasi
        </Input>
        <Button
          type="submit"
          name="btn"
          btnStyle={{
            height: "4rem",
            width: "10rem",
          }}
        >
          Saralash
        </Button>
      </form>
    </>
  );
}

export default Filter;
