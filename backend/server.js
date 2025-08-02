const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Feedback schema
const feedbackSchema = new mongoose.Schema({
  companyName: String,
  plantLocation: String,
  date: String,
  contactPerson: String,
  contactPersonnumber: String,
  designation: String,
  email: String,

  installationQuality: Number,
  accurateParameters: String,
  parameterIssue: String,
  dataReliability: String,
  safeInstallation: String,
  installationIssue: String,
  technicalIssues: String,
  technicalIssueDetails: String,
  systemIntegration: String,

  dashboardEase: String,
  dashboardInsights: String,
  missingKPIs: String,
  chartUsefulness: String,
  alertSystem: String,
  alertIssue: String,
  dashboardSpeed: String,
  reportExport: String,
  dashboardSuggestions: String,

  downtimeReduction: String,
  equipmentImprovement: String,
  teamAction: String,
  maintenancePlanning: String,

  teamSupport: String,
  trainingSufficient: String,
  trainingNeeds: String,
  refreshersNeeded: String,

  currentChallenges: String,
  additionalFeedback: String
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

app.get('/get-feedback', async (req, res) => {
  try {
    const data = await Feedback.find();
    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Error retrieving feedback:", err);
    res.status(500).json({ message: "Server Error: Could not retrieve feedback." });
  }
});

app.post('/submit', async (req, res) => {
  try {
    // Save feedback to MongoDB
    const feedbackData = new Feedback(req.body);
    await feedbackData.save();

    // Extract all form fields from req.body
    const {
      companyName,
      plantLocation,
      date,
      contactPerson,
      contactPersonnumber,
      designation,
      email,

      installationQuality,
      accurateParameters,
      parameterIssue,
      dataReliability,
      safeInstallation,
      installationIssue,
      technicalIssues,
      technicalIssueDetails,
      systemIntegration,

      dashboardEase,
      dashboardInsights,
      missingKPIs,
      chartUsefulness,
      alertSystem,
      alertIssue,
      dashboardSpeed,
      reportExport,
      dashboardSuggestions,

      downtimeReduction,
      equipmentImprovement,
      teamAction,
      maintenancePlanning,

      teamSupport,
      trainingSufficient,
      trainingNeeds,
      refreshersNeeded,

      currentChallenges,
      additionalFeedback
    } = req.body;

    // Prepare the feedback summary for the email
    const responseSummary = `
Company Name: ${companyName}
Plant Location: ${plantLocation}
Date: ${date}
Contact Person: ${contactPerson}
Contact Person Number: ${contactPersonnumber}
Designation: ${designation}
Email: ${email}

Installation Quality: ${installationQuality}
Accurate Parameters: ${accurateParameters}
Parameter Issue: ${parameterIssue}
Data Reliability: ${dataReliability}
Safe Installation: ${safeInstallation}
Installation Issue: ${installationIssue}
Technical Issues: ${technicalIssues}
Technical Issue Details: ${technicalIssueDetails}
System Integration: ${systemIntegration}

Dashboard Ease: ${dashboardEase}
Dashboard Insights: ${dashboardInsights}
Missing KPIs: ${missingKPIs}
Chart Usefulness: ${chartUsefulness}
Alert System: ${alertSystem}
Alert Issue: ${alertIssue}
Dashboard Speed: ${dashboardSpeed}
Report Export: ${reportExport}
Dashboard Suggestions: ${dashboardSuggestions}

Downtime Reduction: ${downtimeReduction}
Equipment Improvement: ${equipmentImprovement}
Team Action: ${teamAction}
Maintenance Planning: ${maintenancePlanning}

Team Support: ${teamSupport}
Training Sufficient: ${trainingSufficient}
Training Needs: ${trainingNeeds}
Refreshers Needed: ${refreshersNeeded}

Current Challenges: ${currentChallenges}
Additional Feedback: ${additionalFeedback}
`;

    // Send confirmation email if email is provided
    if (email) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank you for your feedback!',
        text: `
            Hi ${req.body.contactPerson || 'Customer'},

            Thank you for your valuable feedback submitted to us. We appreciate your time and support.

            Here is a copy of your feedback response:

            Company Name: ${req.body.companyName}
            Plant Location: ${req.body.plantLocation}
            Date: ${req.body.date}
            Contact Person: ${req.body.contactPerson}
            Contact Number: ${req.body.contactPersonnumber}
            Designation: ${req.body.designation}
            Email: ${req.body.email}

            --- Technical Evaluation ---
            Installation Quality: ${req.body.installationQuality}
            Accurate Parameters: ${req.body.accurateParameters}
            Parameter Issue: ${req.body.parameterIssue}
            Data Reliability: ${req.body.dataReliability}
            Safe Installation: ${req.body.safeInstallation}
            Installation Issue: ${req.body.installationIssue}
            Repeated Technical Issues: ${req.body.technicalIssues}
            Technical Issue Details: ${req.body.technicalIssueDetails}
            System Integration: ${req.body.systemIntegration}

            --- Dashboard & Visualization ---
            Dashboard Ease: ${req.body.dashboardEase}
            Dashboard Insights: ${req.body.dashboardInsights}
            Missing KPIs: ${req.body.missingKPIs}
            Chart Usefulness: ${req.body.chartUsefulness}
            Alert System: ${req.body.alertSystem}
            Alert Issue: ${req.body.alertIssue}
            Dashboard Speed: ${req.body.dashboardSpeed}
            Report Export: ${req.body.reportExport}
            Dashboard Suggestions: ${req.body.dashboardSuggestions}

            --- Process & Impact ---
            Downtime Reduction: ${req.body.downtimeReduction}
            Equipment Improvement: ${req.body.equipmentImprovement}
            Team Action: ${req.body.teamAction}
            Maintenance Planning: ${req.body.maintenancePlanning}

            --- Support & Engagement ---
            Team Support: ${req.body.teamSupport}
            Training Sufficient: ${req.body.trainingSufficient}
            Training Needs: ${req.body.trainingNeeds}
            Refreshers Needed: ${req.body.refreshersNeeded}

            --- Suggestions ---
            Current Challenges: ${req.body.currentChallenges}
            Additional Feedback: ${req.body.additionalFeedback}

            Best regards,  
            Beumer Groups India
            `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Feedback confirmation sent to ${email}`);
      } catch (emailError) {
        console.error('❌ Error sending confirmation email:', emailError);
      }
    }

    res.status(200).json({ message: "✅ Thank you for your feedback!" });
  } catch (error) {
    console.error("❌ Error saving feedback:", error);
    res.status(500).json({ message: "Server Error: Could not save feedback." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
