import React from 'react'
import {
  useTheme,
  List,
  ListItem,
  ListItemText,
  Typography,
  Link,
} from '@material-ui/core'
import useStyles, { getMuiTheme } from './styles'
import { MuiThemeProvider } from '@material-ui/core/styles'
export default function Sms({data}) {
  const classes = useStyles()
  const currentTheme = useTheme()
  const preventDefault = (event) => event.preventDefault();
  return (
    <MuiThemeProvider theme={getMuiTheme(currentTheme)}>
      <List dense className={classes.root}>
        {data.related_module_fields && data.related_module_fields.map((item,index) => {
          return (
            <ListItem key={`ticket-${index}`}>
              <ListItemText
                id={`checkbox-list-secondary-label-${index}`}
                primary={
                  <React.Fragment>
                  <Typography component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary">
                    <Link href="#" onClick={preventDefault} variant="body2">
                      {item.name || ""}
                    </Link>
                  </Typography>
                  {` created on ${item.date_entered || ""}`}
                  </React.Fragment>
                }
                secondary={
                  <React.Fragment>
                    {item?.type}
                  </React.Fragment>
                }
              />
            </ListItem>
          )
        })}
      </List>
    </MuiThemeProvider>
  )
}
