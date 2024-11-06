import ThemeColor from "theme";
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
  Spinner,
} from "reactstrap";
import { fetchSalaryByUserId } from "../../api"; // Replace with your actual API function
import DemoNavbar from "components/Navbars/DemoNavbar";
import SimpleFooter from "components/Footers/SimpleFooter";
import "./SalaryReport.css"; // Import custom CSS file for styling

const SalaryReport = () => {
  const [salaryRecords, setSalaryRecords] = useState([]); // Ensure this starts as an array
  const [modal, setModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSalaryRecords();
  }, []);

  const loadSalaryRecords = async () => {
    setLoading(true); // Set loading true when starting to load
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const response = await fetchSalaryByUserId({
        user_id: storedUser.user_id,
      }); // Fetch salary data by user_id

      // Check if response is valid and has data
      if (response) {
        setSalaryRecords(response);
      } else {
        setError("Unexpected response format");
        setSalaryRecords([]); // Ensure it's an empty array if unexpected format
      }
    } catch (error) {
      setError("Error fetching salary records");
      console.error("Error fetching salary records:", error);
    } finally {
      setLoading(false);
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
        <div className="position-relative">
          <section className="section section-hero section-shaped">
            <ThemeColor/>
            <Container className="mt-5">
              <Row className="align-items-center">
                <Col xs="12">
                  <h2 className="mb-4 text-center text-white">Salary Report</h2>
                  {loading && <Spinner color="primary" />}
                  {error && <Alert color="danger">{error}</Alert>}
                  {!loading && !error && (
                    <Table striped responsive className="salary-table">
                      <thead>
                        <tr>
                          <th>Employee ID</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Salary Month</th>
                          <th>Transaction Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salaryRecords.length > 0 ? (
                          salaryRecords.map((record) => (
                            <tr key={record.id}>
                              <td>{record.user_id}</td>
                              <td>{`$${
                                isNaN(Number(record.amount))
                                  ? "0.00"
                                  : Number(record.amount).toFixed(2)
                              }`}</td>
                              <td>{record.status}</td>
                              <td>{record.salary_month}</td>
                              <td>{record.transaction_date}</td>
                              <td>
                                <Button
                                  color="info"
                                  onClick={() => handleRecordClick(record)}
                                >
                                  View Details
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center">
                              No salary records found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  )}
                </Col>
              </Row>
            </Container>
          </section>
        </div>
      </main>
      <SimpleFooter />

      {/* Modal for Salary Details */}
      <Modal isOpen={modal} toggle={toggleModal} className="modal-lg">
        <ModalHeader toggle={toggleModal} className="bg-primary">
          <strong className="text-white">
            Salary Details for {selectedRecord ? selectedRecord.user_id : ""}
          </strong>
        </ModalHeader>
        <ModalBody>
          {selectedRecord && (
            <div>
              <p>
                <strong>Employee ID:</strong> {selectedRecord.user_id}
              </p>
              <p>
                <strong>Amount:</strong> $
                {isNaN(Number(selectedRecord.amount))
                  ? "0.00"
                  : Number(selectedRecord.amount).toFixed(2)}
              </p>
              <p>
                <strong>Status:</strong> {selectedRecord.status}
              </p>
              <p>
                <strong>Salary Month:</strong> {selectedRecord.salary_month}
              </p>
              <p>
                <strong>Transaction Date:</strong>{" "}
                {selectedRecord.transaction_date}
              </p>
              <p>
                <strong>Transaction ID:</strong> {selectedRecord.transaction_id}
              </p>
              <p>
                <strong>Payment Method:</strong> {selectedRecord.payment_method}
              </p>
              <p>
                <strong>Currency:</strong> {selectedRecord.currency}
              </p>
              <p>
                <strong>Notes:</strong> {selectedRecord.notes}
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default SalaryReport;
