import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader, Button, Menu } from "antd";
import { SettingOutlined, PlusCircleOutlined, LogoutOutlined, CalendarOutlined, ReconciliationOutlined, UserOutlined, SlidersOutlined } from '@ant-design/icons';
import { logout } from "../../firebase";

function AdminMenu({ children, title }: any) {
	let navigate = useNavigate();
	let location = useLocation();
	const [current, setCurrent] = useState<any>(location.pathname);
	const items = [
		{
			label: "Members and Admins",
			key: "/admin_dashboard",
			icon: <UserOutlined />,
		},
		{
			label: "Add Mods",
			key: "/admin_dashboard/mods/add",
			icon: <PlusCircleOutlined />
		},
		{
			label: "Mods Submission List",
			key: "/admin_dashboard/submissions",
			icon: <ReconciliationOutlined />,
		},
		{
			label: "Event List",
			key: "/admin_dashboard/event/list",
			icon: <CalendarOutlined />
		},
		{
			label: "Add Event",
			key: "/admin_dashboard/event/add",
			icon: <PlusCircleOutlined />
		},
		{
			label: "Logistics",
			key: "/admin_dashboard/organization",
			icon: <SlidersOutlined />,
		},
		{
			label: "Settings",
			key: "/admin_dashboard/settings",
			icon: <SettingOutlined />,
		},
		{
			label: "Log Out",
			key: "logout",
			icon: <LogoutOutlined />,
		}
	]

	const onClick = (e: any) => {
		if(e.key === "logout") {
			logout();
		} else {
			setCurrent(e.key);
			navigate(e.key);
		}
	}

	return (
		<Menu
			onClick={onClick}
			selectedKeys={[current]}
			mode="horizontal"
			items={items}
		/>
	);
}

export default AdminMenu