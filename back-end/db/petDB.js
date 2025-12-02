import Pet from "../schemas/Pet.js";

export const getAllPets = async () => {
    return await Pet.find({}).sort({ name: 1 });
  };