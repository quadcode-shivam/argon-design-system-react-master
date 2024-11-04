import React, { useEffect, useState } from "react";
import DemoNavbar from "components/Navbars/DemoNavbar";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";
import SimpleFooter from "components/Footers/SimpleFooter";
import { fetchAttendance, loadAttendanceRecords } from "api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Attendance = () => {
  const [modal, setModal] = useState(false);
  const [remove, removeAttendance] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    checkInTime: null,
    checkOutTime: null,
  });
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [isCheckingIn, setIsCheckingIn] = useState(true);

  useEffect(() => {
    loadAttendanceRecords();
  }, []);

  const loadAttendanceRecords = async () => {
    try {
      const response = await fetchAttendance();
      setAttendanceRecords(response.data);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, name) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employeeId) newErrors.employeeId = "Employee ID is required.";
    return newErrors;
  };

  const handleAddOrUpdateAttendance = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (editingIndex !== null) {
        await loadAttendanceRecords({
          id: attendanceRecords[editingIndex].id,
          ...formData,
        });
        setAttendanceRecords((prev) =>
          prev.map((record, i) =>
            i === editingIndex ? { ...record, ...formData } : record
          )
        );
        setEditingIndex(null);
      } else {
        const newRecord = { ...formData };
        setAttendanceRecords((prev) => [...prev, newRecord]);
      }

      setFormData({
        employeeId: "",
        checkInTime: null,
        checkOutTime: null,
      });
      setErrors({});
      setModal(false);
      setIsCheckingIn(true);
    } catch (error) {
      console.error("Error processing attendance record:", error);
    }
  };

  const handleEditAttendance = (index) => {
    const recordToEdit = attendanceRecords[index];
    setFormData({
      employeeId: recordToEdit.employeeId,
      checkInTime: new Date(recordToEdit.checkInTime),
      checkOutTime: new Date(recordToEdit.checkOutTime),
    });
    setEditingIndex(index);
    setIsCheckingIn(false);
    setModal(true);
  };

  const handleRemoveAttendance = async (index) => {
    const recordToRemove = attendanceRecords[index];
    try {
      await removeAttendance(recordToRemove.id);
      loadAttendanceRecords();
    } catch (error) {
      console.error("Error removing attendance record:", error);
    }
  };

  return (
    <>
      <DemoNavbar />
      <main>
        <div className="position-relative">
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
              <Row className="align-items-center">
                <Col xs="6">
                  <h2 className="mb-0">Attendance Records</h2>
                </Col>
                <Col xs="6" className="text-right">
                  <Button
                    color="primary"
                    onClick={() => {
                      setModal(true);
                      setEditingIndex(null);
                      setFormData({
                        employeeId: "",
                        checkInTime: new Date(),
                        checkOutTime: null,
                      });
                      setIsCheckingIn(true);
                    }}
                  >
                    Add Attendance
                  </Button>
                </Col>
              </Row>
              <Table className="mt-4" striped>
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Check-In Time</th>
                    <th>Check-Out Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record, index) => (
                    <tr key={index}>
                      <td>{record.employeeId}</td>
                      <td>
                        {new Date(record.checkInTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>
                        {new Date(record.checkOutTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>
                        <Button
                          color="warning"
                          onClick={() => handleEditAttendance(index)}
                        >
                          Edit
                        </Button>
                        <Button
                          color="danger"
                          onClick={() => handleRemoveAttendance(index)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Container>
          </section>
        </div>
      </main>
      <SimpleFooter />

      <Modal isOpen={modal} toggle={() => setModal(!modal)}>
        <ModalHeader toggle={() => setModal(!modal)}>
          {editingIndex !== null ? "Edit Attendance" : "Add Attendance"}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="employeeId">Employee ID</Label>
            <Input
              type="text"
              name="employeeId"
              id="employeeId"
              placeholder="Enter Employee ID"
              value={formData.employeeId}
              onChange={handleInputChange}
              required
            />
            {errors.employeeId && (
              <Alert color="danger">{errors.employeeId}</Alert>
            )}
          </FormGroup>
          <FormGroup>
            <Label for="checkInTime">Check-In Time</Label>
            <Input
              type="text"
              name="checkInTime"
              id="checkInTime"
              placeholder="Select Check-In Time"
              value={
                formData.checkInTime
                  ? formData.checkInTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""
              }
              readOnly
              onClick={() => setIsCheckingIn(true)}
              disabled={!!formData.checkOutTime}
            />
            <DatePicker
              selected={formData.checkInTime}
              onChange={(date) => handleDateChange(date, "checkInTime")}
              showTimeSelect
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              className="d-none"
            />
          </FormGroup>

          <FormGroup>
            <Label for="checkOutTime">Check-Out Time</Label>
            <Input
              type="text"
              name="checkOutTime"
              id="checkOutTime"
              placeholder="Select Check-Out Time"
              value={
                formData.checkOutTime
                  ? formData.checkOutTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""
              }
              readOnly
              onClick={() => setIsCheckingIn(false)}
              disabled={!formData.checkInTime}
            />
            <DatePicker
              selected={formData.checkOutTime}
              onChange={(date) => handleDateChange(date, "checkOutTime")}
              showTimeSelect
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              className="d-none"
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAddOrUpdateAttendance}>
            {editingIndex !== null ? "Update Attendance" : "Add Attendance"}
          </Button>
          <Button color="secondary" onClick={() => setModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Attendance;
