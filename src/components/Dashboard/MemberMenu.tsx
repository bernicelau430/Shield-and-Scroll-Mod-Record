import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Menu } from "antd";
import { SettingOutlined, PlusCircleOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { logout } from "../../firebase";

function MemberMenu() {
	let navigate = useNavigate();
	let location = useLocation();
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState(location.pathname);
	
    const items = [
		{
			label: "Member Dashboard",
			key: "/dashboard",
            icon: <UserOutlined />,
		},
		{
			label: "Add Mods",
			key: "/dashboard/add",
            icon: <PlusCircleOutlined />,
		},
		{
			label: "Settings",
			key: "/dashboard/settings",
            icon: <SettingOutlined />,
		},
		{
			label: "Log Out",
			key: "logout",
            icon: <LogoutOutlined />,
		},
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
        style={{display: "flex", justifyContent: "center", marginBottom: '25px'}}
    />
	);
}

export default MemberMenu;