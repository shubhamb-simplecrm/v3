import React from 'react'
import {
  useTheme,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  IconButton,
  Collapse,
} from '@material-ui/core'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import useStyles, { getMuiTheme } from './styles'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { clone } from 'ramda'
export default function ProductList() {
  const classes = useStyles()
  const currentTheme = useTheme()
  const [open, setOpen] = React.useState([])
  const handleCollapse = (item) => {
    let data = clone(open)
    if (!data.includes(item)) {
      data = [...open, item]
    } else {
      data = data.filter((openItem) => openItem !== item)
    }
    setOpen(data)
  }
  let data = [
    {
      name: 'Accounts',
      count: 4,
      data: [
        {
          label: 'Balance',
          value: '2,00,000',
        },
        {
          label: 'Balance',
          value: '2,00,000',
        },
      ],
    },
    {
      name: 'Credit Cards',
      count: 2,
      data: [
        {
          label: 'Balance',
          value: '2,00,000',
        },
        {
          label: 'Balance',
          value: '2,00,000',
        },
      ],
    },
    {
      name: 'Term Deposits',
      count: 2,
      data: [
        {
          label: 'Balance',
          value: '2,00,000',
        },
        {
          label: 'Balance',
          value: '2,00,000',
        },
      ],
    },
    {
      name: 'Lending',
      count: 1,
      data: [
        {
          label: 'Balance',
          value: '2,00,000',
        },
        {
          label: 'Balance',
          value: '2,00,000',
        },
      ],
    },
    {
      name: 'Leasing',
      count: 3,
      data: [
        {
          label: 'Balance',
          value: '2,00,000',
        },
        {
          label: 'Balance',
          value: '2,00,000',
        },
      ],
    },
  ]
  return (
    <MuiThemeProvider theme={getMuiTheme(currentTheme)}>
      <List dense className={classes.root}>
        {data.map((item, index) => {
          return (
            <>
              <ListItem
                key={`item-${index}`}
                onClick={() => handleCollapse(index)}
                className={classes.listItem}
                selected={open.includes(index)}
              >
                <ListItemAvatar>
                  <Avatar>{item.count}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  id={`checkbox-list-secondary-label-${index}`}
                  primary={<Typography>{item.name}</Typography>}
                />

                <IconButton disableRipple disableFocusRipple size="small">
                  {open.includes(index) ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </ListItem>
              <Collapse in={open.includes(index)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.data.map((detail) => (
                    <ListItem button className={classes.nestedListItem}>
                      <ListItemText
                        primary={detail.label}
                        className={classes.label}
                      />
                      <ListItemSecondaryAction className={classes.value}>
                        {detail.value}
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </>
          )
        })}
      </List>
    </MuiThemeProvider>
  )
}
