import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
} from "reactstrap";
import { fetchSalaryData } from "../../api"; // Replace with your actual API function
import DemoNavbar from "components/Navbars/DemoNavbar";
import SimpleFooter from "components/Footers/SimpleFooter";

const SalaryReport = () => {
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSalaryRecords();
  }, []);

  const loadSalaryRecords = async () => {
    try {
      const response = await fetchSalaryData(); // Fetch salary data from the API
      setSalaryRecords(response.data);
    } catch (error) {
      setError("Error fetching salary records");
      console.error("Error fetching salary records:", error);
    }
  };

  const toggleModal = () => setModal(!modal);

  const handleRecordClick = (record) => {
    setSelectedRecord(record);
    toggleModal();
  };

  return (
    <>
      <DemoNavbar />
      <main>
        <Container className="mt-5">
          <Row className="align-items-center">
            <Col xs="12">
              <h2 className="mb-4">Salary Report</h2>
              {error && <Alert color="danger">{error}</Alert>}
              <Table striped>
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Salary</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryRecords.map((record, index) => (
                    <tr key={index}>
                      <td>{record.employeeId}</td>
                      <td>{record.name}</td>
                      <td>{record.position}</td>
                      <td>{`$${record.salary.toFixed(2)}`}</td>
                      <td>
                        <Button color="info" onClick={() => handleRecordClick(record)}>
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </main>
      <SimpleFooter />

      {/* Modal for Salary Details */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          Salary Details for {selectedRecord ? selectedRecord.name : ""}
        </ModalHeader>
        <ModalBody>
          {selectedRecord && (
            <div>
              <p><strong>Employee ID:</strong> {selectedRecord.employeeId}</p>
              <p><strong>Name:</strong> {selectedRecord.name}</p>
              <p><strong>Position:</strong> {selectedRecord.position}</p>
              <p><strong>Salary:</strong> ${selectedRecord.salary.toFixed(2)}</p>
              <p><strong>Payment Date:</strong> {selectedRecord.paymentDate}</p>
              <p><strong>Bonus:</strong> ${selectedRecord.bonus.toFixed(2)}</p>
              <p><strong>Deduction:</strong> ${selectedRecord.deduction.toFixed(2)}</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default SalaryReport;
