class Project {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}

class Overlap {
  constructor(days, empId, otherEmpId, projectId) {
    this.days = days;
    this.empId = empId;
    this.otherEmpId = otherEmpId;
    this.projectId = projectId;
  }
}

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

const results = {};

const submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", function () {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function () {
    const csvData = reader.result;

    const rows = csvData.split("\n").slice(1);

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

      results[empId].visited = true;

      // console.log(
      //   longestOverlap.otherEmpId,
      //   longestOverlap.empId,
      //   longestOverlap.projectId,
      //   Math.round(longestOverlap.days)
      // );

      updateDataGrid(
        longestOverlap.otherEmpId,
        longestOverlap.empId,
        longestOverlap.projectId,
        Math.round(longestOverlap.days)
      );
    }
  };
});