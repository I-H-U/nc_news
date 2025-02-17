const app = require("./app.js");
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
