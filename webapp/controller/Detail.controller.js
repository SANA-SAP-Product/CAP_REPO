
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/BusyIndicator"
], function (Controller, MessageToast, MessageBox, JSONModel, BusyIndicator) {
  "use strict";
// +UA changes test
  return Controller.extend("app01.controller.Detail", {
    /**
     * Lifecycle hook: onInit
     * - Set up a local ViewModel to store UI state (username/password, busy, etc.)
     * - Optionally access i18n model if available
     * - Attach any required event delegates
     */
    onInit: function () {
      // Local (view) model to manage state
      var oViewModel = new JSONModel({
        user: {
          username: "",
          password: ""
        },
        busy: false,
        isLoggedIn: false
      });

      this.getView().setModel(oViewModel, "view");

      // If you use routing, you can attach route matched here
      // this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      // this._oRouter.getRoute("detail").attachPatternMatched(this._onRouteMatched, this);

      // Example: read i18n safely (if the component has it)
      this._oI18n = this.getOwnerComponent?.().getModel?.("i18n");

      // Optional: focus username on first render
      this.getView().addEventDelegate({
        onAfterShow: function () {
          var oInput = this.byId("usernameInput");
          if (oInput) {
            oInput.focus();
          }
        }.bind(this)
      });
    },

    /**
     * Handler for login button press (wired via press="onLoginPress" in XML)
     * - Validates input
     * - Shows BusyIndicator during async simulation
     * - Sets login state and shows feedback messages
     */
    onLoginPress: function () {
      var oView = this.getView();
      var oViewModel = oView.getModel("view");

      var sUsername = this._getTrimmedValue("usernameInput");
      var sPassword = this._getTrimmedValue("passwordInput");

      // Simple validation
      var aErrors = [];
      if (!sUsername) {
        aErrors.push("Username is required.");
        this._setValueState("usernameInput", "Error", "Please enter your username");
      } else {
        this._setValueState("usernameInput", "None");
      }

      if (!sPassword) {
        aErrors.push("Password is required.");
        this._setValueState("passwordInput", "Error", "Please enter your password");
      } else {
        this._setValueState("passwordInput", "None");
      }

      if (aErrors.length) {
        MessageBox.warning(aErrors.join("\n"), {
          title: "Missing Information"
        });
        return;
      }

      // Set model user state
      oViewModel.setProperty("/user/username", sUsername);
      oViewModel.setProperty("/user/password", sPassword);

      // Show busy while we "authenticate"
      this._setBusy(true);
      BusyIndicator.show(0);

      // Simulate async authentication (replace with real service call)
      setTimeout(function () {
        this._setBusy(false);
        BusyIndicator.hide();

        // Example: dummy check – accept any non-empty creds
        var bSuccess = true;
        if (bSuccess) {
          oViewModel.setProperty("/isLoggedIn", true);
          MessageToast.show("Signed in successfully. Welcome, " + sUsername + "!");
          // Optionally navigate to another route:
          // this._oRouter.navTo("home", {}, true /* replace */);
        } else {
          MessageBox.error("Invalid username or password.");
        }
      }.bind(this), 800);
    },

    /**
     * Utility: Get trimmed value from an Input by ID
     */
    _getTrimmedValue: function (sControlId) {
      var oInput = this.byId(sControlId);
      return (oInput && oInput.getValue ? oInput.getValue().trim() : "");
    },

    /**
     * Utility: Set value state and (optional) message on an Input
     */
    _setValueState: function (sControlId, sState, sText) {
      var oControl = this.byId(sControlId);
      if (oControl && oControl.setValueState) {
        oControl.setValueState(sState);
        if (oControl.setValueStateText && sText) {
          oControl.setValueStateText(sText);
        }
      }
    },

    /**
     * Utility: Set busy on view & optional page
     */
    _setBusy: function (bBusy) {
      var oViewModel = this.getView().getModel("view");
      oViewModel.setProperty("/busy", bBusy);

      var oPage = this.byId("dashboardPage"); // matches your XML Page id
      if (oPage && oPage.setBusy) {
        oPage.setBusy(bBusy);
      }
    },

    /**
     * (Optional) Handler if you add events to menuButton or userButton later
     */
    onMenuPress: function () {
      MessageToast.show("Menu clicked.");
    },

    onUserPress: function () {
      var sUsername = this.getView().getModel("view").getProperty("/user/username");
      MessageToast.show(sUsername ? ("Hello, " + sUsername) : "Hello User");
    }

    // If using routing:
    // _onRouteMatched: function (oEvent) {
    //   // Handle route parameters and initialize view state for detail route
    // }
  });
});
