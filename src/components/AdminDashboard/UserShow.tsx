import React, { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { Descriptions, Divider, Button, Tag, Table, List, Spin, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { db, doc, getDocs, auth, collection, getDoc, updateDoc, onSnapshot } from "../../firebase";
import dayjs from "dayjs";
import { SettingOutlined } from '@ant-design/icons';

const { Title } = Typography;

function UserShow() {
	let navigate = useNavigate();
	let { userId } = useParams();
	const [submissions, setSubmissions] = useState<any>([]);
	const [user, setUser] = useState<any>();
	const [settings, setSettings] = useState<any>();

	useEffect(() => {
		if (!userId) return;
		let isSubscribed = true;
		getDocs(collection(db, "settings")).then((snapshot: any) => {
			snapshot.forEach((setting: any) => {
				setSettings(setting.data());
			})
		})
		const unsubscribe = onSnapshot(doc(db, "users", userId), (querySnapshot: any) => {
			  const userData = querySnapshot.data();
			  const { mod_history, ...rest } = userData;
			  const modHistoryCopy = mod_history.reverse();
			if (isSubscribed) setUser({ mod_history: modHistoryCopy, ...rest});
				userData.mod_submissions.forEach((submission: any) => {
					getDoc(doc(db, "mod_submissions", submission)).then((data: any) => {
							const submissionData = data.data();
							if (isSubscribed) setSubmissions((content: any) => [submissionData, ...content]);
					})
				});
		});
		return () => {
			isSubscribed = false;
			unsubscribe();
		}
	}, [userId]);

	const submissionColumns = [
		{
	    title: 'User Name',
	    dataIndex: 'name',
	    key: 'name',
		},
		{
			title:'Event Name',
			dataIndex: 'event_name',
			key: 'event_name',
			},
		{
	    title: 'Start Time',
	    dataIndex: 'start_time',
	    key: 'start_time',
		sorter: (a: any, b: any) => dayjs(a).diff(dayjs(b)),
		},
		{
	    title: 'End Time',
	    dataIndex: 'end_time',
	    key: 'end_time',
		},
		{
	    title: 'Mods',
	    dataIndex: 'mods',
	    key: 'mods',
			sorter: (a: any, b: any) => parseFloat(a.mods) - parseFloat(b.mods),
		},
		{
	    title: 'Status',
	    dataIndex: 'status',
	    key: 'status',
			render: (_: any, { status }: any) => {
				if (status === "pending") {
					return <Tag color="gold" key="pending">{status.toUpperCase()}</Tag>
				} else if (status === "approved") {
					return <Tag color="cyan" key="approved">{status.toUpperCase()}</Tag>
				} else {
					return <Tag color="red" key="denied">{status.toUpperCase()}</Tag>	
				}
			}
		},
			{
	    title: 'Last Updated',
	    dataIndex: 'last_updated',
	    key: 'last_updated',
			render: (_: any, { last_updated}: any) => {
				return last_updated.toDate().toDateString();
			}
		},
	];

	if (!user) return <Spin tip= "Loading..."/>
	return (
		<>
		<Descriptions title={<Title  style={{marginTop: '25px', marginLeft: '25px'}} level={2}>User's Information</Title>} bordered>
    <Descriptions.Item label="User's Name">{user.name}</Descriptions.Item>
    <Descriptions.Item label="Mods">{user.mods}</Descriptions.Item>
	<Descriptions.Item label="Required Mods">{settings[settings.current_term]}</Descriptions.Item>
    <Descriptions.Item label="User Email" span={2}>{user.email}</Descriptions.Item>
	<Descriptions.Item label="Mod Submissions">{user.mod_submissions.length}</Descriptions.Item>
    <Descriptions.Item label="Induction">
      {user.induction_term}/{user.induction_year}
    </Descriptions.Item>
    <Descriptions.Item label="Registry">
      {user.registry}
    </Descriptions.Item>
		<Descriptions.Item label="Edit User">
			<Button type="primary" danger onClick={() => navigate("/admin_dashboard/editUser/" + userId)} shape="circle" icon={<SettingOutlined />} />
    </Descriptions.Item>
		<Divider />
  </Descriptions>
  <Divider />
			<Table
        columns={submissionColumns}
        dataSource={submissions}
		title={() => <Title level={2}>User's Submissions</Title>}
      />
	  <Divider />
	  		<List 
			header={<Title level={5}>Mods Approved By Term</Title>}
			bordered
			dataSource={user.mod_history}
			renderItem={(item: any) => <List.Item>{item}</List.Item>}
		/>
		</>
	);
}

export default UserShow;