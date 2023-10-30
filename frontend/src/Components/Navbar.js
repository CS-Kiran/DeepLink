import React from 'react'
import '../CSS/Navbar.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'


const Navbar = (props) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        props.showAlert("Log Out Successful", "success");
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <div className="logo">
                        <Link className="navbar-brand" to="/">
                            <img src={require("../Assets/link.png")} alt="Logo" width="50" height="50" className="d-inline-block align-text-center mx-3" />
                            DeepLink
                        </Link>
                    </div>
                    <div className="tabs mx-5">
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            {(location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/about' || location.pathname === '/contact' || location.pathname === '/departments' || location.pathname === '/projects') ? (
                                <>
                                    <ul className="navbar-nav me-auto mb-2 mb-lg-0" id='navbar_tabs'>
                                        <li className="nav-item mx-3" id='tabs'>
                                            <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                                        </li>
                                        <li className="nav-item mx-3" id='tabs'>
                                            <Link className="nav-link active" aria-current="page" to="/departments">Departments</Link>
                                        </li>
                                        <li className="nav-item mx-3" id='tabs'>
                                            <Link className="nav-link active" aria-current="page" to="/projects">Projects</Link>
                                        </li>
                                        <li className="nav-item mx-3" id='tabs'>
                                            <Link className="nav-link active" aria-current="page" to="/contact">Contact Us</Link>
                                        </li>
                                        <li className="nav-item mx-3" id='tabs'>
                                            <Link className="nav-link active" aria-current="page" to="/about">About</Link>
                                        </li>
                                    </ul>
                                    <form className="d-flex mx-3" role="search">
                                        <Link to="/login" className='loginbtn'>Login</Link>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <ul className="navbar-nav me-auto mb-2 mb-lg-0" id='navbar_tabs'>
                                        <li className="nav-item mx-3" id='tabs'>
                                            <Link className="nav-link active" aria-current="page" to="/dashboard">Dashboard</Link>
                                        </li>
                                        <li className="nav-item mx-3" id='tabs'>
                                            <Link className="nav-link active" aria-current="page" to="/dashboard/register_project">Post Projects</Link>
                                        </li>
                                        <li className="nav-item mx-3" id='tabs'>
                                            <Link className="nav-link active" aria-current="page" to="/dashboard/notification">Notification</Link>
                                        </li>
                                        <li className="nav-item mx-3" id='tabs'>
                                            <Link className="nav-link active" aria-current="page" to="/dashboard/collaboration">Collaboration</Link>
                                        </li>
                                        <li className="nav-item mx-3" id='tabs'>
                                            <Link className="nav-link active" aria-current="page" to="/dashboard/projects">All Projects</Link>
                                        </li>
                                    </ul>
                                    <form className="d-flex mx-3" role="search">
                                        <button className='loginbtn' onClick={handleLogout}>Logout</button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar