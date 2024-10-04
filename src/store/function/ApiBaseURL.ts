let address = "localhost";
address = location.hostname;
// address = "10.110.202.149";
// address = "10.107.65.166";
export const ApiBaseURL =
  process.env.NODE_ENV === "development" ? "http://" + address + ":3000/" : "/";
