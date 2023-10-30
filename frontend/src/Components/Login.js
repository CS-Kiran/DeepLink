import React, { useState } from 'react';
import '../CSS/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { useUserContext } from '../Context/UserContext';

const Login = (props) => {
    const navigate = useNavigate();
    const { updateUserFormData } = useUserContext(); 
    const { setIsAuthenticated } = useAuth(); // Get the isAuthenticated state and its setter
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/login', formData, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response.data)
            if (response.data.status) {
                localStorage.setItem('token', response.data.access_token);
                setIsAuthenticated(true);

                props.showAlert('Login Successful', 'success');

                updateUserFormData('department_address', response.data.user.department_address);
                updateUserFormData('department_description', response.data.user.department_description);
                updateUserFormData('department_email', response.data.user.department_email);
                updateUserFormData('department_head', response.data.user.department_head);
                updateUserFormData('department_name', response.data.user.department_name);
                updateUserFormData('department_phone', response.data.user.department_phone);
                updateUserFormData('department_type', response.data.user.department_type);
                updateUserFormData('department_uid', response.data.user.department_uid);
                updateUserFormData('designation', response.data.user.designation);
                updateUserFormData('dob', response.data.user.dob);
                updateUserFormData('email', response.data.user.email);
                updateUserFormData('first_name', response.data.user.first_name);
                updateUserFormData('last_name', response.data.user.last_name);
                updateUserFormData('personal_address', response.data.user.personal_address);
                updateUserFormData('username', response.data.user.username);
                navigate('/dashboard');
                
            } else {
                props.showAlert('Login Failed', 'danger');
            }
        } catch (error) {
            console.error(error);
            props.showAlert('Login Failed', 'danger');
        }
    };
    

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="InputUsername" className="form-label">Username</label>
                    <input type="text" className="form-control" id="InputUsername" name="username" value={formData.username} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="InputEmail" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="InputEmail" name="email" value={formData.email} onChange={handleChange} />
                    <div className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="form-group">
                    <label htmlFor="InputPassword" className="form-label">Password</label>
                    <input type="password" className="form-control" id="InputPassword" name="password" value={formData.password} onChange={handleChange} />
                </div>
                <button type="submit" className="login-button">Submit</button>
                <p className="message">
                    Not registered? <Link to="/signup">Create an account</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
