import React, { useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import DemoNavbar from "components/Navbars/DemoNavbar"; // Ensure the correct path to the DemoNavbar component
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
} from "reactstrap";
import SimpleFooter from "components/Footers/SimpleFooter";

const Dashboard = () => {
  const mainRef = useRef(null); // Create a ref using useRef
  const navigate = useNavigate(); // Initialize the useNavigate hook

  return (
    <>
      <DemoNavbar />
      <main ref={mainRef}> {/* Use the ref here */}
        <div className="position-relative">
          {/* Hero for FREE version */}
          <section className="section section-hero section-shaped">
            {/* Background circles */}
            <div className="shape shape-style-1 shape-default">
              <span className="span-150" />
              <span className="span-50" />
              <span className="span-50" />
              <span className="span-75" />
              <span className="span-100" />
              <span className="span-75" />
              <span className="span-50" />
              <span className="span-100" />
              <span className="span-50" />
              <span className="span-100" />
            </div>
            <Container className="mt-5">
              <Row className="justify-content-center">
                <Col lg="12" className="text-center">
                  <h1 className="display-4 text-white">Dashboard</h1>
                  <p className="text-white">Quick overview of reports and analytics</p>
                </Col>
              </Row>

              <Row className="mt-4">
                {/* Mark Your Attendance */}
                <Col lg="12" className="mb-4"> {/* Full-width column */}
                  <Card className="shadow border-0">
                    <CardBody>
                      <CardTitle tag="h5">Mark Your Attendance</CardTitle>
                      <p>
                        Quickly mark your attendance to keep records updated in real-time.
                      </p>
                      <Button color="primary" onClick={() => navigate("/mark-attendance")}>
                        Mark Attendance
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row className="mt-5">
                {/* Task Report */}
                <Col lg="6" md="6" className="mb-4">
                  <Card className="shadow border-0">
                    <CardBody>
                      <CardTitle tag="h5">Task Report</CardTitle>
                      <p>
                        View detailed analysis of your tasks and progress over time.
                      </p>
                      <Button color="primary" onClick={() => navigate("/tasks-report")}>
                        View Task Report
                      </Button>
                    </CardBody>
                  </Card>
                </Col>

                {/* Backlinks Report */}
                <Col lg="6" md="6" className="mb-4">
                  <Card className="shadow border-0">
                    <CardBody>
                      <CardTitle tag="h5">Backlinks Report</CardTitle>
                      <p>Analyze backlinks performance and visibility metrics.</p>
                      <Button color="info" onClick={() => navigate("/backlinks-report")}>
                        View Backlinks Report
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              <Row className="mt-4">
                {/* Leaves Report */}
                <Col lg="6" md="6" className="mb-4">
                  <Card className="shadow border-0">
                    <CardBody>
                      <CardTitle tag="h5">Leaves Report</CardTitle>
                      <p>
                        Track leave applications, approvals, and leave balances.
                      </p>
                      <Button color="success" onClick={() => navigate("/leaves-report")}>
                        View Leaves Report
                      </Button>
                    </CardBody>
                  </Card>
                </Col>

                {/* Salary Report */}
                <Col lg="6" md="6" className="mb-4">
                  <Card className="shadow border-0">
                    <CardBody>
                      <CardTitle tag="h5">Salary Report</CardTitle>
                      <p>Access monthly salary reports and payroll history.</p>
                      <Button color="warning" onClick={() => navigate("/salary-reports")}>
                        View Salary Report
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              <Row className="mt-4">
                {/* Attendance Report */}
                <Col lg="6" md="6" className="mb-4">
                  <Card className="shadow border-0">
                    <CardBody>
                      <CardTitle tag="h5">Attendance Report</CardTitle>
                      <p>Track attendance applications and records.</p>
                      <Button color="success" onClick={() => navigate("/attendance-report")}>
                        View Attendance Report
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

            </Container>
          </section>
        </div>
      </main>
      <SimpleFooter />
    </>
  );
};

export default Dashboard;
