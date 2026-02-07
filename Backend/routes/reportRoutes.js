const express = require("express");
const router = express.Router();
const Report = require("../models/reportModel");

/* GET all reports */
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* CREATE report */
router.post("/", async (req, res) => {
  try {
    const saved = await Report.create(req.body);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* RESOLVE report ✅ (NO validation issue) */
router.patch("/:id/resolve", async (req, res) => {
  try {
    const updated = await Report.findByIdAndUpdate(
      req.params.id,
      { resolvedAt: new Date().toLocaleString() },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Report not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* DELETE report ✅ (FORCE delete) */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Report.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Report not found" });
    res.json({ message: "Report deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;