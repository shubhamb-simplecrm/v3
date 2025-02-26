import { createWithEqualityFn as create } from "zustand/traditional";
import { isEmpty, isNil, pathOr } from "ramda";
import { LBL_EMAIL_DRAFT_LIMIT, SOMETHING_WENT_WRONG } from "@/constant";
import { api } from "@/common/api-utils";
import { toast } from "react-toastify";
import { persist } from "zustand/middleware";

const initialState = {
  emailLoading: false,
  formValues: {},
  layoutData: {},
  draftEmails: [],
  draftEmailLimit: 3,
  sendLoading: false,
  isResetEmailBody: false,
};

const useComposeViewData = create(
  persist(
    (set, get) => ({
      ...initialState,
      actions: {
        handleOpenEmailCompose: async (
          payload = { moduleName: "Emails" },
          data = {},
          type = "",
        ) => {
          set({ emailLoading: true });
          const response = await api.get(`/V8/Email/ComposeView`, payload);
          if (response.ok) {
            let initialFormValues = pathOr(
              {},
              ["data", "data", "formValues"],
              response,
            );
            let layoutData = pathOr(
              {},
              ["data", "data", "layoutFields"],
              response,
            );
            if (!isEmpty(data)) {
              Object.entries(initialFormValues).map(([field, value]) => {
                const dataValue = pathOr("", [field], data);
                const toAddress = pathOr(
                  pathOr("", ["toAddr"], data),
                  ["to_addrs_names"],
                  data,
                );
                const fromAddress = pathOr(
                  pathOr("", ["fromAddr"], data),
                  ["from_addr_name"],
                  data,
                );
                if (field == "email_description") {
                  const descriptionValue = pathOr(
                    pathOr("", ["description_html"], data),
                    ["description"],
                    data,
                  );
                  const templateValue = pathOr("", ["email_description"], data);
                  const trail = `<p></p><p></p><blockquote style="margin: 0px 0px 0px 0.8ex;border-left: 1px solid rgb(204, 204, 204);padding-left: 1ex;"><p>On ${
                    data.date_sent_received ?? data.date_entered ?? ""
                  }  ${
                    data.reply_to_addr || data.from_addr_name || ""
                  } wrote:</p> ${descriptionValue}</blockquote>`;
                  initialFormValues[field] =
                    templateValue +
                    (value ?? "") +
                    (isEmpty(descriptionValue) ? "" : trail);
                  get().actions.handleOnChange("initial_description", trail);
                } else if (field == "from_addr_name" && !isEmpty(toAddress)) {
                  let toAddrEmail =
                    typeof toAddress === "string"
                      ? toAddress?.match(/<([^>]+)>/)
                      : toAddress?.[0]?.match(/<([^>]+)>/);
                  toAddrEmail =
                    data?.status == "Outbound"
                      ? fromAddress
                      : (toAddrEmail?.[1] ?? toAddress);
                  const outboundMail = Object.entries(
                    layoutData[field]["options"],
                  ).find(([key, mail]) => {
                    if (mail.includes(toAddrEmail)) return key;
                  });
                  initialFormValues[field] = !isNil(outboundMail)
                    ? outboundMail[0]
                    : value;
                } else if (
                  field == "to_addrs_names" &&
                  !isEmpty(fromAddress) &&
                  !isEmpty(type)
                ) {
                  let addresses = [fromAddress];

                  if (type === "replyAll" || type === "reply") {
                    initialFormValues[field] =
                      data?.status == "Outbound"
                        ? typeof toAddress === "string" && toAddress
                          ? [toAddress]
                          : toAddress
                        : addresses
                          ? addresses
                          : value;
                  } else if (type === "forward") {
                    initialFormValues[field] = [];
                  }
                } else if (
                  field == "cc_addrs_names" &&
                  !isEmpty(fromAddress) &&
                  type === "replyAll"
                ) {
                  let ccAddress = pathOr(
                    pathOr([], ["cc_addrs"], data),
                    ["cc_addrs_names"],
                    data,
                  );
                  if (typeof ccAddress == "string") {
                    if (typeof ccAddress == "string") {
                      if (!isEmpty(ccAddress.trim())) {
                        ccAddress = ccAddress.split(",");
                      }
                    }
                  }
                  initialFormValues[field] = ccAddress;
                } else if (
                  field == "bcc_addrs_names" &&
                  !isEmpty(fromAddress) &&
                  type === "replyAll"
                ) {
                  let bccAddress = pathOr(
                    pathOr([], ["bcc_addrs"], data),
                    ["bcc_addrs_names"],
                    data,
                  );
                  if (typeof bccAddress == "string") {
                    if (typeof bccAddress == "string") {
                      if (!isEmpty(bccAddress.trim())) {
                        bccAddress = bccAddress.split(",");
                      }
                    }
                  }
                  initialFormValues[field] = bccAddress;
                } else if (field == "documents") {
                  if (!isEmpty(dataValue?.[0]?.id)) {
                    initialFormValues["template_pdf"] = [dataValue?.[0]?.id];
                  }
                  initialFormValues[field] = !isEmpty(dataValue)
                    ? dataValue
                    : value;
                } else {
                  initialFormValues[field] = !isEmpty(dataValue)
                    ? dataValue
                    : value;
                }
                if (
                  field === "to_addrs_names" ||
                  field === "cc_addrs_names" ||
                  field === "bcc_addrs_names"
                ) {
                  const emailOptions = pathOr({}, ["emailOptions"], data);
                  let emails = pathOr(
                    [],
                    ["to_addrs_names"],
                    initialFormValues,
                  );
                  if (typeof emails == "string") {
                    emails = [emails];
                  }
                  let ccAddress = pathOr(
                    pathOr([], ["cc_addrs"], data),
                    ["cc_addrs_names"],
                    data,
                  );
                  if (typeof ccAddress == "string") {
                    if (!isEmpty(ccAddress.trim())) {
                      ccAddress = ccAddress.split(",");
                    }
                  }
                  let bccAddress = pathOr(
                    pathOr([], ["bcc_addrs"], data),
                    ["bcc_addrs_names"],
                    data,
                  );
                  if (typeof bccAddress == "string") {
                    if (!isEmpty(bccAddress.trim())) {
                      bccAddress = bccAddress.split(",");
                    }
                  }
                  emails = emails.concat(ccAddress).concat(bccAddress);
                  if (isEmpty(emailOptions) && !isEmpty(emails)) {
                    emails.map((mail) => {
                      emailOptions[mail] = mail;
                    });
                  }
                  if (field === "to_addrs_names") {
                    layoutData[field]["options"] = emailOptions;
                  } else {
                    layoutData["to_addrs_names"][field]["options"] =
                      emailOptions;
                  }
                  initialFormValues["emailOptions"] = pathOr(
                    {},
                    ["emailOptions"],
                    data,
                  );
                }
              });
            }
            set({
              layoutData: layoutData,
              formValues: initialFormValues,
              emailLoading: false,
            });
          } else {
            set({ emailLoading: false });
            toast(
              pathOr(
                SOMETHING_WENT_WRONG,
                ["originalError", "message"],
                response,
              ),
            );
          }
        },
        sendEmail: async (handleClose, values = get().formValues) => {
          set({ sendLoading: true });
          let params = {
            from_addr:
              get().layoutData.from_addr_name.options[values.from_addr_name],
            inbound_email_id: values.from_addr_name,
            to_addrs_names: values.to_addrs_names.toString() ?? "",
            cc_addrs_names: values.cc_addrs_names.toString() ?? "",
            bcc_addrs_names: values.bcc_addrs_names.toString() ?? "",
            name: values.name,
            dummy_attachment: values?.template_pdf ?? [],
            stored_options: values?.stored_options ?? {},
            description: values.email_description,
            email_attachment: values.attachments,
            is_only_plain_text: "",
            type: "out",
            send: "1",
            refer_action: "ComposeView",
            parent: values["parent_name"] ?? {
              parent_name: null,
              parent_id: null,
              parent_type: null,
            },
            parent_type: pathOr("", ["parent_name", "parent_type"], values),
            parent_id: pathOr("", ["parent_name", "parent_id"], values),
          };
          if (!isEmpty(values.documents)) {
            values.documents.map((doc, index) => {
              params[`documentId${index}`] = doc.id;
            });
          }
          let payload = JSON.stringify({ attribute: params });
          const response = await api.post(
            `V8/actionbutton/SendEmail/Emails/1`,
            payload,
          );
          if (response.ok) {
            set({ sendLoading: false });
            handleClose();
            toast(
              pathOr(
                SOMETHING_WENT_WRONG,
                ["data", "data", "discription"],
                response,
              ),
            );
            get().actions.resetFormValues();
          } else {
            set({ sendLoading: false });
            toast(
              pathOr(
                pathOr(SOMETHING_WENT_WRONG, ["data", "errors"], response),
                ["data", "errors", "detail"],
                response,
              ),
            );
          }
        },
        updateFieldOptions: async (query = "", field = {}) => {
          if (isEmpty(query)) {
            return [];
          }
          const response = await api.get(`/V8/Email/getFieldOptions`, {
            moduleName: "Emails",
            searchQuery: query,
          });
          if (response.ok) {
            return pathOr([], ["data", "data"], response);
          } else {
            toast(
              pathOr(
                SOMETHING_WENT_WRONG,
                ["originalError", "message"],
                response,
              ),
            );
          }
        },
        resetFormValues: (value = null) =>
          set((state) => {
            state.formValues = {};
            return { ...state };
          }),
        handleOnChange: (
          fieldName,
          value,
          options = {},
          isBodyReset = false,
        ) => {
          if (fieldName == "email_description") {
            const fromValue = get().formValues?.from_addr_name;
            const signature = get().formValues?.["signatures"]?.[
              fromValue
            ]?.replace(/^(<br\s*\/?>)+/gi, "");
            const trail = get().formValues["initial_description"] ?? "";
            if (value.endsWith("insert_email_signature")) {
              value = value.replace(
                /insert_email_signature/g,
                signature + trail,
              );
            }
          }
          if (fieldName == "from_addr_name" && isBodyReset) {
            const trail = get().formValues["initial_description"] ?? "";
            const newSignature = get().formValues["signatures"][value].replace(
              /^(<br\s*\/?>)+/gi,
              "",
            );
            const description = newSignature + trail;
            get().actions.handleOnChange("email_description", description);
          }
          if (!isEmpty(options)) {
            set((state) => {
              state.formValues = {
                ...state.formValues,
                ["emailOptions"]: {
                  ...state.formValues["emailOptions"],
                  ...options,
                },
              };
              return { ...state };
            });
          }
          set((state) => {
            state.formValues = { ...state.formValues, [fieldName]: value };
            return { ...state };
          });
        },
        addToDraft: (email) => {
          if (get().draftEmails.length < get().draftEmailLimit) {
            set((state) => {
              state.draftEmails = [...state.draftEmails, email];
              return { ...state };
            });
            get().actions.resetFormValues();
          } else {
            toast(LBL_EMAIL_DRAFT_LIMIT);
          }
        },
        deleteDraft: (index) => {
          set((state) => {
            state.draftEmails = state.draftEmails.filter((_, i) => i !== index);
            return { ...state };
          });
        },
        openDraft: (index) => {
          let initialValues = get().draftEmails[index];
          Object.entries(initialValues).map((fieldName) => {
            if (
              fieldName === "to_addrs_names" ||
              fieldName === "cc_addrs_names" ||
              fieldName === "bcc_addrs_names"
            ) {
              const emailOptions = pathOr({}, ["emailOptions"], initialValues);
              let emails = pathOr([], ["to_addrs_names"], initialValues);
              let ccAddress = pathOr(
                pathOr([], ["cc_addrs"], initialValues),
                ["cc_addrs_names"],
                initialValues,
              );
              if (typeof ccAddress == "string") {
                if (typeof ccAddress == "string") {
                  if (!isEmpty(ccAddress.trim())) {
                    ccAddress = ccAddress.split(",");
                  }
                }
              }
              emails = emails.concat(ccAddress);
              if (isEmpty(emailOptions) && !isEmpty(emails)) {
                emails.map((mail) => {
                  emailOptions[mail] = mail;
                });
              }
              initialValues["emailOptions"] = emailOptions;
            }
          });
          get().actions.handleOpenEmailCompose(
            { moduleName: "Emails" },
            initialValues,
          );
          set({
            draftEmails: get().draftEmails.filter((_, i) => i !== index),
          });
          get().actions.resetFormValues();
          set({ formValues: initialValues });
        },
        resetComposeStore: () => set((state) => ({ ...initialState })),
      },
    }),
    {
      name: "email-compose-store",
      partialize: (state) => ({
        draftEmails: state.draftEmails,
      }),
    },
  ),
);

export default useComposeViewData;
