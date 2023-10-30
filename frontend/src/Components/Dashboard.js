import React, { useState } from 'react';
import '../CSS/Dashboard.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import ProjectRegistration from './ProjectRegistration';
import Welcome from './Welcome';
import Projects from '../Components/Projects'
import DashboardProjects from './DashboardProjects';
import Collaboration from './Collaboration';
import Notification from './Notification';
import History from './History';
import Alerts from './Alerts'

const Dashboard = () => {
  const [alert, setAlert] = useState(null);
  const showAlert = (msg, type) => {
    setAlert({
      message: msg,
      type: type
    })
    setTimeout(() => {
      setAlert(null)
    }, 2000)
  }

  const location = useLocation();
  return (
    <>
      <Alerts alert={alert} />
      {location.pathname === '/dashboard' ? (
        <>
          <Welcome />
          <DashboardProjects />
        </>
      ) : (
        <Routes>
          <Route path='register_project' element={<ProjectRegistration showAlert={showAlert} />} />
          <Route exact path='projects' element={<Projects />} />
          <Route exact path='collaboration' element={<Collaboration showAlert={showAlert} />} />
          <Route exact path='notification' element={<Notification />} />
          <Route exact path='notification/history' element={<History />} />
        </Routes>
      )}
    </>
  );
};

export default Dashboard;
