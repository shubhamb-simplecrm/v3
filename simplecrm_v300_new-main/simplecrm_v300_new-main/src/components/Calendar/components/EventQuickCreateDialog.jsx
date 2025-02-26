import { memo, useState } from "react";
import QuickCreate from "@/components/QuickCreate";
import {
  LBL_CREATE_TASK_BUTTON,
  LBL_LOG_CALL,
  LBL_SCHEDULE_MEETING,
} from "@/constant";
import {
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@material-ui/core";
const moduleOptionList = {
  Meetings: LBL_SCHEDULE_MEETING,
  Calls: LBL_LOG_CALL,
  Tasks: LBL_CREATE_TASK_BUTTON,
};
const EventQuickCreateDialog = ({
  open,
  calendarViewType,
  calendarSelectedDate,
  recordACLAccess,
  defaultModule,
  onCloseDialog,
  onRecordSuccess,
}) => {
  const [selectedModule, setSelectedModule] = useState(defaultModule);
  const handleOnModuleChange = (e) => {
    setSelectedModule(e.target.value);
  };
  return (
    <QuickCreate
      moduleName={selectedModule}
      open={open}
      onCancelClick={onCloseDialog}
      onRecordSuccess={onRecordSuccess}
      customProps={{
        calendarSelectedDate: calendarSelectedDate,
        calendarViewType: calendarViewType,
        customHeader: (
          <QuickCreateHeader
            selectedModule={selectedModule}
            recordACLAccess={recordACLAccess}
            handleOnModuleChange={handleOnModuleChange}
          />
        ),
      }}
    />
  );
};
const QuickCreateHeader = memo(
  ({ selectedModule, recordACLAccess, handleOnModuleChange }) => {
    return (
      <FormControl>
        <RadioGroup
          row
          aria-label="position"
          name="position"
          value={selectedModule}
          onChange={handleOnModuleChange}
        >
          {Object.entries(moduleOptionList)?.map(
            ([optionKey, optionLabel]) =>
              recordACLAccess[optionKey]?.edit && (
                <FormControlLabel
                  value={optionKey}
                  control={<Radio color="primary" />}
                  label={optionLabel}
                />
              ),
          )}
        </RadioGroup>
      </FormControl>
    );
  },
);

export default EventQuickCreateDialog;
