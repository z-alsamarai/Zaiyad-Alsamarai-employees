/**
 * The Employee class is a blueprint for creating objects that store employee information.
 * @param employeeId - The employee's ID
 * @param projectId - The project's ID
 * @param dateFrom - The date the employee started working on the project
 * @param dateTo - The date the employee stopped working on the project
 * @example
 * const employee = new Employee(1, 1, '2019-01-01', '2019-01-31');
 */
class Employee {
  constructor(employeeId, projectId, dateFrom, dateTo) {
    this.employeeId = employeeId;
    this.projectId = projectId;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
  }
}

/**
 * Calculate the number of days that two employees have overlapped on a project.
 * @param employee1 - an object with the following properties: (employeeId, projectId, dateFrom, dateTo)
 * @param employee2 - an object with the following properties: (employeeId, projectId, dateFrom, dateTo)
 * @returns The number of days that the two employees have overlapped on a project.
 * @example
 * getOverlappingTime(
 *  {employeeId: 1, projectId: 1, dateFrom: '2019-01-01', dateTo: '2019-01-31'},
 */
function getOverlappingTime(employee1, employee2) {
  const dateFrom1 = new Date(employee1.dateFrom);
  const dateTo1 = employee1.dateTo ? new Date(employee1.dateTo) : new Date();
  const dateFrom2 = new Date(employee2.dateFrom);
  const dateTo2 = employee2.dateTo ? new Date(employee2.dateTo) : new Date();
  
  let overlappingTime = 0;
  if (dateFrom1 < dateTo2 && dateFrom2 < dateTo1) {
    overlappingTime =
      Math.min(dateTo1, dateTo2) - Math.max(dateFrom1, dateFrom2);
  }
  return overlappingTime / (24 * 60 * 60 * 1000);
}

/**
 * Get all the pairs of employees who have worked together.
 * @param employees - an array of objects, each object has the following properties:
 * @returns An array of arrays, each containing two objects. Each object has the following properties:
 * (employeeId, projectId, dateFrom, dateTo)
 */
function getPairs(employees) {
  const pairs = [];
  for (let i = 0; i < employees.length; i++) {
    for (let j = i + 1; j < employees.length; j++) {
      if (
        employees[i].employeeId !== employees[j].employeeId &&
        employees[i].projectId === employees[j].projectId
      ) {
        pairs.push([employees[i], employees[j]]);
      }
    }
  }
  return pairs;
}

/**
 * Get the results for the pairs of employees who have worked together.
 * @param pairs - an array of arrays, each containing two objects. Each object has the following properties:
 * (employeeId, projectId, dateFrom, dateTo)
 * @returns An array of objects, each object has the following properties:
 * (employee1, employee2, project, overlappingTime)
 */
function getResults(pairs) {
  const results = [];
  for (const pair of pairs) {
    const overlappingTime = getOverlappingTime(pair[0], pair[1]);
    if (overlappingTime > 0) {
      results.push({
        employee1: pair[0].employeeId,
        employee2: pair[1].employeeId,
        project: pair[0].projectId,
        overlappingTime: overlappingTime,
      });
    }
  }
  return results;
}

/**
 * Filter the results to only include unique pairs with the highest overlapping time.
 * @param results - an array of objects, each object has the following properties:
 * (employee1, employee2, project, overlappingTime)
 * @returns An array of objects, each object has the following properties:
 * (employee1, employee2, project, overlappingTime)
 */             
function filterResults(results) {
  const filteredResults = [];
  for (const result of results) {
    const existingResult = filteredResults.find(
      (r) =>
        r.employee1 === result.employee1 &&
        r.employee2 === result.employee2 &&
        r.project === result.project
    );
    if (
      !existingResult ||
      existingResult.overlappingTime < result.overlappingTime
    ) {
      filteredResults.push(result);
    }
  }
  return filteredResults;
}

/**
 * The function takes a CSV file as input, parses the data into an array of Employee objects, gets the
 * pairs of employees who have worked together, gets the results for the pairs, filters the results to
 * only include unique pairs with the highest overlapping time, sorts the filtered results by
 * overlapping time in descending order, and prints the filtered results.
 * @param file - The file to process
 */
function processFile(file) {
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function() {
    // Parse the CSV data into an array of Employee objects
    const rows = reader.result.split('\n').slice(1);
    const employees = [];
    for (const row of rows) {
      const fields = row.split(',');
      if (fields.length !== 4) {
        console.error(`Invalid row: ${row}`);
        continue;
      }
      const employee = new Employee(fields[0], fields[1], fields[2], fields[3]);
      employees.push(employee);
    }

    // Get the pairs of employees who have worked together
    const pairs = getPairs(employees);

    // Get the results for the pairs
    const results = getResults(pairs);

    // Filter the results to only include unique pairs with the highest overlapping time
    const filteredResults = filterResults(results);

    // Sort the filtered results by overlapping time in descending order
    filteredResults.sort((a, b) => b.overlappingTime - a.overlappingTime);

    // Print the filtered results
    for (const result of filteredResults) {
      // console.log(`${result.employee1},${result.employee2},${result.project},${result.overlappingTime}`);
      // Update the data grid with the longest overlap
      updateDataGrid(
        result.employee1,
        result.employee2,
        result.project,
        Math.round(result.overlappingTime)
      );
    }
  };
  reader.onerror = function() {
    console.error(reader.error);
  };
}


/**
 * It creates a new row, adds four cells to it, and then adds the row to the table.
 * @param empId1 - The employee ID of the first employee.
 * @param empId2 - The employee ID of the employee who is being assigned to the project.
 * @param projectId - The project ID.
 * @param days - number of days worked on the project
 * @example
 * addRowToDataGrid(1, 2, 3, 31);
 */
function addRowToDataGrid(empId1, empId2, projectId, days) {
  const dataGrid = document.getElementById("dataGrid");

  const row = document.createElement("tr");
  const cell1 = document.createElement("td");
  const cell2 = document.createElement("td");
  const cell3 = document.createElement("td");
  const cell4 = document.createElement("td");

  cell1.innerHTML = empId1;
  cell2.innerHTML = empId2;
  cell3.innerHTML = projectId;
  cell4.innerHTML = days;

  row.appendChild(cell1);
  row.appendChild(cell2);
  row.appendChild(cell3);
  row.appendChild(cell4);

  dataGrid.appendChild(row);
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
  const rows = new Map();

  // Add each row to the Map
  for (let i = 0; i < dataGrid.rows.length; i++) {
    const row = dataGrid.rows[i];
    const key = `${row.cells[0].innerHTML}-${row.cells[1].innerHTML}-${row.cells[2].innerHTML}`;
    rows.set(key, row);
  }

  // Check if a row with the same employee IDs and project ID already exists
  const key = `${empId1}-${empId2}-${projectId}`;
  if (!rows.has(key)) {
    addRowToDataGrid(empId1, empId2, projectId, days);
  }
}

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
  processFile(file);
});