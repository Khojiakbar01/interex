import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import http from "../../utils/axios-instance";
import AppContext from "../../context/AppContext";
import styles from "./Login.module.css";
import UsernameIcon from "../../assets/icons/UsernameIcon";
import LoginIcon from "../../assets/icons/LoginIcon";
import PasswordIcon from "../../assets/icons/PasswordIcon";
import Button from "../../components/Form/FormComponents/Button/Button";
const schema = yup.object().shape({
	username: yup
		.string()
		.trim()
		.required("Username bo'sh bo'lishi mumkin emas")
		.min(5, "Username xato kiritildi")
		.max(20, "Username xato kiritildi"),
	password: yup
		.string()
		.trim()
		.required("Parol bo'sh bo'lishi mumkin emas")
		.min(6, "Parol  xato kiritildi")
		.max(20, "Parol xato kiritildi"),
});

function Login() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});
	const ctx = useContext(AppContext);
	const navigate = useNavigate();
	const [typeState, setTypeState] = useState(null);
	const typeChangeHandler = () => {
		setTypeState(!typeState);
	};
	const login = async (data) => {

		try {
			const res = await http({
				url: "/auth/login",
				method: "POST",
				data,
			});
			localStorage.setItem("token", res.data.data.jwt);
			localStorage.setItem("user", JSON.stringify(res.data.data.user));
			ctx.setAppData({
				user: JSON.parse(localStorage.getItem("user")),
				token: localStorage.getItem("token"),
				isAuth: true,
			});
			navigate("/home");
		} catch (error) {
			toast.error(error.response?.data?.message);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles["left-page"]}>
				<h1>“InterEX Uz”</h1>
				<LoginIcon classname={styles["login-icon"]} />
			</div>
			<div className={styles["right-page"]}>
				<div className={styles["right-page-main-content"]}>
					<h1>Tizimga Kirish</h1>
					<form onSubmit={handleSubmit(login)}>
						<div>
							<label htmlFor="username">
								<div className={styles.spandiv}>
									{/* <span className={styles["input-name"]}>Username </span> */}
									<div className={styles.changeType}>
										<div>
											<UsernameIcon />
										</div>
									</div>
								</div>
								<input
									style={{ borderBottom: errors.username && "1px solid red" }}
									type="text"
									id="username"
									name="username"
									placeholder="Login"
									{...register("username")}
								/>
							</label>
							{errors.username && (
								<p style={{ color: "red" }}>{errors.username.message}</p>
							)}
						</div>
						<div className={styles.password}>
							<label htmlFor="password">
								<div className={styles.spandiv}>
									{/* <span className={styles["input-name"]}>Parol</span> */}
									<div className={styles.changeType}>
										<div onClick={typeChangeHandler}>
											<PasswordIcon />
										</div>
									</div>
								</div>

								<input
									style={{ borderBottom: errors.password && "1px solid red" }}
									type={typeState ? "text" : "password"}
									name="password"
									id="password"
									placeholder="Parol"
									{...register("password")}
								/>
							</label>
							{errors.password && (
								<p style={{ color: "red" }}>{errors.password.message}</p>
							)}
						</div>
						<div style={{ marginTop: "1rem" }}>

							<Button size="medium" name="btn" type="submit" >
								Kirish
							</Button>

						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Login;
