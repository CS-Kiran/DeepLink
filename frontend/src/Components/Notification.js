import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS/Notification.css';
import { useUserContext } from '../Context/UserContext';
import { Link } from 'react-router-dom';

const Notification = () => {
  const [notification, setNotification] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state
  const { formData } = useUserContext();
  const dept_name = formData.department_name;

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/collab_req_details?dept_name=${dept_name}`);
      setNotification(response.data.collab_reqs);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async (project_id, request_id) => {
    try {
      const confirmed = window.confirm('Are you sure you want to accept this request?');
      if (confirmed) {
        await axios.post('http://127.0.0.1:5000/api/collab_req_details/approve', { project_id, request_id });
        console.log('Approved:', project_id);
        fetchData();
      }
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleDecline = async (request_id) => {
    try {
      const confirmed = window.confirm('Are you sure you want to decline this request?');
      if (confirmed) {
        await axios.delete(`http://127.0.0.1:5000/api/collab_req_details/decline?request_id=${request_id}`);
        console.log('Declined:', request_id);
        fetchData();
      }
    } catch (error) {
      console.error('Error declining request:', error);
    }
  };

  return (
    <>
      <Link to='/dashboard/notification/history' style={{textDecoration : 'none'}}>
        <button className="history my-5" id="history-btn">History</button>
      </Link>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>An error occurred: {error.message}</p>
      ) : notification.length > 0 ? (
        <>
          <div>
            <h1 id="notification-heading">New Request's</h1>
          </div>
          <table id="notification-table">
            <thead>
              <tr>
                <th scope="col">FROM (DEPARTMENT NAME)</th>
                <th scope="col">TO (DEPARTMENT NAME)</th>
                <th scope="col">PROJECT ID</th>
                <th scope="col">BUDGET(in Lakh)</th>
                <th scope="col">ESTIMATED DATE</th>
                <th scope="col">SUBJECT</th>
                <th scope="col">REASON</th>
                <th scope="col">RECEIVED ON</th>
                <th scope="col">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {notification.map((row) => (
                <tr key={row.request_id}>
                  <td>{row.from_department_name}</td>
                  <td>{row.to_department_name}</td>
                  <td>{row.project_id}</td>
                  <td>{row.budget_in_lakh}</td>
                  <td>{row.duration}</td>
                  <td>{row.subject}</td>
                  <td>{row.content}</td>
                  <td>{row.posted_on}</td>
                  <td>
                    <form method="post">
                      <button onClick={() => handleApprove(row.project_id, row.request_id)} name="approve" id="approve-btn">ACCEPT</button><br />
                      <button onClick={() => handleDecline(row.request_id)} name="decline" id="decline-btn">DECLINE</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="message" style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ fontSize: '38px', color: '#613fe6' }}>No new requests to show.</p>
        </div>
      )}
    </>
  );
};

export default Notification;