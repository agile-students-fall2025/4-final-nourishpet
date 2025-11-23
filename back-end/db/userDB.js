import User from "../schemas/User.js";

const calculate_bmi = function(height, weight){
  return weight / (height * height / 10000)
}

export const creatUser = async (data) => {
    return await User.create(data);
};

export const getAllUsers = async () => {
    return await User.find();
};

export const findUserById = async (id) => {
    return await User.findById(id);
};

export const updateUserById = async (id, data) => {
    if (data.height !== undefined || data.weight !== undefined) {
        const currentDoc = await User.findById(id);
        
        if (currentDoc) {
            const height = data.height !== undefined 
                ? Number(data.height) || currentDoc.height 
                : currentDoc.height;
            const weight = data.weight !== undefined 
                ? Number(data.weight) || currentDoc.weight 
                : currentDoc.weight;
            
            if (height > 0 && weight > 0) {
                const calculatedBmi = calculate_bmi(height, weight);
                data.bmi = Math.round(calculatedBmi * 10) / 10;
            }
        }
    }
    
    return await User.findByIdAndUpdate(id, data, {new: true});
};

export const DeleteById = async (id) => {
    return await User.findByIdAndDelete(id);
};