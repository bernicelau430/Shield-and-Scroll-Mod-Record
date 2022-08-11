import React, { useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { auth } from "../../firebase";
import UserList from "./UserList";
import Settings from "./Settings";
import ModAdd from "./ModAdd";
import EventAdd from "./EventAdd";
import EventList from "./EventList";
import ModList from "./ModSubmissionList";
import UserShow from "./UserShow";
import UserEdit from "./UserEdit";
import OrganizationSettings from "./OrganizationSettings";
import AdminMenu from "./AdminMenu";

function AdminDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.currentUser) navigate("/");
    }, [auth])

    return (
        <>
        <AdminMenu />
        <Routes>
            <Route path="organization" element={<OrganizationSettings />} />
            <Route path="editUser/:userId" element={<UserEdit />} />
            <Route path="users/:userId" element={<UserShow />} />
            <Route path="event/list" element={<EventList />} />
            <Route path="event/add" element={<EventAdd />} />
            <Route path="mods/add" element={<ModAdd />} />
            <Route path="submissions" element={<ModList />} />
            <Route path="settings" element={<Settings />}/>
            <Route path="/" element={<UserList />}/>
        </Routes>
        </>
    );
}

export default AdminDashboard