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
    const user = await User.findById(id);
    
    if (!user) {
        throw new Error("User not found");
    }
    
    Object.keys(data).forEach(key => {
        if (data[key] !== undefined) {
            user[key] = data[key];
        }
    });
    
    await user.save();
    
    return user;
};

export const DeleteById = async (id) => {
    return await User.findByIdAndDelete(id);
};