import { useState, useEffect, useRef } from "react"; //Importing useState hook for managing component's state
import React from "react";
import CalculateGPA from "./CalculateGPA"; //Import the CGPA logic
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement, // Ensure this is added
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement, // Ensure this is added
  Title,
  Tooltip,
  Legend
);

//Main App component
export default function Form() {
  const chartRef = useRef(null); // Define the chartRef
  //State to hold the course
  const [courses, setCourses] = useState([
    { courseName: "", grade: "", creditUnit: "" }, //Initializing state with an empty course row
  ]);
  const [gpa, setGpa] = useState(null); //State for storing the calculated GPA
  const [chartData, setChartData] = useState(null); // State for storing chart data

  function addCourseRow() {
    setCourses([...courses, { courseName: "", grade: "", creditUnit: "" }]); //Adds a new course row
  }

  /**
   * Handles input changes for specific rows.
   * @param {number} index - Index of the course being edited.
   * @param {object} event - The input change event.
   */
  const handleInput = (index, e) => {
    const { name, value } = e.target;
    const updatedCourses = [...courses];

    // Validate creditUnit value
    if (name === "creditUnit") {
      const numericValue = parseInt(value, 10);
      if (numericValue < 0 || numericValue > 5) {
        return; // Ignore invalid values
      }
    }

    if (!updatedCourses[index]) {
      updatedCourses[index] = { courseName: "", grade: "", creditUnit: "" };
    }

    updatedCourses[index][name] = value;
    setCourses(updatedCourses);
  };

  /**
   * Removes a course row by index.
   * @param {number} index - Index of the course to remove.
   */

  function removeCourseRow(index) {
    const updatedCourses = courses.filter((_, i) => i !== index); //Filter out the row by index
    setCourses(updatedCourses); //Update the state with the reduced array
  }

  const deleteAll = () => {
    setCourses([{ courseName: "", grade: "", creditUnit: "" }]); //Resets the state to its initial state
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission

    for (const course of courses) {
      // Check if any field is empty or creditUnit is invalid
      if (!course.courseName || !course.grade || !course.creditUnit) {
        alert("Please fill in all fields for each course.");
        return; // Exit early if any field is empty
      }

      // Check if creditUnit is a valid number between 1 and 5
      const creditUnit = parseInt(course.creditUnit, 10);
      if (isNaN(creditUnit) || creditUnit < 0 || creditUnit > 5) {
        alert("Please enter a valid credit unit between 1 and 5.");
        return;
      }
    }

    // Calculate GPA
    const calculateGPA = CalculateGPA(courses);

    // Round the GPA to two decimal places
    const roundedGPA = calculateGPA.toFixed(2);
    setGpa(roundedGPA); // Set the calculated GPA

    // Set up the chart data to visualize the GPA

    const chartData = {
      labels: ["GPA"],
      datasets: [
        {
          label: "Your GPA",
          data: [roundedGPA], // Pass GPA value as data for the chart
          backgroundColor: "rgba(75, 192, 192, 0.6)", // Bar color
          borderColor: "rgba(75, 192, 192, 1)", // Border color
          borderWidth: 1,
        },
      ],
    };
    setChartData(chartData); // Set the chart data state
  };

  // Clean up chart when the component is unmounted
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Destroy the chart when the component is unmounted
      }
    };
  }, []);

  return (
    <div>
      <h2>Enter your Courses</h2> {/*Form title */}
      <form onSubmit={handleSubmit}>
        {courses.map((course, index) => (
          <div key={index}>
            <input
              type="text"
              name="courseName"
              placeholder="Course Name"
              value={course.courseName}
              onChange={(e) => handleInput(index, e)}
            />

            {/* Grade Dropbox selection */}
            <select
              name="grade"
              value={course.grade}
              onChange={(e) => handleInput(index, e)}
            >
              <option value="">Grade</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
            </select>

            {/*Credit Unit input*/}
            <input
              type="number"
              name="creditUnit"
              placeholder="Credit Unit"
              min="0" // Minimum value
              max="5" // Maximum value
              value={course.creditUnit}
              onChange={(e) => handleInput(index, e)}
            />

            {/*Remove Course Row button */}
            <button type="button" onClick={() => removeCourseRow(index)}>
              Remove
            </button>
          </div>
        ))}

        {/*Add Course Row button*/}
        <button type="button" onClick={addCourseRow}>
          Add Course
        </button>

        {/*Clear all Course rows*/}
        <button type="button" onClick={deleteAll}>
          Clear All
        </button>

        {/*Submit-Calculate button*/}
        <button type="submit" onClick={handleSubmit}>
          Calculate
        </button>
      </form>
      {/* GPA result display */}
      {gpa !== null && (
        <div>
          <h3>Your GPA: {gpa}</h3>{" "}
          {gpa !== null && (
            <Bar
              ref={chartRef}
              data={chartData}
              options={{ responsive: true }}
            />
          )}
        </div>
      )}
    </div>
  );
}
