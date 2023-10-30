import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS/Notification.css';
import { useUserContext } from '../Context/UserContext';

const History = () => {
  const [history, setHistory] = useState([]);
  const { formData } = useUserContext();
  const dept_name = formData.department_name;
  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/collab_req_history?dept_name=${dept_name}`);
            setHistory(response.data.collab_reqs);
          } catch (error) {
            console.error('Error fetching notification:', error);
          }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div>
        <h1 id="notification-heading">Request History</h1>
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
          </tr>
        </thead>
        <tbody>
          {history.map((row) => (
            <tr key={row.request_id}>
              <td>{row.from_department_name}</td>
              <td>{row.to_department_name}</td>
              <td>{row.project_id}</td>
              <td>{row.budget_in_lakh}</td>
              <td>{row.duration}</td>
              <td>{row.subject}</td>
              <td>{row.content}</td>
              <td>{row.posted_on}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default History;
