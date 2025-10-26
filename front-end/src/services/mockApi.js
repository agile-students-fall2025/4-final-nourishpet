let mockUserData = {
    name: "Charlie",
    petName: "Charlie's dog",
    targetWeight: "50",
    height: "160",
    currentWeight: "55",
    bmi: "21.5 Standard"
  };
  
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  export const fetchUserData = async () => {
    await delay(500);
    return mockUserData;
  };
  
  export const updateUserData = async (newData) => {
    await delay(300);
    mockUserData = newData;
    console.log('User data updated:', newData);
    return { success: true };
  };