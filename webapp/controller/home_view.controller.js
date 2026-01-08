
sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("app01.controller.home_view", {
        onInit: function () {
            
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("Routedashboard").attachPatternMatched(this._onObjectMatched, this);

        // Initialize the model
        var oModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oModel);
    },

    _onObjectMatched: function (oEvent) {
        var user_name = oEvent.getParameter("arguments").name;
        var pass_word = oEvent.getParameter("arguments").pass;
        this.getView().getModel().setProperty("/password", pass_word);
        this.getView().getModel().setProperty("/username", user_name);

        },

        loginButton: function () {
            let username = this.getView().byId("input1").getValue();
            let password = this.getView().byId("input2").getValue();
            // alert("Username : " + username + "\nPassword : " + password);
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Routedashboard",{
                name:username,
                pass:password
            });

        }
    });
});
