/* eslint-disable import/no-anonymous-default-export */
export default {
  suggestions: {
    list: {
      backgroundColor: "white",
      border: "1px solid rgba(0,0,0,0.15)",
      fontSize: "0.85rem",
      overFlow: "scroll"
    },
    item: {
      padding: "5px 10px",
      borderBottom: "1px solid rgba(0,0,0,0.15)",
      "&focused": {
        backgroundColor: "rgb(223,237,249)"
      }
    }
  }
};
