import React, { useState, useEffect, useRef } from "react";
import ThemeColor from "theme";
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
  Spinner,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import SimpleFooter from "components/Footers/SimpleFooter";

// Chart.js imports
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const mainRef = useRef(null);
  const navigate = useNavigate();

  // Retrieve user_id from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [userId, setUserId] = useState(storedUser?.user_id || null);

  // State variables
  const [attendanceChartData, setAttendanceChartData] = useState(null);
  const [taskChartData, setTaskChartData] = useState(null);
  const [backlinksChartData, setBacklinksChartData] = useState(null);
  const [leavesChartData, setLeavesChartData] = useState(null);
  const [salaryChartData, setSalaryChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("Current Month");

  // Get date range based on the selected filter
  const getDateRange = (filter) => {
    const today = new Date();

    switch (filter) {
      case "Last 7 Days":
        const last7DaysStart = new Date();
        last7DaysStart.setDate(today.getDate() - 6); // Last 7 days (including today)
        return { start: last7DaysStart.toISOString().split('T')[0], end: today.toISOString().split('T')[0] };

      case "Current Day":
        return { start: today.toISOString().split('T')[0], end: today.toISOString().split('T')[0] };

      case "Current Month":
        const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the current month
        return { start: currentMonthStart.toISOString().split('T')[0], end: today.toISOString().split('T')[0] };

      case "Current Year":
        const currentYearStart = new Date(today.getFullYear(), 0, 1); // First day of the current year
        return { start: currentYearStart.toISOString().split('T')[0], end: today.toISOString().split('T')[0] };

      default:
        return { start: today.toISOString().split('T')[0], end: today.toISOString().split('T')[0] };
    }
  };

  // Fetch data from API based on the selected date range
  const fetchData = async () => {
    try {
      const { start, end } = getDateRange(dateFilter);

      // Sending POST request with date range and user_id
      const response = await fetch('http://localhost:8000/api/dashboard-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date_range: dateFilter,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Set chart data
      setAttendanceChartData({
        labels: data.attendanceReport.labels,
        datasets: [
          {
            label: "Attendance Percentage",
            data: data.attendanceReport.data,
            fill: false,
            borderColor: "rgb(54, 162, 235)",
            tension: 0.1,
          },
        ],
      });

      setTaskChartData({
        labels: data.taskReport.labels,
        datasets: [
          {
            label: "Tasks Completed",
            data: data.taskReport.data,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      });

      setBacklinksChartData({
        labels: data.backlinkReport.labels,
        datasets: [
          {
            label: "Backlink Performance",
            data: data.backlinkReport.data,
            fill: false,
            borderColor: "rgb(255, 99, 132)",
            tension: 0.1,
          },
        ],
      });

      setLeavesChartData({
        labels: data.leaveReport.labels,
        datasets: [
          {
            label: "Leaves Taken",
            data: data.leaveReport.data,
            fill: false,
            borderColor: "rgb(255, 159, 64)",
            tension: 0.1,
          },
        ],
      });

      setSalaryChartData({
        labels: data.salaryReport.labels,
        datasets: [
          {
            label: "Salary Earned",
            data: data.salaryReport.data,
            fill: false,
            borderColor: "rgb(153, 102, 255)",
            tension: 0.1,
          },
        ],
      });

    } catch (err) {
      setError(`Error fetching data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when date filter changes
  useEffect(() => {
    fetchData();
  }, [dateFilter]);

  // Handle date filter changes
  // const handleDateFilterChange = (selectedFilter) => {
    // setDateFilter(selectedFilter);
  // };

  // Loading and error handling UI
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  return (
    <>
      <DemoNavbar />
      <main ref={mainRef}>
        <div className="position-relative">
          <section className="section section-hero section-shaped">
            <ThemeColor />
            <Container className="mt-5">
              <Row className="justify-content-between">
                <Col lg="6" className="text-left">
                  <h1 className="display-4 text-white">Dashboard</h1>
                  <p className="text-white">Quick overview of reports and analytics</p>
                </Col>

                {/* Date Filter Dropdown */}
                {/* <Col lg="3" className="text-right">
                  <Dropdown isOpen={true} toggle={() => {}}>
                    <DropdownToggle color="primary">
                      Filter by: {dateFilter}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => handleDateFilterChange("Current Day")}>
                        Current Day
                      </DropdownItem>
                      <DropdownItem onClick={() => handleDateFilterChange("Last 7 Days")}>
                        Last 7 Days
                      </DropdownItem>
                      <DropdownItem onClick={() => handleDateFilterChange("Current Month")}>
                        Current Month
                      </DropdownItem>
                      <DropdownItem onClick={() => handleDateFilterChange("Current Year")}>
                        Current Year
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </Col> */}
              </Row>

              {/* Attendance Card */}
              <Row className="mt-4">
                <Col lg="12" className="mb-4">
                  <Card className="shadow border-0">
                    <CardBody>
                      <CardTitle tag="h5">Mark Your Attendance</CardTitle>
                      <p>Quickly mark your attendance to keep records updated in real-time.</p>
                      <Line data={attendanceChartData} />
                      <Button color="primary" className="mt-3" onClick={() => navigate("/mark-attendance")}>
                        Mark Attendance
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* Task and Backlinks Report */}
              <Row className="mt-5">
                <Col lg="6" md="6" className="mb-4">
                  <Card className="shadow border-0">
                    <CardBody>
                      <CardTitle tag="h5">Task Report</CardTitle>
                      <p>View detailed analysis of your tasks and progress over time.</p>
                      <Line data={taskChartData} />
                      <Button color="primary" className="mt-3" onClick={() => navigate("/tasks-report")}>
                        View Task Report
                      </Button>
                    </CardBody>
                  </Card>
                </Col>

                <Col lg="6" md="6" className="mb-4">
                  <Card className="shadow border-0">
                    <CardBody>
                      <CardTitle tag="h5">Backlinks Report</CardTitle>
                      <p>Review your backlink performance in real-time.</p>
                      <Line data={backlinksChartData} />
                      <Button color="primary" className="mt-3" onClick={() => navigate("/backlinks-report")}>
                        View Backlinks Report
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* Leaves and Salary Report */}
              <Row className="mt-5">
                <Col lg="6" md="6" className="mb-4">
                  <Card className="shadow border-0">
                    <CardBody>
                      <CardTitle tag="h5">Leave Report</CardTitle>
                      <p>Track your leave usage and remaining balance.</p>
                      <Line data={leavesChartData} />
                      <Button color="primary" className="mt-3" onClick={() => navigate("/leaves-report")}>
                        View Leave Report
                      </Button>
                    </CardBody>
                  </Card>
                </Col>

                <Col lg="6" md="6" className="mb-4">
                  <Card className="shadow border-0">
                    <CardBody>
                      <CardTitle tag="h5">Salary Report</CardTitle>
                      <p>Review your salary earned over time.</p>
                      <Line data={salaryChartData} />
                      <Button color="primary" className="mt-3" onClick={() => navigate("/salary-reports")}>
                        View Salary Report
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </section>
        </div>
      </main>

      <SimpleFooter />
    </>
  );
};

export default Dashboard;
