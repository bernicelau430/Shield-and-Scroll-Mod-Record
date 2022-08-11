import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";
import Reset from "./components/Reset";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard"
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth, doc, getDoc } from "./firebase";
import "./App.css";

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [additionalRoutes, setAdditionalRoutes] = useState(<></>);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !user) return navigate("/");
		const docSnap = async () => {
        const getData = await getDoc(doc(db, "users", user.uid));
        if (getData.exists()) {
            const tempData = getData.data(); 
            if(tempData.admin) {
                setAdditionalRoutes(<Route path="/admin_dashboard/*" element={<AdminDashboard />}/>);
            } else {
                setAdditionalRoutes(<Route path="/dashboard/*" element={<Dashboard />}/>)
            }
        }
      }
      docSnap();
  }, [user, loading])

  return (
    <div className="App">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<Reset />} />
        {additionalRoutes}
        <Route path="/" element={<SignIn/>} />
      </Routes>
    </div>
  );
}

export default App;
