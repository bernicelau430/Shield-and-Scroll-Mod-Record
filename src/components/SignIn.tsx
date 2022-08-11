import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword, db, doc, getDoc } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button, Form, Input, message, Col } from 'antd';

function SignIn() {
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    useEffect(() => {
        if (loading || !user) {
        // maybe trigger a loading screen
        return;
        }
        const docRef = doc(db, "users", user.uid);
        const docSnap = async () => {
            const data = await getDoc(docRef); 
            if(data.exists()) {
                data.data().admin ? navigate("/admin_dashboard") : navigate("dashboard");
            }
        };
        docSnap();
    }, [user, loading]);
  
      const onFinish = async (values: any) => {
        signInWithEmailAndPassword(auth, values.email, values.password).catch((err) => {
            message.error("Check email and password has been inputted correctly");
        });
      }
      
      const onFinishFailed = (err: any) => {
          message.error(err);
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
          <Input />
        </Form.Item>
  
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
  
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button danger shape="round" type="primary" loading={loading} htmlType="submit">
            Sign In
          </Button>
        </Form.Item>
      </Form>
                    <Form.Item >
                  <Link to="/reset">Forgot Password</Link>
              </Form.Item>
  
              <Form.Item >
                  Don't have an account? <Link style={{ textDecoration: "underline"}} to="/register">Register</Link> now.
              </Form.Item>
      </Col>
    );
  }
  export default SignIn;