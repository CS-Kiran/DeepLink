import React, { useEffect } from "react";
import "../CSS/Home.css";

const Home = () => {
  useEffect(() => {
    fetch("/api/update_project_status")
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error updating project status:", error));
  }, []); // The empty dependency array ensures this effect runs only once

  return (
    <>
      <div className="contain">
        <div className="title">
          Connecting Departments And Citizens For Better Future
        </div>
        <div className="homelogo">
          <img src={require("../Assets/home1.jpg")} alt="homelogo" />
        </div>
      </div>
      <div className="introduction">
        <h3 id="heading">Welcome to DeepLink</h3>
        <p id="paragraph">
          A platform that connects various government Departments to coordinate
          their efforts and provide Citizens with information about their
          projects and initiatives.
        </p>
      </div>
    </>
  );
};

export default Home;
