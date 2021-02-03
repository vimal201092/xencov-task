import fs from "fs";
import path from "path";
import * as csv from "fast-csv";

import salesSchema from "../schema/saleRecordSchema";

const salesController = {
  createRecord: async (req, res) => {
    try {
      let data = [];
      fs.createReadStream(
        path.resolve(__dirname, "../../5m-Sales-Records", "data.csv")
      )
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => {
          throw error.message;
        })
        .on("data", (row) => {
          data.push(row);
          console.log(data);
        })
        .on("end", () => {
          data.pop();
          salesSchema
            .bulkCreate(data)
            .then(() => {
              res.status(200).send({
                message: "Uploaded the file successfully: ",
              });
            })
            .catch((error) => {
              res.status(500).send({
                message: "Fail to import into database!",
                error: error.message,
              });
            });
        });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Could not upload the data: ",
      });
    }
  },
  getRecord: (req, res) => {
    salesSchema
      .findAll()
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving .",
        });
      });
  },
};

export default salesController;
