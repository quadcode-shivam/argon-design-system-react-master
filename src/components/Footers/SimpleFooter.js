import React from "react";
// reactstrap components
import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";

class SimpleFooter extends React.Component {
  render() {
    return (
      <footer className="footer pt-5 pb-3">
        <Container>
          <Row className="align-items-center justify-content-center mb-4">
            <Col lg="6" className="text-center">
              <h4 className="text-primary font-weight-light mb-3">
                We're here to help you!
              </h4>
              <p className="mb-0">
                Have questions or feedback? Reach out to us anytime.
              </p>
            </Col>
          </Row>
          <Row className="justify-content-center mb-4">
            <Col className="text-center">
              <h5 className="font-weight-bold">Contact Us:</h5>
              <p>Email: <a href="mailto:shivam.qcoder@gmail.com">shivam.qcoder@gmail.com</a></p>
              <p>Phone: <a href="tel:+918090313616">+91 80903 13616</a></p>
            </Col>
          </Row>
          <Row className="align-items-center justify-content-center">
            <Col md="6">
              <Nav className="nav-footer justify-content-center">
                <NavItem>
                  <NavLink href="/about" target="_blank">
                    About Us
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/privacy" target="_blank">
                    Privacy Policy
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/contact" target="_blank">
                    Contact Support
                  </NavLink>
                </NavItem>
              </Nav>
            </Col>
          </Row>
          <Row className="justify-content-center mt-4">
            <Col className="text-center">
              <div className="copyright">
                © {new Date().getFullYear()} Your Company Name. All Rights Reserved.
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    );
  }
}

export default SimpleFooter;
