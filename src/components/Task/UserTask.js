import ThemeColor from "theme";
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
  FormGroup,
  Label,
} from "reactstrap";
import SimpleFooter from "components/Footers/SimpleFooter";
import axios from "axios";

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
  const [status, setStatus] = useState("");

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
    setStatus(task.status);
    toggleModal();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleStatusUpdate = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (selectedTask) {
      const updatedTask = {
        id: selectedTask.id,
        employee_id: storedUser.user_id,
        status: status,
      };

      try {
        const response = await api.post("tasks/update", updatedTask);
        console.log("Status updated:", response.data);
      } catch (error) {
        console.error("Error updating task status:", error);
      } finally {
        toggleModal();
      }
    }
  };

  const filteredTasks = data.sprints.flatMap((sprint) =>
    sprint.tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (
    <>
      <DemoNavbar />
      <main ref={mainRef}>
        <div className="position-relative">
          <section className="section section-hero section-shaped">
            <ThemeColor/>
            <Container className="mt-5">
              <h2>User Tasks</h2>
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
                          <CardTitle
                            tag="h5"
                            className="text-center m-0 p-2 bg-primary text-white"
                          >
                            {sprint.name}
                          </CardTitle>
                          <p>
                            <strong>Goal:</strong> {sprint.goal}
                          </p>
                          <p>
                            <strong>Start Date:</strong> {sprint.start_date}
                          </p>
                          <p>
                            <strong>End Date:</strong> {sprint.end_date}
                          </p>
                          <ListGroup>
                            {sprint.tasks.map((task) => (
                              <ListGroupItem
                                key={task.id}
                                onClick={() => handleTaskClick(task)}
                                style={{ cursor: "pointer" }}
                                className="bg-primary text-white mt-1"
                              >
                                <h6 className="bg-white text-primary p-2">
                                  {task.title}
                                </h6>
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

            

              {/* Task Detail Modal */}
              <Modal isOpen={modalOpen} toggle={toggleModal} className="modal-lg">
                <ModalHeader className="bg-primary border border-white border-1 text-white" >
                  <strong className="text-white">{selectedTask ? selectedTask.title : "Task Detail"}</strong>
                </ModalHeader>
                <ModalBody>
                  {selectedTask ? (
                    <div>
                      <h6>
                        <strong>Description:</strong> {selectedTask.description}
                      </h6>
                      <h6>
                        <strong>Status:</strong> {selectedTask.status}
                      </h6>
                      <h6>
                        <strong>Priority:</strong> {selectedTask.priority}
                      </h6>
                      <h6>
                        <strong>Due Date:</strong> {selectedTask.due_date}
                      </h6>

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

                      {/* Status Update Dropdown */}
                      <FormGroup>
                        <Label for="statusSelect">Update Status:</Label>
                        <Input
                          type="select"
                          name="status"
                          id="statusSelect"
                          value={status}
                          onChange={handleStatusChange}
                        >
                          <option value="todo">To Do</option>
                          <option value="in progress">In Progress</option>
                          <option value="ready for staging">Ready for Staging</option>
                          <option value="staging">Staging</option>
                          <option value="ready for production">Ready for Production</option>
                          <option value="production">Production</option>
                          <option value="done">Done</option>
                          <option value="block">Blocked</option>
                        </Input>
                      </FormGroup>
                    </div>
                  ) : (
                    <p>No task selected.</p>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={handleStatusUpdate}>
                    Update Status
                  </Button>
                  <Button color="danger" onClick={toggleModal}>
                    Close
                  </Button>
                </ModalFooter>
              </Modal>
            </Container>
          </section>
        </div>
      </main>
      <SimpleFooter />
    </>
  );
};

export default UserTask;
