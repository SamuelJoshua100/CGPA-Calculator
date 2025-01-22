import { useState, useEffect, useRef } from "react";
import React from "react";
import Header from "./Header";
import CalculateGPA from "./CalculateGPA";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Main App component
export default function Form() {
  const chartRef = useRef(null);
  const [courses, setCourses] = useState([
    { courseName: "", grade: "", creditUnit: "" },
  ]);
  const [gpa, setGpa] = useState(null);
  const [chartData, setChartData] = useState(null);

  // Add course row
  function addCourseRow() {
    setCourses([...courses, { courseName: "", grade: "", creditUnit: "" }]);
  }

  // Handle input changes for each row
  const handleInput = (index, e) => {
    const { name, value } = e.target;
    const updatedCourses = [...courses];

    if (name === "creditUnit") {
      const numericValue = parseInt(value, 10);
      if (numericValue < 0 || numericValue > 5) {
        return;
      }
    }

    if (!updatedCourses[index]) {
      updatedCourses[index] = { courseName: "", grade: "", creditUnit: "" };
    }

    updatedCourses[index][name] = value;
    setCourses(updatedCourses);
  };

  // Remove a course row
  function removeCourseRow(index) {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
  }

  // Delete all course rows
  const deleteAll = () => {
    setCourses([{ courseName: "", grade: "", creditUnit: "" }]);
  };

  // Handle form submission and GPA calculation
  const handleSubmit = (event) => {
    event.preventDefault();
    for (const course of courses) {
      if (!course.courseName || !course.grade || !course.creditUnit) {
        alert("Please fill in all fields for each course.");
        return;
      }
      const creditUnit = parseInt(course.creditUnit, 10);
      if (isNaN(creditUnit) || creditUnit < 0 || creditUnit > 5) {
        alert("Please enter a valid credit unit between 1 and 5.");
        return;
      }
    }

    // Calculate GPA
    const calculateGPA = CalculateGPA(courses);
    const roundedGPA = calculateGPA.toFixed(2);
    setGpa(roundedGPA);

    // Set up the chart data
    const chartData = {
      labels: ["GPA"],
      datasets: [
        {
          label: "Your GPA",
          data: [roundedGPA],
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
    setChartData(chartData);
  };

  // Clean up chart when component is unmounted
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="h-screen w-full min-h-screen bg-gray-100 flex items-center justify-center p-4 flex-col">
      <Header />
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Enter your Courses
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-center justify-start space-x-4 w-full"
      >
        {courses.map((course, index) => (
          <div
            key={index}
            className="space-y-2 flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
          >
            <input
              type="text"
              name="courseName"
              placeholder="Course Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={course.courseName}
              onChange={(e) => handleInput(index, e)}
            />
            <select
              name="grade"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
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
            <input
              type="number"
              name="creditUnit"
              placeholder="Credit Unit"
              min="0"
              max="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={course.creditUnit}
              onChange={(e) => handleInput(index, e)}
            />
            <button
              type="button"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
              onClick={() => removeCourseRow(index)}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addCourseRow}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg mb-2"
        >
          Add Course
        </button>

        <button
          type="button"
          onClick={deleteAll}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg mb-2"
        >
          Clear All
        </button>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg mb-2"
        >
          Calculate
        </button>
      </form>

      {gpa !== null && (
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold">Your GPA: {gpa}</h3>
          <div className="mt-4 w-64 h-64 mx-auto">
            <Bar
              ref={chartRef}
              data={chartData}
              options={{ responsive: true }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
