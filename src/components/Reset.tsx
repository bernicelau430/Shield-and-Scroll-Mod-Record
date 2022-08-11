import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth, sendPasswordResetEmail } from "../firebase";
import { Button, Form, Input, Col, message } from 'antd';

function Reset() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);

	const onFinish = async (values: any) => {
		const { email } = values;
		try {
			sendPasswordResetEmail(auth, email);
      message.success("Successfully sent recovery email!");
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
      alignItems: "center",
      marginTop: "25%",
    }}>
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input placeholder="example@s.sfusd.edu "/>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button danger type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>

			<Form.Item >
				<Link to="/">Sign In Here</Link>
			</Form.Item>

			<Form.Item >
				Don't have an account? <Link to="/register">Register</Link> now.
			</Form.Item>
    </Form>
    </Col>
  );
}
export default Reset;