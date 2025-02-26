import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useSelector } from "react-redux";
import { pathOr } from "ramda";
import { Tooltip, FormHelperText } from "@material-ui/core";
import { Typography } from "../../Wrappers/Wrappers";
import EnvUtils from "../../../common/env-utils";
import useStyles from "./styles";

export default function Tinymce({
  module,
  field,
  onChange,
  errors = {},
  value,
  small = false,
  toolbar = {},
  toolbarCustomButtons = [],
  toolbarHidden = false,
  height = "30vh",
  disabled = false,
  onCopy = null,
}) {
  const editorRef = useRef(null); //
  const classes = useStyles();
  let iserror = errors[field.name] ? true : false;
  let isRequired = field.required === "true" ? "*" : "";
  const currentTheme = useSelector((state) =>
    pathOr("", ["config", "V3SelectedTheme"], state.config),
  );
  const onEditorStateChange = (editorState) => {
    onChange(editorState);
  };
  return (
    <>
      {module !== "Emails" ? (
        <div
          className={
            errors[field.name] && errors[field.name] !== "ReadOnly"
              ? classes.errorTitle
              : classes.title
          }
        >
          {field.label
            ? field.label.replace(/^./, field.label[0].toUpperCase()) +
              isRequired
            : field?.name.replace(/^./, field.name[0].toUpperCase()) +
              isRequired}
        </div>
      ) : (
        ""
      )}
      <div
        className={
          errors[field.name] && errors[field.name] !== "ReadOnly"
            ? classes.errorBox
            : null
        }
      >
        <Editor
          onEditorChange={onEditorStateChange}
          tinymceScriptSrc={"/tinymce/tinymce.min.js"}
          onInit={(evt, editor) => (editorRef.current = editor)}
          value={value || ""}
          disabled={
            errors[field.name] === "ReadOnly" || disabled ? true : false
          }
          init={{
            branding: false,
            height: 400,
            ui_mode: "split",
            // menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
              // "nonbreaking","noneditable","pagebreak","advhr","advimage","autoresize","autosave","bbcode","contextmenu","directionality",
              // "emotions","fullpage","iespell","inlinepopups","layer","legacyoutput","paste","print","save","spellchecker","style",
              // "tabfocus","template","visualchars","xhtmlxtras"
            ],
            promotion: false,
            resize: false,
            menubar: "file edit insert view format table tools help",
            elementpath: false,
            statusbar: true,
            skin: currentTheme == "dark" ? "oxide-dark" : "oxide",
            content_css: currentTheme == "dark" ? "dark" : "",
            // icons: "material",
            // language:"ru",
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "image media link table preview code | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
          onCut={onCopy}
          onCopy={onCopy}
          onPaste={onCopy}
          onContextMenu={onCopy}
        />
      </div>
      <Typography
        variant="caption"
        style={{ color: "rgb(244,76,60)", paddingLeft: "13px" }}
      >
        {errors[field.name] && errors[field.name] !== "ReadOnly"
          ? errors[field.name]
          : null}
      </Typography>
    </>
  );
}
