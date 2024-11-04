import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, CardBody, Button, CardTitle } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaDownload, FaClipboardCheck, FaClipboardList, FaUserClock, FaBan } from "react-icons/fa"; // Import additional icons
import Swal from "sweetalert2";
import DemoNavbar from "components/Navbars/DemoNavbar";
import SimpleFooter from "components/Footers/SimpleFooter";
import { fetchLeavesApi, createLeave } from "api";

const Leave = () => {
  const mainRef = useRef(null);
  const navigate = useNavigate();

  // State for user and leave details
  const [user, setUser] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch leaves on component mount
  useEffect(() => {
    fetchLeaves();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser.user_id);
  }, []);

  // Fetch leaves data
  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const response = await fetchLeavesApi(storedUser.user_id);
      setLeaves(response.leaves);
    } catch (err) {
      setError("Failed to load leaves. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DemoNavbar />
      <main ref={mainRef}>
        <section className="section section-hero section-shaped">
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

              <Col lg="6" md="6" className="mb-4">
                <Card className="shadow border-0">
                  <CardBody>
                    <CardTitle tag="h5">View All Leave</CardTitle>
                    <p>View all leave applications submitted.</p>
                    <Button color="primary" onClick={() => navigate("/view-all-leave")}>
                      <FaClipboardList style={{ fontSize: "20px" }} /> VIEW All LEAVE
                    </Button>
                  </CardBody>
                </Card>
              </Col>

              <Col lg="6" md="6" className="mb-4">
                <Card className="shadow border-0">
                  <CardBody>
                    <CardTitle tag="h5">View Approved Leave</CardTitle>
                    <p>Check all approved leave requests.</p>
                    <Button color="primary" onClick={() => navigate("/view-approved-leave")}>
                      <FaClipboardCheck style={{ fontSize: "20px" }} /> VIEW APPROVED LEAVE
                    </Button>
                  </CardBody>
                </Card>
              </Col>

              <Col lg="6" md="6" className="mb-4">
                <Card className="shadow border-0">
                  <CardBody>
                    <CardTitle tag="h5">View Pending Leave</CardTitle>
                    <p>See all pending leave applications.</p>
                    <Button color="primary" onClick={() => navigate("/view-pending-leave")}>
                      <FaUserClock style={{ fontSize: "20px" }} /> VIEW PENDING LEAVE
                    </Button>
                  </CardBody>
                </Card>
              </Col>

              <Col lg="6" md="6" className="mb-4">
                <Card className="shadow border-0">
                  <CardBody>
                    <CardTitle tag="h5">Suspended Leaves</CardTitle>
                    <p>Review all suspended leave applications.</p>
                    <Button color="primary" onClick={() => navigate("/view-suspended-leave")}>
                      <FaBan style={{ fontSize: "20px" }} /> VIEW SUSPENDED LEAVE
                    </Button>
                  </CardBody>
                </Card>
              </Col>

              <Col lg="6" md="6" className="mb-4">
                <Card className="shadow border-0">
                  <CardBody>
                    <CardTitle tag="h5">Apply Leave</CardTitle>
                    <p>Submit a new leave application.</p>
                    <Button color="primary"onClick={() => navigate("/apply-leave")}>
                      <FaCheckCircle style={{ fontSize: "20px" }} /> APPLY LEAVE
                    </Button>
                  </CardBody>
                </Card>
              </Col>

              <Col lg="6" md="6" className="mb-4">
                <Card className="shadow border-0">
                  <CardBody>
                    <CardTitle tag="h5">Download Report</CardTitle>
                    <p>Download leave reports in various formats.</p>
                    <Button color="primary" onClick={() => navigate("/download-report")}>
                      <FaDownload style={{ fontSize: "20px" }} /> DOWNLOAD REPORT
                    </Button>
                  </CardBody>
                </Card>
              </Col>

            </Row>
          </Container>
        </section>
      </main>
      <SimpleFooter />
    </>
  );
};

export default Leave;
