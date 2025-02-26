import { SSE } from "sse.js";
import { toast } from "react-toastify";
import {
  LBL_BOL_BHAI_CHAT_GPT_TRY_AGAIN,
  SOMETHING_WENT_WRONG,
} from "@/constant";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehype from "rehype-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import a11yDark from "react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark";
import { renderToStaticMarkup } from "react-dom/server";
import { pathOr } from "ramda";

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  margin: "1em 0",
};

const thTdStyle = {
  padding: "0.5em",
  border: "1px solid #ddd",
  textAlign: "left",
  fontColor: "#ddd",
};

export const isValidJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return false;
  }
};

export const streamChunkData = (args) => {
  const {
    requestMetaObj = {},
    gptType = "",
    onData = () => {},
    onError = () => {},
    onComplete = () => {},
  } = args;

  const currentOpenReqInstance = new SSE(requestMetaObj.modelEndPoint, {
    headers: requestMetaObj.headers,
    method: requestMetaObj.method,
    payload: JSON.stringify(requestMetaObj.payload),
  });

  currentOpenReqInstance.addEventListener("message", (e) => {
    if (gptType === "ryabot") {
      const data = e.data;
      if (data) {
        const parsedJson = isValidJSON(data);
        if (parsedJson) {
          const { content, finish_reason } = parsedJson;
          onData(content);
          if (finish_reason === "stop") {
            const references = pathOr({}, ["references"], parsedJson);
            onComplete(references);
            currentOpenReqInstance.close();
          }
        }
      } else {
        currentOpenReqInstance.close();
      }
    } else {
      if (e.data !== "[DONE]") {
        const payload = JSON.parse(e.data);
        const text = payload.choices[0]?.delta?.content;
        if (text && text !== "\n" && text !== "") {
          onData(text);
        }
      } else {
        currentOpenReqInstance.close();
        onComplete({});
      }
    }
  });

  currentOpenReqInstance.addEventListener("error", (e) => {
    const errorMessage =
      JSON.parse(e.data).error?.message || LBL_BOL_BHAI_CHAT_GPT_TRY_AGAIN;
    onError(errorMessage);
    toast(SOMETHING_WENT_WRONG);
  });

  currentOpenReqInstance.stream();
};

export const renderFormattedContent = (content, responseFormat = "html") => {
  const outputContent =
    responseFormat === "html"
      ? content
      : renderToStaticMarkup(
          <>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehype]}
              children={content}
              skipHtml
              components={{
                table: ({ node, ...props }) => (
                  <table style={tableStyle} {...props} />
                ),
                th: ({ node, ...props }) => <th style={thTdStyle} {...props} />,
                td: ({ node, ...props }) => <td style={thTdStyle} {...props} />,
                code: ({ inline, children, language, ...props }) => {
                  const code = String(children);
                  const match = /language-(\w+)/.exec(language || "");
                  return inline ? (
                    <span>{code}</span>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        overflowX: "auto",
                        maxWidth: "100%",
                      }}
                    >
                      <SyntaxHighlighter
                        showLineNumbers={true}
                        style={a11yDark}
                        children={code.replace(/\n$/, "")}
                        useInlineStyles={true}
                        language={match ? match[1] : null}
                        customStyle={{
                          maxWidth: "100%",
                          overflowX: "auto",
                          whiteSpace: "pre-wrap",
                          wordWrap: "break-word",
                        }}
                        {...props}
                      >
                        {code}
                      </SyntaxHighlighter>
                    </div>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </>,
        );
  // const htmlString = (markDownContent);

  return outputContent;
};
