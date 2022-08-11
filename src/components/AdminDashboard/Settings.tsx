import React, { useEffect, useState } from "react";
import AdminMenu from "./AdminMenu";
import { Input, Form, Button, message, Spin,Divider,  Select } from "antd";
import { auth, doc, db, updatePassword, updateEmail, updateDoc, getDoc, onSnapshot, logout } from "../../firebase";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

const { Option } = Select;

function Settings() {
    const [user, load, error] = useAuthState(auth);
	const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<any>();
    const navigate = useNavigate();

    useEffect(() => {
		if (!auth.currentUser) return;
        var canSetState = true;
        const unsubscribe = onSnapshot(doc(db, 'users', auth.currentUser.uid), (querySnapshot: any) => {
            if(canSetState) setUserData(querySnapshot.data());
        })
        return ()=> {
            unsubscribe();
            canSetState = false;
        }
    }, [])

    const onFinishEmail = (values: any) => {
        if (!auth.currentUser) return;
        setLoading(true);
        const { email } = values;
        if (email !== userData.email && email) {
        updateEmail(auth.currentUser, email).then(() => {
            if (!auth.currentUser) return;
            updateDoc(doc(db, 'users', auth.currentUser.uid), {
            }).then(() => {
                message.success("Updated Email!");
				logout();
                setLoading(false);
            })
        }).catch((error) => {
            message.error(error);
        })
    }
    };

    const onFinishPassword = (values: any) => {
        if (!auth.currentUser) return;
        setLoading(true);
        const { password } = values;
        if (password) {
			updatePassword(auth.currentUser, password).then(() => {
				message.success("Updated Password");
				logout();
                setLoading(false);
			}).catch((err) => {
                console.log(err)
                setLoading(false);
				message.error(err);
            })
    }
    };

	const onFinish = (values: any) => {
        if (!auth.currentUser) return;
		const { induction_year, induction_term, registry, name } = values;
		setLoading(true);
        updateDoc(doc(db, 'users', auth.currentUser.uid), {
            induction_term: induction_term,
            induction_year: induction_year,
            name: name,
            registry: registry,
        }).then(() => {
            message.success("Successfully Updated Settings");
        }).catch((err) => {
            console.log(err)
            message.error(err);
        })
		setLoading(false);
	};

	const onFinishFailed = (err: any) => {
		message.error(err);
	}

    if (!auth.currentUser || !userData) return <Spin tip="Loading..." size="large"/>

	return (
		<>
		<Divider>Update Email</Divider>
            <Form
	      name="basic"
	      labelCol={{ span: 8 }}
	      wrapperCol={{ span: 8 }}
	      onFinish={onFinishEmail}
	      onFinishFailed={onFinishFailed}
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
	        <Input placeholder="example@s.sfusd.edu"/>
	      </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span:16 }}>
	        <Button danger type="primary" htmlType="submit">
	          Update Email
	        </Button>
	      </Form.Item>
        </Form>
		<Divider>New Password</Divider>
        <Form
	      name="basic"
	      labelCol={{ span: 8 }}
	      wrapperCol={{ span: 8 }}
	      onFinish={onFinishPassword}
	      onFinishFailed={onFinishFailed}
	      autoComplete="off"
	    >
      <Form.Item
	        label="New Password"
	        name="password"
	      >
	        <Input.Password iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>
	      </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
	        <Button danger type="primary" htmlType="submit">
	          Update Password
	        </Button>
	      </Form.Item>
        </Form>
		<Divider>User Info</Divider>
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
        rules={[{ required: true, message: 'Please input the semester you joined!' }]}
      >
        <Select placeholder="Please select the semester you joined.">
					<Option value="fall">Fall</Option>
          <Option value="spring">Spring</Option>
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

export default Settings;