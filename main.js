class Project {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}

class Overlap {
  constructor(days, empId, otherEmpId) {
    this.days = days;
    this.empId = empId;
    this.otherEmpId = otherEmpId;
  }
}

function getOverlap(projects1, projects2) {
  let longestOverlap = new Overlap(0, 0, 0);

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
        longestOverlap = new Overlap(days, 0, 0);
      }
    }
  }

  return longestOverlap;
}

const results = {};

fetch("input.csv")
  .then((response) => response.text())
  .then((csvData) => {
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
        if (empId !== otherEmpId) {
          const overlap = getOverlap(results[empId], results[otherEmpId]);

          if (overlap.days > longestOverlap.days) {
            longestOverlap = overlap;
            longestOverlap.empId = empId;
            longestOverlap.otherEmpId = otherEmpId;
          }
        }
      }
    }

    console.log(
      longestOverlap.otherEmpId,
      longestOverlap.empId,
      Math.round(longestOverlap.days)
    );

    const resultElement = document.getElementById("result");
    resultElement.innerHTML = `Employee #${
      longestOverlap.otherEmpId
    } and Employee #${longestOverlap.empId} worked together for ${Math.round(
      longestOverlap.days
    )} days.`;
  });