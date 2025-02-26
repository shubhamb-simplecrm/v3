import { makeStyles } from "@material-ui/styles";

export default makeStyles(() => ({
    selectedContainer: {
        flexWrap: "wrap",
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        border: 1,
        borderColor: "blue",
    },
    container: {
        flexWrap: "wrap",
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
    },
    text : {
        textAlign: "center", 
        alignSelf: "center"
    }
  }));