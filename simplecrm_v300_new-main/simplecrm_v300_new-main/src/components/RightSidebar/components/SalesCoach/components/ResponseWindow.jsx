import { useEffect, useRef, useState } from "react";
import useStyles from "./../styles";
import useCommonUtils from "@/hooks/useCommonUtils";
import { isEmpty, isNil, pathOr } from "ramda";
import { useSelector } from "react-redux";
import { api } from "@/common/api-utils";
import {
  LBL_BOL_BHAI_CHAT_GPT_ASK_BOT_TITTLE,
  LBL_BOL_BHAI_CHAT_GPT_TRY_AGAIN,
  SOMETHING_WENT_WRONG,
} from "@/constant";
import { Box, IconButton, Tooltip } from "@material-ui/core";
import { FaIcon } from "@/components";
import {
  isValidJSON,
  renderFormattedContent,
  streamChunkData,
} from "../streamUtils";
import { LoadingComponent } from "./LoadingComponent";
import ReferenceFileBadge from "./ReferenceFileBadge";

const createMarkup = (data) => ({ __html: data });
const convertStrToObject = (encodedString) => {
  const decodedString = encodedString.replace(/&quot;/g, '"');
  const obj = isValidJSON(decodedString);
  return obj;
};

const ResponseWindow = ({
  metaObj,
  responseData,
  finalResponseData,
  onToggleChatWindow,
  setFinalResponseData,
  finalResponseReferenceFiles,
  setFinalResponseReferenceFiles,
  isPromptLoaded,
  setIsPromptLoaded,
}) => {
  const classes = useStyles();
  const promptResponseRef = useRef("");
  const [messageData, setMessageData] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [loading, setLoading] = useState(false);
  const { salesCoachConfig, currentUserData } = useCommonUtils();
  const selectedEntityName = useSelector(
    (state) =>
      state?.detail?.detailViewTabData[metaObj.currentModule]?.data
        ?.templateMeta?.recordInfo?.record_name || "",
  );
  const gptType = pathOr("", ["gptType"], responseData);
  const modelMetaData = pathOr(
    {},
    ["gpt_meta_data", gptType],
    salesCoachConfig,
  );
  const responseFormat = pathOr(
    "html",
    ["promptData", "response_format"],
    responseData,
  );

  const userId = pathOr("", ["data", "id"], currentUserData);
  const userName = pathOr(
    "",
    ["data", "attributes", "user_name"],
    currentUserData,
  );

  const storeOpenAIPrompt = async (prompt, referenceFiles) => {
    let requestPayload = {
      data: {
        type: "scrm_SalesCoachResponse",
        id: responseData?.responseRecordId
          ? responseData?.responseRecordId
          : undefined,
        attributes: {
          description: prompt,
          description_html_c: prompt,
          name: selectedEntityName,
          assigned_user_name: {
            id: userId || "",
            value: userName || "",
          },
          bean_id: !!metaObj?.recordId ? metaObj?.recordId : "",
          parent_name: selectedEntityName,
          prompt_c: {
            id: responseData?.promptData?.id,
            value: responseData?.promptData?.name,
          },
          parent_id: !!metaObj?.recordId ? metaObj?.recordId : "",
          parent_type: responseData?.promptData?.module,
          reference_files_c: JSON.stringify(referenceFiles),
        },
      },
    };
    try {
      const res = responseData.responseRecordId
        ? await api.patch(`/V8/module`, requestPayload)
        : await api.post(`/V8/module`, requestPayload);

      if (!res.ok) {
        console.error("Error storing OpenAI prompt");
      }
    } catch {
      console.error(SOMETHING_WENT_WRONG);
    }
  };

  const callStreamChunkData = () => {
    let requestMetaObj = {};

    if (gptType === "ryabot") {
      let systemPrompt = pathOr(
        [],
        ["messages"],
        isValidJSON(responseData.systemPrompt),
      );
      systemPrompt = systemPrompt.reduce((pV, cV) => {
        if (cV?.role === "system") {
          return cV?.content + "\n" + pV;
        } else {
          return pV + "\n" + cV?.content;
        }
      }, "");

      requestMetaObj = {
        modelEndPoint: modelMetaData?.api_url,
        headers: {
          "Content-Type": "application/json",
          Authorization: responseData.apiToken,
        },
        method: "POST",
        payload: {
          input_text: systemPrompt,
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
        payload: JSON.parse(responseData.systemPrompt),
      };
    }
    setLoading(true);
    streamChunkData({
      requestMetaObj,
      gptType,
      onData: (content) => {
        const formattedContent = renderFormattedContent(
          promptResponseRef.current + content,
          responseFormat,
        );
        promptResponseRef.current += content;
        setLoading(false);
        setMessageData((prev) => formattedContent);
      },
      onComplete: (references) => {
        storeOpenAIPrompt(promptResponseRef.current, references);
        setFinalResponseReferenceFiles(references);
        setFinalResponseData(promptResponseRef.current);
        setIsPromptLoaded(true);
        setLoading(false);
      },
      onError: (errorMessage) => {
        setMessageData(errorMessage);
        setLoading(false);
      },
    });
  };

  useEffect(() => {
    if (!metaObj?.currentModule) return;
    if (responseData?.sourceType === "CRM") {
      const referenceFiles = convertStrToObject(
        responseData?.promptData?.reference_files,
      );
      setMessageData(
        renderFormattedContent(responseData?.moduleResponse, responseFormat),
      );
      setFinalResponseData(
        renderFormattedContent(responseData?.moduleResponse, responseFormat),
      );
      setFinalResponseReferenceFiles(!!referenceFiles ? referenceFiles : {});
      setIsPromptLoaded(true);
    } else if (responseData?.sourceType === "OpenAI") {
      if (finalResponseData) {
        setMessageData(
          renderFormattedContent(finalResponseData, responseFormat),
        );
      } else {
        callStreamChunkData();
      }
    }
  }, [responseData, metaObj]);

  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <>
      <div className={classes.salesCoachSection}>
        <div dangerouslySetInnerHTML={createMarkup(messageData)}></div>
        {gptType == "ryabot" &&
          !isNil(finalResponseReferenceFiles) &&
          !isEmpty(finalResponseReferenceFiles) && (
            <div>
              {Object.entries(finalResponseReferenceFiles).map(
                ([fileId, fileName]) => (
                  <div>
                    <ReferenceFileBadge
                      fileId={fileId}
                      fileName={fileName}
                      modelMetaData={modelMetaData}
                    />
                  </div>
                ),
              )}
            </div>
          )}
      </div>
      {isPromptLoaded && (
        <Box>
          <Tooltip
            title={
              LBL_BOL_BHAI_CHAT_GPT_ASK_BOT_TITTLE + salesCoachConfig?.gpt_name
            }
            placement="top"
            open={showTooltip}
            onOpen={() => setShowTooltip(true)}
            onClose={() => setShowTooltip(false)}
          >
            <IconButton
              color="action"
              align="right"
              onClick={() => onToggleChatWindow(true)}
              className="action-icons"
            >
              <FaIcon
                className="action-icons"
                icon="fa-solid fa-robot"
                color="#fab007"
              />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </>
  );
};

export default ResponseWindow;
