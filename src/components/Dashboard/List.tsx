import React, { useState, useEffect } from "react";
import MemberMenu from "./MemberMenu";
import { Table, Button, Tag, Row, Col, Progress, Divider, Statistic, Typography, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import { db, auth, doc, getDoc, updateDoc, arrayRemove, getDocs, collection, onSnapshot } from "../../firebase";
import { ReloadOutlined } from '@ant-design/icons';
import dayjs from "dayjs";

const { Title } = Typography;

function List({ user }: {user: any}) {
	let navigate = useNavigate();
	const [submissions, setSubmissions] = useState<any[]>([]);
	const [selected, setSelected] = useState([]);
	const [visible, setVisible] = useState(false);
	const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState<any>();
    const [pending, setPending] = useState("0");

	useEffect(() => {
        getDocs(collection(db, "settings")).then((snapshot: any) => {
			snapshot.forEach((setting: any) => {
				setSettings(setting.data());
			})
		})

		if (!Object.keys(user).length || !auth.currentUser) return;
        var canSetState = true;
        setSelected([]);
        const unsubscribe = onSnapshot(doc(db, "users", auth.currentUser.uid), (querySnapshot: any) => {
            querySnapshot.data().mod_submissions.forEach(async (submission_id: any) => {
                const docRef = doc(db, "mod_submissions", submission_id);
                const docData = await getDoc(docRef);
                if (docData.exists()) {
                    const data = docData.data();
                    if (data.status === "pending") setPending(current => (parseFloat(data.mods) + parseFloat(current)).toFixed(2).toString())
                    if(canSetState) setSubmissions(current => [{ key: submission_id, ...data }, ...current]);
                }
                });
            });
        return () => {
            canSetState = false;
            unsubscribe();
        }
	}, [user]);

    const forceRetch = (() => {
        setSelected([]);
        setSubmissions([]);
        user?.mod_submissions?.forEach(async (submission_id: any) => {
            const docRef = doc(db, "mod_submissions", submission_id);
            getDoc(docRef).then((docTemp) => {
                if(docTemp.exists()) {
                    const { user_id, ...rest} = docTemp.data();
                    setSubmissions(current => [...current, {key: submission_id, ...rest}]);
                }
            });
        });
    })

	const columns = [
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
            sorter: (a: any, b:any) => dayjs(a.start_time).diff(dayjs(b.start_time))
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
                if (status === "pending") {
                    return <Tag color="gold" key="pending">{status.toUpperCase()}</Tag>
                } else if (status === "approved") {
                    return <Tag color="cyan" key="approved">{status.toUpperCase()}</Tag>
                } else {
                    return <Tag color="red" key="denied">{status.toUpperCase()}</Tag>	
                }
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

	const handleConfirm = () => {
		if (!selected) return;
		setLoading(true);
        if(!auth.currentUser) return;
        updateDoc(doc(db, "users", auth.currentUser.uid), {
            mod_submissions: arrayRemove(...selected),
        }).then(() => {
            message.success("Removed Submissions");
        }).catch(() => {
            message.error("Error in removing Submission");
        })
		setLoading(false);
        setVisible(false);
		setSelected([]);
	}

	const rowSelection = {
	  onChange: (selectedRowKeys: any) => {
	    setSelected(selectedRowKeys)
	  },
      selectedRowKeys: selected,
	};

    if (!settings || !user) return <Spin tip="Loading.."/>

	return (
		<>
        <Divider>User Statistics</Divider>
        <Row gutter={24}>
            <Col span={6} offset={4}>
                <Statistic title="Mods Approved" value={user.mods}/>
            </Col>
            <Col span={6}>
            <Statistic title="Mods Required" value={settings[settings.current_term]}/>
            </Col>
            <Col span={6}>
            <Statistic title="Mods Pending" value={pending}/>
            </Col>
        </Row>
        <Divider>User Submissions</Divider>
        <Table     
            title={() => <Row style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "baseline",
            }}><Title level={3}>Your Submissions</Title><Button danger type="primary" shape="round" icon={<ReloadOutlined />} onClick={() => forceRetch()}> Reload Your Submissions </Button></Row>}
            columns={columns}
            dataSource={submissions}
         />
		</>
	);
}

export default List;