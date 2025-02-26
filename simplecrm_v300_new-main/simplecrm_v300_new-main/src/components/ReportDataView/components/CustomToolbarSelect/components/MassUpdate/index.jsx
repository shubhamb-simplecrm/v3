import React, { useState, useCallback, useEffect } from "react";
import {
  CircularProgress,
  Grid,
  Button,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { pathOr } from "ramda";
import { Modal } from "../../../";
import { FormInput } from "../../../../../";
import { getMassUpdateForm } from "../../../../../../store/actions/module.actions";
import useStyles from "./styles";
import { LBL_CANCEL_BUTTON_TITLE, LBL_SAVE_BUTTON_TITLE } from "../../../../../../constant";

const MassUpdate = ({
  modalVisible,
  toggleModalVisibility,
  updateRecords,
  updateLoader,
}) => {
  const [form, setForm] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [updateRecordFields, setUpdateRecordFields] = useState({});
  const { selectedModule } = useSelector((state) => state.modules);
  const classes = useStyles();
  const getForm = useCallback(async () => {
    setLoading(true);
    let massUpdateForm = await getMassUpdateForm(selectedModule);
    setForm(
      pathOr([], ["data", "data", "templateMeta", "data"], massUpdateForm),
    );
    setLoading(false);
  }, [selectedModule]);

  useEffect(() => {
    getForm();
  }, [getForm]);

  const renderLoader = () => (
    <div className={classes.progressWrapper}>
      <CircularProgress />
    </div>
  );

  const renderForm = () => {
    return (
      <div className={classes.perSectionWrapper}>
        <Grid container spacing={2}>
          {form &&
            form.map((field) => (
              <Grid item xs={12} sm={6} md={4} key={field.field_key}>
                <FormInput
                  field={field}
                  key={field.field_key}
                  errors={[]}
                  value={updateRecordFields[field.field_key]}
                  small={true}
                  onChange={(val) => {
                    if (field.type === "relate") {
                      setUpdateRecordFields({
                        ...updateRecordFields,
                        [field.name]: val.value,
                        [field.id_name]: val.id,
                      });
                      return;
                    }
                    setUpdateRecordFields({
                      ...updateRecordFields,
                      [field.field_key]: val,
                    });
                  }}
                />
              </Grid>
            ))}
          <div className={classes.buttonsWrapper}>
            {!updateLoader && (
              <Button
                variant="text"
                onClick={toggleModalVisibility}
                color="primary"
                size="medium"
                fullWidth
                disabled={updateLoader}
                disableElevation
                style={{ margin: 5, width: "100px" }}
              >
                {LBL_CANCEL_BUTTON_TITLE}
              </Button>
            )}
            <Button
              variant="contained"
              onClick={() => updateRecords(updateRecordFields)}
              color="primary"
              size="medium"
              fullWidth
              disabled={updateLoader}
              disableElevation
              style={{ margin: 5, width: "100px" }}
            >
              {updateLoader ? <CircularProgress size={20} /> : LBL_SAVE_BUTTON_TITLE}
            </Button>
          </div>
        </Grid>
      </div>
    );
  };

  return (
    <Modal
      visible={modalVisible}
      onClose={() => toggleModalVisibility(!modalVisible)}
      toggleVisibility={() => toggleModalVisibility(!modalVisible)}
      title="Mass update"
    >
      {loading ? renderLoader() : renderForm()}
    </Modal>
  );
};

export default MassUpdate;
