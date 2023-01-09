import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../utils/axios-instance";
import { toast } from "react-toastify";
import Layout from "../../components/Layout/Layout";
import Input from "../../components/Form/FormComponents/Input/Input";
import Button from "../../components/Form/FormComponents/Button/Button";
import Select from "../../components/Form/FormComponents/Select/Select";
import {
	adminSchema,
	storeOwnerSchema,
	courierSchema,
	courierSchemaUpdate,
	adminSchemaUpdate,
	storeOwnerSchemaUpdate,
	defaultSchema,
} from "../../utils/yupSchemas";

const UserMutation = () => {
	const navigate = useNavigate();
	const [role, setRole] = useState(null);
	const [roles, setRoles] = useState(null);
	const [regions, setRegions] = useState(null);
	const [tarifs, setTarifs] = useState(null);
	const { id } = useParams();
	const isUpdate = id !== "new";
	const admin = role === "ADMIN";
	const storeOwner = role === "STORE_OWNER";
	const courier = role === "COURIER";

	const yupResolverObject = () => {
		if (role) {
			if (isUpdate) {
				return (
					(admin && adminSchemaUpdate) ||
					(storeOwner && storeOwnerSchemaUpdate) ||
					(courier && courierSchemaUpdate)
				);
			} else {
				return (
					(admin && adminSchema) ||
					(storeOwner && storeOwnerSchema) ||
					(courier && courierSchema)
				);
			}
		} else {
			return defaultSchema;
		}
	};
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: yupResolver(yupResolverObject()),
	});

  useEffect(() => {
    getAllUserRoles();
    getAllRegions();
	getAllTarifs()
    reset({ phoneNumber:"+998"})
    if (isUpdate) {
      getById();
    }
  }, []);

  const getAllUserRoles = async () => {
    const res = await http({
      url: "/users/roles",
    });
    setRoles(res.data?.data?.roles);
  };
  const getAllRegions = async () => {
    const res = await http({
      url: "/regions",
    });
    setRegions(res.data?.data?.content);
  };
  const getAllTarifs = async () => {
    const res = await http({
      url: "/users/tariffs ",
    });
    setTarifs(res.data?.data?.tariffs);
  };
  const getById = async () => {
    const res = await http({
      url: `/users/${id}`,
    });
    const user = res.data.data.userById;
    if (user.userRole === "COURIER") {
      setRole("COURIER");
    } else if (user.userRole === "STORE_OWNER") {
      setRole("STORE_OWNER");
    }
    reset(user);
  };
  const formSubmit = async (data) => {
    try {
      const res = await http({
        url: isUpdate ? `/users/${id}` : "/users",
        method: isUpdate ? "PUT" : "POST",
        data,
      });
      toast.success(res.data.message);
      navigate("/users");
    } catch (error) {
      return error.response.data.message.map((error) => toast.error(error));
    }
  };
  return (
    <>
      <Layout>
        <form onSubmit={handleSubmit(formSubmit)} className="form">
          <Select
            register={register.bind(null, "userRole")}
            data={roles}
            onChange={(e) => setRole(e.target.value)}
            error={errors.userRole?.message}
          >
            Foydalanuvchi mansabi
          </Select>

					<Input
						id="text"
						type="text"
						placeholder="Ismi"
						register={register.bind(null, "firstName")}
						error={errors.firstName?.message}
					/>

					<Input
						id="text"
						type="text"
						placeholder="Familiyasi"
						register={register.bind(null, "lastName")}
						error={errors.lastName?.message}
					/>

					<Input
						id="text"
						type="text"
						placeholder="Login"
						register={register.bind(null, "username")}
						error={errors.username?.message}
					/>
					{!isUpdate && (
						<>
							<Input
								id="password"
								type="text"
								placeholder="Parol"
								register={register.bind(null, "password")}
								error={errors.password?.message}
							/>
						</>
					)}

					<Input
						id="passportNumber"
						type="text"
						placeholder="Passport Raqam"
						register={register.bind(null, "passportNumber")}
						error={errors.passportNumber?.message}
					/>

					<Input
						id="phoneNumber"
						type="text"
						placeholder="Telefon Raqam"
						register={register.bind(null, "phoneNumber")}
						error={errors.phoneNumber?.message}
					/>
					{role === "STORE_OWNER" && (
						<Input
							id="storeName"
							type="text"
							placeholder="Magazin nomi"
							register={register.bind(null, "storeName")}
							error={errors.storeName?.message}
						/>
					)}

          {role === "COURIER" && (
			<>
            <Select
              register={register.bind(null, "regionId")}
              data={regions}
              error={errors.regionId?.message}
            >
              Viloyatlar
            </Select>
			<Select
              register={register.bind(null, "tariff")}
              data={tarifs?.map((e)=>{
				return { id: e, name: e };
			  })}
              error={errors.tariff?.message}
            >
              Tariflar
            </Select>
			</>
          )}

					<Button type="submit" size="small" name="btn" className="btnLogin">
						{!isUpdate ? "Akkaunt yaratish" : "Akkountni o'zgartirish"}
					</Button>
				</form>
			</Layout>
		</>
	);
};

export default UserMutation;
