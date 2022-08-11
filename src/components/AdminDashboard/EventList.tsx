import React, { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { Button, message, Divider, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { db, auth, doc, collection, getDocs, updateDoc, onSnapshot, logout } from "../../firebase";

function EventList() {
    let navigate = useNavigate();
	const [activeEvents, setActiveEvents] = useState<any>([]);
    const [deactiveEvents, setDeactiveEvents] = useState<any>([]);

	useEffect(() => {
		var isSubscribed = true;
		const fetchData = async () => {
			const querySnapshot = await getDocs(collection(db, "events"));
			var activeEventsList: Array<any> = [];
            var deactiveEventsList: Array<any> = [];
			querySnapshot.forEach((document: any) => {
				const data = document.data();
				const { event_name, active } = data;
				if(active) {
                    activeEventsList.push({key: document.id, event_name: event_name, active: active });
                } else {
                    deactiveEventsList.push({key: document.id, event_name: event_name, active: active });
                }
			});
			if (isSubscribed) {
                setActiveEvents(activeEventsList);
                setDeactiveEvents(deactiveEventsList);
            }
		}
		fetchData();

		const unsubscribe = onSnapshot(collection(db, "events"), (querySnapshot) => {
			  var activeEventsList: Array<any> = [];
              var deactiveEventsList: Array<any> = [];
			  querySnapshot.forEach((document) => {
					const data = document.data();
					const { event_name, active } = data;
				    if(active) {
                        activeEventsList.push( {key: document.id, event_name: event_name, active: active });
                    } else {
                        deactiveEventsList.push( {key: document.id, event_name: event_name, active: active });
                    }
                });
                if (isSubscribed) {
                    setActiveEvents(activeEventsList);
                    setDeactiveEvents(deactiveEventsList);
                }
		});
		return () => {
			isSubscribed = false;
			unsubscribe();
		}
	}, []);

	const handleActivate = async (id : any) => {
		updateDoc(doc(db, "events", id), {
			active: true,
		}).then(() => {
			message.success("Event Activated");
		}).catch((err) => {
			console.log(err);
		});
	};

	const handleDeactivate = (id : any) => {
		updateDoc(doc(db, "events", id), {
			active: false,
		}).then(() => {
			message.success("Event Deactivated");
		}).catch((err) => {
			console.log(err);
		});
	};

	const activeColumns = [
		{
	    title: 'Event Name',
	    dataIndex: 'event_name',
	    key: 'event_name',
		},
		{
	    title: 'Deactivate',
	    dataIndex: 'active',
	    key: 'active',
        render: (_: any, { key, active }: any) => {
                return <Button danger type="primary" shape="round" onClick={() => handleDeactivate(key)}>Deactivate</Button>
		},
        }
	];

	const deactiveColumns = [
		{
	    title: 'Event Name',
	    dataIndex: 'event_name',
	    key: 'event_name',
		},
		{
	    title: 'Activate',
	    dataIndex: 'active',
	    key: 'active',
			render: (_: any, { key }: any) => {
				return <Button danger type="primary" shape="round" onClick={() => handleActivate(key)}>Activate</Button>
			}
		},
	];

	return (
		<>
		<Divider>Active Events</Divider>
			<Table
        columns={activeColumns}
        dataSource={activeEvents}
      />
	  <Divider>Deactive Events</Divider>
			<Table
        columns={deactiveColumns}
        dataSource={deactiveEvents}
      />
		</>
	);
}

export default EventList;
