import React, { useState } from "react";
import {
  getRelateFieldData,
  updateReply,
} from "../../../../../../../../store/actions/module.actions";
import { toast } from "react-toastify";
import SendIcon from "@material-ui/icons/Send";
import { IconButton, Grid } from "@material-ui/core";
import { isEmpty, pathOr, trim } from "ramda";
import { Mention, MentionsInput } from "react-mentions";
import mentionStyle from "./mentionStyle";
import { SOMETHING_WENT_WRONG } from "../../../../../../../../constant";
import useStyles from "./styles";

export default function ActivitiesStreamChatReply({ activity_id, allActivity, setData }) {
  const classes = useStyles();
  const symbolModuleMapping = {
    "@": "Users",
    "#": "Contacts",
    [`$`]: "Opportunities",
  };
  const ModuleSymbolMapping = {
    Users: "@",
    Contacts: "#",
    Opportunities: `$`,
  };
  const [message, setMessage] = useState("");

  const convertComment = (message) => {
    let msg = message;
    let strArr = message.split("");
    let mentionedStr = strArr.filter((item) => item.match(/@/gs));
    mentionedStr.forEach((item) => {
      var matches = item.match(/\(\[(.*?)\]\)/);
      if (matches) {
        var submatch = matches[1];
        msg = msg.replace(item, `${submatch}`);
      }
    });
    var result = msg.replace(/\@[[\s\S]*?\]/g, "");
    return result;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    let convertedMsg = convertComment(message);
    try {
      const res = await updateReply(convertedMsg, activity_id);
      let resData = pathOr({}, ["data", "data", 0], res);
      const resultArr = [];
      allActivity.map((e) => {
        if (e.id === activity_id) {
          resultArr.push(resData);
        } else {
          resultArr.push(e);
        }
      });
      setData([...resultArr]);
      setMessage("");
    } catch (e) {
      toast("something went wrong");
    }
  };

  const fetchRelateFieldData = (str, moduleName, callback) => {
    try {
      const query = `&filter[name][lke]=${str}`;
      getRelateFieldData(moduleName, 5, 1, "name", query)
        .then((res) => {
          let responseData = [];
          if (res.ok) {
            {
              pathOr(
                "",
                ["data", "data", "templateMeta", "listview", "data"],
                res,
              ).map((e) => {
                let moduleName = pathOr("", ["data", "data", "module"], res);
                if (
                  !isEmpty(trim(moduleName)) &&
                  !isEmpty(trim(e.id)) &&
                  !isEmpty(trim(e.attributes.name))
                ) {
                  responseData.push({
                    id: `[${moduleName}:${e.id}:${e.attributes.name}]`,
                    display: e.attributes.name,
                  });
                }
              });
            }
            return responseData;
          }
        })
        .then(callback);
    } catch (ex) {
      toast(SOMETHING_WENT_WRONG);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      className={classes.Inputwidth}
      >
      <Grid item xs={10}>
        <MentionsInput
          style={mentionStyle}
          className={classes.text}
          onChange={handleChange}
          value={message}
          markup="@[__display__]"
          displayTransform={(id, display) => {
            return display;
          }}
        >
          <Mention
            trigger={ModuleSymbolMapping.Users}
            data={(str, callback) =>
              fetchRelateFieldData(
                str,
                symbolModuleMapping[ModuleSymbolMapping.Users],
                callback,
              )
            }
          />
          <Mention
            trigger={ModuleSymbolMapping.Contacts}
            data={(str, callback) =>
              fetchRelateFieldData(
                str,
                symbolModuleMapping[ModuleSymbolMapping.Contacts],
                callback,
              )
            }
          />
          <Mention
            trigger={ModuleSymbolMapping.Opportunities}
            data={(str, callback) =>
              fetchRelateFieldData(
                str,
                symbolModuleMapping[ModuleSymbolMapping.Opportunities],
                callback,
              )
            }
          />
        </MentionsInput>
      </Grid>
      <Grid item xs={2}>
        <IconButton aria-label="toggle-password-visibility" onClick={onSubmit}>
          <SendIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}
