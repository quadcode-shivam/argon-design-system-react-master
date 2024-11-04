import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";

const Profile = () => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    phone: "",
    address: "",
    state: "",
    country: "",
    designation: "",
    position: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const defaultImage = require("assets/img/theme/team-4-800x800.jpg");

  const designations = [
    { id: 1, title: "Developer" },
    { id: 2, title: "Designer" },
    { id: 3, title: "Manager" },
  ];

  const positions = [
    { id: 1, title: "Junior" },
    { id: 2, title: "Mid" },
    { id: 3, title: "Senior" },
  ];

  // Load user data from local storage on component mount
  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("user"));
    if (storedUserData) {
      setFormData({
        userName: storedUserData.name,
        userEmail: storedUserData.email,
        phone: storedUserData.mobile,
        address: storedUserData.address,
        state: storedUserData.state,
        country: storedUserData.country,
        designation: storedUserData.designation,
        position: storedUserData.position,
      });
      // Optionally set a default profile image if available
      // setProfileImage(storedUserData.profileImage || null);
    }
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, []);

  const handleEditModalOpen = () => setEditModalOpen(true);
  const handleEditModalClose = () => setEditModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setUploadStatus(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProfile = (e) => {
    e.preventDefault();
    console.log(formData);
    localStorage.setItem("user", JSON.stringify(formData)); // Save updated data back to local storage
    handleEditModalClose(); // Close the modal after submission
  };

  return (
    <>
      <DemoNavbar />
      <main className="profile-page">
        <section className="section-profile-cover section-shaped my-0">
          <div className="shape shape-style-1 shape-default alpha-4">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="separator separator-bottom separator-skew">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon className="fill-white" points="2560 0 2560 100 0 100" />
            </svg>
          </div>
        </section>
        <section className="section">
          <Container>
            <Card className="card-profile shadow mt--300">
              <div className="px-4">
                <Row className="justify-content-center">
                  <Col className="order-lg-2" lg="3">
                    <div className="card-profile-image">
                      <a href="#pablo" onClick={(e) => e.preventDefault()}>
                        <img
                          alt="Profile"
                          className="rounded-circle"
                          src={profileImage || defaultImage}
                          style={{ cursor: 'pointer', width: '150px', height: '150px' }}
                        />
                      </a>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                        id="fileUpload"
                      />
                      <label htmlFor="fileUpload" style={{ cursor: "pointer", position: "absolute", bottom: "10px", right: "10px" }}>
                        <i className="ni ni-cloud-upload-96" style={{ fontSize: "30px", color: "#fff" }} />
                      </label>
                    </div>
                  </Col>
                  <Col className="order-lg-3 text-lg-right align-self-lg-center d-flex" lg="4">
                    <div className="card-profile-actions py-4 mt-lg-0 w-100 d-flex justify-content-between">
                      <Button className="mr-4" color="info" href="#pablo" onClick={(e) => e.preventDefault()} size="sm">
                        Connect
                      </Button>
                      <Button className="mr-4" color="info" onClick={handleEditModalOpen} size="sm">
                        Edit Profile
                      </Button>
                    </div>
                  </Col>
                  <Col className="order-lg-1" lg="4">
                    <div className="card-profile-stats d-flex justify-content-center">
                      <div>
                        <span className="heading">22</span>
                        <span className="description">Friends</span>
                      </div>
                      <div>
                        <span className="heading">10</span>
                        <span className="description">Photos</span>
                      </div>
                      <div>
                        <span className="heading">89</span>
                        <span className="description">Comments</span>
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className="text-center mt-5">
                  <h3>
                    {formData.userName} <span className="font-weight-light">, 27</span>
                  </h3>
                  <div className="h6 font-weight-300">
                    <i className="ni location_pin mr-2" />
                    {formData.state}, {formData.country}
                  </div>
                  <div className="h6 mt-4">
                    <i className="ni business_briefcase-24 mr-2" />
                    {formData.designation} - {formData.position}
                  </div>
                </div>
                <div className="text-center mt-2">
                  <div className="h6 font-weight-300">
                    <i className="ni location_pin mr-2" />
                    Phone: {formData.phone}
                  </div>
                  <div className="h6 font-weight-300">
                    <i className="ni location_pin mr-2" />
                    Email: {formData.userEmail}
                  </div>
                  <div className="h6 mt-4">
                    <i className="ni business_briefcase-24 mr-2" />
                    Address: {formData.address}
                  </div>
                  <div>
                    <i className="ni education_hat mr-2" />
                    University of Computer Science
                  </div>
                </div>
                <div className="mt-5 py-5 border-top text-center">
                  <Row className="justify-content-center">
                    <Col lg="9">
                      <p style={{ color: "#555" }}>
                        An artist of considerable range, Jamie is an iconic figure in the graphic design community, as well as being the lead designer for the agency.
                      </p>
                    </Col>
                  </Row>
                </div>
              </div>
            </Card>
          </Container>
        </section>

        {/* Edit Profile Modal */}
        <Modal isOpen={isEditModalOpen} toggle={handleEditModalClose}>
          <ModalHeader toggle={handleEditModalClose}>Edit Profile</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmitProfile}>
              <FormGroup>
                <Label for="userName">Name</Label>
                <Input
                  type="text"
                  name="userName"
                  id="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="userEmail">Email</Label>
                <Input
                  type="email"
                  name="userEmail"
                  id="userEmail"
                  value={formData.userEmail}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input
                  type="text"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="address">Address</Label>
                <Input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="state">State</Label>
                <Input
                  type="text"
                  name="state"
                  id="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="country">Country</Label>
                <Input
                  type="text"
                  name="country"
                  id="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="designation">Designation</Label>
                <Input
                  type="select"
                  name="designation"
                  id="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                >
                  {designations.map((designation) => (
                    <option key={designation.id} value={designation.title}>
                      {designation.title}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="position">Position</Label>
                <Input
                  type="select"
                  name="position"
                  id="position"
                  value={formData.position}
                  onChange={handleInputChange}
                >
                  {positions.map((position) => (
                    <option key={position.id} value={position.title}>
                      {position.title}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <ModalFooter>
                <Button color="primary" type="submit">Save changes</Button>
                <Button color="secondary" onClick={handleEditModalClose}>Cancel</Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </Modal>

      </main>
      <SimpleFooter />
    </>
  );
};

export default Profile;
