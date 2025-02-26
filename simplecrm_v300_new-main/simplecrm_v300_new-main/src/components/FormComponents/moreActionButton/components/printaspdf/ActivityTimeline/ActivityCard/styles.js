import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  test: {
    color: "blue",
    backgorund: "black",
  },
  seperatorContainer: {},
  timelineContent: {
    padding: "0",
  },
  mainTimelineContainer: {
    flexDirection: "row",
    margin: "0px",
    marginTop:"10px",
    padding: "0px",
  },
  headerContainer: {
    display: "flex",
    padding: "10px",
    flexWrap: "wrap",
    alignItems:"center",
    width:"80%",
  },
  subjectContainer: {
    marginRight: "10px",
    fontSize: "1rem",
    color: "#0071d2",
  },
  assignedUserContainer: {
    marginRight: "10px",
    background: "#0071d220",
  },
  statusContainer: {
    marginRight: "10px",
    color: "#054616",
    backgroundColor: "#c3e8b6"
  },
  dateContainer: {
    marginRight: "10px",
    background: "#f8f8f8",
  },
  descriptionContainer: {
    padding: "0px 30px 0px 30px ",
    position:"relative",
    boxShadow:'none',
    fontSize:"0.875rem"
  },
  moduleIconContainer: {
    background: "#0071d2",
    boxShadow: "none",
    marginRight: "10px",
    padding:"6px"
  },
  activityCardContainer :{
    padding:" 0px 20px 20px 0px" 
  },
  specialStatusContainer :{
    display:"none"
  },
  nullUserChip :{
    display:"none"
  }
}));

export default useStyles;
