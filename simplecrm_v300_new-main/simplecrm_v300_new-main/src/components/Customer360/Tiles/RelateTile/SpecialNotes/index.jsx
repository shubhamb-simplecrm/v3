import React from 'react'
import {
  useTheme,
  List,
  ListItemText,
  Typography,
} from '@material-ui/core'
import useStyles, { getMuiTheme } from './styles'
import { MuiThemeProvider } from '@material-ui/core/styles'
export default function SpecialNotes({data}) {
  const classes = useStyles()
  const currentTheme = useTheme()
  return (
    <MuiThemeProvider theme={getMuiTheme(currentTheme)}>
      <List dense className={classes.root}>
        {data.related_module_fields && data.related_module_fields.map((item,index) => {
          return (
              <ListItemText
                id={`checkbox-list-secondary-label-${index}`}
                primary={
                  <React.Fragment>
                  <Typography component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary">
                    {item.name || ""}
                  </Typography>
                  </React.Fragment>
                }
              />
          )
        })}
      </List>
    </MuiThemeProvider>
  )
}
