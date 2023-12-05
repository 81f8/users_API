const express = require("express");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(express.json());

const readUsersFile = () => {
  try {
    const data = fs.readFileSync("users.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading users.json:", error);
    throw error;
  }
};

const filterUsers = (list, filters) => {
  return list.filter((user) => {
    return Object.entries(filters).every(([key, value]) => {
      if (["city", "street", "suite", "zipcode"].includes(key)) {
        return user.address.city == value;
      }
      if (key === "company") {
        return user.company.name == value;
      }
      return user[key] == value;
    });
  });
};
app.get("/users", (req, res) => {
  try {
    const userList = readUsersFile();
    const filters = req.query; // Get filters from query parameters
    const filteredUsers = filterUsers(userList, filters);
    res.json(filteredUsers);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/users", (req, res) => {
  try {
    const userList = readUsersFile();
    const newUser = req.body;
    newUser.id = userList.length + 1;

    userList.push(newUser);

    fs.writeFileSync("users.json", JSON.stringify(userList, null, 2), "utf-8");
    res.status(201).json({ message: "success", user: newUser });
  } catch (error) {
    console.error("Error adding new user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/users/:id", (req, res) => {
  const userList = readUsersFile();
  const id = req.params.id;
  const filteredUser = userList.find((user) => user.id == id);
  console.log(filteredUser);
  res.send(filteredUser);
});

app.get("/users/:id/geo", (req, res) => {
  const userList = readUsersFile();
  const id = req.params.id;
  const filteredUser = userList.find((user) => user.id == id);
  const geo = {
    lat: filteredUser.address.geo.lat,
    lng: filteredUser.address.geo.lng,
  };
  mapsLink = `https://www.google.com/maps/search/?api=1&query=${geo.lat},${geo.lng}`;
  res.send({ message: "success", geo, mapsLink });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
