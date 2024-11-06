import ThemeColor from "theme";
import React, { useRef, useEffect, useState } from "react";
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  Button,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";
import { fetchLeavesApi, createLeave, removeLeave } from "api";
import SimpleFooter from "components/Footers/SimpleFooter";
import DemoNavbar from "components/Navbars/DemoNavbar";
import { FaCheckCircle, FaTrashAlt, FaDownload } from "react-icons/fa";
import { jsPDF } from "jspdf";
import Swal from "sweetalert2";

const ViewAllLeaves = () => {
  const mainRef = useRef(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [leaveType, setLeaveType] = useState("sick");
  const [rangeDate, setRangeDate] = useState({ start: "", end: "" });
  const [halfDayFullDay, setHalfDayFullDay] = useState("full");
  const [description, setDescription] = useState(""); // New state for description
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchLeaves();
  }, [statusFilter]);

  const fetchLeaves = async () => {
    setLoading(true);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      setError("User not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchLeavesApi(storedUser.user_id, statusFilter);
      if (response && response.leaves) {
        setLeaves(response.leaves);
      } else {
        setError("No leaves found.");
      }
    } catch (error) {
      setError("Failed to load leaves. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => setModal(!modal);

  const handleApplyLeave = async () => {
    const leaveData = {
      employeeId: JSON.parse(localStorage.getItem("user")).user_id,
      leaveType,
      startDate: rangeDate.start,
      endDate: rangeDate.end,
      halfDayFullDay,
      description, // Include description in leave data
    };
  
    try {
      await createLeave(leaveData);
      toggleModal();
      fetchLeaves();
      Swal.fire('Success!', 'Leave applied successfully.', 'success');
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to apply leave. Please try again.";
      Swal.fire('Error!', errorMessage, 'error');
    }
  };
  

  const downloadLeavesAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Leave Records", 14, 22);

    const tableColumn = ["Employee ID", "Leave Type", "Start Date", "End Date", "Status"];
    const tableRows = leaves.map(leave => [
      leave.employee_id,
      leave.leave_type,
      new Date(leave.start_date).toLocaleDateString(),
      new Date(leave.end_date).toLocaleDateString(),
      leave.status,
    ]);

    doc.autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
    });
    doc.save("leave_records.pdf");
  };

  const getHeaderColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "suspended":
        return "danger";
      default:
        return "primary";
    }
  };

  const getTitle = () => {
    switch (window.location.pathname) {
      case "/view-approved-leave":
        return "Approved Leaves";
      case "/view-pending-leave":
        return "Pending Leaves";
      case "/view-suspended-leave":
        return "Suspended Leaves";
      case "/download-report":
        return "Download Report";
      case "/apply-leave":
        return "Apply Leave";
      default:
        return "All Leaves";
    }
  };

  const handleRemoveLeave = async (leaveId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await removeLeave(leaveId);
        fetchLeaves();
        Swal.fire('Deleted!', 'Your leave has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete leave. Please try again.', 'error');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert color="danger">{error}</Alert>;

  return (
    <>
      <DemoNavbar />
      <main ref={mainRef}>
      <div className="position-relative">
          {/* Hero for FREE version */}
          <section className="section section-hero section-shaped">
          <ThemeColor/>
        <Container className="mt-5">
          <h1>{getTitle()}</h1>
          <Row className="mb-3">
            <Col className="text-right">
              <Button color="primary" className="mr-2" onClick={downloadLeavesAsPDF}>
                <FaDownload /> Download Leaves
              </Button>
              <Button color="primary" onClick={toggleModal}>
                Apply Leave
              </Button>
            </Col>
          </Row>
          <FormGroup>
            <Label for="statusFilter" className="text-white">Filter by Status</Label>
            <Input
              type="select"
              name="statusFilter"
              id="statusFilter"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="suspended">Suspended</option>
            </Input>
          </FormGroup>
          <Row>
            {leaves.map(leave => (
              <Col lg="4" md="6" className="mb-4" key={leave.id}>
                <Card className={`shadow border-0 bg-light`}>
                  <div className={`card-header text-white bg-${getHeaderColor(leave.status)}`}>
                    Leave ID: {leave.id}
                    {leave.status === "pending" && (
                      <FaTrashAlt 
                        className="float-right cursor-pointer" 
                        onClick={() => handleRemoveLeave(leave.id)} 
                      />
                    )}
                  </div>
                  <CardBody>
                    <CardTitle tag="h5">Employee ID: {leave.employee_id}</CardTitle>
                    <p><strong>Leave Type:</strong> {leave.leave_type}</p>
                    <p><strong>Start Date:</strong> {new Date(leave.start_date).toLocaleDateString()}</p>
                    <p><strong>End Date:</strong> {new Date(leave.end_date).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {leave.status}</p>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>

        <Modal isOpen={modal} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Apply Leave</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="leaveType">Leave Type</Label>
              <Input
                type="select"
                name="leaveType"
                id="leaveType"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
              >
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="personal">Personal Leave</option>
                <option value="other">Other Leave</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="rangeDate">Date Range</Label>
              <Row>
                <Col>
                  <Input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={rangeDate.start}
                    onChange={(e) => setRangeDate({ ...rangeDate, start: e.target.value })}
                  />
                </Col>
                <Col>
                  <Input
                    type="date"
                    name="endDate"
                    id="endDate"
                    value={rangeDate.end}
                    onChange={(e) => setRangeDate({ ...rangeDate, end: e.target.value })}
                  />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Label for="halfDayFullDay">Half/Full Day</Label>
              <Input
                type="select"
                name="half_day_full_day"
                id="halfDayFullDay"
                value={halfDayFullDay}
                onChange={(e) => setHalfDayFullDay(e.target.value)}
              >
                <option value="full">Full Day</option>
                <option value="half">Half Day</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleApplyLeave}>
              Apply
            </Button>
            <Button color="secondary" onClick={toggleModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        </section>
        </div>
      </main>
      <SimpleFooter />
    </>
  );
};

export default ViewAllLeaves;
