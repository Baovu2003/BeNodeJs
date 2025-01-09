const app = require("./src/app");

const PORT = process.env.PORT || 3056;
const server = app.listen(PORT, () => {
  console.log(`WSV start with ${PORT}`);
});

// process.on("SIGINT", () => {
//   server.close(() => console.log("Exit"));
// });
process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});