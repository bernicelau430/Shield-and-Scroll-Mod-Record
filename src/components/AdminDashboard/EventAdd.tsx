import React from "react";
import AdminMenu from "./AdminMenu";
import { Input, Form, Button, Divider,  message } from "antd";
import { useNavigate } from "react-router-dom";
import { db, collection, addDoc } from "../../firebase";

function EventAdd() {
	let navigate = useNavigate();

	const onFinish = (values: any) => {
		const { event_name } = values;
		if (!event_name) {
			message.error("Please enter a valid Event Name");
			return;
		}
		const submit = async() => {
			addDoc(collection(db, "events"), {
				event_name: event_name,
                active: true,
			}).then(() => {
                message.success("Successfully Added Event!");
                navigate('/admin_dashboard/event/list');
            });
		}
        submit();
		
	}

	const onFinishFailed = (err: any) => {
		message.error(err);
	}

	return (
		<>
		<Divider>Add Events</Divider>
			<Form
	      name="basic"
	      labelCol={{ span: 8 }}
	      wrapperCol={{ span: 8 }}
	      onFinish={onFinish}
	      onFinishFailed={onFinishFailed}
	      autoComplete="off"
	    >
        <Form.Item label="Event Name" name="event_name" rules={[{ required: true, message: 'Please input your event name!' }]}>
            <Input placeholder="Back To School Night"/>
        </Form.Item>
	      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
	        <Button danger type="primary" htmlType="submit">
	          Submit
	        </Button>
	      </Form.Item>
	    </Form>
		</>
	);
}

export default EventAdd;