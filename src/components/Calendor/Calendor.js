import React, { useEffect, useRef, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from "date-fns";
import ThemeColor from "theme";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Spinner,
  Alert,
  CardTitle,
} from "reactstrap";
import DemoNavbar from "components/Navbars/DemoNavbar";
import SimpleFooter from "components/Footers/SimpleFooter";
import { fetchHolidayApi, fetchLeavesApi } from "api";

const CalendarWithEvents = () => {
  const mainRef = useRef(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalHolidays, setTotalHolidays] = useState(0);
  const [totalLeaveTaken, setTotalLeaveTaken] = useState(0);
  const [totalLate, setTotalLate] = useState(0);
  const [totalHalf, setTotalHalf] = useState(0);
  const [remainingLeaves, setRemainingLeaves] = useState(0);
  const [remainingLate, setRemainingLate] = useState(0);
  const [remainingHalf, setRemainingHalf] = useState(0);
  const [totalLeave, setTotalLeave] = useState(0);

  const renderHeader = () => (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <Button onClick={prevMonth}>Previous</Button>
      <h3 className="text-white">{format(currentMonth, "MMMM yyyy")}</h3>
      <Button onClick={nextMonth}>Next</Button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEEE";
    const startDate = startOfWeek(currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <Col key={i} className="text-center">
          {format(addDays(startDate, i), dateFormat)}
        </Col>
      );
    }
    return <Row>{days}</Row>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const today = new Date();

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isToday = isSameDay(day, today);
        const isSelected = isSameDay(day, selectedDate);
        const event = events.find((e) => isSameDay(new Date(e.start), day));

        days.push(
          <Col key={day} className="text-center m-2">
            <Card
              onClick={() => onDateClick(cloneDay)}
              className={`${
                !isSameMonth(day, monthStart) ? "text-muted text-secondary" : ""
              } ${
                isToday
                  ? "bg-success text-white"
                  : isSelected
                  ? "bg-primary text-white"
                  : "bg-white text-primary"
              } border-light`}
            >
              <CardBody className="p-3">
                
                {event ? (
                  <span
                    className={`badge ${
                      event.type === "holiday" ? "bg-info text-white" : "bg-danger text-white"
                    }`}
                  >
                    {event.type === "holiday" ? event.type : "Leave"}
                  </span>
                ) :<>  {format(day, "d")}</>}
              </CardBody>
            </Card>
          </Col>
        );
        day = addDays(day, 1);
      }
      rows.push(<Row key={day}>{days}</Row>);
      days = [];
    }
    return <div>{rows}</div>;
  };

  const onDateClick = (day) => {
    setSelectedDate(day);
  };

  const prevMonth = () => {
    setCurrentMonth((prev) => addDays(prev, -30));
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => addDays(prev, 30));
  };

  const fetchHoliday = async () => {
    setLoading(true);
    try {
      const response = await fetchHolidayApi();
      const holidays = response.holidays.map((holiday) => ({
        title: holiday.title,
        start: new Date(holiday.start_date),
        end: new Date(holiday.end_date),
        type: "holiday",
      }));
      setEvents((prevEvents) => [...prevEvents, ...holidays]);
      setTotalHolidays(response.total_records);
    } catch (error) {
      setError("Failed to load holidays. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaves = async () => {
    setLoading(true);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await fetchLeavesApi(storedUser.user_id);
      setTotalLeaveTaken(response.total_leave_taken);
      setTotalLate(response.total_late);
      setTotalHalf(response.total_half);
      setRemainingLeaves(response.remaining_leaves);
      setRemainingLate(response.remaining_late);
      setRemainingHalf(response.remaining_half);
      setTotalLeave(response.total_leave);

      const leaves = response.leaves.map((leave) => ({
        title: leave.leave_type + " leave",
        start: new Date(leave.start_date),
        end: new Date(leave.end_date),
        type: "leave",
      }));
      setEvents((prevEvents) => [...prevEvents, ...leaves]);
    } catch (error) {
      setError("Failed to load leaves. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoliday();
    fetchLeaves();
  }, []);

  return (
    <>
      <DemoNavbar />
      <main ref={mainRef}>
        <div className="position-relative">
          <section className="section section-hero section-shaped">
            <ThemeColor/>
            <Container className="mt-5 text-white">
              {loading && <Spinner color="primary" />}
              {error && <Alert color="danger">{error}</Alert>}
              {renderHeader()}
              {renderDays()}
              {renderCells()}

              <Row className="mt-4">
                <Col lg="6" className="mb-4">
                  <Card
                    className="shadow border-0"
                    style={{ backgroundColor: "#f8d7da" }}
                  >
                    <CardBody>
                      <CardTitle tag="h5">Total Holidays</CardTitle>
                      <p className="text-primary">
                        Total number of holidays taken by you.
                      </p>
                      <h3>{totalHolidays}</h3>
                    </CardBody>
                  </Card>
                </Col>

                <Col lg="6" className="mb-4">
                  <Card
                    className="shadow border-0"
                    style={{ backgroundColor: "#d4edda" }}
                  >
                    <CardBody>
                      <CardTitle tag="h5">Total Leave Taken</CardTitle>
                      <p className="text-primary">Total leave days utilized.</p>
                      <h3>{totalLeaveTaken}</h3>
                    </CardBody>
                  </Card>
                </Col>

                <Col lg="6" className="mb-4">
                  <Card
                    className="shadow border-0"
                    style={{ backgroundColor: "#fff3cd" }}
                  >
                    <CardBody>
                      <CardTitle tag="h5">Total Late</CardTitle>
                      <p className="text-primary">
                        Total times you were late to work.
                      </p>
                      <h3>{totalLate}</h3>
                    </CardBody>
                  </Card>
                </Col>

                <Col lg="6" className="mb-4">
                  <Card
                    className="shadow border-0"
                    style={{ backgroundColor: "#cce5ff" }}
                  >
                    <CardBody>
                      <CardTitle tag="h5">Total Half Days</CardTitle>
                      <p className="text-primary">Total half days taken off.</p>
                      <h3>{totalHalf}</h3>
                    </CardBody>
                  </Card>
                </Col>

                <Col lg="6" className="mb-4">
                  <Card
                    className="shadow border-0"
                    style={{ backgroundColor: "#d4edda" }}
                  >
                    <CardBody>
                      <CardTitle tag="h5">Remaining Leaves</CardTitle>
                      <p className="text-primary">
                        Leaves available for future use.
                      </p>
                      <h3>{remainingLeaves}</h3>
                    </CardBody>
                  </Card>
                </Col>

                <Col lg="6" className="mb-4">
                  <Card
                    className="shadow border-0"
                    style={{ backgroundColor: "#fff3cd" }}
                  >
                    <CardBody>
                      <CardTitle tag="h5">Remaining Late</CardTitle>
                      <p className="text-primary">
                        Remaining allowances for lateness.
                      </p>
                      <h3>{remainingLate}</h3>
                    </CardBody>
                  </Card>
                </Col>

                <Col lg="6" className="mb-4">
                  <Card
                    className="shadow border-0"
                    style={{ backgroundColor: "#cce5ff" }}
                  >
                    <CardBody>
                      <CardTitle tag="h5">Remaining Half Days</CardTitle>
                      <p className="text-primary">
                        Half days available for future use.
                      </p>
                      <h3>{remainingHalf}</h3>
                    </CardBody>
                  </Card>
                </Col>

                <Col lg="6" className="mb-4">
                  <Card
                    className="shadow border-0"
                    style={{ backgroundColor: "#f8d7da" }}
                  >
                    <CardBody>
                      <CardTitle tag="h5">Total Leave</CardTitle>
                      <p className="text-primary">
                        Total leave days allocated to you.
                      </p>
                      <h3>{totalLeave}</h3>
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

export default CalendarWithEvents;
