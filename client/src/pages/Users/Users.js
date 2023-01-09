import { useContext, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import http from "../../utils/axios-instance";
import { useState } from "react";
import { BasicTable } from "../../components/Table/BasicTable";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import Switch from "../../components/Form/FormComponents/Switch/Switch";
import Button from "../../components/Form/FormComponents/Button/Button";
import AppContext from "../../context/AppContext";
import { phoneNumberFormat } from "../../utils/phoneNumberFormatter";
function Users() {
  const [value, setValue] = useState([]);
  const [pagination, setPagination] = useState({});
  const [searchParams] = useSearchParams();
  let page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 10;
  const { user } = useContext(AppContext);
  const [role,setRole] = useState(null)
  const [search,setSearch] = useState(null)
  const getAllUser = async () => {
    try {
      const res = await http({
        url: `/users?page=${page}&size=${size}${search?`&search=${search}`:""}${role?`&userRole=${role}`:""}`,
      });
      setValue(res.data.data.content);
      setPagination(res.data.data.pagination);
    } catch (error) {
      toast.error(error?.response.data.message);
    }
  };
  useEffect(()=>{
    page=1
    getAllUser()
  },[role])
  useEffect(() => {
    getAllUser();
  }, [page,search]);

  const userStatusChangeHandler = async ({ id, status }) => {
    try {
      const res = await http({
        url: `users/${id}/status`,
        data: { status },
        method: "PUT",
      });

      getAllUser();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const usersCols = [
    {
      id:"role",
      Header:"Nomi",
      accessor: (user) => {
      return (
        <>
        {user?.storeName||user?.region?.name||"Interex"}
        </>
      )
      }
    },
    {
      id: "fullName",
      Header: "F.I.Sh",
      accessor: (user) => {
        return `${user.firstName} ${user.lastName}`;
      },
    },
    { id: "phoneNumber", Header: "Telefon raqam", accessor: (order) => {
      return (
        <a href={`tel:${order?.phoneNumber}`}>
          <b>{phoneNumberFormat(order?.phoneNumber)}</b>
        </a>
      );
    },},
    {
      id: "passportNumber",
      Header: "Passport raqam",
      accessor: "passportNumber",
    },
    { id: "status", Header: "Mansabi", accessor: "userRoleUz" },
  ];
  const superAdminAction = [
    {
      id: "actions",
      Header: "actions",
      accessor: (user) => {
        return (
          <Link to={`/users/${user.id}`}>
            <Button
              size="iconSmall"
              name="icon"
              iconName="pen"
              btnStyle={{
                margin: "0 auto",
                width: "4rem",
              }}
            />
          </Link>
        );
      },
    },
    {
      id: "userStatus",
      Header: "Status",
      accessor: (user) => {
        const status = user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
        return (
          <Switch
            onSwitch={userStatusChangeHandler.bind(null, {
              id: user.id,
              status,
            })}
            enabled={user.status === "ACTIVE"}
            style={{ margin: "0 auto" }}
          />
        );
      },
    },
  ];
  if (user.userRole === "SUPER_ADMIN") {
    usersCols.push(...superAdminAction);
  }
  return (
    <Layout pageName="Foydalanuvchilar" setSearch={setSearch}>
      {user.userRole === "SUPER_ADMIN" && (
        <Link style={{ width: "10rem", display: "block" }} to="/users/new">
          <Button size="iconSmall" name="btn">
            Foydalanuvchi qo'shish
          </Button>
        </Link>
      )}
    <div style={{display: "flex",gap:"1rem", marginTop: "1rem"}}>
    <Button name="btn" disabled={role===null} onClick={()=>setRole(null)}>Barchasi</Button>
    <Button name="btn" disabled={role==="ADMIN"} onClick={()=>setRole("ADMIN")}>Adminlar</Button>
    <Button name="btn" disabled={role==="COURIER"} onClick={()=>setRole("COURIER")}>Viloyat Boshliqlari</Button>
    <Button name="btn" disabled={role==="STORE_OWNER"} onClick={()=>setRole("STORE_OWNER")}>Firmalar</Button>
    </div> 
      {value?.length > 0 ? (
        <BasicTable
          columns={usersCols}
          data={value}
          pagination={pagination}
          url="/users"
        />
      ) : (
        <p>Malumotlar yoq</p>
      )}
    </Layout>
  );
}

export default Users;
