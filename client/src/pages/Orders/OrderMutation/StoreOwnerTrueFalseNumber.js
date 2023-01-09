import { toast } from "react-toastify";
import Modal from "../../../components/Modal/Modal";
import Button from "../../../components/Form/FormComponents/Button/Button";
const StoreOwnerTrueFalseNumber = ({ message, set, onClose }) => {
   const fn=()=>{
    set(true)
    onClose()
   }
  return (
    <Modal onClose={onClose}>

      <div style={{ padding: "20px"}}>
       <h2>{message}</h2>
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
          onClick={fn}
          >
          Xa
        </Button>
            </div>
      </div>
    </Modal>
  );
};

export default StoreOwnerTrueFalseNumber;
