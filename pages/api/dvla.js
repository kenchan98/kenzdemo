import axios from "axios";

export default async function request_dvla(req, res) {
  if (req.method === "POST") {
    var plateNum = req.body.plateNum;
    console.log(
      "__ NEXT_PUBLIC_DVLA_KEY ---> ",
      process.env.NEXT_PUBLIC_DVLA_KEY
    );
    var config = {
      method: "post",
      url: "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_DVLA_KEY,
        //"x-api-key": "HowYkRxFOQ196qWBr5H3AaqCzbcFWOgw82aB1N3M", //test server
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ registrationNumber: plateNum }),
    };
    //
    //
    axios(config)
      .then(function (response) {
        const data = JSON.stringify(response.data);
        res.status(201).json({ data: data });
      })
      .catch(function (error) {
        console.log(error);
        res.status(500).json({ message: "something wrong!" });
      });

    return res;
  }
}
