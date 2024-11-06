import ThemeColor from "theme";
import React, { useRef, useEffect, useState } from "react";
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
  Table,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; 
import SimpleFooter from "components/Footers/SimpleFooter";
import {
  createBacklink,
  fetchBacklinks,
  updateBacklink,
  removeBacklink,
  updateCheckedStatus,
} from "../../api";

const statusMap = {
  1: "Pending",
  2: "Approved",
  3: "Rejected",
};

const getStatusName = (statusCode) => statusMap[statusCode] || "Unknown";

const submitReport = (backlinks) => {
  console.log("Submitting report:", backlinks);
  alert("Report submitted successfully!");
};

const Backlink = () => {
  const mainRef = useRef(null);
  const [modal, setModal] = useState(false); // State for modal
  const [formData, setFormData] = useState({
    url: "",
    website: "",
    anchor_text: "",
    comments: "",
    date: new Date().toISOString().slice(0, 10),
    completed: false,
  });
  const [backlinks, setBacklinks] = useState([]);
  const [errors, setErrors] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [role, setRole] = useState();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setRole(user.role);
    loadBacklinks();
  }, []);

  const loadBacklinks = async () => {
    try {
      const response = await fetchBacklinks({ page: 1, limit: 10 });
      setBacklinks(response.data);
    } catch (error) {
      console.error("Error fetching backlinks:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.url) newErrors.url = "URL is required.";
    if (!formData.website) newErrors.website = "Website is required.";
    if (!formData.anchor_text)
      newErrors.anchor_text = "Anchor text is required.";
    return newErrors;
  };

  const handleAddOrUpdateBacklink = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Always set the status to 1 (Pending) when adding or updating a backlink
      const backlinkData = { ...formData, status: 1, user_id: role };

      if (editingIndex !== null) {
        const updatedBacklink = await updateBacklink({
          ...backlinkData,
          id: backlinks[editingIndex].id,
        });
        setBacklinks((prev) =>
          prev.map((backlink, i) =>
            i === editingIndex ? updatedBacklink : backlink
          )
        );
        setEditingIndex(null);
      } else {
        const newBacklink = await createBacklink(backlinkData);
        setBacklinks((prev) => [...prev, newBacklink]);
      }

      setFormData({
        url: "",
        website: "",
        anchor_text: "",
        comments: "",
        date: new Date().toISOString().slice(0, 10),
        completed: false,
      });
      setErrors({});
      setModal(false); // Close the modal after submission
    } catch (error) {
      console.error("Error processing backlink:", error);
    }
  };

  const handleEditBacklink = (index) => {
    const backlinkToEdit = backlinks[index];
    setFormData({
      url: backlinkToEdit.url,
      website: backlinkToEdit.website,
      anchor_text: backlinkToEdit.anchor_text,
      comments: backlinkToEdit.comments,
      date: backlinkToEdit.date,
      completed: backlinkToEdit.completed,
    });
    setEditingIndex(index);
    setModal(true); // Open the modal for editing
  };

  const handleCheckboxChange = async (index) => {
    const updatedBacklinks = backlinks.map((backlink, i) => {
      if (i === index) {
        const updatedCompleted = !backlink.completed;
        return { ...backlink, completed: updatedCompleted };
      }
      return backlink;
    });

    setBacklinks(updatedBacklinks);

    const currentBacklink = updatedBacklinks[index];
    const checked = currentBacklink.completed;

    try {
      await updateCheckedStatus({ ids: [currentBacklink.id], checked });
    } catch (error) {
      console.error("Error updating backlink status:", error);
    }
  };

  const handleSubmit = async () => {
    const allCompleted = backlinks.every((backlink) => backlink.completed);
    if (!allCompleted) {
      alert("Please mark all entries as completed before submitting.");
      return;
    }

    submitReport(backlinks);
  };

  const handleRemoveBacklink = async (index) => {
    const backlinkToRemove = backlinks[index];
    try {
      await removeBacklink(backlinkToRemove.id);
      loadBacklinks();
    } catch (error) {
      console.error("Error removing backlink:", error);
    }
  };

  return (
    <>
      <DemoNavbar />
      <main ref={mainRef}>
        <div className="position-relative">
          {/* Hero for FREE version */}
          <section className="section section-hero section-shaped">
            {/* Background circles */}
            <ThemeColor/>
            <Container className="mt-5">
              <Row className="align-items-center">
                <Col xs="6">
                  <h2 className="mb-0 text-white">Daily Backlink Report</h2>
                </Col>
                <Col xs="6" className="text-right">
                  <Button
                    color="primary"
                    className="border"
                    onClick={() => setModal(true)}
                  >
                    Add Backlink
                  </Button>
                </Col>
              </Row>
              <Table className="mt-4" striped>
                <thead>
                  <tr>
                    <th className="text-white">URL</th>
                    <th className="text-white">Website</th>
                    <th className="text-white">Anchor Text</th>
                    <th className="text-white">Status</th>
                    <th className="text-white">Comments</th>
                    <th className="text-white">Date</th>
                    <th className="text-white">Completed</th>
                    <th className="text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {backlinks.map((backlink, index) => (
                    <tr key={index}>
                      <td className="text-white">{backlink.url}</td>
                      <td className="text-white">{backlink.website}</td>
                      <td className="text-white">{backlink.anchor_text}</td>
                      <td className="text-white">
                        {getStatusName(backlink.status)}
                      </td>
                      <td className="text-white">{backlink.comments}</td>
                      <td className="text-white">{backlink.date}</td>
                      <td className="text-center">
                    <Input
                      type="checkbox"
                      checked={backlink.completed}
                      onChange={() => handleCheckboxChange(index)}
                      aria-label={`Complete ${backlink.url}`}
                    />
                  </td>
                  <td className="text-center">
                    <FaEdit
                      style={{
                        cursor: "pointer",
                        color: "orange",
                        marginRight: "10px",
                        transition: "transform 0.2s",
                      }}
                      onClick={() => handleEditBacklink(index)}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                    <FaTrashAlt
                      style={{
                        cursor: "pointer",
                        color: "red",
                        transition: "transform 0.2s",
                      }}
                      onClick={() => handleRemoveBacklink(index)}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Button
                className="submit-btn"
                color="success"
                onClick={handleSubmit}
              >
                Submit Report
              </Button>
            </Container>
          </section>
        </div>
      </main>
      <SimpleFooter />

      {/* Modal for Adding/Editing Backlink */}
      <Modal isOpen={modal} toggle={() => setModal(!modal)}>
        <ModalHeader toggle={() => setModal(!modal)}>
          {editingIndex !== null ? "Edit Backlink" : "Add Backlink"}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="url">URL</Label>
            <Input
              type="text"
              name="url"
              id="url"
              placeholder="Enter URL"
              value={formData.url}
              onChange={handleInputChange}
              required
            />
            {errors.url && <Alert color="danger">{errors.url}</Alert>}
          </FormGroup>

          <FormGroup>
            <Label for="website">Website</Label>
            <Input
              type="text"
              name="website"
              id="website"
              placeholder="Enter Website"
              value={formData.website}
              onChange={handleInputChange}
              required
            />
            {errors.website && <Alert color="danger">{errors.website}</Alert>}
          </FormGroup>

          <FormGroup>
            <Label for="anchor_text">Anchor Text</Label>
            <Input
              type="text"
              name="anchor_text"
              id="anchor_text"
              placeholder="Enter Anchor Text"
              value={formData.anchor_text}
              onChange={handleInputChange}
              required
            />
            {errors.anchor_text && (
              <Alert color="danger">{errors.anchor_text}</Alert>
            )}
          </FormGroup>

          {/* Status field removed from the form */}

          <FormGroup>
            <Label for="comments">Comments</Label>
            <Input
              type="textarea"
              name="comments"
              id="comments"
              value={formData.comments}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="date">Date</Label>
            <Input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleInputChange}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAddOrUpdateBacklink}>
            {editingIndex !== null ? "Update Backlink" : "Add Backlink"}
          </Button>
          <Button color="secondary" onClick={() => setModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Backlink;
