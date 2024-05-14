import createAxiosInstance from "@/utils/request";
import { CancelToken } from "axios";

const origin = window.location.origin;

const request = createAxiosInstance(import.meta.env.VITE_BASE_URL || origin);

export const getUserToken = (
  user_id: string
): Promise<API.BaseResopnse<{ token: string }>> =>
  request.post(`/open_kf_api/auth/get_token`, {
    user_id,
  });

interface RequestQAParams {
  query: string;
  user_id: string;
  token: string;
  cancelToken?: CancelToken;
}

export const requestQA = ({
  query,
  user_id,
  token,
  cancelToken,
}: RequestQAParams): Promise<API.BaseResopnse<API.GetAnswerData>> =>
  request.post(
    "/open_kf_api/queries/smart_query",
    {
      query,
      user_id,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cancelToken,
    }
  );

export const getBotSettings = (): Promise<
  API.BaseResopnse<API.GetBotSettingsData>
> => request.post(`/open_kf_api/bot_config/get_bot_setting`);
