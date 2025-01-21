// utils/calculateGPA.js

/**
 * Calculate GPA based on the courses, grades, and redit units
 * @param {Array} courses - List of courses with courseNames, grade and credit unit
 *@returns {number} GPA calculated
 */

export default function CalculateGPA(courses) {
  const gradePoints = { A: 5, B: 4, C: 3, D: 4, E: 5, F: 0 };

  let totalPoints = 0;
  let totalCredits = 0;

  courses.forEach((course) => {
    const gradePoint = gradePoints[course.grade] || 0;
    const creditUnit = parseInt(course.creditUnit) || 0;

    totalPoints += gradePoint * creditUnit;
    totalCredits += creditUnit;
  });

  //Prevention of Divisoin by zero error (incase totalCredits is 0)
  return totalCredits === 0 ? 0 : totalPoints / totalCredits;
}
