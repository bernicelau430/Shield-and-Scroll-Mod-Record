import React, { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { Input, Form, Button, Checkbox, Divider, message, Typography, Select, InputNumber } from "antd";
import { useNavigate } from "react-router-dom";
import { db, auth,getDoc,  doc, query, collection, getDocs, addDoc, where, updateDoc, arrayUnion, serverTimestamp } from "../../firebase";

const { Option } = Select;
const { Title } = Typography;

function AddMod() {
	const [loading, setLoading] = useState(false);
	const [options, setOptions] = useState<any>([]);
	const [checked, setChecked] = useState(false);
	const [currentUser, setCurrentUser] = useState<any>();
	let navigate = useNavigate();

	useEffect(() => {
		const fetchData = async() => {
			if (!auth.currentUser) return;
			const q = query(collection(db, "users"), where("admin", "==", false));
			const querySnapshot = await getDocs(q);
			var optionList: Array<any> = [];
			querySnapshot.forEach((user) => {
				const name = user.data().name;
				optionList.push(<Option value={user.id + ',' + user.data().mods}>{name}</Option>);
			});
            setOptions(optionList);
			getDoc(doc(db, "users", auth.currentUser.uid)).then((user) => {
				setCurrentUser(user.data());
			})
		}
        fetchData();
	}, [])

	const onFinish = (values: any) => {
		const { mods, event_name, selected_user } = values;
		if (!mods || !event_name) {
			message.error("Please select a valid user, mod value, and title");
			return;
		}
		const submit = async() => {
			if (checked) {
				if (!auth.currentUser) return;
				addDoc(collection(db, "mod_submissions"), {
                    user_id: auth.currentUser.uid,
                    name: currentUser.name,
                    event_name: event_name,
                    status: 'approved',
                    mods: mods,
                    last_updated: serverTimestamp(),
                }).then((docRef) => {
					getDocs(collection(db, "users")).then((querySnapshot) => {
						querySnapshot.forEach((user) => {
							updateDoc(doc(db, "users", user.id), {
								mod_submissions: arrayUnion(docRef.id),
								mods: (parseFloat(user.data().mods) + parseFloat(mods)).toFixed(2).toString(),
							}).then(() => {
								navigate("/admin_dashboard")
							}).catch((err) => {
								console.log(err)
							})
						});
					})
					message.success("Added mods to all users!");
				})
			} else {
            getDoc(doc(db, "users", selected_user)).then((userData: any) => {
                const { name } = userData.data(); 
                addDoc(collection(db, "mod_submissions"), {
                    user_id: selected_user,
                    name: name,
                    event_name: event_name,
                    status: 'approved',
                    mods: mods,
                    last_updated: serverTimestamp(),
                }).then((docRef) => {
                    const arr = selected_user.split(',');
                    updateDoc(doc(db, 'users', arr[0]), {
                        mod_submissions: arrayUnion(docRef.id),
                        mods: (parseFloat(arr[1]) + parseFloat(mods)).toFixed(2).toString(),
                    }).then(() => {
                        message.success("Added Submission!");
                        navigate('/admin_dashboard');
                    }).catch((err: any) => {
                        message.error(err);
                    })
                })
            })
		}
        }
        submit();
		
	}

	const onFinishFailed = (err: any) => {
		message.error(err);
	}

	return (
		<>
		<Divider>Add Mods</Divider>
			<Form
	      name="basic"
	      labelCol={{ span: 8 }}
	      wrapperCol={{ span: 8 }}
	      onFinish={(values) => onFinish(values)}
	      onFinishFailed={onFinishFailed}
	      autoComplete="off"
	    >
			<Form.Item label="Select a User" name="selected_user" rules={[{ required: !checked, message: 'Please a user!' }]}>
			<Select
			    showSearch
			    placeholder="Search to Select User"
			    optionFilterProp="children"
			    filterOption={(input, option) => (option!.children as unknown as string).includes(input)}
			    filterSort={(optionA, optionB) =>
			      (optionA!.children as unknown as string)
			        .toLowerCase()
			        .localeCompare((optionB!.children as unknown as string).toLowerCase())
			    }
			  >
			    {options}
			</Select>
			<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)}>Check to select all Users</Checkbox>
			</Form.Item>
				<Form.Item label="Title" name="event_name"
        rules={[{ required: true, message: 'Please input a title' }]}>
					<Input placeholder="Missing Mods"/>
				</Form.Item>
				<Form.Item label="Mod Value" name="mods"
        rules={[{ required: true, message: 'Please input your mod number!' }]}>
					<InputNumber style={{width: "100%"}} stringMode step="0.05" min="0.05" placeholder="1 minute => 0.05 mods"/>
				</Form.Item>
	      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
	        <Button danger type="primary" loading={loading} htmlType="submit">
	          Submit
	        </Button>
	      </Form.Item>
	    </Form>
		<Divider>{`Mod value must be divisible by 0.05. 1 minute => 0.05 mods`}</Divider>
		</>
	);
}

export default AddMod;