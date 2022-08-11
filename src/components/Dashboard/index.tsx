import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth, where, doc, getDoc, onSnapshot } from "../../firebase";
import Settings from "./Settings";
import List from "./List";
import AddMod from "./AddMod";
import MemberMenu from "./MemberMenu";

function Dashboard() {
	const [user, loading, error] = useAuthState(auth);
	const [data, setData] = useState<any>({});
	const navigate = useNavigate();
	useEffect(() => {
		if (loading || !user) {
            navigate("/");
            return;
        }
		const docRef = doc(db, "users", user.uid);
		const unsubscribe = onSnapshot(docRef, (document) => {
            if (document.exists()) {
                setData(document.data())
            }
        });
        if (Object.keys(data).length === 0) {
            const userDoc = async() => {
                const userData = await getDoc(docRef);
                setData(userData.data());
            }
            userDoc();
        }
        return () => unsubscribe()
	}, [user, loading]);

	return (
        <>
        <MemberMenu />
		<Routes>
			<Route path="settings" element={<Settings />}/>
			<Route path="add" element={<AddMod user={data} />}/>
			<Route path="/" element={<List user={data} />}/>
		</Routes>
        </>
	);
}

export default Dashboard;