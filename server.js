/*********************************************************************************
 * WEB322 – Assignment 5
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name: Het patel  Student ID: 154671218 Date: 27th of november 2022
 *
 * Online (Heroku Cyclic) Link: ________________________________________________________
 *
 ********************************************************************************/

var data_service = require("./data-service.js");
const exphbs = require("express-handlebars");
var port = process.env.PORT || 8080;
var express = require("express");
var app = express();
const path = require("path");
const multer = require("multer");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      navLink: function (url, options) {
        return `<li class="nav-item">
      <a href="${url}" class="nav-link ${
          url === app.locals.activeRoute ? "text-primary" : "text-light"
        }">${options.fn(this)}</a>
      </li>`;
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
    },
  })
);
app.set("view engine", ".hbs");
app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
  next();
});

const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

//function for start app on 8080 port
function Start() {
  return new Promise(function (reslove, reject) {
    data_service
      .initialize()
      .then(function (data) {
        console.log(data);
      })
      .catch(function (reason) {
        console.log(reason);
      });
  });
}

app.use(express.static("public"));
//dfault path route Home page
app.get("/", function (rqust, res) {
  res.render("home");
});
// aboute bage file foute
app.get("/about", function (rqust, res) {
  res.render("about");
});
//department file route and url created departments
app.get("/departments", function (rqust, res) {
  data_service
    .getDepartments()
    .then(function (data) {
      if (data.length > 0) {
        res.render("departments", { departments: data });
      } else {
        res.render("departments", { message: "no results" });
      }
    })
    .catch(function (err) {
      res.render("departments", { message: err });
    });
});
app.get("/departments/add", function (rqust, res) {
  res.render("addDepartment");
});

app.post("/departments/add", function (rqust, res) {
  data_service
    .addDepartment(rqust.body)
    .then(function (data) {
      res.redirect("/departments");
    })
    .catch(function (err) {
      res.status(500).send("Unable to Add Department");
    });
});

app.post("/departments/update", function (rqust, res) {
  data_service
    .updateDepartment(rqust.body)
    .then(function (data) {
      res.redirect("/departments");
    })
    .catch(function (err) {
      res.status(500).send("Unable to Update Department");
    });
});

app.get("/department/:departmentId", function (rqust, res) {
  data_service
    .getDepartmentById(rqust.params.departmentId)
    .then(function (data) {
      if (data) {
        res.render("department", { department: data });
      } else {
        res.status(404).send("Department Not Found");
      }
    })
    .catch(function (err) {
      res.status(404).send("Department Not Found");
    });
});

app.get("/employees", async function (rqust, res) {
  try {
    let dataReq;
    if (rqust.query.status) {
      dataReq = await data_service.getEmployeesByStatus(rqust.query.status);
    } else if (rqust.query.department) {
      dataReq = await data_service.getEmployeesByDepartment(
        rqust.query.department
      );
    } else if (rqust.query.manager) {
      dataReq = await data_service.getEmployeeByManager(rqust.query.manager);
    } else {
      dataReq = await data_service.getAllEmployees();
    }
    if (dataReq.length > 0) {
      res.render("employees", { employees: dataReq });
    } else {
      res.render("employees", { message: "no results" });
    }
  } catch (error) {
    res.render("employees", { message: error });
  }
});
app.get("/employee/:empNum", (req, res) => {
  // initialize an empty object to store the values
  let viewData = {};
  data_service
    .getEmployeeByNum(req.params.empNum)
    .then((data) => {
      if (data) {
        viewData.employee = data; //store employee data in the "viewData" object as "employee"
      } else {
        viewData.employee = null; // set employee to null if none were returned
      }
    })
    .catch(() => {
      viewData.employee = null; // set employee to null if there was an error
    })
    .then(data_service.getDepartments)
    .then((data) => {
      viewData.departments = data; // store department data in the "viewData" object as
      ("departments");
      // loop through viewData.departments and once we have found the departmentId that matches
      // the employee's "department" value, add a "selected" property to the matching
      // viewData.departments object
      13;
      for (let i = 0; i < viewData.departments.length; i++) {
        if (
          viewData.departments[i].departmentId == viewData.employee.department
        ) {
          viewData.departments[i].selected = true;
        }
      }
    })
    .catch(() => {
      viewData.departments = []; // set departments to empty if there was an error
    })
    .then(() => {
      if (viewData.employee == null) {
        // if no employee - return an error
        res.status(404).send("Employee Not Found");
      } else {
        res.render("employee", { viewData: viewData }); // render the "employee" view
      }
    });
});

app.get("/employees/delete/:empNumber", (req, res) => {
  data_service
    .deleteEmployeeByNum(req.params.empNumber)
    .then(() => {
      res.redirect("/employees");
    })
    .catch(() => {
      res.status(500).send("Unable to Remove Employee / Employee not found");
    });
});

app.get("/managers", function (rqust, res) {
  data_service
    .getManagers()
    .then(function (data) {
      res.json(data);
    })
    .catch(function (err) {
      res.json({ message: err });
    });
});

app.get("/employees/add", function (rqust, res) {
  data_service
    .getDepartments()
    .then(function (data) {
      res.render("addEmployee", { departments: data });
    })
    .catch(function (err) {
      res.render("addEmployee", { departments: [] });
    });
});

app.post("/employees/add", function (rqust, res) {
  data_service
    .addEmployee(rqust.body)
    .then(function (data) {
      res.redirect("/employees");
    })
    .catch(function (err) {
      res.json({ message: err });
    });
});

app.post("/employee/update", function (rqust, res) {
  data_service
    .updateEmployee(rqust.body)
    .then(function (data) {
      res.redirect("/employees");
    })
    .catch(function (err) {
      res.json({ message: err });
    });
});

app.get("/images/add", function (rqust, res) {
  res.render("addImage");
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});

app.get("/images", function (rqust, res) {
  fs.readdir("./public/images/uploaded", function (err, items) {
    res.render("images", { images: items });
    console.log(items);
  });
});

app.use(function (rqust, res) {
  res.status(404).send("Page Error");
});

app.listen(port, Start);
