import React, { memo, useState, useEffect, useRef } from "react";
import useStyles, { getMuiTheme } from "./styles";
import { pathOr } from "ramda";
import { useDispatch, useSelector } from "react-redux";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/styles";
import Customer360 from "@/components/Customer360";
import { useHistory } from "react-router-dom";
import { Alert as ConfirmBox } from "../";
import { getListView } from "../../store/actions/module.actions";
import { toast } from "react-toastify";
import { LBL_CTI_CUSTOMER_PHONE_NOT_FOUND } from "../../constant";
import LocalStorageUtils from "../../common/local-storage-utils";

const CTI = ({ open = true }) => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const dispatch = useDispatch();
  const cloudConnectConfig = useSelector(
    (state) => state.config?.cloudConnectConfig,
  );
  const [openCTI, setOpenCTI] = useState(open);
  /* WebScoket Connection START */
  const [customer360Id, setCustomer360Id] = useState(
    "34c61bf2-337f-701f-ec9e-6192364949da",
  );
  const [customerMobile, setCustomerMobile] = useState(null);
  const [openC360, setC360Open] = useState(false);
  const [alertVisible, setAlertVisibility] = useState(false);

  const checkPermissions = () => {
    const permissions = navigator.mediaDevices.getUserMedia({
      audio: true,
      camera: false,
    });
    permissions
      .then((stream) => {})
      .catch((err) => {
        console.log(`${err.name} : ${err.message}`);
      });
  };

  useEffect(() => {
    checkPermissions();
  }, [open]);

  useEffect(() => {
    if (
      cloudConnectConfig &&
      cloudConnectConfig.session_id &&
      cloudConnectConfig.session_id !== ""
    ) {
      setOpenCTI(true);
    } else {
      setOpenCTI(false);
    }
  }, [cloudConnectConfig]);

  useEffect(() => {
    socketCall();
  }, []);

  const socketCall = () => {
    // Create WebSocket connection.
    try {
      const socket = new WebSocket("wss://websocket.simplecrmdev.com/");
      socket.onopen = function (e) {};

      socket.onmessage = function (event) {
        let data = JSON.parse(event.data);
        setCustomerMobile(data && data.customer_no ? data.customer_no : null);
        if (data.customer_no) {
          setAlertVisibility(true);
          setOpenCTI(true);
        }
      };

      socket.onclose = function (event) {
        if (event.wasClean) {
          console.log(
            `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`,
          );
        } else {
          console.log("[close] Connection died");
        }
      };
      socket.onerror = function (error) {
        console.log(`[error] ${error}`);
      };
    } catch (e) {}
  };

  return (
    <div className={classes.ctiCont}>
      <MuiThemeProvider theme={getMuiTheme(theme)}>
        {open && (
          <div className={classes.ctiIframeCont}>
            <iframe
              allow="microphone"
              className={classes.ctiIframe}
              id="the-iframe"
              allowtransparency="true"
              title="CTI"
              src={`${cloudConnectConfig.iframe_url}&session=${cloudConnectConfig.session_id}`}
              width="650"
              height="106"
            />
          </div>
        )}
        {customer360Id && openC360 ? (
          <Customer360
            relData={customer360Id}
            open={openC360}
            setOpen={setC360Open}
            setCustomer360Id={setCustomer360Id}
          />
        ) : null}

        <ConfirmBox
          title="Redirecting to Customer record."
          msg="Do you want to redirect to calling customer's record?"
          open={alertVisible}
          agreeText={"Yes"}
          disagreeText={"No"}
          handleClose={() => setAlertVisibility(!alertVisible)}
          onAgree={() => {
            if (customerMobile) {
              LocalStorageUtils.setValue("CTI_mobile", customerMobile);
              if (
                pathOr("", ["location", "pathname"], history) ===
                "/app/Accounts"
              ) {
                dispatch(getListView("Accounts", 1, 25, "", ""));
              } else {
                history.push("/app/Accounts");
              }
            } else {
              toast(LBL_CTI_CUSTOMER_PHONE_NOT_FOUND);
            }
          }}
        />
      </MuiThemeProvider>
    </div>
  );
};
export default memo(CTI);
