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
    const filters = req.query;
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

app.put("/users/:id", (req, res) => {
  try {
    const userList = readUsersFile();
    const id = req.params.id;
    const userIndex = userList.findIndex((user) => user.id == id);

    if (userIndex === -1) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const updatedUser = req.body;
    userList[userIndex] = { ...userList[userIndex], ...updatedUser };

    fs.writeFileSync("users.json", JSON.stringify(userList, null, 2), "utf-8");
    res.json({ message: "success", user: userList[userIndex] });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/users/:id", (req, res) => {
  try {
    const userList = readUsersFile();
    const id = req.params.id;

    const updatedUsers = userList.filter((user) => user.id != id);

    if (updatedUsers.length === userList.length) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const deletedUser = userList.find((user) => user.id == id);

    fs.writeFileSync(
      "users.json",
      JSON.stringify(updatedUsers, null, 2),
      "utf-8"
    );
    res.json({ message: "success", user: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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

app.get("/users/first", (_req, res) => {
  try {
    const userList = readUsersFile();
    console.log(userList);
    console.log(userList[0]);
    res.json(userList[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/users/last", (_req, res) => {
  try {
    const userList = readUsersFile();
    res.json(userList[userList.length - 1]);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
