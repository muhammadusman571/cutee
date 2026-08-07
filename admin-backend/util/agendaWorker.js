const agenda = require("./agenda");

(async function () {
  await agenda.start();
  console.log("Agenda worker started ✅");
})();
