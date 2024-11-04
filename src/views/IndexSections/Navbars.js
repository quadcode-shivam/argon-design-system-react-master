import React from "react";
import Headroom from "headroom.js";
import {
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
  Tooltip,
} from "reactstrap";

const navItems = [
  { title: "Backlinks", icon: "ni ni-chart-pie-35", link: "#pablo" },
  { title: "Tasks", icon: "ni ni-check-bold", link: "#pablo" },
  { title: "Attendance", icon: "ni ni-calendar-grid-58", link: "#pablo" },
  { title: "Profile", icon: "ni ni-single-02", link: "#pablo" },
];

class Navbars extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipOpen: Array(navItems.length).fill(false),
      collapseClasses: "",
      collapseOpen: false,
    };
  }

  toggleTooltip = (index) => {
    const newTooltipOpen = [...this.state.tooltipOpen];
    newTooltipOpen[index] = !newTooltipOpen[index];
    this.setState({ tooltipOpen: newTooltipOpen });
  };

  componentDidMount() {
    const headroom = new Headroom(document.getElementById("navbar-main"));
    headroom.init();
  }

  toggleCollapse = () => {
    this.setState((prevState) => ({
      collapseOpen: !prevState.collapseOpen,
      collapseClasses: prevState.collapseOpen ? "" : "show",
    }));
  };

  onExiting = () => {
    this.setState({ collapseClasses: "collapsing-out" });
  };

  onExited = () => {
    this.setState({ collapseClasses: "" });
  };

  render() {
    return (
      <header className="header-global">
        <Navbar
          className="navbar-main navbar-dark bg-default headroom"
          expand="lg"
          id="navbar-main"
        >
          <Container>
            <NavbarBrand
              href="#pablo"
              className="m-0 p-0"
              onClick={(e) => e.preventDefault()}
            >
              Quad Pulse
              <i
                className="ni ni-user-run ml-1"
                style={{ fontSize: "16px", fontWeight: "bold" }}
              />
            </NavbarBrand>
            <button
              className="navbar-toggler"
              id="navbar-main-toggler"
              onClick={this.toggleCollapse}
            >
              <span className="navbar-toggler-icon" />
            </button>
            {this.state.collapseOpen && (
              <button
                className="close-button navbar-toggler"
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "15px",
                  fontSize: "20px",
                  color: "white",
                  background: "none",
                  border: "none",
                }}
                onClick={this.toggleCollapse}
              >
                &times;
              </button>
            )}
            <UncontrolledCollapse
              navbar
              toggler="#navbar-main-toggler"
              className={`${this.state.collapseClasses}`}
              onExiting={this.onExiting}
              onExited={this.onExited}
              style={{ maxHeight: "300px", overflowY: "auto" }} // allows scrolling if menu items increase
            >
              <Nav className="ml-lg-auto" navbar>
                {navItems.map((item, index) => (
                  <NavItem key={index}>
                    <NavLink
                      className="nav-link-icon"
                      href={item.link}
                      onClick={(e) => e.preventDefault()}
                      id={`tooltip-${index}`}
                      onMouseEnter={() => this.toggleTooltip(index)}
                      onMouseLeave={() => this.toggleTooltip(index)}
                    >
                      <i className={item.icon} />
                      <span className="nav-link-inner--text d-lg-none">
                        {item.title}
                      </span>
                    </NavLink>
                    <Tooltip
                      placement="top"
                      isOpen={this.state.tooltipOpen[index]}
                      target={`tooltip-${index}`}
                      toggle={() => this.toggleTooltip(index)}
                      className="custom-tooltip"
                    >
                      {item.title}
                    </Tooltip>
                  </NavItem>
                ))}
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav className="nav-link-icon">
                    <i className="ni ni-settings-gear-65" />
                    <span className="nav-link-inner--text d-lg-none">
                      More
                    </span>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                      Leaves
                    </DropdownItem>
                    <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                      Salary
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                      Profile
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </UncontrolledCollapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}

export default Navbars;
