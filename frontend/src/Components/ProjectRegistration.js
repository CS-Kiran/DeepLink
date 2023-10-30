import React from 'react';
import '../CSS/Project.css';
import axios from 'axios';
import { useProjectContext } from '../Context/ProjectContext';
import { useUserContext } from '../Context/UserContext';

const ProjectRegistration = (props) => {
  const { projectData, updateProjectData } = useProjectContext();
  const { formData } = useUserContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateProjectData(name, value);
  };

  const handleProjectStatus = () => {
    const startDate = new Date(document.getElementById('start_date').value);
    const endDate = new Date(document.getElementById('end_date').value);
    const currentDate = new Date();
  
    if (startDate && endDate && startDate <= endDate) {
      if (currentDate >= startDate && currentDate <= endDate) {
        updateProjectData('project_status', 'Ongoing');
      } else if (currentDate > endDate) {
        updateProjectData('project_status', 'Completed');
      } else {
        updateProjectData('project_status', 'Upcoming');
      }
    } else {
      updateProjectData('project_status', '');
    }
  };
  

  const handleResetForm = () => {
    document.getElementById('proj_form').reset();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    updateProjectData('department_name',formData.department_name)
    try {
      console.log(projectData)
      const response = await axios.post('http://127.0.0.1:5000/api/register_project', projectData);
      if (response.data.status) {
        props.showAlert('Project registered successfully', 'success');
        updateProjectData('project_status', '');
        handleResetForm();
      } else {
        props.showAlert('Project registered failed', 'danger');
        updateProjectData('project_status', '');
      }
    } catch (error) {
      props.showAlert('An error occurred during project registration', 'danger');
      updateProjectData('project_status', '');
      console.error(error);
    }
  };

  return (
    <div className="container" id="project-registration">
      <h1>Project Posting Form</h1>
      <form method="post" onSubmit={handleSubmit} id="proj_form">
        <div className="information">
          {/* Project Name */}
          <label htmlFor="proj_name">Project Name<span>*</span></label>
          <input type="text" id="name" name="project_name" onChange={handleChange} placeholder="Enter Project Name" required /><br />

          {/* Department Name */}
          <div className="dept_name">
            <label>Department Name<span className="required-color">*</span></label>
            <input type="text" id="department_name" name="department_name" value={formData.department_name} readOnly /><br />
          </div>
          <br />
          {/* Project Description */}
          <label htmlFor="proj_description">Project Description</label>
          <textarea onChange={handleChange} name="project_description" placeholder="Enter Project Description" rows="6" cols="40" maxLength="160" wrap="soft" required id="proj_description"></textarea><br />

          {/* Project Budget */}
          <label htmlFor="proj_budget">Project Budget (in Lakhs)<span>*</span></label>
          <input onChange={handleChange} type="text" id="money" name="project_budget" placeholder="Estimated Budget in Lakhs" required /><br />

          {/* Project Commencement */}
          <label htmlFor="proj_date">Project Commencement<span>*</span></label>
          <input type="date" id="start_date" name="project_start_date" placeholder="Enter Project Start Date" required onChange={handleChange} /><br />

          {/* Project Termination */}
          <label htmlFor="proj_date">Project Termination<span>*</span></label>
          <input type="date" id="end_date" name="project_end_date" placeholder="Enter Project End Date" required onChange={handleChange} /><br />

          {/* Project Status */}
          <label htmlFor="proj_status">Project Status<span>*</span></label>
          <input type="text" id="status" name="project_status" placeholder="Status : Click here!" value={projectData.project_status} onClick={handleProjectStatus} readOnly /><br />

          {/* Project Location */}
          <label htmlFor="proj_location">Project Location<span>*</span></label>
          <textarea onChange={handleChange} name="project_location" placeholder="Enter Project Location" rows="6" cols="40" maxLength="160" wrap="soft" required id="proj_location"></textarea><br />

          <div className="coordinates">
            {/* Latitude */}
            <label htmlFor="latitude">Latitude<span>*</span></label>
            <input onChange={handleChange} type="text" id="latitude" name="latitude" placeholder="Enter Latitude : 18.640279" required />

            {/* Longitude */}
            <label htmlFor="longitude">Longitude<span>*</span></label>
            <input onChange={handleChange} type="text" id="longitude" name="longitude" placeholder="Enter Longitude : 73.877309" required />

          </div>
          <br />
          <div className="btn">
            <button type="submit" name="send" id="send">SUBMIT</button>
            <button name="clear" id="clear" type="button" onClick={handleResetForm}>CLEAR</button>

          </div>
        </div>
      </form>
    </div>
  );
};

export default ProjectRegistration;