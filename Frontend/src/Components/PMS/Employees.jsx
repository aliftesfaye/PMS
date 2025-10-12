import React, { useEffect, useState } from "react";
import apiService from "../services/apiServices";

const Employees = (props) => {
  const [employeesData, setEmployeesData] = useState([]);
  const [divisionName, setDivisionName] = useState();
  console.log(props.row.division.division_id);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        if (apiService && apiService.fetchEmployees) {
          const data = await apiService.fetchEmployees(
            props.row.division.division_id
          );
          setEmployeesData(data[0].Users);
          setDivisionName(data[0].name);
        } else {
          setEmployeesData([]);
          setDivisionName("");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div>
      <div className="employee">
        <div className="employee-name">
          List of Employees in {divisionName} Department
        </div>
        <div className="overflow-y-auto h-72 no-scrollbar">
          <table>
            <thead>
              {employeesData && employeesData.length !== 0 ? (
                <tr>
                  <th>No</th>
                  <th>Employee</th>
                </tr>
              ) : (
                <tr></tr>
              )}
            </thead>
            <tbody>
              {employeesData && employeesData.length === 0 ? (
                <tr colSpan={2} className="flex justify-center bg-red-600">
                  <td>No Employee data</td>
                </tr>
              ) : (
                employeesData.map((employee, index) => (
                  <tr key={index}>
                    <td className="numb">{index + 1}</td>
                    <td>
                      <div>
                        {/* <img src={employee.img_url} alt="" /> */}
                        <span>{employee.full_name}</span>
                      </div>
                    </td>
                    {/* <td className="emp-role">{employee.role}</td> */}
                    <td></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employees;
