import { InputAdornment } from "@material-ui/core";
import VarCharField from "./VarCharField";
import { EmojiObjectsOutlined as HelpOutlineIcon } from "@material-ui/icons";
import CustomFormInput from "..";
const NameField = (props) => {
  const { moduleMetaData, value, onChange, fieldMetaObj, customProps } = props;
  return moduleMetaData?.currentModule === "Cases" ? (
    <VarCharField
      {...props}
      value={typeof value === "object" ? value?.value : value}
      onChange={onChange}
      customProps={{
        ...customProps,
        field: {
          InputProps: {
            endAdornment: (
              <InputAdornment position="end" style={{ padding: 0 }}>
                <CustomFormInput
                  {...props}
                  onChange={onChange}
                  control={null}
                  fieldMetaObj={{
                    ...fieldMetaObj,
                    type: "relate",
                    module: "AOK_KnowledgeBase",
                  }}
                  customProps={{
                    isIconBtn: true,
                    btnIcon: <HelpOutlineIcon />,
                  }}
                />
              </InputAdornment>
            ),
          },
        },
      }}
    />
  ) : (
    <VarCharField {...props} />
  );
};
export default NameField;