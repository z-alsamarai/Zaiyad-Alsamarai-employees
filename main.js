/*
  * The Project class is a container for the start and end dates of a project.
  * @param start - The start date of the project.
  * @param end - The end date of the project. 
  * @returns An object with the following properties: 
  * - start: The start date of the project.
  * - end: The end date of the project.
  * @example
  * const project = new Project(new Date(2020, 0, 1), new Date(2020, 0, 31));
  * console.log(project.start); // 2020-01-01T00:00:00.000Z
  */
class Project {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}

/**
  * The Overlap class is a container for the number of days two employees
  * are working on the same project.
  * @param days - The number of days of overlap between the two projects.
  * @param empId - The employee ID of the first employee.
  * @param otherEmpId - The employee ID of the second employee.
  * @param projectId - The project ID of the overlap.
  * @returns An object with the following properties:
  * - days: The number of days of overlap between the two projects.
  * - empId: The employee ID of the first employee.
  * - otherEmpId: The employee ID of the second employee.
  * - projectId: The project ID of the overlap.
  * @example
  * const overlap = new Overlap(31, 1, 2, 3);
  * console.log(overlap.days); // 31
  */ 
class Overlap {
  constructor(days, empId, otherEmpId, projectId) {
    this.days = days;
    this.empId = empId;
    this.otherEmpId = otherEmpId;
    this.projectId = projectId;
  }
}

/**
 * The getOverlap function returns the longest overlap between two employees.
 * @param projects1 - An object containing the projects of the first employee.
 * @param projects2 - An object containing the projects of the second employee.
 * @returns An object with the following properties:
 * - days: The number of days of overlap between the two projects.
 * - empId: The employee ID of the first employee.
 * - otherEmpId: The employee ID of the second employee.
 * - projectId: The project ID of the overlap.
 * @example
 * const projects1 = {
 * 1: new Project(new Date(2020, 0, 1), new Date(2020, 0, 31)),
 * 2: new Project(new Date(2020, 1, 1), new Date(2020, 1, 28)),
 * 3: new Project(new Date(2020, 2, 1), new Date(2020, 2, 31))
 * };
 * const projects2 = {
 * 1: new Project(new Date(2020, 0, 15), new Date(2020, 0, 31)),
 * 2: new Project(new Date(2020, 1, 1), new Date(2020, 1, 15)),
 * 4: new Project(new Date(2020, 2, 1), new Date(2020, 2, 31))
 * };
 * const overlap = getOverlap(projects1, projects2);
 * console.log(overlap.days); // 17
 * console.log(overlap.empId); // 0
 * console.log(overlap.otherEmpId); // 0
 * console.log(overlap.projectId); // 1
 */
function getOverlap(projects1, projects2) {
  let longestOverlap = new Overlap(0, 0, 0, 0);

  for (const projectId in projects1) {
    if (projectId in projects2) {
      const start =
        projects1[projectId].start > projects2[projectId].start
          ? projects1[projectId].start
          : projects2[projectId].start;
      const end =
        projects1[projectId].end < projects2[projectId].end
          ? projects1[projectId].end
          : projects2[projectId].end;
      const days = (end - start) / (1000 * 60 * 60 * 24) + 1;

      if (days > longestOverlap.days) {
        longestOverlap = new Overlap(days, 0, 0, projectId);
      }
    }
  }

  return longestOverlap;
}

/**
 * The updateDataGrid function updates the data grid with the longest overlap between two employees.
 * @param empId1 - The employee ID of the first employee.
 * @param empId2 - The employee ID of the second employee.
 * @param projectId - The project ID of the overlap.
 * @param days - The number of days of overlap between the two projects.
 * @example
 * updateDataGrid(1, 2, 3, 31);
 * const dataGrid = document.getElementById("dataGrid");
 * console.log(dataGrid.rows[0].cells[0].textContent); // 1
 * console.log(dataGrid.rows[0].cells[1].textContent); // 2
 * console.log(dataGrid.rows[0].cells[2].textContent); // 3
 * console.log(dataGrid.rows[0].cells[3].textContent); // 31
 */
function updateDataGrid(empId1, empId2, projectId, days) {
  const dataGrid = document.getElementById("dataGrid");

  // Check if a row with the same employee IDs and project ID already exists
  let rowExists = false;
  for (let i = 0; i < dataGrid.rows.length; i++) {
    const row = dataGrid.rows[i];
    if (
      row.cells[0].textContent === empId1 &&
      row.cells[1].textContent === empId2 &&
      row.cells[2].textContent === projectId
    ) {
      rowExists = true;
      break;
    }
  }

  // If the row does not already exist, add it
  if (!rowExists) {
    const row = document.createElement("tr");
    const cell1 = document.createElement("td");
    cell1.textContent = empId1;
    const cell2 = document.createElement("td");
    cell2.textContent = empId2;
    const cell3 = document.createElement("td");
    cell3.textContent = projectId;
    const cell4 = document.createElement("td");
    cell4.textContent = days;
    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);
    row.appendChild(cell4);
    dataGrid.appendChild(row);
  }
}

// results is an object containing the longest overlap between two employees
const results = {};


// Get the file input element
const fileInput = document.getElementById("fileInput");

// Add an event listener for the change event
fileInput.addEventListener("change", function () {
  // Get the file name from the file input element
  const fileName = fileInput.value;

  // Update the text of the custom file input element
  const customFileInput = document.querySelector(".custom-file-input");
  customFileInput.textContent = fileName;
});

// submitButton is the button that submits the CSV file
const submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", function () {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  // If a file was selected, read the file
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function () {
    const csvData = reader.result;

    const rows = csvData.split("\n").slice(1);

    /**
     * For each row in the CSV file, create a Project object and add it to the results object.
     * If the employee ID and project ID already exist in the results object, update the start
     * and end dates of the Project object.
     */
    rows.forEach((row) => {
      const [empId, projectId, startDate, endDate] = row.split(",");
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : new Date();

      if (!results[empId]) {
        results[empId] = {};
      }

      if (!results[empId][projectId]) {
        results[empId][projectId] = new Project(start, end);
      } else {
        results[empId][projectId].start =
          start < results[empId][projectId].start
            ? start
            : results[empId][projectId].start;
        results[empId][projectId].end =
          end > results[empId][projectId].end
            ? end
            : results[empId][projectId].end;
      }
    });

    let longestOverlap = new Overlap(0, 0, 0);

    /**
     * For each employee ID in the results object, compare the employee's projects with the
     * projects of every other employee. If the overlap is longer than the current longest
     * overlap, update the longest overlap.
     * After comparing the employee's projects with every other employee's projects, mark the
     * employee as visited and update the data grid with the longest overlap.
     */
    for (const empId in results) {
      for (const otherEmpId in results) {
        if (empId !== otherEmpId && !results[otherEmpId].visited) {
          const overlap = getOverlap(results[empId], results[otherEmpId]);

          if (overlap.days > longestOverlap.days) {
            longestOverlap = overlap;
            longestOverlap.empId = empId;
            longestOverlap.otherEmpId = otherEmpId;
          }
        }
      }

      // Mark the employee as visited
      results[empId].visited = true;

      // Update the data grid with the longest overlap
      updateDataGrid(
        longestOverlap.otherEmpId,
        longestOverlap.empId,
        longestOverlap.projectId,
        Math.round(longestOverlap.days)
      );
    }
  };
});