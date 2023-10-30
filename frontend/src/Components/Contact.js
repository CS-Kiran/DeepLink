import React from 'react'
import '../CSS/Contact.css'
const Contact = () => {
    return (
        <>
            <div id="contact-container">
                <div className="desc">
                    <h2>
                        " We'd love to hear from you! If you have any questions or feedback
                        about our website, please don't hesitate to get in touch."
                    </h2>
                    <p>
                        <h3>
                            Email :
                            <p id="l1">You can email us at <u>contact@governmentprojects.com</u></p>
                            <p id="l2">We aim to respond to all emails within 24 hours.</p>
                        </h3>

                        <h3>
                            Phone : 
                            <p id="l3">+91 9871236540</p>
                        </h3>

                        <h3>
                            Mailing Address : 
                            <p id="l4">Government Projects</p>
                            <p id="l5">123 MK Road</p>
                            <p id="l6">Pune, Maharashtra</p>
                            <p id="l7">India 411001</p>
                        </h3>
                    </p>
                </div>

                <div className="container1">
                    <div className="information">
                        <h1>Feedback</h1>
                        <form method="post" name="Form" action="mail.php" id="emailform">
                            <label htmlFor="name">From :</label>
                            <input type="email" name="sender" placeholder="Enter Sender's Email" required />
                            <br />

                            <label htmlFor="name">Password :</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter Sender's Email Password"
                                required
                            />
                            <br />

                            <label htmlFor="email">To :</label>
                            <input type="email" name="receiver" placeholder="Enter Receiver's Email" required />
                            <br />

                            <label htmlFor="subject">Subject :</label>
                            <input type="text" name="subject" placeholder="Enter Your Email Subject" required />
                            <br />

                            <label htmlFor="message">Message :</label>
                            <br />
                            <textarea name="message" id="message" rows="5" cols="50" required />
                            <br />

                            <div className="btn">
                                <button type="submit" name="send" id="send">
                                    SEND
                                </button>
                                <button type="button" name="clear" id="clear">
                                    CLEAR
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Contact