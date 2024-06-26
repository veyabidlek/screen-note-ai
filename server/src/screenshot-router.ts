import { Router } from "express";
import fs from "fs";
import path from "path";

const screenshotRouter = Router();

screenshotRouter.post("/", (req, res) => {
  const { screenshot } = req.body;
  const base64Data = screenshot.replace(/^data:image\/png;base64,/, "");

  const screenshotPath = path.join(__dirname, "screenshots");
  if (!fs.existsSync(screenshotPath)) {
    fs.mkdirSync(screenshotPath, { recursive: true });
  }

  const filePath = path.join(screenshotPath, `screenshot-${Date.now()}.png`);
  fs.writeFile(filePath, base64Data, "base64", (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to save screenshot" });
    }
    res.status(200).json({ message: "Screenshot saved successfully" });
  });
});

export default screenshotRouter;
