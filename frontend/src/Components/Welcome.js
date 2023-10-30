import React from 'react'
import { useUserContext } from '../Context/UserContext';
import '../CSS/Welcome.css'

const Welcome = () => {
  const { formData } = useUserContext(); 
  console.log(formData);
  return (
    <>
    <div className='welcome-container'>
      <h1 id='user-dept-name'>Department : {formData.department_name}</h1>
      <h1 id='welcome-heading'>Welcome!</h1>
      <h2 id='user-name-desig'>
        {formData.designation} : {formData.first_name} {formData.last_name}
      </h2>
    </div>
    </>
  )
}

export default Welcome