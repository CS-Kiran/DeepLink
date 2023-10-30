import React from 'react'
import '../CSS/Signup.css'
import { Link, useNavigate } from 'react-router-dom'
import { useUserContext } from '../Context/UserContext';
import axios from 'axios';

const Signup = (props) => {
    const navigate = useNavigate();
    const { formData, updateUserFormData } = useUserContext();
    const handleChange = (e) => {
        const { name, value } = e.target;
        updateUserFormData(name, value);
    };
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/register', formData, { headers: { "Content-Type": "application/json" } });
            props.showAlert('Registration Successful', 'success');
            console.log(response.data);
            navigate('/login');
        } catch (error) {
            props.showAlert('Registration Failed', 'danger');
            console.error(error);
            navigate('/signup');
        }
    };
    return (
        <>
            <div id="signup-container">
                <div className="container">
                    <form name="reg_form" onSubmit={handleRegister}>
                        {/* Department Details */}
                        <div id="conForm">
                            <div className="title">
                                <h1>Registration Form</h1>
                            </div>
                            <br />
                            <div id="department">
                                <label>
                                    <h1>Department Details</h1>
                                </label>
                                <br /><br />
                                <div className="dept_name">
                                    <label htmlFor="department_name">Department Name<span>*</span></label>
                                    <select onChange={handleChange} name="department_name" required>
                                        <option value="" disabled selected hidden>Select Department</option>
                                        <option value="Construction">Construction</option>
                                        <option value="Pipeline Distribution">Pipeline Distribution</option>
                                        <option value="Electrical Power Work">Electrical Power Work</option>
                                        <option value="Sanitation & Hygiene Management">Sanitation & Hygiene Management</option>
                                        <option value="Environment Recreation">Environment/Park Recreation</option>
                                        <option value="Infrastructure & Transportation">Infrastructure & Transportation</option>
                                    </select>
                                </div>

                                <label htmlFor="department_type">Department Type<span>*</span></label>
                                <input onChange={handleChange} type="text" name="department_type" placeholder="Department Type or Ministry Name" required /><br />

                                <label htmlFor="department_description">Department Description<span>*</span></label><br />
                                <textarea onChange={handleChange} name="department_description" placeholder="Department Description" rows="6" cols="40" maxLength="160" wrap="soft" required></textarea><br />

                                <label htmlFor="department_head">Department Head<span>*</span></label>
                                <input onChange={handleChange} type="text" name="department_head" placeholder="Department Head" required /><br />

                                <label htmlFor="department_email">Department Email<span>*</span></label>
                                <input onChange={handleChange} type="email" name="department_email" placeholder="Department Email" required /><br />

                                <label htmlFor="department_phone">Department Phone<span>*</span></label>
                                <input onChange={handleChange} type="tel" name="department_phone" placeholder="Department Contact Number" pattern="[0-9]{10}" required /><br />

                                <label htmlFor="department_address">Department Address<span>*</span></label><br />
                                <textarea onChange={handleChange} name="department_address" placeholder="Department Address" rows="6" cols="40" maxLength="160" wrap="soft" required></textarea><br />
                            </div>

                            {/* Personal Details */}
                            <div id="personal">
                                <br /><br />
                                <label><h1>Personal Details</h1></label><br /><br />
                                <label htmlFor="first_name">First Name<span>*</span></label>
                                <input onChange={handleChange} type="text" name="first_name" placeholder="First Name" required /><br />

                                <label htmlFor="last_name">Last Name<span>*</span></label>
                                <input onChange={handleChange} type="text" name="last_name" placeholder="Last Name" required /><br />

                                <label htmlFor="dob">Date of Birth<span>*</span></label>
                                <input onChange={handleChange} type="date" name="dob" placeholder="Date Of Birth" required /><br />

                                <label htmlFor="personal_address">Personal Address</label><br />
                                <textarea onChange={handleChange} name="personal_address" placeholder="Personal Address" rows="6" cols="40" maxLength="160" wrap="soft"></textarea><br />

                                <label htmlFor="designation">Designation<span>*</span></label>
                                <input onChange={handleChange} type="text" name="designation" placeholder="Designation" required /><br />

                                <label htmlFor="department_uid">Departmental UID<span>*</span></label>
                                <input onChange={handleChange} type="text" name="department_uid" placeholder="Your Department UID Number" required /><br />
                            </div>

                            {/* Login Details */}
                            <div id="login_details">
                                <br /><br />
                                <label><h1>Login Details</h1></label><br /><br />
                                <label htmlFor="username">Username<span>*</span></label>
                                <input onChange={handleChange} type="text" name="username" placeholder="Username" /><br />

                                <label htmlFor="email">Email Id<span>*</span></label>
                                <input onChange={handleChange} type="email" name="email" placeholder="Email Id" /><br />

                                <label htmlFor="password">Password<span>*</span></label>
                                <input onChange={handleChange} type="password" name="password" placeholder="Password" /><br />
                            </div>

                            <div className="btn">
                                <br /><br />
                                <button type="submit" name="register" id="reg">REGISTER</button><br />
                                <Link to='/login' name="back" id="back">BACK</Link><br />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Signup