const Report = require("../models/reportModel");

exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find();
        res.json(reports);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.createReport = async (req, res) => {
    try {
        const report = new Report(req.body);
        await report.save();
        res.status(201).json(report);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Error creating report" });
    }
};

exports.resolveReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ message: "Report not found" });
        report.resolvedAt = new Date().toLocaleString();
        await report.save();
        res.json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.deleteReport = async (req, res) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        if (!report) return res.status(404).json({ message: "Report not found" });
        res.json({ message: "Report deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};
