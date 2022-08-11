import React, { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { Button, message, Table, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import { db, auth, doc, collection, getDocs, updateDoc, onSnapshot, logout } from "../../firebase";

function UserList() {
    let navigate = useNavigate();
	const [adminUsers, setAdminsList] = useState<any>([]);
	const [users, setUsers] = useState<any>([]);
	const [settings, setSettings] = useState<any>();

	useEffect(() => {
		getDocs(collection(db, "settings")).then((snapshot: any) => {
			snapshot.forEach((setting: any) => {
				setSettings(setting.data());
			})
		});
	}, [])

	useEffect(() => {
		var isSubscribed = true;

		const unsubscribe = onSnapshot(collection(db, "users"), (querySnapshot) => {
			  var usersList: Array<any> = [];
			    var adminsList: Array<any> = [];
			  querySnapshot.forEach((document) => {
					const data = document.data();
					const { name, mods, ...rest } = data;
					if (data.admin) {
						adminsList.push({key: document.id, name: name});
					} else {
						usersList.push({key: document.id, name: name, required_mods: settings ? settings[settings.current_term] : 0, mods: mods, ...rest});
					}
				});
                if (isSubscribed) {
                    setAdminsList(adminsList);
                    setUsers(usersList);
                }
		});
		return () => {
			isSubscribed = false;
			unsubscribe();
		}
	}, [settings]);

	const handlePromote = async (id : any) => {
		updateDoc(doc(db, "users", id), {
			admin: true,
		}).then(() => {
			message.success("User Promoted");
		}).catch((err) => {
			console.log(err);
		});
	};

	const handleDemote = (id : any) => {
		updateDoc(doc(db, "users", id), {
			admin: false,
		}).then(() => {
			message.success("User Demoted");
            if (auth?.currentUser?.uid === id) {
                logout();
            }
		}).catch((err) => {
			console.log(err);
		});
	};

	const userColumns = [
		{
	    title: 'Members',
	    dataIndex: 'name',
	    key: 'name',
			render: (_: any, { key, name }: any) => {
				return <a onClick={() => navigate("/admin_dashboard/users/" + key)}>{name}</a>
			}
		},
		{
	    title: 'Mods',
	    dataIndex: 'mods',
	    key: 'mods',
		},
		{
			title: 'Required Mods',
			dataIndex: 'required_mods',
			key: 'required_mods',
		},
		{
			title: 'Induction Term',
			dataIndex: 'induction_term',
			key: 'induction_term',
		},
		{
			title: 'Induction Year',
			dataIndex: 'induction_year',
			key: 'induction_year',
		},
		{
	    title: 'Promote',
	    dataIndex: 'promote',
	    key: 'promote',
			render: (_: any, { key }: any) => {
				return <Button danger type="primary" shape="round" onClick={() => handlePromote(key)}>Promote</Button>
			}
		},
	];

	const adminColumns = [
		{
	    title: 'Admins',
	    dataIndex: 'name',
	    key: 'name',
		},
		{
	    title: 'Demote',
	    dataIndex: 'demote',
	    key: 'demote',
			render: (_: any, { key }: any) => {
				return <Button danger type="primary" shape="round" onClick={() => handleDemote(key)}>Demote</Button>
			}
		},
	];

	return (
		<>
		<Divider>Members</Divider>
			<Table
        columns={userColumns}
        dataSource={users}
      />
	  <Divider>Admins</Divider>
			<Table
        columns={adminColumns}
        dataSource={adminUsers}
      />
		</>
	);
}

export default UserList;
