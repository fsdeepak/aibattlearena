import app from "./src/app.js";
import config from "./src/config/config.js";

const PORT = Number(config.PORT) || 3000;

// 2. Explicitly listen on '0.0.0.0'
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
