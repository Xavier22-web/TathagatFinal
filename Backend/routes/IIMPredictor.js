const express=require("express")

const User=require("../models/UserSchema")

const IIMPredictor =  require("../models/IIMPredictorSchema")

const router=express.Router()



// ✅ POST Route to Save IIM Predictor Data
router.post("/iim-predictor", async (req, res) => {
    try {
        const { userId, category, gender, classX, classXII, discipline, graduation, gradPercentage, workExperience, takenCATBefore, catYear, interestedCourses } = req.body;

        if (!userId || !category || !gender || !classX || !classXII || !discipline || !graduation || !gradPercentage || !workExperience || !takenCATBefore || !catYear || !interestedCourses) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // ✅ Check if the user already has an entry
        let existingPrediction = await IIMPredictor.findOne({ userId });

        if (existingPrediction) {
            // ✅ Update existing entry
            existingPrediction.category = category;
            existingPrediction.gender = gender;
            existingPrediction.classX = classX;
            existingPrediction.classXII = classXII;
            existingPrediction.discipline = discipline;
            existingPrediction.graduation = graduation;
            existingPrediction.gradPercentage = gradPercentage;
            existingPrediction.workExperience = workExperience;
            existingPrediction.takenCATBefore = takenCATBefore;
            existingPrediction.catYear = catYear;
            existingPrediction.interestedCourses = interestedCourses;
            existingPrediction.updatedAt = new Date();

            await existingPrediction.save();
            return res.status(200).json({ message: "Data updated successfully!", data: existingPrediction });
        }

        // ✅ If no existing entry, create new
        const newPrediction = new IIMPredictor({
            userId,
            category,
            gender,
            classX,
            classXII,
            discipline,
            graduation,
            gradPercentage,
            workExperience,
            takenCATBefore,
            catYear,
            interestedCourses
        });

        await newPrediction.save();
        res.status(201).json({ message: "Data saved successfully!", data: newPrediction });

    } catch (error) {
        console.error("❌ Error saving/updating data:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});


router.get("/iim-predictor/:userId", async (req, res) => {
    try {
        const { userId } = req.params; 
        
        if (!userId) {
            return res.status(400).json({ message: "❌ userId is missing in the request!" });
        }

        // ✅ Find the user's submitted IIM predictor data
        const predictionData = await IIMPredictor.findOne({ userId });

        if (!predictionData) {
            return res.status(404).json({ message: "No data found for this user!" });
        }

        // ✅ Fetch user name using `userId`
        const user = await User.findById(userId).select("name"); 
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // ✅ Merge User Name into Response
        const responseData = {
            ...predictionData._doc,  // Predictor Data
            name: user.name           // User Name
        };

        console.log("✅ Data Found:", responseData);
        res.status(200).json(responseData);

    } catch (error) {
        console.error("❌ Error fetching data:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});




router.post("/submit-cmat-score", async (req, res) => {
    try {
        const { userId, qtCorrect, qtWrong, lrCorrect, lrWrong, lcCorrect, lcWrong, gaCorrect, gaWrong } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "❌ User ID is required!" });
        }

        // ✅ Score Calculation Logic
        const qt = (qtCorrect * 4) - (qtWrong * 1);
        const lr = (lrCorrect * 4) - (lrWrong * 1);
        const lc = (lcCorrect * 4) - (lcWrong * 1);
        const ga = (gaCorrect * 4) - (gaWrong * 1);
        const totalScore = qt + lr + lc + ga;

        // ✅ Predicted Percentile Logic (Using Historical Trends)
        let predictedPercentile = 0;
        if (totalScore >= 300) predictedPercentile = 99;
        else if (totalScore >= 250) predictedPercentile = 95;
        else if (totalScore >= 200) predictedPercentile = 85;
        else if (totalScore >= 150) predictedPercentile = 75;
        else if (totalScore >= 100) predictedPercentile = 60;
        else predictedPercentile = 40;

        // ✅ Find User's Prediction Entry
        let predictor = await IIMPredictor.findOne({ userId });

        if (!predictor) {
            return res.status(404).json({ message: "❌ No user data found, please complete registration first." });
        }

        // ✅ Update User's Scores & Prediction
        predictor.qt = qt;
        predictor.lr = lr;
        predictor.lc = lc;
        predictor.ga = ga;
        predictor.totalScore = totalScore;
        predictor.predictedPercentile = predictedPercentile;

        await predictor.save();

        res.status(200).json({
            message: "✅ CMAT Scores & Percentile Saved Successfully!",
            qt, lr, lc, ga,
            totalScore,
            predictedPercentile
        });

    } catch (error) {
        console.error("❌ Error calculating CMAT scores:", error);
        res.status(500).json({ message: "❌ Server error, please try again later." });
    }
});

// ✅ CMAT Score Fetch API
router.get("/get-cmat-score/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "❌ User ID is required!" });
        }

        const predictor = await IIMPredictor.findOne({ userId });

        if (!predictor) {
            return res.status(404).json({ message: "❌ No CMAT data found for this user!" });
        }

        res.status(200).json({
            qt: predictor.qt,
            lr: predictor.lr,
            lc: predictor.lc,
            ga: predictor.ga,
            totalScore: predictor.totalScore,
            predictedPercentile: predictor.predictedPercentile
        });

    } catch (error) {
        console.error("❌ Error fetching CMAT scores:", error);
        res.status(500).json({ message: "❌ Server error, please try again later." });
    }
});




module.exports = router;
