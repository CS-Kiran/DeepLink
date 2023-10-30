import { createContext, useContext, useState } from 'react';

const UserContext = createContext();
export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    department_name : '',
    department_type : '',
    department_description : '',
    department_head : '',
    department_email : '',
    department_phone : '',
    department_address : '',
    first_name : '',
    last_name : '',
    dob : '',
    personal_address : '',
    designation : '',
    department_uid : '',
    username : '',
    email : '',
    password : ''
  });

  const updateUserFormData = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <UserContext.Provider value={{ formData, updateUserFormData, setFormData }}>
      {children}
    </UserContext.Provider>
  );
};
