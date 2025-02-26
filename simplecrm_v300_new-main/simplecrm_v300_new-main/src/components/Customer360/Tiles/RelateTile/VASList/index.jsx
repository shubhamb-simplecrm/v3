import React from 'react'
import {
  useTheme,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
  Button,
} from '@material-ui/core'
import useStyles, { getMuiTheme } from './styles'
import { MuiThemeProvider } from '@material-ui/core/styles'
import PhoneIphoneOutlinedIcon from '@material-ui/icons/PhoneIphoneOutlined'
export default function VASList() {
  const classes = useStyles()
  const currentTheme = useTheme()
  const [checked, setChecked] = React.useState(['wifi'])
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }
    setChecked(newChecked)
  }
  let data = [
    {
      id:'1',
      name: 'Mobile Banking',
      datetext: '',
      icon: <PhoneIphoneOutlinedIcon />,
      status: true,
      button:true,
      buttontext:"SMS",
    },
    {
      id:'2',
      name: 'E-Banking',
      datetext: '12/01/2022',
      icon: <PhoneIphoneOutlinedIcon />,
      status: false,
      button:false,
      buttontext:"SMS",
    },
    {
      id:'3',
      name: 'Transaction Alerts',
      datetext: '12/01/2022',
      icon: <PhoneIphoneOutlinedIcon />,
      status: true,
      button:false,
      buttontext:"SMS",
    },
    {
      id:'4',
      name: 'Missed Call Alerts',
      datetext: '',
      icon: <PhoneIphoneOutlinedIcon />,
      status: true,
      button:false,
      buttontext:"SMS",
    },
    {
      id:'5',
      name: 'E-Statements',
      datetext: '12/01/2022',
      icon: <PhoneIphoneOutlinedIcon />,
      status: true,
      button:false,
      buttontext:"SMS",
    },
  ]
  return (
    <MuiThemeProvider theme={getMuiTheme(currentTheme)}>
      <List className={classes.root}>
        {data.map((item) => (
          <>
            <ListItem>
              <ListItemText id="switch-list-label-primary" primary={item.name} />
              <ListItemText id="switch-list-label-second" primary={item.datetext} />
              <ListItemSecondaryAction>
                
                {item.button ? 
                <Button variant="contained" size ='small'> {item.buttontext} </Button> : <Switch
                name = {item.id}
                edge="end"
                onChange={()=>handleToggle(item.id)}
                checked={item.status}
                inputProps={{ 'aria-labelledby': `switch-list-label-${item.name}` }}
              />}
              </ListItemSecondaryAction>
            </ListItem>
          </>
        ))}
      </List>
    </MuiThemeProvider>
  )
}
