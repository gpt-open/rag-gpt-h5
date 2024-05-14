const origin = window.location.origin;

const baseUrl = import.meta.env.VITE_BASE_URL || origin;

export const getUserToken = (
  user_id: string
): Promise<API.BaseResopnse<{ token: string }>> =>
  fetch(`${baseUrl}/open_kf_api/auth/get_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id,
    }),
  }).then((res) => res.json());

interface RequestQAParams {
  query: string;
  user_id: string;
  token: string;
  controller?: AbortController;
  onData: (data: string, query: string) => void;
}

export const requestQA = async ({
  query,
  user_id,
  token,
  controller,
  onData,
}: RequestQAParams) => {
  try {
    const response = await fetch(
      `${baseUrl}/open_kf_api/queries/smart_query_stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query, user_id }),
        signal: controller?.signal,
      }
    );

    const reader = response.body!.getReader();
    const decoder = new TextDecoder("utf-8");
    let done = false;
    let result = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      result += decoder.decode(value, { stream: !done });
      onData(result, query);
    }
    result = "";
  } catch (error) {
    console.error("Error during request:", error);
    throw error;
  }
};

export const getBotSettings = (): Promise<
  API.BaseResopnse<API.GetBotSettingsData>
> =>
  fetch(`${baseUrl}/open_kf_api/bot_config/get_bot_setting`, {
    method: "POST",
  }).then((res) => res.json());
