const User = require("../user/user.model");
const SalarySetting = require("../salarySettings/salarySetting.modle");
const SalarySheet = require("./salarySheet.model");
const Agency = require("../agency/agency.model");

const ejs = require("ejs");
const puppeteer = require("puppeteer");

exports.getSalarySheets = async (req, res) => {
  try {
    const agencyCode = req.params.agencyCode;

    // Get the agency
    const agency = await Agency.findOne({ agencyCode }).select("_id");
    if (!agency) {
      return res.status(404).json({ status: false, error: "Agency not found" });
    }

    // Calculate last month date range
    // const now = new Date();
    const now = new Date();
    const firstDayLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );
    const lastDayLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
    );

    // Retrieve salary sheets for last month
    const sheets = await SalarySheet.aggregate([
      {
        $match: {
          createdAt: { $gte: firstDayLastMonth, $lte: lastDayLastMonth },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: { "user.hostAgency": agency._id, "user.isHost": true } },
      {
        $project: {
          _id: 1,
          target: 1,
          basic_salary: 1,
          diamond_share: 1,
          total_salary: 1,
          agency_share: 1,
          rcoin: 1,
          day_time: 1,
          createdAt: 1,
          user: {
            name: "$user.name",
            userId: "$user.uniqueId",
          },
        },
      },
      { $sort: { createdAt: 1 } }, // sort ascending by creation date
    ]);
    console.log("sheetsv", sheets[0]);
    const month = firstDayLastMonth.toLocaleString("default", {
      month: "long",
    });
    const year = firstDayLastMonth.getFullYear();
    // Render EJS template to HTML
    const html = await ejs.renderFile(
      `${__dirname}/../../views/salarySheet.ejs`,
      { sheets, month, year }, // you can calculate month/year dynamically
    );

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });
    await page.emulateMediaType("screen");
    await page.setViewport({ width: 1240, height: 1754 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
    });

    await browser.close();

    // Send PDF buffer to client
    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=salary-${agencyCode}.pdf`,
      "Content-Length": pdfBuffer.length,
    });
    res.end(pdfBuffer);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.deleteSalarySheet = async (req, res) => {
  try {
    const { id } = req.params;

    const sheet = await SalarySheet.findById(id);
    if (!sheet) {
      return res.status(404).json({ status: false, error: "Record not found" });
    }

    await SalarySheet.findByIdAndDelete(id);

    return res.status(200).json({
      status: true,
      message: "Salary Sheet deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
