# Zaiyad-Alsamarai-employees
A JavaScript Web App that identifies the pair of employees who have worked together on common projects for the longest period of time that is calculates longest overlap on common projects worked between employees for the longest time.

The input data is given as a CSV file with data in the following format: 
```
EmpID, ProjectID, DateFrom, DateTo
143, 12, 2013-11-01, 2014-01-05
218, 10, 2012-05-16, NULL
143, 10, 2009-01-01, 2012-05-27
```

The expected output would be:
Employee#1, Employee#2, DaysWorkedTogether 

Specific requirements
1) DateTo can be NULL, equivalent to today
2) The input data must be loaded to the program from a CSV file
3) Outputs the results to a web console