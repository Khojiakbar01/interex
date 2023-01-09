import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import Input from "../../Form/FormComponents/Input/Input";
import SearchIcon from "../../../assets/icons/SearchIcon";
import Burger from "../../../assets/icons/Burger";
import RoundNotifications from "../../../assets/icons/RoundNotifications";
import SmsIcon from "../../../assets/icons/SmsIcon";
import Arrow from "../../../assets/icons/Arrow";
import AppContext from "../../../context/AppContext";
import ArrowForBtn from "../../../assets/icons/ArrowForBtn";
import http from "../../../utils/axios-instance";
import { toast } from "react-toastify";

function Navbar(props) {
	const { user, onReset } = useContext(AppContext);
	const [show, setShow] = useState(false);
	const [notification, setNotification] = useState(false);
	const [arrowChange, setArrowChange] = useState(true);
	const navigate = useNavigate();
	const activeAndNotActiveHandler = () => {
		props.sidebarActiveHandle();
		setArrowChange(!arrowChange);
	};
	const logoutHandle = () => {
		localStorage.clear();
		onReset();
		navigate("/");
	};
	useEffect(() => {
		getNotifications();
	}, []);
	const modalShow = () => {
		setShow(!show);
	};
	const getNotifications = async (click) => {
		try {
			const res = await http({
				url: "/postback/rejected/count",
			});
			click && toast.success("Hech Qanday Eslatmalar Yo'q");
			setNotification(null);
		} catch (error) {
			toast.error(error.response.data.message);
			setNotification(error.response.data.message);
		}
	};

	// show &&
	//   document.addEventListener("click", () => {
	//     setShow(!show);
	//   });

	return (
		<div className={styles.navbar}>
			<div
				onClick={activeAndNotActiveHandler}
				className={`${styles.arrowForBtn} ${
					!arrowChange ? styles.arrowRight : ""
				}`}
			>
				<ArrowForBtn />
			</div>

			<div className={styles.formControl}>
				<Input
					onChange={(e) => {
						props.setSearch(e.target.value);
					}}
					placeholder={"Qidirish"}
				/>
				<div className={styles.searchSvg}>
					<SearchIcon classname={styles.searchSvg} />
				</div>
			</div>
			<div></div>

			<div className={styles.userInfo}>
				<div
					className={styles.RoundNotificationSvg}
					onClick={() => getNotifications(true)}
				>
					<RoundNotifications
						classname={styles.RoundNotificationSvg}
						classRed={notification && styles.notification}
					/>
				</div>

				<div style={{ margin: "0 auto", textAlign: "center" }}>
					<p className={`h5`}>{`${`${
						user.storeName || user.regionName || user.firstName || ""
					}`}`}</p>
					<span>{user.userRole}</span>
				</div>

				<div className={styles.userMenu} onClick={modalShow}>
					<div className={styles.arrowSvg}>
						<Arrow classname={styles.arrowSvg} />
					</div>
					<div
						className={`${styles.userMenuModal} ${
							show ? styles.modalShow : ""
						}`}
					>
						<p
							onClick={logoutHandle}
							className={`h6 ${styles.userMenuModalItem}`}
						>
							Chiqish
						</p>
						<Link
							className={`h6 ${styles.userMenuModalItem}`}
							to={`/settings/${user.id}`}
						>
							Sozlamalar
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Navbar;
