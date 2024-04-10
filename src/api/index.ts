import createAxiosInstance from "@/utils/request";
import { CancelToken } from "axios";

const hostname = window.location.hostname;
const protocol = window.location.protocol;
const isHttps = protocol === "https:";

const guessUrl = `${protocol}//${hostname}${isHttps ? "" : ":7000"}`;

const request = createAxiosInstance(import.meta.env.VITE_BASE_URL || guessUrl);

export const getUserToken = (
  user_id: string
): Promise<API.BaseResopnse<{ token: string }>> =>
  request.post(`/open_kf_api/get_token`, {
    user_id,
  });

export const requestQA = (
  query: string,
  user_id: string,
  cancelToken?: CancelToken
): Promise<API.BaseResopnse<API.GetAnswerData>> =>
  request.post(
    "/open_kf_api/smart_query",
    {
      query,
      user_id,
    },
    {
      cancelToken,
    }
  );

export const getBotSettings = (): Promise<
  API.BaseResopnse<API.GetBotSettingsData>
> => request.post(`/open_kf_api/get_bot_setting`);
