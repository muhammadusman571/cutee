const SalarySetting = require("./salarySetting.modle");
// Create Salary Setting
exports.createSalarySetting = async (req, res) => {
  try {
    const {
      target,
      diamond_share,
      basic_salary,
      agency_share,
      days,
      hours,
      applyDays,
    } = req.body;

    // Create new setting
    const salarySetting = await SalarySetting.create({
      target,
      diamond_share,
      basic_salary,
      agency_share,
      days,
      // hours,
      applyDays,
    });

    return res.status(200).json({
      status: true,
      message: "Salary Setting saved successfully",
      salarySetting,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// Get Salary Setting
exports.getSalarySettings = async (req, res) => {
  try {
    const salarySetting = await SalarySetting.find().sort({
      target: 1,
      // createdAt: -1,
    });
    return res.status(200).json({
      status: true,
      message: "Salary Setting fetched successfully",
      salarySetting,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// Delete Salary Setting
exports.deleteSalarySetting = async (req, res) => {
  try {
    const { id } = req.params;

    const salarySetting = await SalarySetting.findById(id);
    if (!salarySetting) {
      return res
        .status(404)
        .json({ status: false, error: "Salary Setting not found" });
    }

    await SalarySetting.findByIdAndDelete(id); // Correct deletion
    return res.status(200).json({
      status: true,
      message: "Salary Setting deleted successfully",
      id,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// Update Salary Setting
exports.updateSalarySetting = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      target,
      diamond_share,
      basic_salary,
      total_salary,
      agency_share,
      days,
      hours,
      applyDays,
    } = req.body;
    const salarySetting = await SalarySetting.findById(id);
    if (!salarySetting) {
      return res
        .status(404)
        .json({ status: false, error: "Salary Setting not found" });
    }
    salarySetting.target = target || salarySetting.target;
    salarySetting.diamond_share = diamond_share || salarySetting.diamond_share;
    salarySetting.basic_salary = basic_salary || salarySetting.basic_salary;
    salarySetting.total_salary = total_salary || salarySetting.total_salary;
    salarySetting.agency_share = agency_share || salarySetting.agency_share;
    salarySetting.days = days || salarySetting.days;
    // salarySetting.hours = hours || salarySetting.hours;
    salarySetting.applyDays = applyDays ?? salarySetting.applyDays;

    console.log(applyDays);

    await salarySetting.save();
    return res.status(200).json({
      status: true,
      message: "Salary Setting updated successfully",
      salarySetting,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
