import { useSelector } from "react-redux";
import DateUtils from "../common/date-utils";
import EnvUtils from "../common/env-utils";
import { pathOr, isEmpty, isNil } from "ramda";
import packageInfo from "../../package.json" assert { type: "json" };
const DEFAULT_VALUES = {
  dateFormat: "d-m-Y",
  timeFormat: "h:ia",
  dateRegFormat: "([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})",
  dateRegPositions: { Y: 1, m: 2, d: 3 },
  microsoft365Configuration: {
    clientID: null,
    clientSecret: null,
    tenantID: null,
    authorizationEndpoint: null,
    redirectURL: null,
    tokenEndpoint: null,
    apiEndpoint: null,
    scopes: null,
    subscriptions: null,
  },
  listViewRowPerPage: 20,
  statusFieldBackgroundMetaData: {},
  userPrefCurrencyId: null,
  userPrefCurrencyRecords: [],
  defaultSystemCurrencySymbol: "₹",
  siteUrl: EnvUtils.getValue("REACT_APP_BASE_URL"),
  allowMergeModulesList: ["Contacts", "Accounts", "Leads", "Opportunities"],
  maxMassUpdateLimit: 20,
  maxMassDeleteLimit: 20,
  maxMergeRecordLimit: 5,
  allowC360ModulesList: [],
  navbarOptions: {},
  userRoles: [],
  isListViewTableFixed: false,
  isMicrosoftLoginSync: false,
  isSubPanelCountEnable: true,
  currentProjectVersion: packageInfo.version,
  docsSiteURL: EnvUtils.getValue("REACT_APP_DOCS_BASE_URL"),
  docsOpeningVisible: false,
  isCopyPasteContentAllow: true,
  passwordValidation: {},
  enableAttachmentButtonModules: ["Cases"],
  currentActiveTheme: "",
  maxUploadLimit: "",
  minUploadLimit: 0,
  maxAllowEmailEditView: 5,
  currentUserData: {},
  defaultCurrency: {
    id: "-99",
    conversion_rate: 1,
    iso4217: "INR",
    name: "Indian Rupee",
    significant_digits: 2,
    symbol: "₹",
  },
  idleSessionTimeout: EnvUtils.getValue("REACT_APP_ALLOW_IDLE_TIME"),
  idleSessionPopupShowTime: EnvUtils.getValue(
    "REACT_APP_ALLOW_IDLE_POPUP_TIME",
  ),
  dashletViewRowPerPage: 20,
  nativeDeviceSettings: {
    isCopyPasteContentEnabled: true,
    isScreenCaptureEnabled: true,
    isLocationLatLongMandatory: false,
    allowLocationLatLongCaptureModule: [],
  },
  salesCoachConfig: {},
};

const getDefaultValue = (inputValue, defaultValue = null) => {
  if (typeof inputValue == "boolean") return inputValue;
  if (isNil(inputValue) || isEmpty(inputValue)) {
    if (!isNil(defaultValue)) return defaultValue;
  }
  return inputValue;
};

const useCommonUtils = () => {
  const defaultDateFormat = getDefaultValue(
    useSelector((state) => state?.config?.config?.default_date_format),
    DEFAULT_VALUES?.dateFormat,
  );

  const defaultTimeFormat = getDefaultValue(
    useSelector((state) => state?.config?.config?.default_time_format),
    DEFAULT_VALUES?.timeFormat,
  );

  const dateFormat = getDefaultValue(
    useSelector(
      (state) => state?.config?.userPreference?.attributes?.global?.datef,
    ),
    defaultDateFormat,
  );

  const timeFormat = getDefaultValue(
    useSelector(
      (state) => state?.config?.userPreference?.attributes?.global?.timef,
    ),
    defaultTimeFormat,
  );
  const dateRegFormat = getDefaultValue(
    useSelector(
      (state) =>
        state?.config?.userPreference?.attributes?.global?.date_reg_format,
    ),
    DEFAULT_VALUES?.dateRegFormat,
  );
  const dateRegPositions = getDefaultValue(
    useSelector(
      (state) =>
        state?.config?.userPreference?.attributes?.global?.date_reg_positions,
    ),
    DEFAULT_VALUES?.dateRegPositions,
  );
  const isMicrosoftLoginSync = getDefaultValue(
    useSelector(
      (state) =>
        state?.config?.currentUserData?.data?.attributes
          ?.microsoft_calendar_sync,
    ),
    DEFAULT_VALUES?.isMicrosoftLoginSync,
  );
  const microsoft365Configuration = getDefaultValue(
    useSelector((state) => state?.config?.config?.MS365Configuration),
    DEFAULT_VALUES?.microsoft365Configuration,
  );
  const userRoles = getDefaultValue(
    useSelector((state) => state?.config?.config?.aclroles),
    DEFAULT_VALUES?.userRoles,
  );

  const listViewRowPerPage = getDefaultValue(
    useSelector((state) => state?.config?.config?.list_max_entries_per_page),
    DEFAULT_VALUES?.listViewRowPerPage,
  );

  const subpanelListViewRowPerPage = getDefaultValue(
    useSelector(
      (state) => state?.config?.config?.list_max_entries_per_subpanel,
    ),
    DEFAULT_VALUES?.listViewRowPerPage,
  );

  const statusFieldBackgroundMetaData = getDefaultValue(
    useSelector((state) => state?.config?.config?.fields_background),
    DEFAULT_VALUES?.statusFieldBackgroundMetaData,
  );

  const userPrefCurrencyId = getDefaultValue(
    useSelector(
      (state) => state?.config?.userPreference?.attributes?.global?.currency,
    ),
    DEFAULT_VALUES?.userPrefCurrencyId,
  );
  const userPrefCurrencyRecords = getDefaultValue(
    useSelector(
      (state) => state?.config?.userPreference?.attributes?.CurrenciesRecords,
    ),
    DEFAULT_VALUES?.userPrefCurrencyRecords,
  );
  const defaultCurrency = getDefaultValue(
    {
      id: "-99",
      conversion_rate: 1,
      name: useSelector(
        (state) => state?.config?.config?.default_currency_name,
      ),
      iso4217: useSelector(
        (state) => state?.config?.config?.default_currency_iso4217,
      ),
      significant_digits: useSelector(
        (state) => state?.config?.config?.default_currency_significant_digits,
      ),
      symbol: useSelector(
        (state) => state?.config?.config?.default_currency_symbol,
      ),
    },
    DEFAULT_VALUES?.defaultCurrency,
  );

  const defaultSystemCurrencySymbol = getDefaultValue(
    useSelector((state) => state?.config?.config?.default_currency_symbol),
    DEFAULT_VALUES?.defaultSystemCurrencySymbol,
  );
  const siteUrl = getDefaultValue(
    useSelector((state) => state?.config?.config?.site_url),
    DEFAULT_VALUES?.siteUrl,
  );
  const allowMergeModulesList = getDefaultValue(
    useSelector((state) => state?.config?.config?.allowMergeModulesList),
    DEFAULT_VALUES?.allowMergeModulesList,
  );
  const maxMassUpdateLimit = getDefaultValue(
    useSelector((state) => state?.config?.config?.maxMassUpdateLimit),
    DEFAULT_VALUES?.maxMassUpdateLimit,
  );
  const maxMassDeleteLimit = getDefaultValue(
    useSelector((state) => state?.config?.config?.maxMassDeleteLimit),
    DEFAULT_VALUES?.maxMassDeleteLimit,
  );
  const maxMergeRecordLimit = getDefaultValue(
    useSelector((state) => state?.config?.config?.max_merge_records),
    DEFAULT_VALUES?.maxMergeRecordLimit,
  );
  const allowC360ModulesList = getDefaultValue(
    useSelector((state) => state?.config?.config?.c360Modules),
    DEFAULT_VALUES?.allowC360ModulesList,
  );

  const navbarOptions = getDefaultValue(
    useSelector((state) => state?.config?.config?.right_drawer_action_buttons),
    DEFAULT_VALUES?.navbarOptions,
  );
  const isListViewTableFixed = getDefaultValue(
    useSelector((state) => state?.config?.config?.isListViewTableFixed),
    DEFAULT_VALUES?.isListViewTableFixed,
  );

  const isSubPanelCountEnable = getDefaultValue(
    useSelector((state) => state?.config?.config?.subpanelCountEnable),
    DEFAULT_VALUES?.isSubPanelCountEnable,
  );
  const docsSiteURL = getDefaultValue(
    useSelector((state) => state?.config?.config?.docsSiteURL),
    DEFAULT_VALUES?.docsSiteURL,
  );
  const currentProjectVersion = getDefaultValue(
    useSelector((state) => state?.config?.config?.SIMPLECRM_VERSION),
    DEFAULT_VALUES?.currentProjectVersion,
  );
  const docsOpeningVisible = getDefaultValue(
    useSelector((state) => state?.config?.config?.docsOpeningVisible),
    DEFAULT_VALUES?.docsOpeningVisible,
  );
  const isCopyPasteContentAllow = getDefaultValue(
    useSelector((state) => state?.config?.config?.isCopyPasteContentAllow),
    DEFAULT_VALUES?.isCopyPasteContentAllow,
  );
  const passwordValidation = getDefaultValue(
    useSelector((state) => state?.config?.config?.passwordValidation),
    DEFAULT_VALUES?.passwordValidation,
  );
  const enableAttachmentButtonModules = getDefaultValue(
    useSelector((state) => state?.config?.config?.enable_attachment_button),
    DEFAULT_VALUES?.enableAttachmentButtonModules,
  );
  const currentActiveTheme = getDefaultValue(
    useSelector((state) => state?.config?.config?.V3SelectedTheme),
    DEFAULT_VALUES?.currentActiveTheme,
  );
  const maxUploadLimit = getDefaultValue(
    useSelector((state) => state?.config?.config?.upload_maxsize),
    DEFAULT_VALUES?.maxUploadLimit,
  );
  const minUploadLimit = getDefaultValue(
    useSelector((state) => state?.config?.config?.upload_minsize),
    DEFAULT_VALUES?.minUploadLimit,
  );
  const maxFileUploadLimit = 5;
  const maxAllowEmailEditView = getDefaultValue(
    useSelector(
      (state) => state?.config?.config?.max_allowed_email_address_edit_view,
    ),
    DEFAULT_VALUES?.maxAllowEmailEditView,
  );
  const currentUserData = getDefaultValue(
    useSelector((state) => state?.config?.currentUserData),
    DEFAULT_VALUES?.currentUserData,
  );
  const idleSessionTimeout = getDefaultValue(
    useSelector((state) => state?.config?.config?.IdleSessionTimeout),
    DEFAULT_VALUES?.idleSessionTimeout,
  );
  const idleSessionPopupShowTime = getDefaultValue(
    useSelector((state) => state?.config?.config?.IdleSessionPopupShowTime),
    DEFAULT_VALUES?.idleSessionPopupShowTime,
  );
  const dashletViewRowPerPage = getDefaultValue(
    useSelector((state) => state?.config?.config?.list_max_entries_per_dashlet),
    DEFAULT_VALUES?.dashletViewRowPerPage,
  );
  const nativeDeviceSettings = getDefaultValue(
    useSelector((state) => state?.config?.config?.nativeDeviceSettings),
    DEFAULT_VALUES?.nativeDeviceSettings,
  );
  const salesCoachConfig = getDefaultValue(
    useSelector((state) => state?.config?.config?.salesCoachConfig),
    DEFAULT_VALUES?.salesCoachConfig,
  );

  return {
    subpanelListViewRowPerPage,
    salesCoachConfig,
    nativeDeviceSettings,
    dashletViewRowPerPage,
    idleSessionTimeout,
    idleSessionPopupShowTime,
    currentUserData,
    dateFormat,
    timeFormat,
    isSubPanelCountEnable,
    isCopyPasteContentAllow,
    docsSiteURL,
    currentProjectVersion,
    docsOpeningVisible,
    passwordValidation,
    enableAttachmentButtonModules,
    currentActiveTheme,
    maxUploadLimit,
    minUploadLimit,
    maxFileUploadLimit,
    maxAllowEmailEditView,
    userPrefCurrencyRecords,
    defaultCurrency,
    get statusFieldBackgroundMetaData() {
      return statusFieldBackgroundMetaData;
    },
    siteUrl,
    getStatusFieldBackgroundColor(moduleName, fieldName) {
      const statusFieldMetaData = pathOr(
        {},
        [moduleName, fieldName],
        statusFieldBackgroundMetaData,
      );

      return statusFieldMetaData;
    },
    get getParseDateFormat() {
      return DateUtils.getDateFormat(dateFormat);
    },
    get getParseTimeFormat() {
      return DateUtils.getTimeFormat(timeFormat);
    },
    get getParseDateTimeFormat() {
      return `${DateUtils.getDateFormat(dateFormat)} ${DateUtils.getTimeFormat(
        timeFormat,
      )}`;
    },
    get getCurrentFormattedDate() {
      return DateUtils?.getCurrentDate(dateFormat);
    },
    get getCurrentFormattedTime() {
      return DateUtils?.getCurrentDate(timeFormat);
    },
    get getCurrentFormattedDateTime() {
      return DateUtils?.getCurrentDate(
        `${DateUtils.getDateFormat(dateFormat)} ${DateUtils.getTimeFormat(
          timeFormat,
        )}`,
      );
    },
    get microsoft365Configuration() {
      return microsoft365Configuration;
    },
    get isUserHaveCustomerPortalRole() {
      return (
        Array.isArray(userRoles) &&
        !isEmpty(
          userRoles.filter(
            (o) => o.id === "9ad526fb-e592-9f87-a475-61d3f1776bea",
          ),
        )
      );
    },
    get getListViewRowPerPage() {
      return listViewRowPerPage;
    },
    get getUserPrefCurrencySymbol() {
      let tempSymbol = defaultSystemCurrencySymbol;
      if (!Array.isArray(userPrefCurrencyRecords)) return tempSymbol;
      userPrefCurrencyRecords.forEach((item) => {
        if (item.id == userPrefCurrencyId) {
          tempSymbol = item?.symbol;
        }
      });
      return tempSymbol;
    },
    getCurrencySymbolById(currencyId) {
      if (!Array.isArray(userPrefCurrencyRecords)) return tempSymbol;
      userPrefCurrencyRecords.forEach((item) => {
        if (item.id == currencyId) {
          tempSymbol = item?.symbol;
        }
      });
      return tempSymbol;
    },
    get allowMergeModulesList() {
      return allowMergeModulesList;
    },
    get maxMassUpdateLimit() {
      return maxMassUpdateLimit;
    },
    get maxMassDeleteLimit() {
      return maxMassDeleteLimit;
    },
    get maxMergeRecordLimit() {
      return maxMergeRecordLimit;
    },
    get allowC360ModulesList() {
      return allowC360ModulesList;
    },
    get userRoles() {
      return userRoles;
    },
    get isListViewTableFixed() {
      return isListViewTableFixed;
    },
    get navbarOptions() {
      const commonNavbarOption = pathOr(
        [],
        ["commonNavbarOption"],
        navbarOptions,
      );
      const fixedNavbarOption = pathOr(
        {},
        ["fixedNavbarOption"],
        navbarOptions,
      );
      const mobileViewNavBarOpenerOption = pathOr(
        {},
        ["mobileViewNavBarOpenerOption"],
        navbarOptions,
      );
      const quickCreateNavBarOpenerOption = pathOr(
        {},
        ["quickCreateNavBarOpenerOption"],
        navbarOptions,
      );
      return {
        ...navbarOptions,
        get allNavbarOptions() {
          return [
            ...commonNavbarOption,
            ...Object.values(fixedNavbarOption),
            mobileViewNavBarOpenerOption,
            quickCreateNavBarOpenerOption,
          ];
        },
      };
    },
    get isMicrosoftLoginSync() {
      return isMicrosoftLoginSync == "1";
    },
  };
};
export default useCommonUtils;
