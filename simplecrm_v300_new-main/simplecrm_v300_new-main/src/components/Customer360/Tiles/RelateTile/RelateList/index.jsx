import React, { useState } from 'react';
import { MuiThemeProvider } from "@material-ui/core/styles";
import useStyles,{getMuiTheme} from "./styles";
import {
  Grid,
  Typography,
  ListItemText,
  ListItem,
  List,
  Divider,
  useTheme,
  IconButton
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {textEllipsis} from '../../../../../common/utils';
import  ShowEventDetail  from '../../../../Calendar/components/ShowEventDetail';


export default function RelateList({ data = [],module,related_back_module_name }) {
  const classes = useStyles();
  const currentTheme = useTheme();
  const [showDialogOpen, setShowDialogOpen] = useState({
    open: false,
    id: null,
    module: null,
    moduleLabel:null

  });

  const showDetail = (newId,newModule) => {
    setShowDialogOpen({open:true,id:newId,module:newModule,label:module})
  };
  const showList = (item) => {
    let itemData = item;
    let firstItem = Object.keys(itemData)[2];

    return <>  
        
    <ListItem alignItems="flex-start">
      <ListItemText
        primary={<><span onClick={(e)=>showDetail(itemData['id'],related_back_module_name)} title={itemData[firstItem]} className={classes.link}>
          {itemData[firstItem] && textEllipsis(itemData[firstItem],40)}
        </span><IconButton className={classes.previewButton} aria-label="preview" size="small" onClick={(e)=>showDetail(itemData['id'],related_back_module_name)}  >
  <VisibilityIcon />
</IconButton></>}
        secondary={
          Object.keys(itemData).map((field,fieldIndex) => (
            fieldIndex>2 && fieldIndex<4?
            <>
              <Grid container
                direction="row"
                justifyContent="center"
                alignItems="left"
              >
                <Grid item xs={3}>
                  <Typography variant="subtitle2" className={classes.label} title={field}>
                    {field && textEllipsis(field,25)}
                    </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                    title={itemData[field]}
                  >
                    : {itemData[field] && textEllipsis(itemData[field],40)}
                  </Typography>

                </Grid>
              </Grid>

            </>:null
          ))


        }
      />
    </ListItem>
      <Divider component="li" /></>

  }
  return (
    <MuiThemeProvider theme={getMuiTheme(currentTheme)}>   
    <List className={classes.root}>
      {data && Object.keys(data).map((item) =>
        data[item] ? showList(data[item]) : null
      )}
    </List>
     {showDialogOpen.open ? <ShowEventDetail showDialogOpen={showDialogOpen} setShowDialogOpen={setShowDialogOpen} size="md"/> : null}
    </MuiThemeProvider>
  );
}