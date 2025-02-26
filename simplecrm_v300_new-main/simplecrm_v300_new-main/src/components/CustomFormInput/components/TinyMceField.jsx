import React, { useCallback, useMemo, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { PropTypes } from "prop-types";
import useCommonUtils from "@/hooks/useCommonUtils";
import { FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import Tooltip from "@/components/SharedComponents/Tooltip";
import { wysiwygCustomToolBarOptions } from "@/components/FormLayoutContainer/editview-constant";
import RelateFieldDialog from "./RelateField/components/relate-field-dialog";
import { pathOr } from "ramda";

export default function TinyMceField(props) {
  const {
    fieldMetaObj,
    moduleMetaData,
    fieldState,
    onChange,
    value,
    size,
    variant,
    fullWidth,
    height = 300,
  } = props;
  const [selectedToolbarOption, setSelectedToolbarOption] = useState({
    status: false,
    fieldMetaObj: null,
  });
  const toggleDialogVisibility = useCallback(() => {
    setSelectedToolbarOption({
      status: false,
      fieldMetaObj: null,
    });
  }, []);
  const editorRef = useRef(null);
  const { currentActiveTheme } = useCommonUtils();
  const onEditorStateChange = (editorState) => {
    onChange(editorState);
  };
  let customOptions = useMemo(() => {
    let customOptions = wysiwygCustomToolBarOptions;
    if (
      fieldMetaObj?.disablePDFtemplate &&
      fieldMetaObj.hasOwnProperty("disablePDFtemplate")
    ) {
      customOptions = wysiwygCustomToolBarOptions.filter(
        (option) => option.module != "AOS_PDF_Templates",
      );
    }
    return customOptions;
  }, [fieldMetaObj]);

  const handleOnInit = (evt, editor) => {
    editorRef.current = editor;
  };
  const customToolbarIconSlug = customOptions?.reduce((pv, cv) => {
    return `${pv} | ${cv.name}`;
  }, "");
  return (
    <>
      <Tooltip title={fieldMetaObj?.comment}>
        <FormControl
          size={size}
          variant={variant}
          fullWidth={fullWidth}
          error={fieldState?.error}
          disabled={fieldState?.disabled}
        >
          <InputLabel shrink={true}>{fieldMetaObj?.label}</InputLabel>
          <div style={{ marginTop: 10 }}>
            <Editor
              onEditorChange={onEditorStateChange}
              tinymceScriptSrc={"/tinymce/tinymce.min.js"}
              onInit={handleOnInit}
              value={value || ""}
              disabled={fieldState?.disabled}
              init={{
                branding: false,
                height: height,
                help_accessibility: false,
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
                resize: true,
                menubar: "file edit insert view format table tools help",
                elementpath: false,
                statusbar: true,
                skin: currentActiveTheme == "dark" ? "oxide-dark" : "oxide",
                content_css: currentActiveTheme == "dark" ? "dark" : "",
                // icons: "material",
                // language:"ru",
                ui_mode: "split",
                toolbar:
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  `image media link table preview ` +
                  `${customToolbarIconSlug}`,
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                setup: (editor) => {
                  customOptions?.forEach((option) => {
                    editor.ui.registry.addButton(option?.name, {
                      text: option.label,
                      icon: option.icon,
                      onAction: () => {
                        setSelectedToolbarOption({
                          status: true,
                          fieldMetaObj: option,
                        });
                      },
                    });
                  });
                },
              }}
            />
          </div>
          <FormHelperText error={fieldState?.error}>
            {fieldState?.helperText}
          </FormHelperText>
        </FormControl>
      </Tooltip>
      {selectedToolbarOption?.status && (
        <RelateFieldDialog
          {...props}
          fieldMetaObj={selectedToolbarOption?.fieldMetaObj}
          isDialogVisible={selectedToolbarOption?.status}
          toggleDialogVisibility={toggleDialogVisibility}
          onChange={(val) => {
            let template = "";
            if (
              selectedToolbarOption?.fieldMetaObj?.module === "EmailTemplates"
            ) {
              template = pathOr("", ["email_template"], val);
              if (fieldMetaObj["name"] == "email_description") {
                template += "insert_email_signature";
              }
            } else if (
              selectedToolbarOption?.fieldMetaObj?.module ===
              "AOS_PDF_Templates"
            ) {
              template = pathOr(
                "",
                ["rowData", "attributes", "description"],
                val,
              );
            }
            onChange(template);
          }}
        />
      )}
    </>
  );
}

TinyMceField.propTypes = {
  fieldMetaObj: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  variant: PropTypes.string,
  size: PropTypes.string,
  fullWidth: PropTypes.bool,
  fieldState: PropTypes.object,
  moduleMetaData: PropTypes.object,
  customProps: PropTypes.object,
};

TinyMceField.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  variant: "outlined",
  size: "small",
  fullWidth: true,
  fieldState: {
    disabled: false,
    required: false,
    error: false,
    visible: true,
    helperText: null,
  },
  moduleMetaData: {},
  customProps: {},
};
