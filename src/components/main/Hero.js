import ThemeColor from "theme";
import React from "react";
import { Button, Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom"; // Make sure to import Link from react-router-dom
import { NavbarBrand } from "reactstrap"; // Ensure you import NavbarBrand if you're using it

class Hero extends React.Component {
  render() {
    // Retrieve and parse user data from local storage
    const userData = JSON.parse(localStorage.getItem('user')); // Assuming 'user' is the key
    const userName = userData ? userData.name : "Guest"; // Default to "Guest" if no user is found

    return (
      <>
        <div className="position-relative">
          <section className="section section-hero section-shaped">
            <ThemeColor/>
            <Container
              className="shape-container d-flex align-items-center py-lg"
              style={{ minHeight: "100vh" }}
            >
              
              <div className="col px-0">
                <Row className="align-items-center justify-content-center">
                  <Col className="text-center" lg="8">
                    <h1 className="display-4 text-white font-weight-bold">
                      Welcome, {userName}!
                    </h1>
                    <p className="lead text-white mt-3">
                      We're glad to have you back. Dive into your dashboard to
                      manage tasks, check your calendar, or explore other
                      features.
                    </p>

                    {/* Brand Logo */}
                    <NavbarBrand
                      tag={Link}
                      to="/"
                      className="m-0 p-0 fw-bold text-white"
                      style={{ fontSize: "22px", fontWeight: "bold" }}
                    >
                      Quad Pulse
                      <i className="ni ni-user-run ml-1" style={{ fontSize: "16px" }} />
                    </NavbarBrand>

                    {/* Navigation Buttons */}
                    <div className="btn-wrapper mt-4">
                      <Button
                        className="btn-white btn-icon mb-3 mb-sm-0"
                        color="default"
                        href="/dashboard"
                        size="lg"
                      >
                        <span className="btn-inner--icon mr-1">
                          <i className="ni ni-tv-2" />
                        </span>
                        <span className="btn-inner--text">Go to Dashboard</span>
                      </Button>
                      <Button
                        className="btn-icon mb-3 mb-sm-0"
                        color="info"
                        href="tasks-report"
                        size="lg"
                      >
                        <span className="btn-inner--icon mr-1">
                          <i className="ni ni-check-bold" />
                        </span>
                        <span className="btn-inner--text">View My Tasks</span>
                      </Button>
                      <Button
                        className="btn-icon mb-3 mb-sm-0"
                        color="primary"
                        href="/calendar"
                        size="lg"
                      >
                        <span className="btn-inner--icon mr-1">
                          <i className="ni ni-calendar-grid-58" />
                        </span>
                        <span className="btn-inner--text">Calendar</span>
                      </Button>
                    </div>

                    {/* Credits */}
                    <div className="mt-5">
                      <small className="text-white font-weight-bold mb-0 mr-2">
                        *proudly coded by
                      </small>
                      <NavbarBrand
                        tag={Link}
                        to="/"
                        className="m-0 p-0 fw-bold text-light"
                        style={{ fontSize: "22px", fontWeight: "bold" }}
                      >
                        Quad Pulse
                        <i className="ni ni-user-run ml-1" style={{ fontSize: "16px" }} />
                      </NavbarBrand>
                    </div>
                  </Col>
                </Row>
              </div>
            </Container>
            <div className="separator separator-bottom separator-skew zindex-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon
                  className="fill-white"
                  points="2560 0 2560 100 0 100"
                />
              </svg>
            </div>
          </section>
        </div>
      </>
    );
  }
}

export default Hero;
