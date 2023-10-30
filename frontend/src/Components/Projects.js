import React, { useEffect, useState } from 'react';
import '../CSS/Project_details.css';

const ProjectStatus = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch projects from the API
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/project_details');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching projects');
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div id="projectStatusContainer">
      <h1 style={{ fontFamily: 'monospace, sans-serif', fontSize: '40px', textAlign: 'center', color: '#613fe5', fontWeight: '800' }}>Projects</h1>
      <table id="projectTable">
        <thead>
          <tr>
            <th>Project ID</th>
            <th>Project Name</th>
            <th>Department Name</th>
            <th>Status</th>
            <th>Project Commencement</th>
            <th>Project Deadline</th>
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
  );
};

export default ProjectStatus;
