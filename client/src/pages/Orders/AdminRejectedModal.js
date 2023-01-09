import { toast } from "react-toastify";
import Button from "../../components/Form/FormComponents/Button/Button";
import Modal from "../../components/Modal/Modal";
import http from "../../utils/axios-instance";
const AdminRejectedModal = ({ id, filter, onClose }) => {
    const changeOrderStatus = async () => {
        try {
          const res = await http({
            url: `/orders/${id.id}`,
            method: "PATCH",
            data: {
              orderStatus: id.status,
            },
          });
          filter();
          onClose()
        } catch (error) {
          toast.error(error?.response?.data?.message);
        }
      };
  return (
    <Modal onClose={onClose}>

      <div style={{ padding: "20px"}}>
       <h2> Mahsulotni bekor qilish</h2>
       <div style={{display:"flex" }}>

      <Button
          size="small"
          name="btn"
          btnStyle={{backgroundColor:"red"}}
          onClick={() => onClose()}
          >
         Yoq
        </Button>
        <Button
          size="small"
          name="btn"
          onClick={() => changeOrderStatus()}
          >
          Xa
        </Button>
            </div>
      </div>
    </Modal>
  );
};

export default AdminRejectedModal;
