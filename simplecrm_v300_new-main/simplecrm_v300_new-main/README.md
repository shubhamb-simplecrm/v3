
# V3.2.4

## Major Enhancements

### 📧 Email Compose UI/UX Enhancements
Redesigned the Email Compose interface for improved usability, added draft-saving functionality with easy editing, and introduced advanced search capabilities across email fields and CRM modules to enhance productivity.

### ⚙️ Separate Field Configuration for Create and Edit Views
  The Field Configurator now allows users to apply validations and settings specifically to the **Create View** and **Edit View** independently or to both combined. Previously, configurations were universally applied to both views.
  
---
**Important: Migration for Older Versions (< 3.2.4)**: 
  1. **Backup**: Save `custom/fieldConfiguration`.  
  2. **Run Script**: Execute `<v267domain.com>/update_FC_for_editview.php` after upgrade.  
  3. **Test**: Ensure all field configurations work properly.  
  4. **Clean Up**: Delete the script file after testing.
---

### 🚀 System Performance Enhancements

Significant performance improvements were achieved by optimizing queries, refining ACL checks, streamlining custom logic hooks, and enhancing ListView, subpanel, and BPM processes. These enhancements result in faster data loading, improved API performance, and overall system efficiency.

### 🔐 Refresh Access Token Session Feature  
Introduced seamless token refresh functionality to automatically regenerate access tokens upon expiration, ensuring uninterrupted user sessions. Enhanced API error handling improves system reliability and responsiveness, minimizing disruptions due to token expirations or network issues.

<table>
  <colgroup>
    <col style={{ width: '20%' }} />
    <col style={{ width: '40%' }} />
    <col style={{ width: '40%' }} />
  </colgroup>
  <tr>
    <td> <strong>Feature</strong> </td>
    <td> <strong>Access Token</strong> </td>
    <td> <strong>Refresh Token</strong> </td>
  </tr>
  <tr>
    <td><strong>What it is</strong></td>
    <td>A short-lived token used to prove your identity and allow access to specific app features or data.</td>
    <td>A long-lived token used to request new access tokens when the current one expires.</td>
  </tr>
  <tr>
    <td><strong>How long it lasts</strong></td>
    <td>
    <ul>
    <li> Valid for <strong>8 hours</strong> by default, but this duration can be configured as needed. </li>
    <li> For overriding the default expiration time : 
    [$sugar_config['access_token_expires_interval']](../developer-guide/config_override.md)</li>
    </ul>
   </td>
    <td>
     <ul>
    <li> Valid for <strong>1 month</strong> by default, but this duration can be configured as needed. </li>
    <li> For overriding the default expiration: 
    [$sugar_config['refresh_token_expires_interval']](../developer-guide/config_override.md)</li>
    </ul>
    </td>
  </tr>
  <tr>
    <td><strong>How it's used</strong></td>
    <td>Sent with every API request to authenticate and access protected resources (like fetching or updating data).</td>
    <td>Used to generate a new access token when the current one expires, keeping the session active.</td>
  </tr>
  <tr>
    <td>**Why we need both**</td>
    <td>Short lifespan improves security, as stolen tokens can only be used for a limited time. Reduces risks of long-term exposure.</td>
    <td>Keeps your session active without requiring frequent logins. Adds a layer of security by not exposing login credentials repeatedly.</td>
  </tr>
</table>

To gain a deeper understanding of **Access Tokens** and **Refresh Tokens**, you can refer to this insightful article: [What is Access Tokens and Refresh Tokens?](https://crm-documentation.simplecrmondemand.com/docs/technical-blogs/access-refresh-tokens-intro).

## Frontend

### Enhancements

- **Studio V3 Interface Updated for Tablet Responsiveness** The Studio V3 interface has been updated to ensure optimal responsiveness across tablet devices. These enhancements focus on providing a more seamless user experience by adjusting layouts, elements, and component behaviors for medium-sized screens such as tablets. [#PR 1628](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1628)
- **Comprehensive System and UI Updates: Field Configurator Changes, Mobile View Improvements, Automation Support, Email Validation, and Miscellaneous Bug Fixes Across List Views, Pagination, Masking, and Field Type Handling**

  - Settings & Field Configurator: Fixed issues with settings and fields, making them easier to manage.
  - Mobile View: Added a checkbox to select all items on mobile.
  - Automation: Improved testing by adding helpful identifiers in activity cards.
  - Emails: Improved email validation and fixed issues with displaying certain fields when composing emails.
  - Field Types: Fixed errors with number fields, ensuring they only accept valid input.
  - General Fixes: Resolved problems with pagination, loading indicators, and displaying HTML content correctly in lists.
  - Masking & Validation: Fixed errors with hiding sensitive data and validating fields.
  - Phone Calls: Added a feature to make calls directly from phone numbers in records.
    [#PR 1587](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1587)

- **Upgrade Zustand from v4 to v5 and Address Breaking Changes** Implementing necessary adjustments to accommodate the breaking changes introduced in the new version. All relevant modifications have been successfully made to ensure compatibility and maintain functionality throughout the application. This migration enhances the overall performance and reliability of the state management system. [#PR 1630](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1630)

### Bug Fixes

- **Removed the Unwanted space below the Subpanel in Detail View** The height of the TabPanel components was fixed to ensure the Subpanel remains within the layout, with scrolling added when the content exceeds the layout's limits. [#PR 1623](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1623)

- **Fixed Issue Where Selecting a KB Record in Cases Module Didn't Update the Resolution Field** The configuration has been updated in the Cases module to ensure that when a Knowledge Base (KB) record is selected in the "Name" field, the resolution field is now automatically filled with the corresponding KB record's resolution. [#PR 1627](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1627)

- **Fixed Iframe Dashlet URL Updating and Improve Loading Behavior** This update fixes the iframe dashlet to correctly update the URL after changes. It also adds a loading screen during content loading and an error screen for failed URL loads, enhancing user experience by providing clear feedback during these processes. [#PR 1618](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1618)

- **Fixed Cross-Tab Idle Timeout Issue** This update addresses the issue where idle logout was not functioning correctly across multiple tabs. Now, when one tab logs out due to inactivity, all other tabs will also log out. This is achieved by adding the 'syncTimers' key in the idle session hook to ensure consistent session management. [#PR 1610](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1610)

- **Fixed SAML Login Screen Errors and UI Issues** This update resolves issues with the SAML login screen in the CRM, ensuring that errors are now displayed correctly. It also addresses and fixes various UI problems to enhance the overall user experience. [#PR 1611](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1611)

- **Fixed Admin Iframe Crash** This update addresses the issue causing the admin iframe page to crash upon opening. The problem has been resolved by defining the "siteUrl," ensuring the iframe loads correctly without errors. [#PR 1619](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1619)

- **Fix PDF Preview Rendering Issue** This update fixes the bug of PDF pages rendering twice in the `@cyntler/react-doc-viewer` dialog box. The issue was resolved by upgrading the library and importing `TextLayer.css` and `AnnotationLayer.css` from `react-pdf`. See the code for details. [#PR 1622](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1622)

- **Updated Attachment Dialog to Display Files Across All Modules** This update resolves the issue where the attachment dialog failed to show previously attached files in all modules due to an incorrect relationship name in the API. The relationship name is now dynamically retrieved from the API, eliminating the need for hardcoding. [#PR 1597](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1597)

- **Activity Stream Improvements: Loading and Scrolling Issues Resolved** This update addresses two key issues in the Activity Stream:

  - On initial load, the "My Groups" section now properly displays records without an empty state before the data is fully loaded.
  - The blank page issue that occurred after scrolling twice in the "My Groups" section has been fixed, ensuring a seamless scrolling experience. [#PR 1431](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1431)

- **Enhancements to Activities Module: User Data, Form Management, and Duration Display Resolved**

  - The activities module's close action from the dashlet now correctly passes assigned user data.
  - Form values are now managed correctly, resolving previous inconsistencies.
  - The duration field value is now properly displayed in both the detail view and edit view. [#PR 1449](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1449)

- **Enhancements to Filter and Saved Search Functionalities** Improvements have been made to the Filter and Saved Search features, addressing multiple existing issues. Logic adjustments were implemented to ensure these functionalities work correctly, enhancing overall user experience. [#PR 1629](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1629)

- **Baseline Bug Fixes and Improvements** This update addresses baseline issues to enhance functionality and user experience. Key improvements include removing unnecessary instances from the .env-cmdrc file, updating packages, disabling autocomplete on the password field for security, fixing HTML tag display in the description field, and enhancing relate field search with "rname" for broader field coverage. [#PR 1650](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1650)

- **Enhanced Frontend Error Handling for Form Submissions** This update improves form submission error management by handling server-side errors on the frontend. Necessary changes have been added to ensure that users are promptly informed of any issues during form submission, enhancing overall user experience and reliability. [#PR 1652](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1652)

- **Add Client ID, Secret, and User Details Storage in Local Storage** This update enables storage of client ID, secret, and user details in local storage, making these values accessible for the mobile webview. These changes facilitate smoother authentication and session management on mobile, improving user experience and functionality. [#PR 1653](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1653)

### What's Changed

- Removed the Unwanted space below the Subpanel in Detail View [#PR 1623](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1623)
- Studio V3 Interface Updated for Tablet Responsiveness [#PR 1628](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1628)
- Comprehensive System and UI Updates: Field Configurator Changes, Mobile View Improvements, Automation Support, Email Validation, and Miscellaneous Bug Fixes Across List Views, Pagination, Masking, and Field Type Handling. [#PR 1587](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1587).
- Fixed Issue Where Deleting a Module Caused BPM Configuration List to Show a Blank Page [#PR 968](https://github.com/simplecrm-projects/simplecrm_v267/pull/968)
- Fixed Issue Where Selecting a KB Record in Cases Module Didn't Update the Resolution Field [#PR 1627](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1627)
- Upgraded Zustand from v4 to v5 and Address Breaking Changes [#PR 1630](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1630)
- Import `isNil` Function in EmailForm Component [#PR 1633](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1633)
- Fixed Iframe Dashlet URL Updating and Improve Loading Behavior [#PR 1618](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1618)
- Fixed Cross-Tab Idle Timeout Issue [#PR 1610](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1610)
- Fixed SAML Login Screen Errors and UI Issues [#PR 1611](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1611)
- Fixed Admin Iframe Crash [#PR 1619](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1619)
- Fix PDF Preview Rendering Issue [#PR 1622](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1622)
- Updated Attachment Dialog to Display Files Across All Modules [#PR 1597](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1597)
- Fixed the Label Value Overflow issue in the Detail View [#PR 1420](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1420)
- Activity Stream Improvements: Loading and Scrolling Issues Resolved [#PR 1431](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1431)
- Enhancements to Activities Module: User Data, Form Management, and Duration Display Resolved [#PR 1449](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1449)
- Optimized Security Group Access Check for Listview Performance [#PR 1002](https://github.com/simplecrm-projects/simplecrm_v267/pull/1002)
- Fix Bug in History Subpanel - Email Values Displaying as Decoded HTML [#PR 1014](https://github.com/simplecrm-projects/simplecrm_v267/pull/1014)
- Baseline Bug Fixes and Improvements [#PR 1650](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1650)
- Enhanced Frontend Error Handling for Form Submissions [#PR 1652](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1652)
- Add Client ID, Secret, and User Details Storage in Local Storage [#PR 1653](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1653)
- User-Specific Redirects on Login [#PR 1011](https://github.com/simplecrm-projects/simplecrm_v267/pull/1011)
- Surveys Module Button in Left-Side Drawer (v267) [#PR 1012](https://github.com/simplecrm-projects/simplecrm_v267/pull/1012)
- Display Both Active and Inactive Users in "Assign to" Field for Better Ticket Tracking [#PR 1017](https://github.com/simplecrm-projects/simplecrm_v267/pull/1017)
- Restrict Editing of Key Fields for Regular Users [#PR 1019](https://github.com/simplecrm-projects/simplecrm_v267/pull/1019)

## Backend

### Enhancements
  - **Optimized Security Group Access Check for Listview Performance** This update improves performance in the listview, subpanel listview, and popup view by reducing the number of queries made for security group access checks. Instead of running a query for each record, the system now retrieves all record IDs in a single batch and performs the access control checks efficiently, significantly boosting performance. [#PR 1002](https://github.com/simplecrm-projects/simplecrm_v267/pull/1002) 
  
  :::danger Important
  - **Removed Delete button from list view for V267** 
  The delete button has been removed from the V267 list view to prevent data integrity issues caused by incomplete deletions that created orphan records. This change addresses major impacts on roles, where associated actions were not deleted, leading to incorrect ACL configurations. 
  Users can now delete records via Mass Delete or Detail View, ensuring proper data handling. 
  Additionally, SQL queries have been provided to identify and clean up existing orphan records.  
  **Please check this PR and check the description for necessary actions: [#PR 1027](https://github.com/simplecrm-projects/simplecrm_v267/pull/1027)**
  :::

- **Enforced Minimum File Size for Uploaded Files in CRM** This update ensures that files smaller than the configured minimum size (including 0 bytes) cannot be uploaded in the CRM. Administrators can easily adjust the minimum file size in the configuration file, preventing the upload of empty or invalid files and enhancing data integrity across the platform. [#PR 980](https://github.com/simplecrm-projects/simplecrm_v267/pull/980)

- **Visualize Survey Responses in Detail View** This update adds a feature to the SurveyResponse detail view, allowing users to visualize survey responses in a clear and organized table format. This enhancement improves the readability and analysis of survey data.[#PR 906](https://github.com/simplecrm-projects/simplecrm_v267/pull/906)

- **Improved ListView and Export API Performance by Optimizing Query** This update removes an unnecessary OR condition from the ListView and Export API queries, which was slowing down performance. Since NULL values are not present in the "deleted" column, the condition is no longer needed, resulting in faster data loading, especially in modules with large datasets. [#PR 927](https://github.com/simplecrm-projects/simplecrm_v267/pull/927)

- **Optimized ACL Checks to Improve List View Performance** In SimpleCRM v300, excessive queries were causing delays when using the list view, as ACL (Access Control List) checks were being performed for every record, even those without security groups. This led to repeated access checks for actions like list, view, edit, delete, export, import, create, and download.
  To resolve this, we optimized the process by limiting ACL checks only to records associated with a security group, reducing unnecessary checks and significantly improving performance. [#PR 936](https://github.com/simplecrm-projects/simplecrm_v267/pull/936)

- **Enhanced Basic Search to Include Labels Field from API**
  The basic search placeholder in the ListView now dynamically displays the field name, sourced directly from the API. This enhancement ensures that the search field labels are consistent with the data provided by the API, improving the user experience and aligning with backend updates. [#PR 1410](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1410)

- **Disable News Search Option in Top Navigation by Default with Configurable Toggle** We have disabled the "News Search" feature from the top navigation bar in the baseline configuration. This feature can still be enabled for any specific project by modifying the config_override.php file.[#PR 985](https://github.com/simplecrm-projects/simplecrm_v267/pull/985).

- **Accurate Expected Date Calculation for Holiday Record Creation** This update improves the expected date calculation logic for records created on holidays. It now correctly identifies whether today is a holiday and adjusts the expected date accordingly. If today is a holiday, the system will use the next working day with appropriate opening and closing hours, ensuring accurate timelines for record processing. [#PR 727](https://github.com/simplecrm-projects/simplecrm_v267/pull/727).

- **Enhancement:Rectifying Blank Space Removal in Filter Sort Order Field** An unnecessary blank option was previously included in the sort-order field within the filter settings, alongside the ascending and descending choices. This blank value cluttered the user interface and caused confusion for users. By eliminating the blank option, the sort-order field has been streamlined, enhancing the overall user experience and clarity in the sorting functionality.[#PR 736](https://github.com/simplecrm-projects/simplecrm_v267/pull/736)

- **Enhanced Inbound Email Account Management Options** New options have been added to the panel for managing inbound email accounts, allowing users to easily create both personal and group email accounts directly. The previous buttons for creating these accounts have been disabled, streamlining the process and providing users with direct access to create the inbound email accounts they need. [#PR 840](https://github.com/simplecrm-projects/simplecrm_v267/pull/840)

- **User-Specific Redirects on Login** This update introduces user-specific redirects upon login.

  - Admin users are redirected to the Administration Panel list.
  - Regular users are redirected to their profile view.
  - This enhancement ensures users are directed to the appropriate interface based on their role, improving navigation efficiency. [#PR 1011](https://github.com/simplecrm-projects/simplecrm_v267/pull/1011)

- **Display Both Active and Inactive Users in "Assign to" Field for Better Ticket Tracking** This update addresses an issue where inactive users with assigned tickets do not appear in the "Assign to" field within the search view, making it difficult to find tickets assigned to them. By modifying the getSearchView() function to retrieve all users (active and inactive) without filtering by status, the system will now display both active and inactive users, ensuring more comprehensive ticket tracking and assignment visibility. [#PR 1017](https://github.com/simplecrm-projects/simplecrm_v267/pull/1017)
- **Restrict Editing of Key Fields for Regular Users** This update restricts regular users from editing specific fields, including Username, User Type, Status, and Reporting Manager, ensuring these important fields can only be modified by authorized users. This limitation helps maintain data integrity and control over essential user information. [#PR 1019](https://github.com/simplecrm-projects/simplecrm_v267/pull/1019)
- **Improved Performance for Security Group Role Queries** We’ve enhanced the performance of role-related queries in environments with many security groups. By adding indices to the securitygroup_id and role_id columns in the securitygroups_acl_roles table, queries to fetch roles for a security group are now faster and more efficient. [#PR 975](https://github.com/simplecrm-projects/simplecrm_v267/pull/975)

- **OAuth2 Refresh Token Issue Resolved in V8 API** The OAuth2 refresh token functionality in the V8 API was not working correctly. This has been addressed with the necessary updates to restore proper token refresh behavior. [#PR 944](https://github.com/simplecrm-projects/simplecrm_v267/pull/944)

- **Subpanel Reordering Feature Added for V3 Record Detail View** A new functionality has been introduced to allow reordering of subpanels in the record detail view, which was previously unavailable in V3. Custom code has been added to the system, enabling admin users to reorder subpanels via V267, and these changes will automatically apply to all users across the system. [#PR 951](https://github.com/simplecrm-projects/simplecrm_v267/pull/951)

- **Optimized Escalation Date Calculation for Improved Performance** The logic for calculating escalation dates has been optimized to enhance performance. Previously, multiple SQL queries for non-working days, holidays, and user leave slowed down the process. Now, data is collected once, and calculations are done in a single step, with non-working days calculated recursively, leading to improved efficiency. [#PR 921](https://github.com/simplecrm-projects/simplecrm_v267/pull/921)

- **Improvements to BPM Step Order, Assignment Scheduling, and User Comparisons** BPM steps are now correctly ordered by creation date to avoid issues with step display, especially in MSSQL. Completed steps and BPMs no longer trigger unnecessary assignments, streamlining scheduler behavior. Additionally, user ID comparisons for the "Next Step" button are now case-insensitive and trimmed to prevent errors with migrated user data. [#PR 946](https://github.com/simplecrm-projects/simplecrm_v267/pull/946)

- **Optimize History Subpanel Performance** This update enhances the performance of the history subpanel by restructuring its queries. It removes unnecessary contact and email relationships from the history query for cases, improving efficiency. Additionally, hardcoded OR conditions have been replaced with IN clauses in various module subpanels, resulting in better readability and performance throughout the application. [#PR 948](https://github.com/simplecrm-projects/simplecrm_v267/pull/948)

- **Compatibility Update for Next Step Button in MSSQL Environments** This update resolves an issue with the Next Step button functionality in MSSQL database environments by adding a conditional check for db_type. When the database type is MSSQL, the API now executes the appropriate query, ensuring consistent operation across different database systems. [#PR 913](https://github.com/simplecrm-projects/simplecrm_v267/pull/913)

- **Performance Boost by Removing Unused Alert and Favorites API Calls in v267** Removed unnecessary background API calls for alerts and favorites in v267, where top navigation and corresponding features are not visible. These optimizations eliminate redundant processes, enhancing overall application performance for users. [#PR 969](https://github.com/simplecrm-projects/simplecrm_v267/pull/969)

- **Enhanced ListView Performance with Optimized Record Counts, User Data, and Subpanel Loading**  
  This update improves ListView performance by optimizing record count retrieval, directly querying user full names, and reducing redundant SQL calls and bean initializations, leading to faster response times and better resource efficiency in high-load scenarios. [#PR 972](https://github.com/simplecrm-projects/simplecrm_v267/pull/972)

- **Streamlining Custom Module Logic Hooks** This update removes unused logic hooks from the custom module to enhance performance during create, update, delete, and mass update operations. By eliminating redundant hooks, the codebase is simplified, leading to faster execution and easier future maintenance.[#PR 983](https://github.com/simplecrm-projects/simplecrm_v267/pull/983)

### Bug Fixes

- - **Surveys Module Button in Left-Side Drawer (v267)** In version 267, a "Surveys Module" button was added to the left-side drawer for easier access. Regular users see this button only if they have access to the Surveys module, while admins can view it regardless of permissions. In the Survey Response Module's detail view, there's a known issue where the "Assigned To" field does not display values; this will be resolved in the next release. Additionally, edit, add, and delete actions are now restricted for both the Surveys and Survey Response modules in V3 to enhance data security and control. [#PR 1012](https://github.com/simplecrm-projects/simplecrm_v267/pull/1012)
- **Fix Bug in History Subpanel - Email Values Displaying as Decoded HTML** The email record values in the History subpanel were previously displaying in a decoded format. This issue has been resolved by wrapping all value keys with the html_entity_decode function to properly encode the values, ensuring they display correctly in the subpanel. [#PR 1014](https://github.com/simplecrm-projects/simplecrm_v267/pull/1014)

- **Fixed Issue Where Deleting a Module Caused BPM Configuration List to Show a Blank Page** Now, the system checks if a module is valid before trying to load it. If the module no longer exists, the system will skip it, ensuring the BPM list works smoothly without errors. [#PR 968](https://github.com/simplecrm-projects/simplecrm_v267/pull/968)

- **Subpanel Count Display Issue Resolved for Workflow and Related Modules** The count of records in the "Process Audit" subpanel of the Workflow module was previously not visible. This issue also affected the "Scheduler," "Roles," and "Security Group" subpanels. To resolve this, we updated the configuration to ensure these modules are properly included, allowing the counts to display correctly. [#PR 912](https://github.com/simplecrm-projects/simplecrm_v267/pull/912)

- **Preventing Spaces in Usernames and Disabling Unused Active Date Code** Usernames cannot contain spaces (e.g., "Pournima Shende" is invalid, while "pournimashende" is valid). To enforce this rule, we have implemented validation on both the API and V267 sides. If a user attempts to enter a username with spaces, an error message will prompt them to correct it. [#PR 911](https://github.com/simplecrm-projects/simplecrm_v267/pull/911)

- **Disable AOD for .DOCX File Uploads and Add Decimal Type for Opportunity Scoring**
  When users upload a .docx file, an error occurs during saving. This has been fixed by disabling the AOD feature in the configuration file with `$sugar_config['aod']['enable_aod'] = false;`. The `opportunity_scoring_c` field type has also been changed to 'Decimal' for improved accuracy.[#PR 916](https://github.com/simplecrm-projects/simplecrm_v267/pull/916)

- **Sync Users Popup List View with Studio Configuration**
  The popup ListView was incorrectly displaying user data instead of the layout set in Studio. We removed the overriding condition, ensuring the popup now reflects the Studio configuration. Sorting and searching functionalities have been verified to work correctly. [#PR 923](https://github.com/simplecrm-projects/simplecrm_v267/pull/923)

- **"Show Full Names" Option Now Displays Full Names Correctly** Resolved an issue where the "Show Full Names" option in system settings wasn't working correctly. Instead of showing full names, the frontend was displaying usernames in the list and detail views. A flag check has been added in the query logic to ensure that when this option is enabled, the assigned user's full name is displayed as expected. [#PR 973](https://github.com/simplecrm-projects/simplecrm_v267/pull/973)

- **Improved Error Display and UI in SAML Login** The error display in the SAML login screen has been corrected to ensure proper visibility of error messages. UI issues affecting the SAML login screen have also been resolved, providing a smoother user experience. [#PR 935](https://github.com/simplecrm-projects/simplecrm_v267/pull/935)

- **Improved MSID Handling for V267 Login Under Load Balancing** In V267, login issues occurred when using load balancing due to improper session sharing for MSID, causing authentication failures. The current workaround involves passing an encrypted access token instead of MSID in the iframe URL to create the session. [#PR 945](https://github.com/simplecrm-projects/simplecrm_v267/pull/945)

- **LDAP Functionality Improvement** The LDAP functionality was not operational on the v3 side. We identified and added the missing functions and logic to enable its proper working. Further testing is required to ensure everything functions as expected.[#PR 903](https://github.com/simplecrm-projects/simplecrm_v267/pull/903)

- **Dashlet Resizing and Dragging Enhancement** The dashlet cards were incorrectly positioned when resized or dragged. This issue has been resolved by providing the correct properties to the react-grid-layout component, ensuring that dashlets behave as expected during these actions. [#PR 1381](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1381)

- **Improvements to V267 Login and Session Management** The login process for V267 has been enhanced to address session generation issues. Initially, an endpoint was created to streamline access through an iframe using an MSID. However, challenges with load balancing and session sharing led to updates. The login now uses an encrypted access token to create a session
  ([#PR 766](https://github.com/simplecrm-projects/simplecrm_v267/pull/766),
  [#PR 953](https://github.com/simplecrm-projects/simplecrm_v267/pull/953),
  [#PR 993](https://github.com/simplecrm-projects/simplecrm_v267/pull/993))

- **Resolution of Key System Issues** Several important issues have been addressed: the problem with MSID generation has been fixed, the report ID is now correctly passed to the API response in the report dashlet, and the issue with file uploads not updating records has been resolved. [#PR 811](https://github.com/simplecrm-projects/simplecrm_v267/pull/811)

- **Improvements to System Usability and Code Efficiency** This pull request implements several enhancements to improve usability and maintainability. The max size field dropdown has been removed for specific field types, and JSON configurations are now hardcoded in the portal admin service, streamlining logic. Additionally, the user_portal_preferences table is deprecated, leading to a more efficient database structure. Testing steps ensure these changes function as intended without affecting system performance. [#PR 900](https://github.com/simplecrm-projects/simplecrm_v267/pull/900)

- **Improvements to Currency Field Behavior in Studio** This update changes the behavior of the range-enabled field for currency types. In the create view, it will be checked, and in the edit view, it will be disabled only if previously checked. If unchecked by default, the "Enable Range Search" option stays active. Additionally, the "Account Number" field in the Accounts module will be corrected to allow editing when unchecked. [#PR 970](https://github.com/simplecrm-projects/simplecrm_v267/pull/970)

- **Resolution of Email Subject Display Issues** The issue of UFT 8 encoded data and icons not displaying correctly in email subjects has been resolved, ensuring that emails now appear as intended with all characters and icons properly shown. [#PR 823](https://github.com/simplecrm-projects/simplecrm_v267/pull/823)

- **Inbound Email Configuration and Template Variable Issues Resolved** The "Type" field in inbound email configurations, previously disabled, now submits correctly using a hidden input, ensuring values like "Auto Import Emails" and group folder IDs are saved properly. Additionally, email template variables are now parsed correctly when sending case creation emails, preventing the raw variables from appearing in the emails. [#PR 914](https://github.com/simplecrm-projects/simplecrm_v267/pull/914)

- **Input Sanitization for BPM Processes and Automation Task Data Fetching Enhanced** Input sanitization for BPM process names and task bodies now allows only valid characters, preventing JSON errors. Automation tasks also now correctly retrieve data in the required array format, fixing issues with blank data. [#PR 908](https://github.com/simplecrm-projects/simplecrm_v267/pull/908)

- **Resolved HTML Character Encoding Issues in Audit Logs** Fields with single or double quotes were incorrectly flagged as changed in audit logs due to improper decoding. This update ensures audit logs accurately compare field values by handling double-encoded HTML characters and quotes, eliminating discrepancies. [#PR 949](https://github.com/simplecrm-projects/simplecrm_v267/pull/949)

- **Added Proper Auditing for Relate Fields in V8 API** The relate field was not being captured in the change log when using the V8 API. This update adds the required code to ensure that changes to relate fields are correctly audited and reflected in the change log. [#PR 952](https://github.com/simplecrm-projects/simplecrm_v267/pull/952)

- **Resolved Issue with Line Items Being Removed from Parent Quote on Duplication** When duplicating a quote, the new quote was inheriting line items, but they were being removed from the parent quote due to an ID field issue. The fix excludes the ID field to prevent this, ensuring both quotes retain their line items. [#PR 947](https://github.com/simplecrm-projects/simplecrm_v267/pull/947)

- **Improvements Round Robin Assignment for BPM Tasks and Steps** An issue caused BPM task assignments to repeatedly assign the same user when only two users were in a role or security group. The update corrects variable usage to ensure proper round-robin distribution for tasks and steps. [#PR 979](https://github.com/simplecrm-projects/simplecrm_v267/pull/979)

- **Resolving User Assignment Issues in BPM Steps and Tasks** An issue was found where the same user was assigned to both a BPM step and its associated task when configured with different role or security groups. The expected behavior is for a user from Role/Security Group 1 to be assigned to the Step, while a user from Role/Security Group 2 should be assigned to the Step Task. This update ensures that the correct users are assigned based on their respective groups. [#PR 978](https://github.com/simplecrm-projects/simplecrm_v267/pull/978)

- **Correction of BPM Name Duplication During Creation** An issue was identified where the BPM name, auto-suggested from the selected criteria field during creation, would sometimes show the value twice. This update ensures the BPM name is populated correctly, eliminating any duplication of the selected option's value. [#PR 904](https://github.com/simplecrm-projects/simplecrm_v267/pull/904)

- **Enhanced Input Sanitization and Automation Data Retrieval** This update enhances input sanitization for BPM process names, conditional task bodies, and API names by allowing only valid alphanumeric characters and specific punctuation. This prevents corruption of BPM JSON in the detail view due to invalid characters. Additionally, it improves data retrieval for automation tasks, ensuring parameter data is fetched in the correct array format, which resolves issues with blank data from the fetched_row property. [#PR 908](https://github.com/simplecrm-projects/simplecrm_v267/pull/908)

- **Improved User Access to Surveys Module** A new "Surveys Module" button has been added to the right-side drawer popup in version 267, making it easier for users to access the Surveys Module quickly and efficiently.[#PR 1003](https://github.com/simplecrm-projects/simplecrm_v267/pull/1003)

- **Improved Pagination Accuracy in Popup View** This update resolves an issue in the popup view where the last record was not being correctly removed when using custom pagination. By adjusting the record retrieval process, the system now accurately displays the correct pagination count (e.g., "1-10 of 10+"). [#PR 997](https://github.com/simplecrm-projects/simplecrm_v267/pull/997)

- **Resolve Export Issues for Combined "Name" Field in Leads and Contacts** This update addresses an issue in the export functionality where the combined "Name" field, which merges "First Name" and "Last Name," was not exporting correctly in modules like Leads and Contacts. While fields such as "Status" and "Account Name" were exported as expected, the "Name" field was missing. The solution ensures that the combined name is now accurately included in the exported data. [#PR 992](https://github.com/simplecrm-projects/simplecrm_v267/pull/992)

- **Align Popup ListView with Studio Configuration** This update resolves an issue where the popup ListView was not displaying the layout configured in Studio, instead showing the user's default ListView data. By removing the conflicting condition, the popup view now accurately reflects the layout settings from Studio. Additionally, sorting and searching functionalities have been verified to work correctly within the popup view. [#PR 923](https://github.com/simplecrm-projects/simplecrm_v267/pull/923)

- **Improvement of Email Tracking and Visibility in CRM**

  - Storage of Sender Information: Previously, the from_addr field was not being saved in the email_text table when emails were sent from the CRM, making it impossible to retrieve this information later. This has been resolved, ensuring that the from_addr is now properly stored. [#PR 909](https://github.com/simplecrm-projects/simplecrm_v267/pull/909)

  - Display of Email Details in History Subpanel: The history subpanel was lacking important details such as from_addr, to_addr, cc_addr, and email_type, resulting in incomplete information. This update ensures that these fields are now correctly populated and visible in the history subpanel, providing complete visibility of email interactions. [#PR 918](https://github.com/simplecrm-projects/simplecrm_v267/pull/918)

- **Improvement to List Filtering Functionality** This update improves the list filtering functionality by fixing an issue where filters were not applied correctly. Enabling the `listOnFilter` setting previously displayed the full list instead of the filtered results due to an incorrectly trimmed condition. This has been corrected, ensuring only relevant items are shown based on selected filters. [#PR 928](https://github.com/simplecrm-projects/simplecrm_v267/pull/928)

- **Improvement of User Permissions in API** This update introduces a feature allowing regular users to verify their permissions for creating and downloading content through the API. By implementing access checks in the specified API endpoints, users can now easily determine their privileges for various modules. [#PR 764](https://github.com/simplecrm-projects/simplecrm_v267/pull/764)

- **Visibility of Photo Field in Employees and Users Module** This update resolves the issue preventing the photo field from displaying in the list view of the Employees and Users modules. The problem arose from incorrect code affecting the filename field and a misconfiguration in the vardef file. Now, the photo field is properly defined, ensuring that images are correctly shown in the list view. [#PR 901](https://github.com/simplecrm-projects/simplecrm_v267/pull/901)

- **Display of Count in Workflow Module Subpanels** This update resolves the issue where the count of records was not visible in the "Process Audit," "Scheduler," "Roles," and "Security Group" subpanels within the Workflow module. By adding these modules to the exclusion list, the count is now correctly displayed, enhancing visibility and usability for users. [#PR 912](https://github.com/simplecrm-projects/simplecrm_v267/pull/912)

- **Username Validation and Active Date Adjustments** This update enforces username validation to prevent spaces, ensuring correct formatting. It resolves an issue with the active date (Publish Date) to retain its original value after editing. The export functionality now displays usernames instead of IDs for the "assigned to" and "created by" fields. Regular users can edit usernames, but the status and user type fields remain unchanged for consistency. [#PR 911](https://github.com/simplecrm-projects/simplecrm_v267/pull/911)

- **Disabling AOD for DOCX Uploads and Updating Field Type** This update addresses an error that occurred when users attempted to upload .docx files by disabling the AOD functionality in the configuration file. Additionally, the field type for opportunity_scoring_c has been updated to 'Decimal' to ensure proper data handling. [#PR 916](https://github.com/simplecrm-projects/simplecrm_v267/pull/916)

- **Resolving Errors in Dashlet View for Document Tasks** This update addresses an issue where tasks related to the Documents module caused errors in the Dashlet view. The problem stemmed from a query attempting to retrieve a non-existent name field in the document table, leading to loading failures. After debugging, the query has been corrected to ensure the Dashlet view functions properly for all users. [#PR 954](https://github.com/simplecrm-projects/simplecrm_v267/pull/954)

- **Displaying Document Revisions in the Subpanel** This update resolves an issue where the Document Revisions subpanel in the Documents module showed a count but no data when a file was attached. By excluding the DocumentRevision module in the data/SugarBean.php file, existing data in the Document Revisions subpanel is now correctly displayed, providing users with full visibility of their document revisions. [#PR 955](https://github.com/simplecrm-projects/simplecrm_v267/pull/955)

- **Restricting Users Module from Related To Fields** This update removes the "Users" module from the "Related To" fields when creating a task, which previously caused errors. Now, only modules with relevant relationships will appear in the "Related To" fields, improving the overall functionality and user experience. [#PR 956](https://github.com/simplecrm-projects/simplecrm_v267/pull/956)

- **Removing Edit and Create Permissions for Survey Responses Subpanel** This update restricts users from creating and editing entries in the "Survey Responses" subpanel by modifying the config_override_v3.php file. [#PR 959](https://github.com/simplecrm-projects/simplecrm_v267/pull/959)

- **Retaining Boolean Values in Task Dashlet Filter View** This update resolves an issue where Boolean values in TODO fields were not saved in the filter view for the task dashlet, leading to filtering problems. [#PR 960](https://github.com/simplecrm-projects/simplecrm_v267/pull/960)

- **Disabling "Add to Target List" in Report Detail View** The option to "Add to Target List" has been removed from the report detail view on the V3 side, while it remains available in V267. [#PR 965](https://github.com/simplecrm-projects/simplecrm_v267/pull/965)

- **Improving Dropdown Visibility for Multiple Selections** When selecting multiple values in criteria fields, the dropdown now remains fully visible by adjusting the Z-index, ensuring users can see and select additional options without needing to resize the page. [#PR 966](https://github.com/simplecrm-projects/simplecrm_v267/pull/966)

- **Resolving Multi-Enum Error in BPM Configuration and Deleted Module Cleanup** This update resolves an issue where BPM configurations with multi-enum datatype fields were not applied correctly to records due to improper value handling. A str_replace function was added to handle multi-enum values. Additionally, deleted modules that reappeared in BPM configurations after being re-enabled have been properly removed. [#PR 974](https://github.com/simplecrm-projects/simplecrm_v267/pull/974)

- **Enforcing No Spaces in Usernames** Spaces are no longer allowed in usernames (e.g., "Pournima Shende"). Validation has been added on both the API and V267 sides to ensure usernames are entered without spaces (e.g., "pournimashende"). Users will now receive an error message if they attempt to create a username with spaces. [#PR 986](https://github.com/simplecrm-projects/simplecrm_v267/pull/986)

- **Improving Email Code Authentication with Input Validation** This update enhances the email code authentication process by ensuring that incorrect input, such as a 5-digit code followed by a dot, triggers a user-friendly error message. Validation logic was also improved to prevent trailing characters, increasing both security and accuracy in user authentication. [#PR 976](https://github.com/simplecrm-projects/simplecrm_v267/pull/976)

- **Removing Duplicate Access for Regular Users in Users and Employee Modules** This update removes the option for regular users to duplicate records from the rights dropdown in DetailView, simplifying access permissions and aligning with standard user rights. [#PR 988](https://github.com/simplecrm-projects/simplecrm_v267/pull/988)

- **Resolving Checkbox Issue for Personal and Group Emails** This update addresses a problem in version 267 where the personal checkbox for inbound emails does not update correctly. When users create a personal email and later attempt to change it to a group email, the checkbox remains checked, leading to confusion about the email's classification. This fix ensures that the checkbox accurately reflects the email's status, providing clearer information to users. [#PR 756](https://github.com/simplecrm-projects/simplecrm_v267/pull/756)

- **Improvements in Popup Filter, File Uploads, and Email Reminder Templates** This update includes:

  - Popup Filter Correction: The "Assigned User ID" filter now accurately displays user names.
  - File Upload Fixes: We resolved issues with uploading both "File" and "Image" types for improved functionality.
  - Optimized Email Reminders: The email reminder template has been simplified to show only essential details, enhancing clarity.[#PR 784](https://github.com/simplecrm-projects/simplecrm_v267/pull/784)

- **New OAuth Client Management Panel in Admin Section** This update introduces a new OAuth client panel in the admin section, making it easier to manage OAuth configurations. The panel includes options for managing OAuth2 clients and tokens, creating new clients with different grant types, and managing OAuth keys. A dedicated file has been created for this feature, and the necessary labels have been added to the language file for consistency. [#PR 833](https://github.com/simplecrm-projects/simplecrm_v267/pull/833)

- **New Options for Inbound Email Accounts in User Panel** This update introduces new options for creating inbound email accounts directly from the user panel. Users can now easily set up both personal and group inbound email accounts with two new buttons: "New Personal Inbound Email Account" and "New Group Inbound Email Account." Additionally, the previous buttons for creating these accounts have been disabled, streamlining the process for users. [#PR 840](https://github.com/simplecrm-projects/simplecrm_v267/pull/840)

- **Log Date and Time Display Issue in System Settings** This update resolves an issue in the System Settings > View Log section where date and time were missing from log entries. The problem stemmed from the strtotime function not processing correctly, and adjustments have been made to ensure date and time display accurately in logs. [#PR 919](https://github.com/simplecrm-projects/simplecrm_v267/pull/919)

- **Checkbox Default Behavior for Missing Business Hours Data** This update adds a condition to ensure that the checkbox is automatically set to unchecked when business hours data is not present in the database. This adjustment helps prevent confusion by clearly indicating that no business hours have been configured. [#PR 937](https://github.com/simplecrm-projects/simplecrm_v267/pull/937)

- **Default Date Sorting for Activities and History Subpanels in DetailView** This update ensures consistent sorting in the new DetailView UI by setting Activities and History subpanels to automatically sort by the date_entered field. This change overrides any previous custom sort settings, providing a predictable and logical order for users when viewing records.[#PR 940](https://github.com/simplecrm-projects/simplecrm_v267/pull/940)

- **Improved Visibility and Access Controls for Survey Modules in Detail View** This update addresses display issues for survey questions and responses in the Detail View on v300. Additionally, it removes Edit, Delete, and Duplicate permissions for Survey and SurveyResponse modules to reinforce data security and control, ensuring proper visibility and access restrictions. [#PR 941](https://github.com/simplecrm-projects/simplecrm_v267/pull/941)

- **Survey URL Display Restored in v300 for Survey Module** This update addresses an issue where the Survey URL was not visible in the Survey module on v300. The fix ensures that the Survey URL now displays correctly, allowing users to access the URL as expected. [#PR 943](https://github.com/simplecrm-projects/simplecrm_v267/pull/943)

- **Accurate Related Account Count Retrieval in MSSQL** Updated the getRowCount function to ensure it accurately fetches the count of related account records, enhancing compatibility with MSSQL databases. This adjustment ensures reliable record counting across different database environments. [#PR 964](https://github.com/simplecrm-projects/simplecrm_v267/pull/964)

- **Consistent Error Messages for Delete Access Restrictions** This update ensures that users without delete permissions receive clear and consistent error messages when attempting to delete records. Previously, the message was generic and unclear, causing confusion. Now, it aligns with other action messages, making it easier for users to understand their access limitations.[#PR 981](https://github.com/simplecrm-projects/simplecrm_v267/pull/981)

- **Performance Optimizations for History Subpanel** This update introduces several performance enhancements to the History subpanel by streamlining how data is fetched and access controls are handled. Unnecessary Bean calls have been eliminated, email retrieval has been optimized with custom SQL queries, and global focus object management has been simplified. These changes reduce database load and improve the overall efficiency of the History subpanel, resulting in faster performance. [#PR 982](https://github.com/simplecrm-projects/simplecrm_v267/pull/982)

- **Ensuring Email Loading in History Subpanel** This update resolves an issue preventing emails from loading in the History subpanel by removing unnecessary fields from the email query. This change fixes the loading error, ensuring that emails are displayed correctly and improving the overall stability and functionality of the History subpanel.[#PR 987](https://github.com/simplecrm-projects/simplecrm_v267/pull/987)

- **Corrected Date and Time Display in Log Files** This update resolves the issue where the log files in the System Settings > View Log section were missing date and time information. The problem was traced to the incorrect functioning of the strtotime function. The fix involved replacing it with the strftime function to accurately parse and display the date and time, ensuring that logs provide the necessary context for each entry. [#PR 919](https://github.com/simplecrm-projects/simplecrm_v267/pull/919)

- **Resolved Workflow Condition Value Truncation Issue** This update fixes a problem in the "Create Workflow" section where selecting multiple values using the "One Of" option for Enum fields could lead to truncation if the total character length exceeded 255 characters. Users can now save longer combinations of selected values without losing any data, ensuring that workflow conditions are accurately preserved. [#PR 902](https://github.com/simplecrm-projects/simplecrm_v267/pull/902)

- **Checkbox Behavior Adjusted for Business Hours Data** This update introduces a condition that ensures the checkbox is set to unchecked if there is no business hours data available in the database. This change improves user experience by providing clear feedback when business hours are not configured. [#PR 937](https://github.com/simplecrm-projects/simplecrm_v267/pull/937)

- **Corrected Assignment Email Link to Use v3 URL Instead of v267** Fixed an issue where the assignment email link was incorrectly using the older v267 URL [#PR 1005](https://github.com/simplecrm-projects/simplecrm_v267/pull/1005)

- **Field Configurator Enhancements and Obsolete Code Cleanup** This update introduces key improvements to the Field Configurator (FC) and removes outdated code dependencies. Enhancements include the ability to apply conditions independently for create and edit views, direct fetching of edit view layout data from configuration files, and removal of reliance on the user_portal_preferences table. The update also cleans up unnecessary code and APIs, as well as removes the obsolete "admin links" option in system settings. Additionally, the max size dropdown field has been removed from the studio edit view for integer, float, decimal, and phone field types. These changes aim to streamline FC usage and improve overall system performance. [#PR 939](https://github.com/simplecrm-projects/simplecrm_v267/pull/939)

- **Survey Module Popup and Relate Field Default Module Improvements** This update addresses two enhancements in the Survey and Relate fields. First, the "Create" button was removed from the Survey Response popup view, streamlining the interface to only show the "Reset" and "Search" options. Second, for "Relate" type fields in version 3, a default module is now auto-selected during field creation to ensure smoother workflow functionality. These changes improve the user experience and prevent potential workflow issues when creating and managing Survey and Relate type fields [#PR 995](https://github.com/simplecrm-projects/simplecrm_v267/pull/995)

- **Patch Update: Fix for Email Type Display in History Subpanel** This patch corrects an issue in the History subpanel where the email type (In/Out) was not displayed properly. The fix involved removing an extra "$" symbol from the code, allowing the email type to be fetched and shown as expected.[#PR 989](https://github.com/simplecrm-projects/simplecrm_v267/pull/989)

- **Patch for V3 Username Validation Response Changes** This patch updates the response handling mechanism for username validation in the V3 endpoint, ensuring improved consistency and accuracy in the validation feedback. [#PR 996](https://github.com/simplecrm-projects/simplecrm_v267/pull/996)

- **Limited Editing Access for Key Fields by Regular Users** Regular users are now restricted from editing specific fields such as Username, User Type, Status, and Reporting Manager. These fields are non-editable to ensure that only authorized personnel can make changes, preserving data accuracy and user role integrity. [#PR 1019](https://github.com/simplecrm-projects/simplecrm_v267/pull/1019)

- **Fix Link in Assignment Email to Open Correct App Version (v300)** This update resolves an issue where assignment emails contained a link pointing to an outdated app version (v267) instead of the current v300 version, preventing users from accessing assigned records. The email template code was updated to ensure the link correctly directs to the v300 app. Testing confirmed that users can now click the link in the email to seamlessly access their assigned records in the v300 app, enhancing accessibility and reducing potential confusion. [#PR 1005](https://github.com/simplecrm-projects/simplecrm_v267/pull/1005)

- **Performance Improvements and Bug Fixes for User and Configuration APIs** This patch optimizes several configuration and user-related APIs to enhance performance and maintainability. Key improvements include streamlining the Config API logic, creating a dedicated function for field background configurations, refining user session handling, and introducing a function for retrieving user roles and security groups. Additionally, issues with the SESSION variable for current_user_id have been fixed, ensuring reliable session initialization. These enhancements result in faster load times, improved data retrieval, and a smoother user experience, especially noticeable during login and configuration access. [#PR 1018](https://github.com/simplecrm-projects/simplecrm_v267/pull/1018)

- **Added Missing Static Declaration to loadUserOnSession Function** This update resolves an issue where the loadUserOnSession function was missing its static declaration. Adding the static keyword ensures proper function behavior and consistency across sessions. [#PR 1020](https://github.com/simplecrm-projects/simplecrm_v267/pull/1020)

### What's Changed

- Enforced Minimum File Size for Uploaded Files in CRM [#PR 980](https://github.com/simplecrm-projects/simplecrm_v267/pull/980)
- Visualize Survey Responses in Detail View [#PR 906](https://github.com/simplecrm-projects/simplecrm_v267/pull/906)
- Improved ListView and Export API Performance by Optimizing Query [#PR 927](https://github.com/simplecrm-projects/simplecrm_v267/pull/927)
- Optimized ACL Checks to Improve List View Performance [#PR 936](https://github.com/simplecrm-projects/simplecrm_v267/pull/936)
- Enhanced Basic Search to Include Labels Field from API [#PR 1410](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1410)
- Disable News Search Option in Top Navigation by Default with Configurable Toggle [#PR 985](https://github.com/simplecrm-projects/simplecrm_v267/pull/985)
- Added ACL Button Configuration for Detail View [#PR 691](https://github.com/simplecrm-projects/simplecrm_v267/pull/691)
- New OAuth Client Management Panel in Admin Section [#PR 833](https://github.com/simplecrm-projects/simplecrm_v267/pull/833)
- Enhanced Inbound Email Account Management Options [#PR 840](https://github.com/simplecrm-projects/simplecrm_v267/pull/840)
- Fixed Issue Where Deleting a Module Caused BPM Configuration List to Show a Blank Page [#PR 968](https://github.com/simplecrm-projects/simplecrm_v267/pull/968)
- Subpanel Count Display Issue Resolved for Workflow and Related Modules [#PR 912](https://github.com/simplecrm-projects/simplecrm_v267/pull/912)
- Preventing Spaces in Usernames and Disabling Unused Active Date Code [#PR 911](https://github.com/simplecrm-projects/simplecrm_v267/pull/911)
- Disable AOD for .DOCX File Uploads and Add Decimal Type for Opportunity Scoring [#PR 916](https://github.com/simplecrm-projects/simplecrm_v267/pull/916)
- Sync Users Popup List View with Studio Configuration [#PR 923](https://github.com/simplecrm-projects/simplecrm_v267/pull/923)
- "Show Full Names" Option Now Displays Full Names Correctly [#PR 973](https://github.com/simplecrm-projects/simplecrm_v267/pull/973)
- Improved Performance for Security Group Role Queries [#PR 975](https://github.com/simplecrm-projects/simplecrm_v267/pull/975)
- Improved Error Display and UI in SAML Login [#PR 935](https://github.com/simplecrm-projects/simplecrm_v267/pull/935)
- OAuth2 Refresh Token Issue Resolved in V8 API [#PR 944](https://github.com/simplecrm-projects/simplecrm_v267/pull/944)
- Improved MSID Handling for V267 Login Under Load Balancing [#PR 945](https://github.com/simplecrm-projects/simplecrm_v267/pull/945)
- Subpanel Reordering Feature Added for V3 Record Detail View [#PR 951](https://github.com/simplecrm-projects/simplecrm_v267/pull/951)
- Optimized Escalation Date Calculation for Improved Performance [#PR 921](https://github.com/simplecrm-projects/simplecrm_v267/pull/921)
- LDAP Functionality Improvement [#PR 903](https://github.com/simplecrm-projects/simplecrm_v267/pull/903)
- Dashlet Resizing and Dragging Enhancement [#PR 1381](https://github.com/simplecrm-projects/simplecrm_v300_new/pull/1381)
- Improvements to V267 Login and Session Management [#PR 766](https://github.com/simplecrm-projects/simplecrm_v267/pull/766), [#PR 953](https://github.com/simplecrm-projects/simplecrm_v267/pull/953), [#PR 993](https://github.com/simplecrm-projects/simplecrm_v267/pull/993)
- Mass Export Field Selection Improvement [#PR 786](https://github.com/simplecrm-projects/simplecrm_v267/pull/786)
- Improvements to System Usability and Code Efficiency [#PR 900](https://github.com/simplecrm-projects/simplecrm_v267/pull/900)
- Improvements to Currency Field Behavior in Studio [#PR 970](https://github.com/simplecrm-projects/simplecrm_v267/pull/970)
- Resolution of Email Subject Display Issues [#PR 823](https://github.com/simplecrm-projects/simplecrm_v267/pull/823)
- Inbound Email Configuration and Template Variable Issues Resolved [#PR 914](https://github.com/simplecrm-projects/simplecrm_v267/pull/914)
- Input Sanitization for BPM Processes and Automation Task Data Fetching Enhanced [#PR 908](https://github.com/simplecrm-projects/simplecrm_v267/pull/908)
- Improvements to BPM Step Order, Assignment Scheduling, and User Comparisons [#PR 946](https://github.com/simplecrm-projects/simplecrm_v267/pull/946)
- Resolved HTML Character Encoding Issues in Audit Logs [#PR 949](https://github.com/simplecrm-projects/simplecrm_v267/pull/949)
- Added Proper Auditing for Relate Fields in V8 API [#PR 952](https://github.com/simplecrm-projects/simplecrm_v267/pull/952)
- Resolved Issue with Line Items Being Removed from Parent Quote on Duplication [#PR 947](https://github.com/simplecrm-projects/simplecrm_v267/pull/947)
- Improvements Round Robin Assignment for BPM Tasks and Steps [#PR 979](https://github.com/simplecrm-projects/simplecrm_v267/pull/979)
- Resolving User Assignment Issues in BPM Steps and Tasks [#PR 978](https://github.com/simplecrm-projects/simplecrm_v267/pull/978)
- Enhanced Input Sanitization and Automation Data Retrieval [#PR 908](https://github.com/simplecrm-projects/simplecrm_v267/pull/908)
- Improved User Access to Surveys Module [#PR 1003](https://github.com/simplecrm-projects/simplecrm_v267/pull/1003)
- Improved Pagination Accuracy in Popup View [#PR 997](https://github.com/simplecrm-projects/simplecrm_v267/pull/997)
- Resolve Export Issues for Combined "Name" Field in Leads and Contacts [#PR 992](https://github.com/simplecrm-projects/simplecrm_v267/pull/992)
- Align Popup ListView with Studio Configuration [#PR 923](https://github.com/simplecrm-projects/simplecrm_v267/pull/923)
- Improvement of Email Tracking and Visibility in CRM [#PR 909](https://github.com/simplecrm-projects/simplecrm_v267/pull/909), [#PR 918](https://github.com/simplecrm-projects/simplecrm_v267/pull/918)
- Improvement to List Filtering Functionality [#PR 928](https://github.com/simplecrm-projects/simplecrm_v267/pull/928)
- Optimize History Subpanel Performance [#PR 948](https://github.com/simplecrm-projects/simplecrm_v267/pull/948)
- Visibility of Photo Field in Employees and Users Module [#PR 901](https://github.com/simplecrm-projects/simplecrm_v267/pull/901)
- Display of Count in Workflow Module Subpanels [#PR 912](https://github.com/simplecrm-projects/simplecrm_v267/pull/912)
- Username Validation and Active Date Adjustments [#PR 911](https://github.com/simplecrm-projects/simplecrm_v267/pull/911)
- Disabling AOD for DOCX Uploads and Updating Field Type [#PR 916](https://github.com/simplecrm-projects/simplecrm_v267/pull/916)
- Resolving Errors in Dashlet View for Document Tasks [#PR 954](https://github.com/simplecrm-projects/simplecrm_v267/pull/954)
- Displaying Document Revisions in the Subpanel [#PR 955](https://github.com/simplecrm-projects/simplecrm_v267/pull/955)
- Restricting Users Module from Related To Fields [#PR 956](https://github.com/simplecrm-projects/simplecrm_v267/pull/956)
- Removing Edit and Create Permissions for Survey Responses Subpanel [#PR 959](https://github.com/simplecrm-projects/simplecrm_v267/pull/959)
- Retaining Boolean Values in Task Dashlet Filter View [#PR 960](https://github.com/simplecrm-projects/simplecrm_v267/pull/960)
- Disabling "Add to Target List" in Report Detail View [#PR 965](https://github.com/simplecrm-projects/simplecrm_v267/pull/965)
- Improving Dropdown Visibility for Multiple Selections [#PR 966](https://github.com/simplecrm-projects/simplecrm_v267/pull/966)
- Resolving Multi-Enum Error in BPM Configuration and Deleted Module Cleanup [#PR 974](https://github.com/simplecrm-projects/simplecrm_v267/pull/974)
- Enforcing No Spaces in Usernames [#PR 986](https://github.com/simplecrm-projects/simplecrm_v267/pull/986)
- Improving Email Code Authentication with Input Validation [#PR 976](https://github.com/simplecrm-projects/simplecrm_v267/pull/976)
- Removing Duplicate Access for Regular Users in Users and Employee Modules [#PR 988](https://github.com/simplecrm-projects/simplecrm_v267/pull/988)
- Removing Unnecessary Blank Option in Filter Sort Order Field [#PR 736](https://github.com/simplecrm-projects/simplecrm_v267/pull/736)
- Enabling Setting Button Access for Regular Users
- Correcting Pagination Display in Dashboard Dashlets [#PR 703](https://github.com/simplecrm-projects/simplecrm_v267/pull/703)
- Resolving Error When Adding Dashlets to Dashboard [#PR 744](https://github.com/simplecrm-projects/simplecrm_v267/pull/744)
- User Module ListView Data Fetch Issue Resolved [#PR 743](https://github.com/simplecrm-projects/simplecrm_v267/pull/743)
- New Options for Inbound Email Accounts in User Panel [#PR 840](https://github.com/simplecrm-projects/simplecrm_v267/pull/840)
- Restrict Special Characters in Activity Description Field [#PR 874](https://github.com/simplecrm-projects/simplecrm_v267/pull/874)
- Improve Pagination and Bulk Action Functionality in ListView [#PR 772](https://github.com/simplecrm-projects/simplecrm_v267/pull/772)
- Address User Experience Issues in Settings and File Management [#PR 791](https://github.com/simplecrm-projects/simplecrm_v267/pull/791)
- Updates to Dashlet Value Storage, Task Sorting, and Password Reset Functionality [#PR 802](https://github.com/simplecrm-projects/simplecrm_v267/pull/802)
- Restricted Access to History and Activities Subpanels for Unauthorized Users [#PR 861](https://github.com/simplecrm-projects/simplecrm_v267/pull/861)
- Compatibility Update for Next Step Button in MSSQL Environments [#PR 913](https://github.com/simplecrm-projects/simplecrm_v267/pull/913)
- Log Date and Time Display Issue in System Settings [#PR 919](https://github.com/simplecrm-projects/simplecrm_v267/pull/919)
- Checkbox Default Behavior for Missing Business Hours Data [#PR 937](https://github.com/simplecrm-projects/simplecrm_v267/pull/937)
- Default Date Sorting for Activities and History Subpanels in DetailView [#PR 940](https://github.com/simplecrm-projects/simplecrm_v267/pull/940)
- Improved Visibility and Access Controls for Survey Modules in Detail View [#PR 941](https://github.com/simplecrm-projects/simplecrm_v267/pull/941)
- Survey URL Display Restored in v300 for Survey Module [#PR 943](https://github.com/simplecrm-projects/simplecrm_v267/pull/943)
- Accurate Related Account Count Retrieval in MSSQL [#PR 964](https://github.com/simplecrm-projects/simplecrm_v267/pull/964)
- Performance Boost by Removing Unused Alert and Favorites API Calls in v267 [#PR 969](https://github.com/simplecrm-projects/simplecrm_v267/pull/969)
- Enhanced ListView Performance with Optimized Record Counts, User Data, and Subpanel Loading [#PR 972](https://github.com/simplecrm-projects/simplecrm_v267/pull/972)
- Consistent Error Messages for Delete Access Restrictions [#PR 981](https://github.com/simplecrm-projects/simplecrm_v267/pull/981)
- Performance Optimizations for History Subpanel [#PR 982](https://github.com/simplecrm-projects/simplecrm_v267/pull/982)
- Streamlining Custom Module Logic Hooks [#PR 983](https://github.com/simplecrm-projects/simplecrm_v267/pull/983)
- Ensuring Email Loading in History Subpanel [#PR 987](https://github.com/simplecrm-projects/simplecrm_v267/pull/987)
- Corrected Date and Time Display in Log Files [#PR 919](https://github.com/simplecrm-projects/simplecrm_v267/pull/919)
- Resolved Workflow Condition Value Truncation Issue [#PR 902](https://github.com/simplecrm-projects/simplecrm_v267/pull/902)
- Checkbox Behavior Adjusted for Business Hours Data [#PR 937](https://github.com/simplecrm-projects/simplecrm_v267/pull/937)
- Automatic Sorting by Date in Activities and History Subpanels [#PR 940](https://github.com/simplecrm-projects/simplecrm_v267/pull/940)
- Corrected Assignment Email Link to Use v3 URL Instead of v267 [#PR 1005](https://github.com/simplecrm-projects/simplecrm_v267/pull/1005)
- Field Configurator Enhancements and Obsolete Code Cleanup [#PR 939](https://github.com/simplecrm-projects/simplecrm_v267/pull/939)
- Survey Module Popup and Relate Field Default Module Improvements [#PR 995](https://github.com/simplecrm-projects/simplecrm_v267/pull/995)
- Patch Update: Fix for Email Type Display in History Subpanel [#PR 989](https://github.com/simplecrm-projects/simplecrm_v267/pull/989)
- Patch for V3 Username Validation Response Changes [#PR 996](https://github.com/simplecrm-projects/simplecrm_v267/pull/996)
- Limited Editing Access for Key Fields by Regular Users [#PR 1019](https://github.com/simplecrm-projects/simplecrm_v267/pull/1019)
- Fix Link in Assignment Email to Open Correct App Version (v300) [#PR 1005](https://github.com/simplecrm-projects/simplecrm_v267/pull/1005)
- Performance Improvements and Bug Fixes for User and Configuration APIs [#PR 1018](https://github.com/simplecrm-projects/simplecrm_v267/pull/1018)
- Added Missing Static Declaration to loadUserOnSession Function [#PR 1020](https://github.com/simplecrm-projects/simplecrm_v267/pull/1020)

## QA Test Cases
[Request to View](https://docs.google.com/spreadsheets/d/1_xGnx3-aVKtq6F1zorr2pqCq-I3_lJbuKyLcx9EfI0Y/edit?gid=549598594#gid=549598594)

**Release Date:** 10-12-2024
