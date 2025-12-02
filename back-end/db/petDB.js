import Pet from "../schemas/Pet.js";

export const getAllPets = async () => {
    return await Pet.find({}).sort({ name: 1 });
  };

export async function showPetInfo(userId) {
        if (!userId) throw new Error("userId is required");
        const pet = await Pet.findOne({ user_id: userId });
        return pet || null;
    };