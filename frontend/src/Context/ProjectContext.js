import { createContext, useContext, useState } from 'react';

const ProjectContext = createContext();
export const useProjectContext = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [projectData, setProjectData] = useState({
    project_name: '',
    department_name: '',
    project_description: '',
    project_budget: '',
    project_start_date: '',
    project_end_date: '',
    project_status: '',
    project_location: '',
    latitude: '',
    longitude: ''
  });

  const updateProjectData = (name, value) => {
    setProjectData((prevProjectData) => ({
      ...prevProjectData,
      [name]: value,
    }));
  };

  return (
    <ProjectContext.Provider value={{ projectData, updateProjectData }}>
      {children}
    </ProjectContext.Provider>
  );
};
