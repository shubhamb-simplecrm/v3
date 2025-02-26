import React from "react";
// styles
import { getMuiTheme } from "./styles";
import { toast } from "react-toastify";
import { Button, useTheme, TextField, Grid } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { pathOr } from "ramda";
import { c360SaveNotes } from "../../../../store/actions/customer360.actions";
import {
  LBL_CANCEL_BUTTON_TITLE,
  LBL_RECORD_CREATED,
  LBL_SAVE_BUTTON_TITLE,
} from "../../../../constant";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import useCommonUtils from "../../../../hooks/useCommonUtils";

export default function CreateForm({ data, setNewNote, setUpdateListView }) {
  const theme = useTheme();
  const { handleSubmit, reset, control } = useForm();
  const userData = pathOr(
    [],
    ["data", "attributes"],
    useSelector((state) => state.config.currentUserData),
  );
  const userName = pathOr("", ["user_name"], userData);
  const { getCurrentFormattedDate } = useCommonUtils();
  const onSubmit = async (formData) => {
    let reqData = {
      data: {
        attributes: {
          name: formData?.name || `${userName} ${getCurrentFormattedDate}`,
          description: formData?.description,
          assigned_user_name: { id: userData?.id, value: userData?.name },
          parent_id: data?.id,
          parent_name: data?.attributes?.name,
          parent_type: data?.type == "Account" ? "Accounts" : data?.type,
        },
        type: "Notes",
      },
    };
    let res = await c360SaveNotes(reqData);
    setUpdateListView(true);
    let id = pathOr(null, ["data", "data", "id"], res);
    if (id) {
      setNewNote(pathOr([], ["data", "data"], res));
      resetForm();
      toast(LBL_RECORD_CREATED);
    }
  };
  const resetForm = () =>
    reset({
      name: "",
      description: "",
    });

  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item md={12} sm={15} xs={16}>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              rules={{ required: "Note is required" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  label="Note *"
                  variant="outlined"
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  helperText={error ? error.message : null}
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  color="primary"
                >
                  {LBL_SAVE_BUTTON_TITLE}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={resetForm}
                >
                  {LBL_CANCEL_BUTTON_TITLE}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </MuiThemeProvider>
  );
}
