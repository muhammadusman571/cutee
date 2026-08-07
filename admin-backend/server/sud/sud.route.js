const express = require("express");
const router = express.Router();

const {
  getSSToken,
  getUserInfo,
  updateSSToken,
  getAccount,
  getCode,
  updateUserScore,
} = require("./sud.controller");
const { verifySudSignature } = require("../../middleware/sudAuth");

// ================= ROUTES =================

// 1. GET SS TOKEN

router.post(
  "/get_sstoken",

  getSSToken,
);

router.post(
  "/update_sstoken",

  updateSSToken,
);
router.post(
  "/get_user_info",

  getUserInfo,
);

router.get(
  "/get_code",

  getCode,
);
router.post(
  "/update_score",

  updateUserScore,
);
// router.post("/get_sstoken", async (req, res) => {
//   try {
//     const result = await getSsTokenService(req.body.code);
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.json({
//       ret_code: 1,
//       ret_msg: error.message,
//       sdk_error_code: 9999,
//       data: {},
//     });
//   }
// });

// // 2. UPDATE SS TOKEN
// router.post("/update_sstoken", verifySudSignature, async (req, res) => {
//   try {
//     const result = await updateSsTokenService(req.body.ss_token);
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.json({
//       ret_code: 1,
//       ret_msg: error.message,
//       sdk_error_code: 9999,
//       data: {},
//     });
//   }
// });

// // 3. GET USER INFO
// router.post("/get_user_info", verifySudSignature, async (req, res) => {
//   try {
//     const result = await getUserInfoService(req.body.ss_token);
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.json({
//       ret_code: 1,
//       ret_msg: error.message,
//       sdk_error_code: 9999,
//       data: {},
//     });
//   }
// });

// // 4. REPORT GAME DATA (game_start / game_settle)
// router.post("/report_game", verifySudSignature, async (req, res) => {
//   try {
//     const result = await reportGameService(req.body);
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.json({
//       ret_code: 1,
//       ret_msg: error.message,
//       sdk_error_code: 9999,
//       data: {},
//     });
//   }
// });

// // 5. GET ACCOUNT INFO
// router.post("/get_account_info", verifySudSignature, async (req, res) => {
//   try {
//     const result = await getAccountInfoService(req.body.uid);
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.json({
//       ret_code: 1,
//       ret_msg: error.message,
//       sdk_error_code: 9999,
//       data: {},
//     });
//   }
// });

// // 6. GET USER SCORE (deprecated)
// router.post("/get_user_score", verifySudSignature, async (req, res) => {
//   try {
//     const result = await getUserScoreService(req.body.uid);
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.json({
//       ret_code: 1,
//       ret_msg: error.message,
//       sdk_error_code: 9999,
//       data: {},
//     });
//   }
// });

// // 7. UPDATE USER SCORE
// router.post("/update_user_score", verifySudSignature, async (req, res) => {
//   try {
//     const result = await updateUserScoreService(req.body);
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.json({
//       ret_code: 1,
//       ret_msg: error.message,
//       sdk_error_code: 9999,
//       data: {},
//     });
//   }
// });

router.post("/get_account", getAccount);

module.exports = router;
