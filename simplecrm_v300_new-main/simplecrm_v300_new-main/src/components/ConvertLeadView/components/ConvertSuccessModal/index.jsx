import React from "react";
import {Grow,Link ,Avatar,CardHeader,CardActions,Card,Modal,Paper,Typography,Grid,useTheme} from "@material-ui/core";
import { Close} from "@material-ui/icons";
import { pathOr} from "ramda";
import { Scrollbars } from 'react-custom-scrollbars';
import { useSelector } from 'react-redux';
import useStyles from "./styles";
import {FaIcon} from "../../../";

const ConvertSuccessModal = ({title,data, modalVisible,toggleModalVisibility}) => {
  const classes = useStyles();
  const theme = useTheme();
  const { sidebarLinks } = useSelector((state) => state.layout);
  const getModuleIcon = (module)=>{
    let icon = pathOr(null,["attributes",module,"icon","icon"],sidebarLinks);
    return <FaIcon icon={`fas ${icon ? icon : "fas fa-cube"}`} size="1x" />;
  }
  
  const dataArr = pathOr([],['createdRecords'],data);
  
  const renderBody = () => {
    return (
      <Paper square className={classes.paper}>
        <Scrollbars autoHide={true}>
          <div className={classes.titleHeadWrapper}>
            <Typography variant="h6" style={{ fontWeight: "500", color: theme.palette.text.primary }}>
              {title}
            </Typography>
            <Close
              onClick={() => toggleModalVisibility(modalVisible)}
              className={classes.closeIcon}
            />
          </div>
           <Grid container spacing={3} style={{padding:'2rem'}}>
             {dataArr.map((record,key)=>{
               return (<>
               <Grow in={true} timeout={1000}>
                <Grid item xs={12} sm={6}>
                    <Link href={`/app/detailview/${record.module}/${record.id}`} underline="none">
                    <Card className={[classes.root, classes.card]}>
                      <CardHeader
                      avatar={<Avatar aria-label="recipe" className={classes.avatar}>{getModuleIcon(record.module)}</Avatar>}
                      subheader={record.name}
                      title={record.module}
                      />
                      <CardActions>
                      </CardActions> 
                    </Card>
                    </Link>
                </Grid>
                </Grow>
               </>);
             })}
      </Grid>
        </Scrollbars>
      </Paper>
    );
  };
  return (
    <>
      <Modal
        disableBackdropClick
        open={modalVisible}
        onClose={() => toggleModalVisibility(!modalVisible)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {renderBody()}
      </Modal>
    </>
  );
};

export default ConvertSuccessModal;
