import React, { useState } from 'react';
import '../CSS/Collaboration.css';
import { useUserContext } from '../Context/UserContext';
import axios from 'axios';

const Collaboration = (props) => {
  const { formData } = useUserContext();
  const [collaboration, setCollaboration] = useState({
    from_dept_name: formData.department_name,
    to_dept_name: '',
    pid: '',
    subject: '',
    budget: '',
    duration: '',
    content: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCollaboration((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/collaboration', collaboration);
      console.log(response.data);
      props.showAlert('Collaboration request send successfully', 'success');
      setCollaboration({
        from_dept_name: formData.department_name,
        to_dept_name: '',
        pid: '',
        subject: '',
        budget: '',
        duration: '',
        content: '',
      });

    } catch (error) {
      console.error('Error sending collaboration request:', error);
      props.showAlert('Error sending collaboration request', 'danger');
      setCollaboration({
        from_dept_name: formData.department_name,
        to_dept_name: '',
        pid: '',
        subject: '',
        budget: '',
        duration: '',
        content: '',
      });
    }
  };

  return (
    <div id="collaboration">
      <h1 id="collab-heading" className="heading">
        Send Collaboration Request
      </h1>

      <form onSubmit={handleSubmit} className="form1" id="collab-form" method='post'>
        <div className="info">
          <div className="dept_name">
            <label htmlFor="to_dept_name" id="dept_namecollab_label">
              Send to (Department Name)<span>*</span>
            </label>

            <select
              name="to_dept_name"
              className="option"
              id="departmentcollab_name"
              required
              value={collaboration.to_dept_name}
              onChange={handleChange}
            >
              <option value="" disabled hidden>
                Select Department
              </option>
              <option value="Construction">Construction</option>
              <option value="Pipeline Distribution">Pipeline Distribution</option>
              <option value="Electrical Power Work">Electrical Power Work</option>
              <option value="Sanitation & Hygiene Management">Sanitation & Hygiene Management</option>
              <option value="Environment Recreation">Environment/Park Recreation</option>
              <option value="Infrastructure & Transportation">Infrastructure & Transportation</option>
            </select>
          </div>

          <label htmlFor="pid" id="pid_label">
            Project Id<span>*</span>
          </label>
          <input
            type="text"
            name="pid"
            id="pid_input"
            required
            placeholder="Project Id"
            value={collaboration.pid}
            onChange={handleChange}
          />
          <br />

          <label htmlFor="subject" id="subject_label">
            Subject<span>*</span>
          </label>
          <input
            type="text"
            name="subject"
            id="subject_input"
            required
            placeholder="Subject"
            value={collaboration.subject}
            onChange={handleChange}
          />
          <br />

          <label htmlFor="budget" id="budget_label">
            Budget<span>*</span>
          </label>
          <input
            type="text"
            name="budget"
            id="budget_input"
            required
            placeholder="Enter project budget (in Lakh)"
            value={collaboration.budget}
            onChange={handleChange}
          />
          <br />

          <label htmlFor="duration" id="duration_label">
            Estimated End Date<span>*</span>
          </label>
          <input
            type="date"
            name="duration"
            id="duration_input"
            required
            placeholder="Enter Project duration"
            value={collaboration.duration}
            onChange={handleChange}
          />
          <br />

          <label htmlFor="content" id="content_label">
            Reason<span>*</span>
          </label>
          <br />
          <textarea
            placeholder="Reason for Collaboration"
            name="content"
            id="content_input"
            rows="6"
            cols="40"
            maxLength="160"
            wrap="soft"
            value={collaboration.content}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="button">
          <button type="submit" name="submit" id="collab-submit">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Collaboration;
