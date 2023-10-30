import React, { useState, useEffect } from 'react';
import '../CSS/Department.css';
import axios from 'axios';

const DepartmentsTable = () => {
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        axios
            .get('http://127.0.0.1:5000/api/department_details')
            .then((response) => setDepartments(response.data.departments))
            .catch((error) => console.error('Error fetching data:', error));
    },[]);

    return (
        <div id="departmentsTableContainer">
            <h1 id="departmentsHeading">Departments</h1>
            {departments.length === 0 ? (
                <p>Loading departments...</p>
            ) : (
                <table id="departmentsTable">
                    <thead>
                        <tr>
                            <th>Department ID</th>
                            <th>Department Name</th>
                            <th>Department Type</th>
                            <th>Description</th>
                            <th>Department Head</th>
                            <th>Department Email</th>
                            <th>Department Phone</th>
                            <th>Department Address</th>
                            <th>Department UID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((department) => (
                            <tr key={department.department_details_id}>
                                <td>{department.department_details_id}</td>
                                <td>{department.department_name}</td>
                                <td>{department.department_type}</td>
                                <td>{department.department_description}</td>
                                <td>{department.department_head}</td>
                                <td>{department.department_email}</td>
                                <td>{department.department_phone}</td>
                                <td>{department.department_address}</td>
                                <td>{department.department_uid}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DepartmentsTable;
