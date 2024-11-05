import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DemoNavbar from "components/Navbars/DemoNavbar";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ListGroup,
  ListGroupItem,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import SimpleFooter from "components/Footers/SimpleFooter";
import axios from "axios";
import { Dialog, DialogContent } from '@mui/material';

const UserTask = () => {
  const mainRef = useRef(null);
  const [data, setData] = useState({ sprints: [] });
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(5);
  const [historyEntries, setHistoryEntries] = useState([]);

  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("tasks/fetch");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchHistory = async (taskId) => {
    try {
      const response = await api.get(`tasks/${taskId}/history`);
      setHistoryEntries(response.data);
    } catch (error) {
      console.error("Error fetching task history:", error);
    }
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen && selectedTask) {
      fetchHistory(selectedTask.id);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    toggleModal();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredTasks = data.sprints.flatMap((sprint) =>
    sprint.tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination Logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (
    <>
      <DemoNavbar />
      <main ref={mainRef}>
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
          <h2 className="text-white">User Tasks</h2>
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearch}
            className="mb-3"
          />
          {loading ? (
            <p>Loading tasks...</p>
          ) : (
            <Row>
              {data.sprints.map((sprint) => (
                <Col md="4" key={sprint.id}>
                  <Card className="mb-3">
                    <CardBody>
                      <CardTitle tag="h5" className="text-center m-0 p-2 bg-primary text-white">{sprint.name}</CardTitle>
                      <p><strong>Goal:</strong> {sprint.goal}</p>
                      <p><strong>Start Date:</strong> {sprint.start_date}</p>
                      <p><strong>End Date:</strong> {sprint.end_date}</p>
                      <ListGroup>
                        {sprint.tasks.map((task) => (
                          <ListGroupItem
                            key={task.id}
                            onClick={() => handleTaskClick(task)}
                            style={{ cursor: 'pointer' }}
                            className="bg-primary text-white mt-1"
                          >
                            <h6 className="bg-white text-primary p-2">{task.title}</h6>
                            <p>Status: {task.status}</p>
                            <p>Priority: {task.priority}</p>
                          </ListGroupItem>
                        ))}
                      </ListGroup>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* Pagination Controls */}
          <Pagination aria-label="Page navigation example">
            <PaginationItem disabled={currentPage === 1}>
              <PaginationLink onClick={() => setCurrentPage(currentPage - 1)}>Previous</PaginationLink>
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem active={index + 1 === currentPage} key={index}>
                <PaginationLink onClick={() => setCurrentPage(index + 1)}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem disabled={currentPage === totalPages}>
              <PaginationLink onClick={() => setCurrentPage(currentPage + 1)}>Next</PaginationLink>
            </PaginationItem>
          </Pagination>

          {/* Task Detail Dialog */}
          <Dialog open={modalOpen} onClose={toggleModal}>
            <DialogContent>
              {selectedTask ? (
                <div>
                  <h6>{selectedTask.title}</h6>
                  <p><strong>Description:</strong> {selectedTask.description}</p>
                  <p><strong>Status:</strong> {selectedTask.status}</p>
                  <p><strong>Priority:</strong> {selectedTask.priority}</p>
                  <p><strong>Due Date:</strong> {selectedTask.due_date}</p>

                  {/* Task History Section */}
                  <h6>Task History:</h6>
                  <ul>
                    {historyEntries.map((entry) => (
                      <li key={entry.id}>
                        <p>{entry.action}</p>
                        <p>{entry.timestamp}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No task selected.</p>
              )}
            </DialogContent>
            <ModalFooter>
              <Button color="secondary" onClick={toggleModal}>Close</Button>
            </ModalFooter>
          </Dialog>
        </Container>
        </section>
        </div>
      </main>
      <SimpleFooter />
    </>
  );
};

export default UserTask;
