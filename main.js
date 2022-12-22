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
        results[empId][projectId] = { start, end };
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

    let longestOverlap = { days: 0 };

    for (const empId in results) {
      for (const otherEmpId in results) {
        if (empId !== otherEmpId) {
          const overlap = getOverlap(results[empId], results[otherEmpId]);

          if (overlap.days > longestOverlap.days) {
            longestOverlap = { empId, otherEmpId, ...overlap };
          }
        }
      }
    }

    console.log(
      longestOverlap.otherEmpId,
      longestOverlap.empId,
      longestOverlap.days
    );
    
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `Employee #${longestOverlap.otherEmpId} and Employee #${longestOverlap.empId} worked together for ${longestOverlap.days} days.`;
  });

function getOverlap(projects1, projects2) {
  let longestOverlap = { days: 0 };

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
        longestOverlap = { days };
      }
    }
  }

  return longestOverlap;
}
