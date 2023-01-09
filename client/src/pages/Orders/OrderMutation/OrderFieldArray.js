import { useEffect, useState } from "react";
import OrderItems from "./nestedFieldArray";
import http from "../../../utils/axios-instance";
import Input from "../../../components/Form/FormComponents/Input/Input";
import Button from "../../../components/Form/FormComponents/Button/Button";
import styles from "./OrderField.module.css";
import Select from "../../../components/Form/FormComponents/Select/Select";

const OrderFieldArray = ({
  item,
  register,
  index,
  errors,
  watch,
  regions,
  control,
  remove,
  rId,
  dId,
}) => {
  const [districts, setDistricts] = useState(null);
  const [regionId, setRegionId] = useState(rId);
  const [districtId, setDistrictId] = useState(dId);
  // let districtId = watch(`orders.${index}.districtId`);
  const getAllDistrict = async () => {
    const res = await http({
      url: `regions/${regionId}/districts`,
      method: "GET",
    });
    setDistricts(res.data.data.getDistrictByRegion);
  };
  useEffect(() => {
    regionId && getAllDistrict();
  }, [regionId]);

  return (
    <li
      style={{ borderBottom: "1px solid black", position: "relative" }}
      key={item.id}
    >
      <div className={styles.orderContainer}>
        <div className="bold h6">{index + 1}</div>
        <Input
          placeholder=""
          register={register.bind(null, `orders.${index}.recipient`)}
          error={errors?.orders?.[index]?.recipient?.message}
        >
          Xaridor ismi
        </Input>
        <Input
          placeholder=""
          register={register.bind(null, `orders.${index}.note`)}
          error={errors?.orders?.[index]?.note?.message}
        >
          Izoh
        </Input>
        <Input
          type="text"
          placeholder=""
          register={register.bind(null, `orders.${index}.recipientPhoneNumber`)}
          error={errors?.orders?.[index]?.recipientPhoneNumber?.message}
        >
          Telefon raqami
        </Input>
        <Select
          register={register.bind(null, `orders.${index}.regionId`)}
          data={regions}
          error={
            errors?.orders?.[index]
              ? errors?.orders?.[index]?.regionId?.message
              : ""
          }
          placeholder="Viloyat tanlang"
          onChange={(e) => {
            setRegionId(e.target.value);
          }}
        >
          Viloyat
        </Select>

        <Select
          register={register.bind(null, `orders.${index}.districtId`)}
          data={districts}
          placeholder="Tumanni tanlang"
          error={
            errors?.orders?.[index]
              ? errors?.orders?.[index]?.districtId?.message
              : ""
          }
          onChange={(e) => {
            setDistrictId(e.target.value);
          }}
        >
          Tumanlar
        </Select>
      </div>

      <OrderItems
        orderIndex={index}
        control={control}
        errors={errors}
        register={register}
      />
      <div
        className={styles.btnIconTextContainer}

        onClick={() => remove(index)}
      >
        <Button btnStyle={{width:"6rem",backgroundColor:"rgba(255, 0, 0, 0.575)"}} type="button" name="icon" iconName="trash">
          O'chirish
        </Button>
      </div>
    </li>
  );
};

export default OrderFieldArray;
