import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from "@material-ui/core/styles";

export default makeStyles((theme) => ({}));


export const getMuiTheme = (theme) => {
    return createMuiTheme({
        ...theme,
        overrides: {
            MuiOutlinedInput: {
                input: {
                    // textAlign: 'right',
                },
            },

        },
    })
};