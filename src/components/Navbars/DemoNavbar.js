import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import Headroom from "headroom.js";
import {
  Button,
  UncontrolledCollapse,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  Popover,
  PopoverBody,
} from "reactstrap";
// Import Font Awesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faChartBar,
  faClipboardList,
  faUsers,
  faFileAlt,
  faSignOutAlt,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";

class DemoNavbar extends React.Component {
  state = {
    collapseClasses: "",
    collapseOpen: false,
    popoverOpen: false,
    user: {
      email: "user@example.com",
      name: "John Doe",
      role: "Admin",
    },
  };

  componentDidMount() {
    const headroom = new Headroom(document.getElementById("navbar-main"));
    headroom.init();

    // Retrieve and parse user data from local storage
    const userData = JSON.parse(localStorage.getItem("user")); // Assuming 'user' is the key
    if (userData) {
      this.setState({ user: { ...this.state.user, ...userData } });
    }
  }

  onExiting = () => {
    this.setState({ collapseClasses: "collapsing-out" });
  };

  onExited = () => {
    this.setState({ collapseClasses: "" });
  };

  togglePopover = () => {
    this.setState((prevState) => ({ popoverOpen: !prevState.popoverOpen }));
  };

  handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem("user"); // Clear the user data

    // Redirect to login page
    this.props.history.push("/login"); // Redirect to the login page
  };

  render() {
    const { email, name, role } = this.state.user;

    return (
      <>
        <header className="header-global">
          <Navbar
            className="navbar-main navbar-transparent navbar-light headroom"
            expand="lg"
            id="navbar-main"
          >
            <Container>
              <NavbarBrand
                tag={Link}
                to="/"
                className="m-0 p-0 fw-bold"
                style={{ fontSize: "22px", fontWeight: "bold" }}
              >
                Quad Pulse
                <i
                  className="ni ni-user-run ml-1"
                  style={{ fontSize: "16px" }}
                />
              </NavbarBrand>
              <button className="navbar-toggler" id="navbar_global">
                <span className="navbar-toggler-icon" />
              </button>
              <UncontrolledCollapse
                toggler="#navbar_global"
                navbar
                className={this.state.collapseClasses}
                onExiting={this.onExiting}
                onExited={this.onExited}
              >
                <div className="navbar-collapse-header">
                  <Row>
                    <Col className="collapse-brand" xs="6">
                      <NavbarBrand
                        tag={Link}
                        to="/"
                        className="m-0 p-0 fw-bold"
                        style={{ fontSize: "22px", fontWeight: "bold" }}
                      >
                        Quad Pulse
                        <i
                          className="ni ni-user-run ml-1"
                          style={{ fontSize: "16px" }}
                        />
                      </NavbarBrand>
                    </Col>
                    <Col className="collapse-close" xs="6">
                      <button className="navbar-toggler" id="navbar_global">
                        <span />
                        <span />
                      </button>
                    </Col>
                  </Row>
                </div>

                {/* Main Navigation */}
                <Nav
                  className="ml-auto navbar-nav-hover align-items-lg-center"
                  navbar
                >
                  <NavItem>
                    <NavLink tag={Link} to="/dashboard">
                      <FontAwesomeIcon
                        icon={faTachometerAlt}
                        className="mr-2"
                      />
                      Dashboard
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} to="/backlinks-report">
                      <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                      Backlinks Report
                    </NavLink>
                  </NavItem>
                  <UncontrolledDropdown nav>
                    <DropdownToggle nav>
                      <FontAwesomeIcon
                        icon={faClipboardList}
                        className="mr-2"
                      />
                      Attendance
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem tag={Link} to="/attendance-report">
                        Attendance Report
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <UncontrolledDropdown nav>
                    <DropdownToggle nav>
                      <FontAwesomeIcon icon={faUsers} className="mr-2" />
                      Leaves
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem tag={Link} to="/view-all-leave">
                        View All Leave
                      </DropdownItem>
                      <DropdownItem tag={Link} to="/view-approved-leave">
                        View Approved Leave
                      </DropdownItem>
                      <DropdownItem tag={Link} to="/view-pending-leave">
                        View Pending Leave
                      </DropdownItem>
                      <DropdownItem tag={Link} to="/view-suspended-leave">
                        View Suspended Leave
                      </DropdownItem>
                      <DropdownItem tag={Link} to="/download-report">
                        Download Report
                      </DropdownItem>
                      <DropdownItem tag={Link} to="/apply-leave">
                        Apply Leave
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <NavItem>
                    <NavLink tag={Link} to="/salary-reports">
                      <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                      Salary Reports
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink id="profilePopover" onClick={this.togglePopover}>
                      <FontAwesomeIcon
                        icon={faUserCircle}
                        style={{ fontSize: "20px" }}
                      />
                    </NavLink>
                    <Popover
                      placement="bottom"
                      isOpen={this.state.popoverOpen}
                      target="profilePopover"
                      toggle={this.togglePopover}
                    >
                      <PopoverBody className="p-3">
                        <div>
                          <p className="mb-1">
                            <strong>Email:</strong> {email}
                          </p>
                          <p className="mb-1">
                            <strong>Name:</strong> {name}
                          </p>
                          <p className="mb-1">
                            <strong>Role:</strong> {role}
                          </p>
                          <Button
                            tag={Link}
                            to="/profile-page"
                            color="primary"
                            size="sm"
                            block
                          >
                            View Profile
                          </Button>
                          <Button
                            color="primary"
                            size="sm"
                            block
                            onClick={this.handleLogout} // Call handleLogout on click
                          >
                            <FontAwesomeIcon
                              icon={faSignOutAlt}
                              className="mr-2"
                            />
                            Logout
                          </Button>
                        </div>
                      </PopoverBody>
                    </Popover>
                  </NavItem>
                </Nav>
              </UncontrolledCollapse>
            </Container>
          </Navbar>
        </header>
      </>
    );
  }
}

export default DemoNavbar;
