import { createMuiTheme } from "@material-ui/core/styles";

export const getMuiTheme = (theme) => {
    return createMuiTheme({
        ...theme,
        overrides: {
            MuiOutlinedInput: {
                root: {
                    padding: "2.5px 3px !important"
                },
            },
            MuiInputLabel:{
                outlined:{
                    transform: "translate(14px, 14px) scale(1)"
                }
            }
        }
    });
}
