import tinycolor from "tinycolor2";

const primary = "#0071d2";
const secondary = "#121a36";
const warning = "#FFC260";
const success = "#3CD4A0";
const info = "#9013FE";
const menumobilelight = "#fafafa";
const listview = "#ffffff";

const lightenRate = 7.5;
const darkenRate = 15;

export default {
  palette: {
    primary: {
      main: primary,
      light: tinycolor(primary).lighten(lightenRate).toHexString(),
      dark: tinycolor(primary).darken(darkenRate).toHexString(),
      menumobile: menumobilelight,
      listview: listview,
    },
    secondary: {
      main: secondary,
      light: tinycolor(secondary).lighten(lightenRate).toHexString(),
      dark: tinycolor(secondary).darken(darkenRate).toHexString(),
      contrastText: "#FFFFFF",
    },
    activityStream: {
      link: "#0071d2",
      comment: {
        username: "grey",
        color: "rgb(92,92,92)",
        background1: "rgba(243,243,249,1)",
        background2: "rgba(238, 237, 237, 0.4)",
      }
    },
    studio: {
      defaultColumns: {
        color: "green",
        bgColor: "#0080000d",
      },
      availableColumns: {
        color: "#E88A00",
        bgColor: "#e88a000a",
      },
      hiddenColumns: {
        color: "#DE3D31",
        bgColor: "#de3d310a",
      },
    },
    warning: {
      main: warning,
      light: tinycolor(warning).lighten(lightenRate).toHexString(),
      dark: tinycolor(warning).darken(darkenRate).toHexString(),
    },
    success: {
      main: success,
      light: tinycolor(success).lighten(lightenRate).toHexString(),
      dark: tinycolor(success).darken(darkenRate).toHexString(),
    },
    info: {
      main: info,
      light: tinycolor(info).lighten(lightenRate).toHexString(),
      dark: tinycolor(info).darken(darkenRate).toHexString(),
    },
    text: {
      primary: "#121a36",
      secondary: "#6E6E6E",
      hint: "#B9B9B9",
      highlight: "#0071d2",
    },
    icon: {
      color:"#121a36",
      defaultColor:"rgb(171,171,171)",
    },
    background: {
      default: "#fafafa",
      paper: "#FFFFFF",
      linkActive: '#0071d2',
      sidebar: "#131A34",
      linkActiveBg: '#cccccc29',
      listView:"#cccccc26",
      border: "#dedede",
      wrapbg: "#dedede",
    },
    compEmailBack: {
      default: "#131A34",
    },
    label:{
      listView:{
        color:"#828282"
      },
      detailView:{
        color:"#828282",
      }
    },
    
  },
  appbar: {
    background: "#121a36",
    text: "#ffffff",
    logoBgColor:'#e9e8e8'
  },
  rightBarButtons: {
    background: primary,
    text: "#ffffff",
  },
  rightBarButtonsActive: {
    background: secondary,
    text: "#ffffff",
  },
  dashletHeader: {
    background: "unset",
    text: "unset",
  },
  overlayBg: {
    background: 'rgb(255 255 255 / 48%)',
  },
  grey: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "rgba(66,66,66,1)",
    900: "#212121",
    A100: "#d5d5d5",
    A200: "#aaaaaa",
    A400: "#303030",
    A700: "#616161",
  },
  brdrWidth: 4,
  padng: 0,
  rightBrdr: "-15px",
  tdTop: 2,
  overrides: {
    
    MuiButton: {
      containedPrimary: {
        color: '#ffffff !important'

      }
    },
    MuiListItem: {
      root: {
        "&$selected": {
          backgroundColor: "#d6d9e6 !important",
          "&:focus": {
            backgroundColor: "#d6d9e6",
          },
        },
      },
      button: {
        "&:hover, &:focus": {
          backgroundColor: "#d6d9e6",
        },
      },
    },
    MuiTouchRipple: {
      child: {
        backgroundColor: "white",
      },
    },
    MuiTableRow: {
      root: {
        height: 56,
      },
    },
    MuiTableCell: {
      root: {
        borderBottom: "1px solid rgba(224, 224, 224, .5)",
      },
      head: {
        fontSize: "0.95rem",
      },
      body: {
        fontSize: "0.95rem",
      },
    },

    /* Custom Tab css by Ritesh */
    MuiTabScrollButton: {
      root: {
        '&$disabled': {
          opacity: 1
        },
      },
    },
    MuiTabs: {
      flexContainer: {
        borderBottom: "1px solid #ccc",
        // display:"inline",
        // padding:15
      },
    },
    MuiCardHeader: {
      action: {
        marginRight: "2px",
      },
    },
    MuiTab: {

      root: {
        minHeight: "0px",
        padding: "10px 15px",
        // eslint-disable-next-line no-useless-computed-key
        ["@media (min-width: 600px)"]: {
          minWidth: "0px",
        },
      },
      wrapper: {
        display: `inline-block`,
        textTransform: "capitalize"
      },
      textColorInherit: {
        "&$selected": {
          color: primary,
          borderBottom: "3px solid " + primary,
        },
      },
    },
    PrivateTabIndicator: {
      root: {
        height: 0
      }
    },
    MuiAccordionSummary: {
      root: {
        "&$expanded": {
          margin: "0 !important",
          minHeight: "100% !important",
        },
        "&$selected": {
          color: "#536dfe",
        },
      },
      content: {
        "&$expanded": {
          margin: "0 !important",
          minHeight: "100% !important",
        },
      }
    },
    MuiAccordion: {
      rounded: {
        "&:first-child": {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0
        },
        "&$expanded": {
          border: "1px solid #cccccc43"
        },
      },
      "&$expanded": {
        border: "1px solid #cccccc43"
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: 0
      },
      elevation1: {
        boxShadow: "none"
      },
      elevation4: {
        boxShadow: "none"
      }
    },
    MuiOutlinedInput: {
      input: {
        padding: "11px 14px"
      }
    },
    
  },
  bolBhaiGPT: {
    palette: {
      defaultColor: "#121a36",
      loadingSectionColor: "#00000061",
      userMessageBackground: "rgb(0 113 210)"
    }
  }
};
