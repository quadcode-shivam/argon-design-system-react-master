import React, { useRef, useEffect, useState } from "react";
import DemoNavbar from "components/Navbars/DemoNavbar";
import { Container, Row, Col, Card, CardBody, Button, Table, Badge, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import Swal from "sweetalert2";
import SimpleFooter from "components/Footers/SimpleFooter";
import { FaCheckCircle, FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { checkIn, checkOut, fetchCheckInRecords } from "../../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeColor from "theme";

const MarkAttendance = () => {
  const mainRef = useRef(null);
  const [user, setUser] = useState(null);
  const [checkInRecords, setCheckInRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [averageCheckInTime, setAverageCheckInTime] = useState(0);
  const [averageCheckOutTime, setAverageCheckOutTime] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const fetchCheckInData = async () => {
    setLoading(true);
    try {
      const employeeId = user?.user_id;
      const response = await fetchCheckInRecords(employeeId.toString());
      setCheckInRecords(response.check_ins);
      calculateAverageTimes(response.check_ins);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching check-in records:", error);
      setError("Failed to load check-in records.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchCheckInData();
  }, [user]);

  const calculateAverageTimes = (records) => {
    const totalCheckInTimes = records.reduce((total, record) => total + new Date(record.check_in_time).getTime(), 0);
    const totalCheckOutTimes = records.reduce((total, record) => total + (record.check_out_time ? new Date(record.check_out_time).getTime() : 0), 0);
    const validCheckIns = records.length;
    const validCheckOuts = records.filter(record => record.check_out_time).length;

    setAverageCheckInTime(validCheckIns > 0 ? totalCheckInTimes / validCheckIns : 0);
    setAverageCheckOutTime(validCheckOuts > 0 ? totalCheckOutTimes / validCheckOuts : 0);
  };

  const handleCheckIn = async () => {
    try {
      const employeeId = user?.user_id;
      const response = await checkIn(employeeId);
      toast[response.message === "Please check out first." ? "warning" : "success"](response.message);
      fetchCheckInData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Check-in failed. Please try again.");
    }
  };

  const handleCheckOut = async () => {
    try {
      const employeeId = user?.user_id;
      const response = await checkOut(employeeId);
      toast.success(response.message);
      fetchCheckInData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Check-out failed. Please try again.");
    }
  };

  const downloadInfoAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Employee Check-In Records", 14, 22);

    const tableColumn = ["Employee ID", "User Name", "Email", "Check In Time", "Check Out Time", "Status", "Role"];
    const tableRows = checkInRecords.map((record) => [
      record.employee_id,
      record.user_name,
      record.email,
      new Date(record.check_in_time).toLocaleString(),
      record.check_out_time ? new Date(record.check_out_time).toLocaleString() : "N/A",
      record.status,
      record.role,
    ]);

    doc.autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
    });
    doc.save("check_in_records.pdf");
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = checkInRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(checkInRecords.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <DemoNavbar />
      <main ref={mainRef}>
        <section className="section section-hero section-shaped">
            {/* Background circles */}
            <ThemeColor/>
          <Container className="mt-5">
            <Row className="justify-content-center">
              <Col lg="6" md="6" className="mb-4">
                <Card className="shadow border border-1 border-light" style={{ background: "#7289da", color: "#ffffff" }}>
                  <CardBody className="text-center">
                    <Button
                      style={{ fontSize: "24px", fontWeight: "600", color: "#7289da" }}
                      onClick={handleCheckIn}
                      className="w-100 h-100"
                    >
                      <FaCheckCircle style={{ fontSize: "30px" }} /> CHECK IN
                    </Button>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" md="6" className="mb-4">
                <Card className="shadow border border-1 border-light" style={{ background: "#7289da", color: "#ffffff" }}>
                  <CardBody className="text-center">
                    <Button
                      className="w-100"
                      style={{ fontSize: "24px", fontWeight: "600", color: "#7289da" }}
                      onClick={() => {
                        Swal.fire({
                          title: "Are you sure?",
                          text: "You won't be able to revert this!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#3085d6",
                          cancelButtonColor: "#d33",
                          confirmButtonText: "Yes, check out!",
                          cancelButtonText: "No, cancel",
                        }).then((result) => {
                          if (result.isConfirmed) handleCheckOut();
                        });
                      }}
                    >
                      <FaCheckCircle style={{ fontSize: "30px" }} /> CHECK OUT
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row className="mt-4 text-center">
              <Col>
                <Button
                  style={{
                    background: "#7289da",
                    color: "#ffffff",
                    padding: "8px 16px",
                    borderRadius: "5px",
                    fontWeight: "bold",
                  }}
                  onClick={downloadInfoAsPDF}
                >
                  <FaDownload className="mr-2" />
                  DOWNLOAD INFO
                </Button>
              </Col>
            </Row>

            <Row className="mt-5">
              <Col lg="6" className="mb-4">
                <div
                  className="px-3 border border-1 border-light"
                  style={{
                    paddingTop: "20px",
                    background: "#7289da",
                    color: "#ffffff",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "20px",
                  }}
                >
                  <p>Average Check Ins:</p>
                  <p>
                    {new Date(averageCheckInTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </Col>
              <Col lg="6" className="mb-4">
                <div
                  className="px-3 border border-1 border-light"
                  style={{
                    paddingTop: "20px",
                    background: "#7289da",
                    color: "#ffffff",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "20px",
                  }}
                >
                  <p>Average Check Outs:</p>
                  <p>
                    {new Date(averageCheckOutTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </Col>
            </Row>

            <Row className="mt-5">
              <Col lg="12">
                <h4 className="text-center mb-4" style={{ color: "#7289da" }}>Check-In Records</h4>
                <Table striped responsive>
                  <thead style={{ background: "#7289da", color: "#ffffff" }}>
                    <tr>
                      <th>Employee ID & Role</th>
                      <th>User Name</th>
                      <th>Email</th>
                      <th>Check In Time</th>
                      <th>Check Out Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecords.map((record) => (
                      <tr key={record.id}>
                        <td  style={{ color: "#ffffff" }}>
                          <strong>{record.employee_id}</strong>
                          <br />
                          <Badge color={record.role === "Admin" ? "success" : "info"}>{record.role}</Badge>
                        </td>
                        <td  style={{ color: "#ffffff" }}>{record.user_name}</td>
                        <td  style={{ color: "#ffffff" }}>{record.email}</td>
                        <td  style={{ color: "#ffffff" }}>{new Date(record.check_in_time).toLocaleString()}</td>
                        <td  style={{ color: "#ffffff" }}>
                          {record.check_out_time ? new Date(record.check_out_time).toLocaleString() : "N/A"}
                        </td>
                        <td>
                          <Badge color={record.status === "present" ? "success" : "danger"} className="mr-1">
                            {record.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {checkInRecords.length > recordsPerPage && (
                  <Pagination>
                    {[...Array(totalPages)].map((_, pageIndex) => (
                      <PaginationItem active={pageIndex + 1 === currentPage} key={pageIndex}>
                        <PaginationLink onClick={() => paginate(pageIndex + 1)}>
                          {pageIndex + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  </Pagination>
                )}
              </Col>
            </Row>
          </Container>
        </section>
      </main>
      <SimpleFooter />
    </>
  );
};

export default MarkAttendance;
