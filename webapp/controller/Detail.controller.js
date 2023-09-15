sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/model/json/JSONModel",
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
      "use strict";
  
      return Controller.extend("exam.exprogramb17.controller.Detail", {
        onInit : function () {
            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteDetail").attachPatternMatched(this._onPatternMatched, this);
          },
          _onPatternMatched: function (oEvent) {

            let oParam = oEvent.getParameters().arguments;
  
            let oModel = this.getView().getModel();
  
            let sPath = oModel.createKey('/carrierSet', {
              Carrid : oParam.paramId
            });
            oModel.read(sPath, {
              urlParameters: {
                '$expand' : 'to_Flight'
              },
              success: function (oReturn) {
                let oModel = new JSONModel(oReturn.to_Flight.results);
                this.getView().setModel(oModel,'fly');
              }.bind(this),
              error: function (oError) {
              }
            })
  
          },
          onNavMain: function () {
            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo('RouteMain');  // 돌아가기 + 로그 클리어 
            
        }
      });
    }
  );
  