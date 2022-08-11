import React, { useEffect, useState } from "react";
import { Input, Form, Divider, Button, message, Spin, Select } from "antd";
import { auth, doc, db, updateDoc, onSnapshot } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;

function UserEdit() {
    const { userId } = useParams();
	const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<any>();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) return;
        var canSetState = true;
        const unsubscribe = onSnapshot(doc(db, 'users', userId), (querySnapshot: any) => {
            if(canSetState) setUserData(querySnapshot.data());
        })
        return ()=> {
            unsubscribe();
            canSetState = false;
        }
    }, [userId])

	const onFinish = (values: any) => {
        if (!auth.currentUser || !userId) return;
		const { induction_year, induction_term, registry, name } = values;
		setLoading(true);
        updateDoc(doc(db, 'users', userId), {
            induction_term: induction_term,
            induction_year: induction_year,
            name: name,
            registry: registry,
        }).then(() => {
            message.success("Successfully Updated Settings");
            navigate("/admin_dashboard/users/" + userId);
        }).catch((err) => {
            console.log(err)
            message.error(err);
        })
		setLoading(false);
	};

	const onFinishFailed = (err: any) => {
		message.error(err);
	}

    if (!userId || !userData) return <Spin tip="Loading..." size="large"/>

	return (
		<>
		<Divider>Email</Divider>
            <Form
	      name="basic"
	      labelCol={{ span: 8 }}
	      wrapperCol={{ span: 8 }}
	      autoComplete="off"
				initialValues={{
                    'email': userData.email, 
                 }}
	    >
            	<Form.Item
	        label="Email"
	        name="email"
			rules={[{ required: true, message: 'Please enter a valid email address!' }]}
	    >
	        <Input disabled placeholder="example@s.sfusd.edu"/>
	      </Form.Item>
        </Form>
		<Divider>User Information</Divider>
		<Form
	      name="basic"
	      labelCol={{ span: 8 }}
	      wrapperCol={{ span: 8 }}
	      onFinish={onFinish}
	      onFinishFailed={onFinishFailed}
	      autoComplete="off"
				initialValues={{
                    'registry': userData.registry,
                    'induction_term': userData.induction_term,
                    'induction_year': userData.induction_year,
                    'name': userData.name,
                 }}
	    >
			<Form.Item
        label="Induction Term"
        name="induction_term"
        rules={[{ required: true, message: 'Please input the semester user joined!' }]}
      >
        <Select placeholder="Please select the semester user joined.">
					<Option value="Fall">Fall</Option>
          <Option value="Spring">Spring</Option>
				</Select>
      </Form.Item>
          <Form.Item
	        label="Induction Year"
	        name="induction_year"
            rules={[{ required: true, message: 'Please enter a valid induction year!' }]}
	      >
	        <Input placeholder="2022"/>
	      </Form.Item>
          <Form.Item
	        label="Name"
	        name="name"
            rules={[{ required: true, message: 'Please enter a valid name!' }]}
	      >
	        <Input placeholder="John Doe"/>
	      </Form.Item>
          <Form.Item
	        label="Registry"
	        name="registry"
            rules={[{ required: true, message: 'Please enter a valid registry!' }]}
	      >
	        <Input placeholder="2209"/>
	      </Form.Item>

	      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
	        <Button danger type="primary" loading={loading} htmlType="submit">
	          Update Data
	        </Button>
	      </Form.Item>
	    </Form>
        </>
	);
}

export default UserEdit;