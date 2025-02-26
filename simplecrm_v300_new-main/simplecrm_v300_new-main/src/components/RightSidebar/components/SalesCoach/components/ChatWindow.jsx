import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { CloseRounded, SendRounded } from "@material-ui/icons";
import { useRef, useState } from "react";
import {
  isValidJSON,
  renderFormattedContent,
  streamChunkData,
} from "../streamUtils";
import { filterXSS } from "xss";
import { pathOr } from "ramda";
import ChatMessage from "./ChatMessage";
import {
  LBL_BOL_BHAI_CHAT_ASK_QUESTIONS,
  LBL_BOL_BHAI_CHAT_GPT_CLOSE_CHAT,
  LBL_BOL_BHAI_CHAT_GPT_REPEAT_QUESTION,
  LBL_BOL_BHAI_CHAT_GPT_TYPING,
} from "@/constant";
import useCommonUtils from "@/hooks/useCommonUtils";
import { customAlphabet } from "nanoid";
import useStyles from "./../styles";

const getRandomId = (length = 21) => {
  const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);
  return nanoid(length);
};

const ChatWindow = ({
  responseData,
  finalResponseData,
  onToggleChatWindow,
  chatMessages,
  setChatMessages,
  chatHistory,
  setChatHistory,
}) => {
  const [loadingChat, setChatLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [salesCoachReplied, setSalesCoachReplied] = useState(false);
  const takeInputRef = useRef();
  const dynamicRef = useRef();
  const prevChatMessage = useRef("");
  const { salesCoachConfig } = useCommonUtils();
  const responseFormat = pathOr(
    "html",
    ["promptData", "response_format"],
    responseData,
  );
  const gptType = pathOr("", ["gptType"], responseData);
  const modelMetaData = pathOr(
    {},
    ["gpt_meta_data", gptType],
    salesCoachConfig,
  );

  const handleOnEnter = (e, run) => {
    if (run || e.keyCode === 13) {
      const inputValue = takeInputRef.current.value.trim();
      if (inputValue == "") return;
      setChatLoading(true);
      const userMessage = {
        role: "user",
        content: `${inputValue} ${salesCoachConfig?.prompt_params || ""}`,
      };
      const gptType = pathOr("", ["gpt_type"], salesCoachConfig);
      const currentMessageInstance = [...chatHistory, userMessage];
      let requestMetaObj = {};
      let currentChatText = "";
      const currentSystemMessageID = getRandomId(16);
      const modelMetaData = pathOr(
        {},
        ["gpt_meta_data", gptType],
        salesCoachConfig,
      );
      if (gptType === "ryabot") {
        let finalPrompt = "";
        const isFirstUserChat =
          currentMessageInstance.filter((message) => message.role == "user")
            .length == 1;
        if (isFirstUserChat && responseData?.sourceType === "CRM") {
          let systemPrompt =
            pathOr(
              [],
              ["messages"],
              isValidJSON(responseData.systemPrompt),
            )?.filter((message) => message.role == "system") ?? {};
          systemPrompt = pathOr("", [0, "content"], systemPrompt);
          finalPrompt = currentMessageInstance.reduce((pV, cV) => {
            return `${pV} ${cV.role == "system" ? cV.content + " \n " : "\n "}`;
          }, systemPrompt);
          finalPrompt += inputValue;
        } else {
          finalPrompt += inputValue;
        }

        // const
        // const systemPrompt = currentMessageInstance.reduce((pV, cV) => {
        //   return pV + "\n" + cV?.content;
        // }, finalResponseData ?? "");

        requestMetaObj = {
          modelEndPoint: modelMetaData?.api_url,
          headers: {
            "Content-Type": "application/json",
            Authorization: responseData.apiToken,
          },
          method: "POST",
          payload: {
            input_text: finalPrompt,
            response_format: "json",
          },
        };
      } else {
        requestMetaObj = {
          modelEndPoint: modelMetaData?.api_url,
          headers: {
            "Content-Type": "application/json",
            Authorization: responseData.apiToken,
          },
          method: "POST",
          payload: {
            model: modelMetaData?.model,
            messages: currentMessageInstance,
            temperature: modelMetaData?.temperature,
            stream: true,
          },
        };
      }

      const userMessageData = {
        type: "user",
        message: inputValue,
        id: getRandomId(16),
      };
      const currentSystemMessageData = {
        type: "system",
        message: "",
        ref: dynamicRef,
        id: currentSystemMessageID,
      };

      setChatMessages((prev) => [
        ...prev,
        userMessageData,
        currentSystemMessageData,
      ]);
      setChatHistory((prev) => [...prev, userMessage]);
      takeInputRef.current.value = "";
      streamChunkData({
        requestMetaObj,
        gptType,
        onData: (content) => {
          setChatLoading(false);
          dynamicRef.current?.scrollIntoView({
            block: "end",
            inline: "nearest",
          });
          currentChatText += content;
          prevChatMessage.current += content;
          dynamicRef.current.innerHTML = filterXSS(
            renderFormattedContent(currentChatText, responseFormat),
          );
        },
        onError: (errorMessage) => {
          setChatLoading(false);
          dynamicRef.current.innerHTML =
            errorMessage || LBL_BOL_BHAI_CHAT_GPT_REPEAT_QUESTION;
        },
        onComplete: (references) => {
          currentSystemMessageData.references = references ?? {};
          currentSystemMessageData.message = currentChatText;
          setChatHistory((prev) => [
            ...prev,
            {
              role: "system",
              content: prevChatMessage.current,
            },
          ]);
          setSalesCoachReplied(false);
          setChatLoading(false);
          takeInputRef.current.focus();
          prevChatMessage.current = "";
        },
      });
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "10px",
          height: "calc(100% - 1rem)",
        }}
      >
        <div
          className="thick-scroll-bar"
          style={{ height: "90%", overflow: "auto" }}
        >
          <div className="message-section">
            {chatMessages.map((val, index) => (
              <ChatMessage
                key={index}
                type={val.type}
                message={renderFormattedContent(
                  val.message,
                  val.type == "system" ? responseFormat : "html",
                )}
                messageId={val.id}
                ref={val?.ref}
                gptType={gptType}
                modelMetaData={modelMetaData}
                references={val?.references ?? {}}
                gptName={salesCoachConfig?.gpt_name}
              />
            ))}
          </div>
        </div>
        <Grid>
          {loadingChat && (
            <ChatBotReplyingLoader gptName={salesCoachConfig?.gpt_name} />
          )}
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <TextField
              label={LBL_BOL_BHAI_CHAT_ASK_QUESTIONS}
              variant="outlined"
              autoFocus
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      color="action"
                      onClick={(e) => handleOnEnter(e, true)}
                    >
                      <SendRounded />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              size="small"
              fullWidth
              inputRef={takeInputRef}
              disabled={salesCoachReplied}
              onKeyUp={handleOnEnter}
            />
          </div>
        </Grid>
      </Box>
      <Tooltip
        title={LBL_BOL_BHAI_CHAT_GPT_CLOSE_CHAT}
        placement="top"
        open={showTooltip || false}
        onOpen={() => setShowTooltip(true)}
        onClose={() => setShowTooltip(false)}
      >
        <CloseRounded
          className={"action-icons position-bottom width-cs cs-white"}
          onClick={() => onToggleChatWindow(false)}
        />
      </Tooltip>
    </>
  );
};

export const ChatBotReplyingLoader = ({ gptName }) => {
  const classes = useStyles();
  return (
    <div className="loader">
      {gptName + LBL_BOL_BHAI_CHAT_GPT_TYPING}
      <div className={classes.ball}></div>
      <div className={classes.ball}></div>
      <div className={classes.ball}></div>
    </div>
  );
};

export default ChatWindow;
