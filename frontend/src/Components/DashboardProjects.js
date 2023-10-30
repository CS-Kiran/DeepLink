import React, { useEffect, useState } from 'react'
import { useUserContext } from '../Context/UserContext';
import axios from 'axios';

const DashboardProjects = () => {
  const [projects, setProjects] = useState([]);
  const { formData } = useUserContext();

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/dashboard_projects', {
        params: {
          department_name: formData.department_name,
        },
      });
      const data = response.data;
      setProjects(data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  return (
    <>
      <div id="projectStatusContainer">
        <h1 style={{ fontFamily: 'monospace, sans-serif', fontSize: '30px', color: '#613fe5', fontWeight: '800', marginTop : '2%' }}>Your Projects</h1>
        {/* Render the table with projects here */}
        <table id="projectTable">
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Project Name</th>
              <th>Department Name</th>
              <th>Status</th>
              <th>Project Commencement</th>
              <th>Project DeadLine</th>
              <th>Project Location</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Map</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.project_id} id={`projectRow_${project.project_id}`}>
              <td>{project.project_id}</td>
              <td>{project.project_name}</td>
              <td>{project.department_name}</td>
              <td id="project_status" className={project.project_status.toLowerCase()}>{project.project_status}</td>
              <td>{project.project_start_date}</td>
              <td>{project.project_end_date}</td>
              <td>{project.project_location}</td>
              <td>{project.latitude}</td>
              <td>{project.longitude}</td>
              <td>
                <div>
                  <iframe
                    title={`Map of ${project.project_name}`}
                    src={`https://maps.google.com/maps?q=${project.latitude},${project.longitude}&hl=en&z=14&t=k&output=embed`}
                    id={`map_${project.project_id}`}
                  />
                </div>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default DashboardProjects