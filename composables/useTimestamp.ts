export const useTimestamp = () => useState("timestamp", () => Date.parse(new Date().toString()));
