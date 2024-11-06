import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
  Progress,
} from "reactstrap";
import { loginUser } from "api"; // Ensure this imports your API call function

const Login = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    successMessage: "",
    error: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    const data = {
      email,
      password,
    };

    try {
      const response = await loginUser(data); // Call the API correctly
      localStorage.removeItem('token'); // Clear old local storage data
      localStorage.removeItem('user'); 
      localStorage.setItem('token', response.token); // Save new token and user data
      localStorage.setItem('user', JSON.stringify(response.user));
      setFormData({ ...formData, successMessage: "Successfully Matched! Redirecting ..." });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error logging in:", error);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      setFormData({ ...formData, error: errorMessage });
    }
  };

  return (
    <main>
      <section className="section section-shaped section-lg">
        <div className="shape shape-style-1 bg-gradient-default">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <Container className="pt-lg-5 pb-lg-9">
          <Row className="justify-content-center">
            <Col lg="6">
              <Card className="bg-secondary shadow border-0">
                <CardHeader className="bg-white">
                  <div className="text-muted text-center">
                    <h3>Quad Pulse <i className="ni ni-user-run ml-1" style={{fontSize:"16px", fontWeight:"bold"}}/></h3>
                  </div>
                  <Progress value={(currentStep) * 100} />
                </CardHeader>
                <CardBody className="px-lg-5 py-lg-5">
                  <Form role="form" onSubmit={onSubmit}>
                    <FormGroup>
                      <InputGroup className="input-group-alternative mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-email-83" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input 
                          name="email"
                          placeholder="Email" 
                          type="email" 
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </InputGroup>
                    </FormGroup>
                    <FormGroup>
                      <InputGroup className="input-group-alternative mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-lock-circle-open" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          name="password"
                          placeholder="Password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </InputGroup>
                    </FormGroup>
                    <div className="text-center">
                      <Button className="btn-neutral" color="default" type="submit">
                        Submit
                      </Button>
                    </div>
                    {formData.successMessage && (
                      <div className="text-success mt-3">
                        {formData.successMessage}
                      </div>
                    )}
                    {formData.error && (
                      <div className="text-danger mt-3">
                        {formData.error}
                      </div>
                    )}
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <small>Forgot password?</small>
              </a>
            </Col>
            <Col className="text-right" xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={() => navigate('/register-page')}
              >
                <small>Create new account</small>
              </a>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default Login;
