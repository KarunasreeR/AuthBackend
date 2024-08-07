const Lead = require("../models/lead"); // Import the Lead model

// Create a new lead
exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.findOne({ email_id: req.body.email_id });
    if (lead) {
      res
        .status(500)
        .json({ message: "Lead already exist with this mailId", status: 0 });
    } else {
      const { name, email_id, phone_number } = req.body;
      const newLead = new Lead({ name, email_id, phone_number });
      await newLead.save();
      res
        .status(201)
        .json({ message: "Lead created successfully", lead: newLead });
    }
  } catch (error) {
    res.status(500).json({ message: "Error creating lead", error });
  }
};

// Get a list of all leads
exports.leadsList = async (req, res) => {
  try {
    const leads = await Lead.find();
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving leads", error });
  }
};

// Get a lead by email
exports.getLead = async (req, res) => {
  try {
    const { email } = req.params;
    const lead = await Lead.findOne({ email_id: email });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving lead", error });
  }
};

// Update a lead by email
exports.editLead = async (req, res) => {
  try {
    const { email } = req.params;
    const updates = req.body;
    const lead = await Lead.findOneAndUpdate({ email_id: email }, updates, {
      new: true,
    });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json({ message: "Lead updated successfully", lead });
  } catch (error) {
    res.status(500).json({ message: "Error updating lead", error });
  }
};

// Delete a lead by email
exports.deleteLead = async (req, res) => {
  try {
    const { email } = req.params;
    const result = await Lead.findOneAndDelete({ email_id: email });
    if (!result) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting lead", error });
  }
};
