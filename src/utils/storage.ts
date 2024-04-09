import { IMessageItem } from "@/MessageList";

export const saveUserID = (userID: string) =>
  localStorage.setItem("kf_userID", userID);
export const getUserID = () => localStorage.getItem("kf_userID");

export const saveToken = (token: string) =>
  localStorage.setItem("kf_token", token);
export const getToken = () => localStorage.getItem("kf_token");

export const saveHistoryMessage = (msgs: IMessageItem[]) =>
  localStorage.setItem("tmp_user_history_message", JSON.stringify(msgs));
export const getHistoryMessage = () =>
  JSON.parse(
    localStorage.getItem("tmp_user_history_message") || "[]"
  ) as IMessageItem[];
export const clearHistoryMessage = () =>
  localStorage.removeItem("tmp_user_history_message");
