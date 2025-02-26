import { Box, CircularProgress, Typography } from "@material-ui/core";
import useStyles from "./styles";
import DrawerHeader from "../DrawerHeader";
import {
  LBL_BOL_BHAI_CHAT_GPT_BOT_GREETING_MESSAGE,
  LBL_R_YABOT,
  LBL_SALES_COACH,
} from "@/constant";
import Scrollbars from "react-custom-scrollbars";
import { useRef, useState } from "react";
import useFetchInitialSalesCoachResponse from "./hooks/useFetchInitialSalesCoachResponse";
import ResponseWindow from "./components/ResponseWindow";
import ChatWindow from "./components/ChatWindow";
import "./salesCoach.css";
import { pathOr } from "ramda";
import { useSelector } from "react-redux";
import { useModuleViewDetail } from "@/hooks/useModuleViewDetail";
import { LoadingComponent } from "./components/LoadingComponent";

const SalesCoach = () => {
  const classes = useStyles();
  const isChatWindowShowRef = useRef(false);
  const [shouldShowChatWindow, setShouldShowChatWindow] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [finalResponseData, setFinalResponseData] = useState("");
  const [finalResponseReferenceFiles, setFinalResponseReferenceFiles] =
    useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [isPromptLoaded, setIsPromptLoaded] = useState(false);

  const { error, loading, responseData } = useFetchInitialSalesCoachResponse();
  const metaObj = useModuleViewDetail();
  const selectedEntityName = useSelector(
    (state) =>
      state?.detail?.detailViewTabData[metaObj.currentModule]?.data
        ?.templateMeta?.recordInfo?.record_name || "",
  );
  const toggleChatWindow = (flag) => {
    const oldPrompt = pathOr("", ["systemPrompt"], responseData);
    if (flag && !isChatWindowShowRef.current) {
      chatHistory &&
        onAddChatHistory({
          role: "system",
          content: finalResponseData,
        });

      chatHistory &&
        oldPrompt &&
        onAddChatHistory({
          role: "system",
          content: JSON.parse(JSON.stringify(JSON.parse(oldPrompt).messages))[0]
            .content,
        });
      isChatWindowShowRef.current = true;
    }
    setShouldShowChatWindow(flag);
    chatMessages.length < 1 &&
      setChatMessages((prev) =>
        prev.concat({
          type: "system",
          message: `${LBL_BOL_BHAI_CHAT_GPT_BOT_GREETING_MESSAGE} <b>${selectedEntityName}</b>`,
        }),
      );
  };
  const onAddChatHistory = ({ role, content }) => {
    if (!role || !content) return;
    setChatHistory((prevState) =>
      prevState.concat({ role: role, content: content }),
    );
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className={classes.root}>
      <DrawerHeader title={LBL_R_YABOT} />
      <Scrollbars
        id="scrollableDivRight"
        autoHide={true}
        className={classes.contentHeight}
      >
        {shouldShowChatWindow ? (
          <ChatWindow
            responseData={responseData}
            finalResponseData={finalResponseData}
            onToggleChatWindow={toggleChatWindow}
            onAddChatHistory={onAddChatHistory}
            setChatHistory={setChatHistory}
            chatHistory={chatHistory}
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
            shouldShowChatWindow={shouldShowChatWindow}
            isPromptLoaded={isPromptLoaded}
            setIsPromptLoaded={setIsPromptLoaded}
          />
        ) : (
          <ResponseWindow
            metaObj={metaObj}
            responseData={responseData}
            finalResponseData={finalResponseData}
            onToggleChatWindow={toggleChatWindow}
            setFinalResponseData={setFinalResponseData}
            finalResponseReferenceFiles={finalResponseReferenceFiles}
            setFinalResponseReferenceFiles={setFinalResponseReferenceFiles}
            shouldShowChatWindow={shouldShowChatWindow}
            isPromptLoaded={isPromptLoaded}
            setIsPromptLoaded={setIsPromptLoaded}
          />
        )}
      </Scrollbars>
    </div>
  );
};

export default SalesCoach;
