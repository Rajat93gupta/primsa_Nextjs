// app/api/Functions/GetUser.ts
const GetUser = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/me`, {
      cache: "no-store",
      credentials: "include", // important for HttpOnly cookie
    });
    console.log(response);
    

    if (!response.ok) {
      return null; // user not logged in
    }

    const data = await response.json();
    console.log(data,"data");
    
    return data.user; // return the user object
  } catch (err) {
    console.error("Failed to fetch user:", err);
    return null;
  }
};

export { GetUser };
