import React, { forwardRef, useRef } from "react";
import { Box, Grid, IconButton, Tooltip } from "@material-ui/core";
import { FileCopyRounded } from "@material-ui/icons";
import { FaIcon } from "@/components";
import { LBL_BOL_BHAI_CHAT_GPT_COPY_MESSAGE } from "@/constant";
import ReferenceFileBadge from "./ReferenceFileBadge";
import { isNil, isEmpty } from "ramda";

const copyChatMessage = (messageId, hiddenInputRef) => {
  const message = document.getElementById(messageId);
  if (message) {
    const clone = message.cloneNode(true);
    const styleElements = clone.getElementsByTagName("style");
    for (const styleElement of styleElements) {
      styleElement.remove();
    }
    const allElements = clone.querySelectorAll("*");
    for (const element of allElements) {
      element.removeAttribute("style");
    }
    hiddenInputRef.current.value = clone.textContent;
    hiddenInputRef.current.select();
    document.execCommand("copy");
  }
};
const createMarkup = (data) => ({ __html: data });

const ChatMessage = forwardRef(
  (
    { type, message, messageId, gptName, gptType, references, modelMetaData },
    ref,
  ) => {
    const hiddenInputRef = useRef();

    if (type === "user") {
      return (
        <>
          <input
            type="text"
            ref={hiddenInputRef}
            key="toCopyHiddenFields"
            style={{ position: "absolute", top: "-9999px", left: "-9999px" }}
          />
          <Grid container justify="flex-end">
            <Box sx={{ width: "85%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: "10px",
                }}
              >
                <div
                  style={{
                    background: "rgba(240, 242, 246, 0.5)",
                    padding: "15px 12px",
                    borderRadius: "5px",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FaIcon
                      icon="fa-solid fa-user-tie"
                      color="#fff"
                      className="color-red"
                    />
                    <span>You</span>
                  </div>
                  <div
                    style={{ fontWeight: "400", marginTop: "10px" }}
                    className="thin-scroll-bar"
                    id={`currentMessage_${messageId}`}
                    ref={ref}
                  >
                    {message}
                  </div>
                </div>
              </div>
            </Box>
          </Grid>
        </>
      );
    } else {
      return (
        <>
          <input
            type="text"
            ref={hiddenInputRef}
            key="toCopyHiddenFields"
            style={{ position: "absolute", top: "-9999px", left: "-9999px" }}
          />
          <div
            style={{
              textAlign: "start",
              padding: "5px 12px",
              borderRadius: "5px",
              background: "transparent",
              fontSize: "0.875rem",
              lineHeight: "1.75",
              width: "90%",
            }}
          >
            <div
              style={{
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <FaIcon
                icon="fa-solid fa-robot"
                color="#fff"
                className="user-icon"
              />
              <span>{gptName}</span>
              <Box>
                <Tooltip
                  title={LBL_BOL_BHAI_CHAT_GPT_COPY_MESSAGE}
                  placement="top"
                >
                  <IconButton
                    color="action"
                    style={{
                      backgroundColor: "transparent",
                      fontSize: "1.1rem",
                    }}
                    onClick={() =>
                      copyChatMessage(
                        `currentMessage_${messageId}`,
                        hiddenInputRef,
                      )
                    }
                  >
                    <FileCopyRounded
                      style={{ color: "rgb(0 0 0 / 12%)", width: "1rem" }}
                      fontSize="small"
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            </div>
            <div
              style={{ fontWeight: "400" }}
              className="thin-scroll-bar"
              id={`currentMessage_${messageId}`}
              dangerouslySetInnerHTML={createMarkup(message)}
              ref={ref}
            ></div>
            {gptType == "ryabot" &&
              !isNil(references) &&
              !isEmpty(references) && (
                <div>
                  {Object.entries(references).map(([fileId, fileName]) => (
                    <div>
                      <ReferenceFileBadge
                        fileId={fileId}
                        fileName={fileName}
                        modelMetaData={modelMetaData}
                      />
                    </div>
                  ))}
                </div>
              )}
          </div>
        </>
      );
    }
  },
);

export default ChatMessage;
