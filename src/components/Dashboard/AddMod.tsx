import React, { useState, useEffect } from "react";
import MemberMenu from "./MemberMenu";
import { Form, Button, message, Divider, Col, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { db, auth, doc, query, collection, getDocs, where, updateDoc, addDoc, arrayUnion, serverTimestamp } from "../../firebase";
import DatePicker from "../DatePicker";
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

function AddMod({ user }: {user: any}) {
	const [loading, setLoading] = useState(false);
	const [events, setEvents] = useState<JSX.Element[]>([]);
	const [selectedEvent, setSelectedEvent] = useState('');
	const [startTime, setStartTime] = useState();
	const [endTime, setEndTime] = useState();
	let navigate = useNavigate();

	// We find all active events and make their names into values we can select
    useEffect(() => {
        const q = query(collection(db, "events"), where("active", "==", true));
        const querySnapshot = async () => {
            const docs = await getDocs(q);
            let options: Array<JSX.Element> = [];
            docs.forEach((event) => {
                const name = event.data().event_name;
                options.push(<Option value={name}>{name}</Option>);
            });
            setEvents(options);
        }
        querySnapshot();
    }, []);
	

	const onFinish = (values: any) => {
		if (!selectedEvent || !startTime|| !endTime) {
			message.error("Please select a valid start date + time, end date + time, and event");
			return;
		}
		const minutes = Math.abs(dayjs(startTime).diff(dayjs(endTime), 'minute')) + 1;
		const mods = (minutes * 0.05).toFixed(2).toString();
		const docRef = async () => {
            if (!auth.currentUser) return;
           addDoc(collection(db, "mod_submissions"), {
                user_id: auth.currentUser.uid,
				name: user.name,
                event_name: selectedEvent,
                status: 'pending',
                start_time: dayjs(startTime).format("YYYY-MM-DD h:mm A"),
                end_time: dayjs(endTime).format("YYYY-MM-DD h:mm A"),
                mods: mods,
                last_updated: serverTimestamp(),
            }).then((ref) => {
                if (!auth.currentUser) return;
                updateDoc(doc(db, 'users', auth.currentUser.uid), {
                    mod_submissions: arrayUnion(ref.id),
                }).then(() => {
                    message.success("Added Submission!");
                    navigate('/dashboard');
                }).catch((err) => {
                    message.error(err);
                })
            });
    }
        docRef();
	}

	const onFinishFailed = (err: any) => {
		message.error(err);
	}

	return (
		<>
			<Divider>Create a Mod Submission</Divider>
			<Col style= {{
				display: "flex",
				justifyContent: "center",
				flexDirection: "column",
				alignItems: "center",
			}}>
			<Form
	      name="basic"
	      labelCol={{ span: 12 }}
	      wrapperCol={{ span: 16 }}
	      onFinish={onFinish}
	      onFinishFailed={onFinishFailed}
	      autoComplete="off"
	    >
			<Form.Item label="Search and select Event">
				<Select
			    showSearch
			    placeholder="Search to Select Event"
			    optionFilterProp="children"
			    filterOption={(input, option) => (option!.children as unknown as string).includes(input)}
			    filterSort={(optionA, optionB) =>
			      (optionA!.children as unknown as string)
			        .toLowerCase()
			        .localeCompare((optionB!.children as unknown as string).toLowerCase())
			    }
					onChange={(value) => setSelectedEvent(value)}
			  >
			    {events}
			  </Select>
			  </Form.Item>
				<Form.Item label="Enter Hours (Make sure to click Ok!)">
					<RangePicker 
						showTime={{ format: 'h:mm A', use12Hours: true }}
			      format="YYYY-MM-DD h:mm A"
			      onOk={(value: any) => {
                            if (value.length === 2) {
							    setStartTime(value[0]);
							    setEndTime(value[1]);
                            }
						}}
					/>
				</Form.Item>
	      <Form.Item wrapperCol={{ offset: 12, span: 8 }}>
	        <Button danger type="primary" loading={loading} htmlType="submit">
	          Submit
	        </Button>
	      </Form.Item>
	    </Form>
		</Col>
		</>
	);
}

export default AddMod;