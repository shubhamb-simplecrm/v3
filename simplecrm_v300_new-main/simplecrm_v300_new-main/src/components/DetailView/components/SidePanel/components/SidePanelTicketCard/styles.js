import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => {
  return {
    root:{
      display: "flex",
      alignItems:"center"
    },
    cardContainer: {
      padding: "6px 3px 6px 10px",
      borderBottom: "1px solid #ececec",
      height:"60px",
      "&:hover": {
        background: "#fafafa",
      },
    },
    expandCardContainer: {
      padding: "6px 3px 6px 10px",
      borderBottom: "1px solid #ececec",
      height:"120px",
      "&:hover": {
        background: "#fafafa",
      },
    },
    
    headerContainer: {
      display: "flex",
      color: "#0071d2",
      alignItems: "top",
      marginBottom: "2px",
    },
    subject: {
      fontSize: "1rem",
      width: "95%",
    },
    barIcon: {
      marginRight: "5px",
    },
    activityStatusContainer: {
      borderRadius: "4px",
      fontSize: "0.875rem",
      color: "#267e3d",
      background: "#dfece3",
      height:"20px",
      marginTop:"10px",
      marginBottom:"10px",
    },
    expandIcon: {
      color: "#6e6e6e",
      cursor: "pointer",
    },
    description: {
      color: "black",
      fontSize: "0.8rem",
      cursor: "pointer",
      textOverflow: "ellipsis",
      overflow: "hidden",
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      padding: "1px",
      transition: "height 0.3s ease-in-out",
      background: "#fafafa",
      marginLeft:"5px",
    },
    title: {
      color: "#0071d2",
      cursor: "pointer",
      textOverflow: "ellipsis",
      overflow: "hidden",
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      marginLeft:"5px",
      // marginTop:"8px",
      fontSize:"0.875rem"
    },
  };
});
