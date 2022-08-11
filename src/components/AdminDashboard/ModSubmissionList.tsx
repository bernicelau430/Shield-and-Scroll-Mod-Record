import React, { useEffect, useState } from "react";
import AdminMenu from "./AdminMenu";
import { Tag, Table, Divider, Button, message, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { db, collection, doc, updateDoc, getDoc, query, getDocs, onSnapshot } from "../../firebase";
import dayjs from "dayjs";
import { CheckOutlined, StopOutlined } from "@ant-design/icons";
import { QuerySnapshot } from "firebase/firestore";

const { Title } = Typography;

function ModSubmissionList() {
	let navigate = useNavigate();
    const [pending, setPending] = useState<any>([]);
    const [approved, setApproved] = useState<any>([]);
    const [denied, setDenied] = useState<any>([]);

    useEffect(() => {
		var isSubscribed = true;
        const pendingList: Array<any> = [];
        const approvedList: Array<any> = [];
        const deniedList: Array<any> = [];

		const unsubscribe = onSnapshot(query(collection(db, "mod_submissions")), (querySnapshot: any) => {
            querySnapshot.forEach((document: any) => {
				const data = document.data();
                const { status, name, user_id } = data;
                if(status === "pending") {
                    pendingList.push({key: document.id, name: name, ...data});
                } else if (status === "approved") {
                    approvedList.push({key: document.id, name: name, ...data});
                } else {
                    deniedList.push({key: document.id, name: name, ...data});
                }
			});
                if (isSubscribed) {
                    setPending(pendingList.sort((a, b) => dayjs(a.start_time).diff(dayjs(b.start_time))));
                    setApproved(approvedList.sort((a, b) => dayjs(a.start_time).diff(dayjs(b.start_time))));
                    setDenied(deniedList.sort((a, b) => dayjs(a.start_time).diff(dayjs(b.start_time))));
                }
		});
		return () => {
			isSubscribed = false;
			unsubscribe();
		}
	}, []);

    const refetch = () => {
        getDocs(collection(db, "mod_submissions")).then((querySnapshot) => {
            const pendingList: Array<any> = [];
            const approvedList: Array<any> = [];
            const deniedList: Array<any> = [];
            querySnapshot.forEach((document: any) => {
                const data = document.data();
                const { status, name, user_id } = data;
                if(status === "pending") {
                    pendingList.push({key: document.id, name: name, ...data});
                } else if (status === "approved") {
                    approvedList.push({key: document.id, name: name, ...data});
                } else {
                    deniedList.push({key: document.id, name: name, ...data});
                }
            });
            setPending(pendingList.sort((a, b) => dayjs(a.start_time).diff(dayjs(b.start_time))));
            setApproved(approvedList.sort((a, b) => dayjs(a.start_time).diff(dayjs(b.start_time))));
            setDenied(deniedList.sort((a, b) => dayjs(a.start_time).diff(dayjs(b.start_time))));
        });
    }

    const handleApprove = (key: any, user_id: any, mods: any) => {
        updateDoc(doc(db, "mod_submissions", key), {
            status: "approved",
        }).then(() => {
            getDoc(doc(db, "users", user_id)).then((userData: any) => {
                const data = userData.data();
                updateDoc(doc(db, "users", user_id), {
                    mods: (parseFloat(data.mods) + parseFloat(mods)).toString(),
                })
            }).then(() => {
                message.success("Successfully approved mod submission");
                refetch();
            }).catch((err) => {
                console.log(err);
            })
        });
    }

    const handleDeny = (key: any) => {
        updateDoc(doc(db, "mod_submissions", key), {
            status: "denied",
        }).then(() => {
            message.success("Successfully denied mod submission");
            refetch();
        }).catch((err) => {
            console.log(err);
        })
    }

	const pendingColumns = [
        {
            title: 'User Name',
            dataIndex: 'name',
            key: 'name',
		},
		{
            title: 'Event Name',
            dataIndex: 'event_name',
            key: 'event_name',
		},
		{
            title: 'Start Time',
            dataIndex: 'start_time',
            key: 'start_time',
            sorter: (a: any, b:any) => dayjs(a.start_time).diff(dayjs(b.start_time)),
	    },
        {
            title: 'End Time',
            dataIndex: 'end_time',
            key: 'end_time',
		},
		{
            title: 'Mod Value',
            dataIndex: 'mods',
            key: 'mods',
		    sorter: (a:any, b:any) => parseFloat(a.mods) - parseFloat(b.mods),
		},
		{
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_: any, { status }: any) => {
                 return <Tag color="gold" key="pending">{status.toUpperCase()}</Tag>
            },
		},
		{
			title: "Last Updated",
			dataIndex: 'last_updated',
	        key: 'last_updated',
			render: (_: any, { last_updated }: any) => {

				return <>{last_updated.toDate().toDateString()}</>;
            },
		},
        {
			title: "Approve",
			dataIndex: 'approve',
	        key: 'approve',
			render: (_: any, { key, user_id, mods }: any) => {

				return <Button danger type="primary" onClick={() => handleApprove(key, user_id, mods)} icon={<CheckOutlined />}/>
            },
		},
        {
			title: "Deny",
			dataIndex: 'deny',
	        key: 'deny',
			render: (_: any, { key }: any) => {

				return <Button type="primary" danger onClick={() => handleDeny(key)} icon={<StopOutlined />}/>;
            },
		},
	];

    const approvedColumns = [
        {
            title: 'User Name',
            dataIndex: 'name',
            key: 'name',
		},
		{
            title: 'Event Name',
            dataIndex: 'event_name',
            key: 'event_name',
		},
		{
            title: 'Start Time',
            dataIndex: 'start_time',
            key: 'start_time',
            sorter: (a: any, b:any) => dayjs(a.start_time).diff(dayjs(b.start_time)),
	    },
        {
            title: 'End Time',
            dataIndex: 'end_time',
            key: 'end_time',
		},
		{
            title: 'Mod Value',
            dataIndex: 'mods',
            key: 'mods',
		    sorter: (a:any, b:any) => parseFloat(a.mods) - parseFloat(b.mods),
		},
		{
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_: any, { status }: any) => {
                 return <Tag color="cyan" key="approved">{status.toUpperCase()}</Tag>
            },
		},
		{
			title: "Last Updated",
			dataIndex: 'last_updated',
	        key: 'last_updated',
			render: (_: any, { last_updated }: any) => {

				return <>{last_updated.toDate().toDateString()}</>;
            },
		},
	];

    const deniedColumns = [
        {
            title: 'User Name',
            dataIndex: 'name',
            key: 'name',
		},
		{
            title: 'Event Name',
            dataIndex: 'event_name',
            key: 'event_name',
		},
		{
            title: 'Start Time',
            dataIndex: 'start_time',
            key: 'start_time',
            sorter: (a: any, b:any) => dayjs(a.start_time).diff(dayjs(b.start_time)),
	    },
        {
            title: 'End Time',
            dataIndex: 'end_time',
            key: 'end_time',
		},
		{
            title: 'Mod Value',
            dataIndex: 'mods',
            key: 'mods',
		    sorter: (a:any, b:any) => parseFloat(a.mods) - parseFloat(b.mods),
		},
		{
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_: any, { status }: any) => {
                 return <Tag color="red" key="denied">{status.toUpperCase()}</Tag>
            },
		},
		{
			title: "Last Updated",
			dataIndex: 'last_updated',
	        key: 'last_updated',
			render: (_: any, { last_updated }: any) => {

				return <>{last_updated.toDate().toDateString()}</>;
            },
		},
	];


	return (
		<>
			<Table
        columns={pendingColumns}
        dataSource={pending}
        title={() => <Title level={2}>Pending Submissions</Title>}
      />
      <Divider />
      <Table
        columns={approvedColumns}
        dataSource={approved}
        title={() =>  <Title level={2}>Approved Submissions</Title>}
      />
      <Divider />
			<Table
        columns={deniedColumns}
        dataSource={denied}
        title={() =>  <Title level={2}>Denied Submissions</Title>}
      />
		</>
	);
}

export default ModSubmissionList;