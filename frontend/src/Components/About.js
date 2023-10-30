import React from 'react'
import '../CSS/About.css'
import { Link } from 'react-router-dom'
const About = () => {
    return (
        <>
            <div id="container">
                <div id="moto">
                    <h1>ABOUT US</h1>
                </div>
                <div id="intro1">
                    <p>
                        We are a team of dedicated professionals who are passionate about helping to improve communication and collaboration between government departments and civilians. Our mission is to provide a platform that makes it easier for Citizens to stay informed about government projects and initiatives, and for government departments to coordinate and share information with each other.
                    </p>
                </div>
                <div id="intro2">
                    <h1>Our Services</h1>
                    <p>
                        Our website offers a range of services to help government departments and Citizens:
                    </p>
                    <h3>Project Database :</h3>
                    <p>
                        We maintain a comprehensive database of government projects and initiatives, with up-to-date information about their progress and status.
                    </p>
                    <h3>Collaboration Tools :</h3>
                    <p>
                        Our platform provides tools for government departments to communicate and collaborate with each other, including messaging, document sharing, and project management features.
                    </p>
                </div>
                <div id="intro3">
                    <h1>Contact Us</h1>
                    <p>
                        If you have any questions or feedback about our website, or if you'd like to get in touch with us, please visit our <Link to='/contact' id='link_contact'>Contact</Link> page for more information.
                    </p>
                </div>
            </div>
        </>
    )
}

export default About