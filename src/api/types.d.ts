declare namespace API {
  type BotSettings = {
    id: number;
    initial_messages: string[];
    suggested_messages: string[];
    bot_name: string;
    bot_avatar: string;
    chat_icon: string;
    placeholder: string;
    model: string;
  };

  // response
  type BaseResopnse<T> = {
    retcode: number;
    message: string;
    data: T;
  };
  type GetBotSettingsData = {
    config: BotSettings;
  };
  type GetAnswerData = { answer: string; source: string[] };
}
