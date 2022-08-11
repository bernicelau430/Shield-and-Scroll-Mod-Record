import React, { useEffect, useState } from "react";
import AdminMenu from "./AdminMenu";
import { Input, Divider, Form, Button, message, Spin, Select, Typography } from "antd";
import { auth, collection, db, doc, getDocs, updateDoc, query, arrayUnion, where } from "../../firebase";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Title } = Typography;

function OrganizationSettings() {
	const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        getDocs(collection(db, "settings")).then((querySnapshot: any) => {
            querySnapshot.forEach((obj: any) => {
                setData(obj.data());
            });
        });
    }, [])

	const onFinish = (values: any) => {
		const { fall, spring, summer } = values;
		setLoading(true);
        getDocs(collection(db, "settings")).then((querySnapshot: any) => {
            querySnapshot.forEach((document: any) => {
                updateDoc(doc(db, 'settings', document.id), {
                    fall: fall,
                    spring: spring,
                    summer: summer,
                }).then(() => {
                    message.success("Successfully changed requirements");
                    navigate('/admin_dashboard');
                }).catch((err) => {
                    console.log(err);
                })
            })
        })
        setLoading(false);
	};

    const onFinishTerm = (values: any) => {
        if (!data) return;
		const { current_term, current_year } = values;
        const term = data["current_term"] === "fall" ? "Fall" : data["current_term"] === "spring" ? "Spring" : "Summer";
		setLoading(true);
        getDocs(collection(db, "settings")).then((querySnapshot: any) => {
            querySnapshot.forEach((document: any) => {
                updateDoc(doc(db, 'settings', document.id), {
                    current_term: current_term,
                    current_year: current_year,
                }).then(() => {
                    getDocs(collection(db, "users")).then((snapshot) => {
                        snapshot.forEach((user) => {
                            updateDoc(doc(db, "users", user.id), {
                                mods: 0,
                                mod_history: arrayUnion(term + " " + current_year + ": " + user.data().mods)
                            })
                        });
                        navigate('/admin_dashboard')
                    })
                }).catch((err) => {
                    console.log(err);
                })
            })
        })
        setLoading(false);
	};

	const onFinishFailed = (err: any) => {
		message.error(err);
	}

    if (!data) return <Spin tip="Loading..." size="large"/>

	return (
		<>
        <Divider>Mod Requirements for Terms</Divider>
		<Form
	      name="basic"
	      labelCol={{ span: 8 }}
	      wrapperCol={{ span: 8 }}
	      onFinish={onFinish}
	      onFinishFailed={onFinishFailed}
	      autoComplete="off"
				initialValues={{'fall': data['fall'], 'spring': data['spring'], 'summer': data['summer']}}
	    >
		<Form.Item
	        label="Fall Mod Requirement"
	        name="fall"
			rules={[{ required: true, message: 'Please enter a valid number!' }]}
	    >
	        <Input placeholder="44"/>
	      </Form.Item>
	      <Form.Item
	        label="Spring Mod Requirement"
	        name="spring"
			rules={[{ required: true, message: 'Please enter a valid number!' }]}
	    >
	        <Input placeholder="44"/>
	      </Form.Item>
          <Form.Item
	        label="Summer Mod Requirement"
	        name="summer"
			rules={[{ required: true, message: 'Please enter a valid number!' }]}
	    >
	        <Input placeholder="44"/>
	      </Form.Item>

	      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
	        <Button danger type="primary" loading={loading} htmlType="submit">
	          Update
	        </Button>
	      </Form.Item>
	    </Form>
        <Divider>Only Change Term/Year when it is a new semester. This will reset all user mods for the new semester.</Divider>
        <Form
	      name="basic"
	      labelCol={{ span: 8 }}
	      wrapperCol={{ span: 8 }}
	      onFinish={onFinishTerm}
	      onFinishFailed={onFinishFailed}
	      autoComplete="off"
				initialValues={{'current_term': data['current_term'], 'current_year': data['current_year']}}
	    >
		<Form.Item
	        label="Current Term"
	        name="current_term"
			rules={[{ required: true, message: 'Please enter a valid term!' }]}
	    >
	        <Select placeholder="Please select the current semester.">
			    <Option value="fall">Fall</Option>
                <Option value="spring">Spring</Option>
                <Option value="summer">Summer</Option>
			</Select>
	      </Form.Item>
          <Form.Item
	        label="Current Year"
	        name="current_year"
			rules={[{ required: true, message: 'Please enter a valid year!' }]}
	    >
	        <Input placeholder="2022"/>
	      </Form.Item>
	      
	      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
	        <Button danger type="primary" loading={loading} htmlType="submit">
	          Change Term
	        </Button>
	      </Form.Item>
	    </Form>
		</>
	);
}

export default OrganizationSettings;