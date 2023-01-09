import { useContext, useState } from "react";
import Button from "../../components/Form/FormComponents/Button/Button";
import Layout from "../../components/Layout/Layout";
import UpdatePassword from "../../components/UpdatePassword/UpdatePassword";
import AppContext from "../../context/AppContext";

const Settings = () => {
	const [updatePassword, setUpdatePassword] = useState(false);
	const { user } = useContext(AppContext);

    const updateSelfPassword = () => {
		setUpdatePassword(!updatePassword);
	};

    return ( 
        <Layout>
    
        <div>

       <div style={{width: '10rem',marginBottom: '1rem'}}>
        <Button
        name="btn"
            onClick={updateSelfPassword}
            style={{
                cursor: "pointer",
            }}
        >
            {!updatePassword ? "Parolni o'zgartirish" : "Paroldan chiqish"}
        </Button>
        </div> 
        {updatePassword && <UpdatePassword id={user.id} />}
    </div>    </Layout>
     );
}
 
export default Settings;