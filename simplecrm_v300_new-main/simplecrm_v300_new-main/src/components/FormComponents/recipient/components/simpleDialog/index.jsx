import {
  Avatar,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import { stringToColor } from "../../../../../common/utils";

function SimpleDialog(props) {
  const { onClose, valueArr, open } = props;
  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      PaperProps={{
        sx: {
          maxHeight: 500,
        },
      }}
      maxWidth={"md"}
    >
      <DialogTitle id="simple-dialog-title">{valueArr?.optionType}</DialogTitle>
      <List style={{ columnCount: 3 }}>
        {valueArr?.idsArr.map((v) => (
          <ListItem button key={v}>
            <ListItemAvatar>
              <Avatar
                style={{
                  backgroundColor: stringToColor(v?.name),
                }}
              >
                {v?.name.charAt(0).toUpperCase().trim()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={v?.name} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

export default SimpleDialog;
