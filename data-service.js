const Sequelize = require("sequelize");
var sequelize = new Sequelize(
  "zkxfuyih",
  "zkxfuyih",
  "N0pYuD9Ypku_jtXlEzP8GDwHCR9cIp-5",
  {
    host: "peanut.db.elephantsql.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Connection success."))
  .catch((err) => console.log("Unable to connect to DB.", err));

// declare models
const Employee = sequelize.define("Employee", {
  employeeNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  SSN: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressState: Sequelize.STRING,
  addressPostal: Sequelize.STRING,
  maritalStatus: Sequelize.STRING,
  isManager: Sequelize.BOOLEAN,
  employeeManagerNum: Sequelize.INTEGER,
  status: Sequelize.STRING,
  department: Sequelize.INTEGER,
  hireDate: Sequelize.STRING,
});

const Department = sequelize.define("Department", {
  departmentId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  departmentName: Sequelize.STRING,
});

module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    sequelize
      .sync()
      .then(function () {
        resolve("success!");
      })
      .catch(function (error) {
        reject("Unable to sync the database");
      });
  });
};

module.exports.getDepartments = function () {
  return new Promise(function (resolve, reject) {
    Department.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no result returned");
      });
  });
};

module.exports.getAllEmployees = function () {
  return new Promise((resolve, reject) => {
    Employee.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no result returned");
      });
  });
};
module.exports.getEmployeesByStatus = function (status) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        status,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no result returned");
      });
  });
};
module.exports.getEmployeesByDepartment = function (department) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        department,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no result returned");
      });
  });
};
module.exports.getEmployeeByManager = function (num) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        employeeManagerNum: num,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no result returned");
      });
  });
};
//fetch Managers data from managers json file
module.exports.getManagers = function () {
  return new Promise(function (resolve, reject) {
    Employee.findAll({
      where: {
        isManager: true,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no result returned");
      });
  });
};

//add employee data to employee json file
module.exports.addEmployee = function (employeeData) {
  return new Promise(function (resolve, reject) {
    employeeData.isManager = employeeData.isManager ? true : false;
    for (let i in employeeData) {
      if (employeeData[i] == "") {
        employeeData[i] = null;
      }
    }
    Employee.create(employeeData)
      .then(() => {
        resolve("Success");
      })
      .catch((err) => {
        reject("unable to create employee");
      });
  });
};
module.exports.getEmployeeByNum = function (num) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        employeeNum: num,
      },
    })
      .then((data) => {
        resolve(data[0]);
      })
      .catch((err) => {
        reject("no result returned");
      });
  });
};

module.exports.updateEmployee = function (employeeData) {
  return new Promise((resolve, reject) => {
    employeeData.isManager = employeeData.isManager ? true : false;
    for (let i in employeeData) {
      if (employeeData[i] == "") {
        employeeData[i] = null;
      }
    }
    Employee.update(employeeData, {
      where: {
        employeeNum: employeeData.employeeNum,
      },
    })
      .then(() => {
        resolve("Success");
      })
      .catch((err) => {
        reject("unable to update employee");
      });
  });
};

module.exports.addDepartment = function (departmentData) {
  return new Promise(function (resolve, reject) {
    for (let i in departmentData) {
      if (departmentData[i] == "") {
        departmentData[i] = null;
      }
    }
    Department.create(departmentData)
      .then(() => {
        resolve("Success");
      })
      .catch((err) => {
        reject("unable to create department");
      });
  });
};

module.exports.updateDepartment = function (departmentData) {
  return new Promise((resolve, reject) => {
    for (let i in departmentData) {
      if (departmentData[i] == "") {
        departmentData[i] = null;
      }
    }
    Department.update(departmentData, {
      where: {
        departmentId: departmentData.departmentId,
      },
    })
      .then(() => {
        resolve("Success");
      })
      .catch((err) => {
        reject("unable to update department");
      });
  });
};

module.exports.getDepartmentById = function (id) {
  return new Promise((resolve, reject) => {
    Department.findAll({
      where: {
        departmentId: id,
      },
    })
      .then((data) => {
        resolve(data[0]);
      })
      .catch((err) => {
        reject("no result returned");
      });
  });
};

module.exports.deleteEmployeeByNum = function (empNum) {
  return new Promise((resolve, reject) => {
    Employee.destroy({
      where: {
        employeeNum: empNum,
      },
    })
      .then(() => {
        resolve("Success");
      })
      .catch((err) => {
        reject("unable to delete employee");
      });
  });
};

module.exports.deleteDepartmentById = function (id) {
  return new Promise((resolve, reject) => {
    Department.destroy({
      where: {
        departmentId: id,
      },
    })
      .then(() => {
        resolve("Success");
      })
      .catch((err) => {
        reject("unable to delete department");
      });
  });
};
