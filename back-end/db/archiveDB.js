import Nutrition from '../schemas/Nutrition.js'

const getTodayStr = () => new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
});

//get record for past 7 days
export const getWeeklyLogs = async (userId) => {

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    return await Nutrition.find({
        user_id: userId,
        createdAt: { $gte: sevenDaysAgo }
    })
        .sort({ createdAt: -1 }); // Sort by date desc
};

//add new food
export const addFoodEntry = async (userId, foodItem) => {
    // foodItem expects: { name, grams, p, f, c }

    const todayStr = getTodayStr();

    // calculate calories
    const calories = (foodItem.p * 4) + (foodItem.f * 9) + (foodItem.c * 4);

    return await Nutrition.findOneAndUpdate(
        {
            user_id: userId,
            date: todayStr
        },
        {
            // update array
            $push: {
                food_list: foodItem.name,
                grams: foodItem.grams,
                protein_list: foodItem.p,
                fat_list: foodItem.f,
                carbs_list: foodItem.c
            },
            // increment numbers
            $inc: {
                total_intake: calories,
                protein: foodItem.p,
                fat: foodItem.f,
                carbs: foodItem.c
            }
        },
        {
            new: true,   // return the updated document
            upsert: true // create the document if it doesn't exist for today
        }
    );
};