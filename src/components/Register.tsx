import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
} from "../firebase";
import { Button, Form, Input, Col, Select, message } from 'antd';

const { Option } = Select;

function Register() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, loading]);

	const onFinish = async (values: any) => {
		const { name, registry, email, password, induction_term, induction_year } = values;
		try {
			registerWithEmailAndPassword(name, registry, induction_term, induction_year, email, password);
		} catch(e: any) {
			message.error(e);
		}
	}

	const onFinishFailed= (error: any) => {
		message.error(error);
	}

  return (
    <Col style={{
      display: "flex",
      flexDirection: "column",
      marginTop: "10%",
    }}>
		<Form
      name="basic"
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 8  }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Full Name"
        name="name"
        rules={[{ required: true, message: 'Please input your full name!' }]}
      >
        <Input placeholder="John Doe"/>
      </Form.Item>

			<Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input placeholder="example@s.sfusd.edu"/>
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

			<Form.Item
        label="Registry"
        name="registry"
        rules={[{ required: true, message: 'Please input your registry!' }]}
      >
        <Input placeholder="2009"/>
      </Form.Item>

			<Form.Item
        label="Induction Term"
        name="induction_term"
        rules={[{ required: true, message: 'Please input the semester you joined!' }]}
      >
        <Select placeholder="Please select the semester you joined.">
					<Option value="Fall">Fall</Option>
          <Option value="Spring">Spring</Option>
				</Select>
      </Form.Item>

			<Form.Item
        label="Induction Year"
        name="induction_year"
        rules={[{ required: true, message: 'Please input the year you joined!' }]}
      >
        <Input placeholder="2022"/>
      </Form.Item>

      <Form.Item wrapperCol={{ span: 16, offset: 10 }}>
        <Button danger type="primary" loading={loading} htmlType="submit">
          Register
        </Button>
      </Form.Item>

			<Form.Item  wrapperCol={{ span: 16, offset: 10 }}>
				Already have an account? <Link to="/">Sign In</Link> here.
			</Form.Item>
    </Form>
    </Col>
  );
}

export default Register