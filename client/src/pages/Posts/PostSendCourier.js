import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/Form/FormComponents/Button/Button";
import Input from "../../components/Form/FormComponents/Input/Input";
import Modal from "../../components/Modal/Modal";
import ExampleComponent from "../../components/VoiceRecorder/Example";
import AppContext from "../../context/AppContext";
import http from "../../utils/axios-instance";

const PostSendCourier = ({ id, url, onClose }) => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();
  useEffect(() => {
   reset({phone:"+998"})
  },[])
  const sendPost = async (data) => {
    try {
      const res = await http({
        url:
          user.userRole === "ADMIN"
            ? `/posts/${id}/send`
            : `/postback/${id}/send/rejected`,
        method: "PUT",
        data: {
          postStatus:
            user.userRole === "ADMIN" ? "DELIVERING" : "REJECTED_DELIVERING",
         ...data
        },
      });
      toast.success(res.data.message);
    } catch (error) {
      error.response.data.error.errors.map(e=>{
        toast.error(e.msg)
      })
    } finally {
      onClose();
    }
  };
  const changeOrderStatusByCourier = async (data) => {
    if(data.expense === "") {
      data.expense = 0
    }
    try {
      const res = await http({
        url: `/orders/delivered/${id.id}/status`,
        method: "PUT",
        data: {
         orderStatus: id.status,
         note: data.comment,
         expense: data.expense||0
        },
      });
    } catch (error) {
    } finally {
      onClose();
    }
  }
  return (
    <Modal onClose={onClose}>

        <form style={{padding: "20px"}} onSubmit={handleSubmit(((url === "/orders/delivered"||url===`/posts/${id.postId}/orders`) && changeOrderStatusByCourier) ||
      ((url === "/postback" || url === "/posts") && sendPost))} className="form">
				{	(url === "/postback" || url === "/posts")&&<><Input
						id="text"
						type="text"
						placeholder="Ismi"
						register={register.bind(null, "name")}
						error={errors.name?.message}
					/>
					<Input
						id="phone"
						type="text"
						placeholder="Telefon Raqami"
						register={register.bind(null, "phone")}
						error={errors.phone?.message}
					/>

					<Input
						id="avtoNumber"
						type="text"
						placeholder="Mashina Raqami"
						register={register.bind(null, "avtoNumber")}
						error={errors.avtoNumber?.message}
					/>
					</>}
					<Input
						id="text"
						type="text"
						placeholder="Eslatma"
						register={register.bind(null, "comment")}
						error={errors.comment?.message}
					/>
         {user.userRole==="COURIER"&&(id.status==="SOLD"||id.status==="REJECTED")&&  <Input
						id="text"
						type="number"
						placeholder="Ortiqcha harajat"
						register={register.bind(null, "expense")}
						error={errors.expense?.message}
					/>}
   {user.userRole==="COURIER"&&(id.status==="SOLD"||id.status==="PENDING"||id.status==="REJECTED")&&<ExampleComponent/>}

					<Button type="submit" size="small" name="btn" className="btnLogin">
          {((url === "/orders/delivered"||url===`/posts/${id.postId}/orders`) && `${id.statusUz}`) ||
      ((url === "/postback" || url === "/posts") && "Send Post")}
					</Button>
				</form>
    </Modal>
  );
};

{/* <div style={{ padding: "20px" }}>
  <Input
    type="text"
    placeholder="note"
    onChange={(e) => setNote(e.target.value)}
  />

  <Button
    name="btn"
    size="small"
    btnStyle={{ marginTop: "10px" }}
    onClick={
      ((url === "/orders/delivered"||url===`/posts/${id.postId}/orders`) && changeOrderStatusByCourier) ||
      ((url === "/postback" || url === "/posts") && sendPost)
    }
  >
    {((url === "/orders/delivered"||url===`/posts/${id.postId}/orders`) && `${id.status} Order`) ||
      ((url === "/postback" || url === "/posts") && "Send Post")}
  </Button>
</div> */}
export default PostSendCourier;
