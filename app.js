const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const fileDbPath = path.join(__dirname, "database", "items.json");

const server = http.createServer(requestHandler);

function requestHandler(req, res) {
  if (req.url === "/item" && req.method === "GET") {
    getAllItem(req, res);
  } else if (req.url === "/item" && req.method === "POST") {
    addNewItem(req, res);
  } else if (req.url === "/item" && req.method === "GET") {
    getOneItem(req, res);
  } else if (req.url === "/item" && req.method === "PUT") {
    updateItem(req, res);
  } else if (req.url === "/item" && req.method === "DELETE") {
    deleteItem(req, res);
  }
}

function getAllItem(req, res) {
  fs.readFile(fileDbPath, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.writeHead(400);
      res.end("An error occured");
    }
    res.end(data);
  });
}

function addNewItem(req, res) {
  const body = [];

  // data parsed with a request is attached to a data event
  req.on("data", (chunk) => {
    body.push(chunk);
  });

  // All data is successfully read from client
  req.on("end", () => {
    const parsedItem = Buffer.concat(body).toString();
    const newItem = JSON.parse(parsedItem);
    // console.log(parsedItem);

    fs.readFile(fileDbPath, "utf8", (err, data) => {
      if (err) {
        console.log(err);
        res.writeHead(400);
        res.end("An error occured");
      }
      const oldItem = JSON.parse(data);
      const allItem = [...oldItem, newItem];

      const lastItem = allItem[allItem.length - 1];
      const lastItemId = lastItem.id;
      newItem.id = lastItemId + 1;

      allItem.push(newItem);
      // console.log(allItem);
      fs.writeFile(fileDbPath, JSON.stringify(allItem), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(
            JSON.stringify({
              message: "Could not save Item to database",
            })
          );
        }
        res.end(JSON.stringify(newItem));
      });
    });
  });
}

function updateItem(req, res) {
  const body = [];

  // data parsed with a request is attached to a data event
  req.on("data", (chunk) => {
    body.push(chunk);
  });

  // All data is successfully read from client
  req.on("end", () => {
    const parsedItem = Buffer.concat(body).toString();
    const itemDetailsToUpdate = JSON.parse(parsedItem);
    // console.log(itemDetailsToUpdate);
    const itemId = itemDetailsToUpdate.id;

    fs.readFile(fileDbPath, "utf8", (err, items) => {
      if (err) {
        console.log(err);
        res.writeHead(400);
        res.end("An error occured");
      }
      const itemsObj = JSON.parse(items);
      const itemIndex = itemsObj.findIndex((item) => {
        return item.id === itemId;
      });
      console.log(itemIndex);

      if (itemIndex === -1) {
        res.writeHead(404);
        res.end("The item with specified is not found");
        return;
      }

      const updatedItem = { ...itemsObj[itemIndex], ...itemDetailsToUpdate };
      itemsObj[itemIndex] = updatedItem;
      console.log(updatedItem);
      // console.log(itemDetailsToUpdate)
      fs.writeFile(fileDbPath, JSON.stringify(itemsObj), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(
            JSON.stringify({
              message: "Could not save Item to database",
            })
          );
        }
        res.writeHead(200);
        res.end("Update Successful");
      });
    });
  });
}

function deleteItem(req, res) {
  const body = [];

  // data parsed with a request is attached to a data event
  req.on("data", (chunk) => {
    body.push(chunk);
  });

  // All data is successfully read from client
  req.on("end", () => {
    const parsedItem = Buffer.concat(body).toString();
    const itemDetailsToUpdate = JSON.parse(parsedItem);
    // console.log(itemDetailsToUpdate);
    const itemId = itemDetailsToUpdate.id;

    fs.readFile(fileDbPath, "utf8", (err, items) => {
      if (err) {
        console.log(err);
        res.writeHead(400);
        res.end("An error occured");
      }
      const itemsObj = JSON.parse(items);
      const itemIndex = itemsObj.findIndex((item) => {
        return item.id === itemId;
      });
      // console.log(itemIndex);

      itemsObj.splice(itemIndex, 1);
      console.log(itemsObj);

      if (itemIndex === -1) {
        res.writeHead(404);
        res.end("The item with specified is not found");
        return;
      }

      const updatedItem = { ...itemsObj[itemIndex], ...itemDetailsToUpdate };
      itemsObj[itemIndex] = updatedItem;
      console.log(updatedItem);
      // console.log(itemDetailsToUpdate)
      fs.writeFile(fileDbPath, JSON.stringify(itemsObj), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(
            JSON.stringify({
              message: "Could not save Item to database",
            })
          );
        }
        res.writeHead(200);
        res.end("Deletion Successful");
      });
    });
  });
}

server.listen(PORT, (req, res) => {
  console.log(`Server is listening at port: ${PORT}`);
});
