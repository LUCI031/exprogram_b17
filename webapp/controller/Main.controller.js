sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("exam.exprogramb17.controller.Main", {
      onInit: function () {
        let oCurrcode = [{ curr: "USD" }, { curr: "EUR" }, { curr: "KRW" }];
        this.getView().setModel(new JSONModel(oCurrcode), "Currcode");
      },
      onSearch: function (oEvent) {
        let oCurrcode = this.byId("idCombo").getSelectedKey();
        let oInput = this.byId("idInput").getValue();
        let aFilters = [];

        if (oCurrcode) {
          aFilters.push(new Filter("Currcode", FilterOperator.EQ, oCurrcode));
        }

        if (oInput) {
          aFilters.push(
            new Filter("Carrname", FilterOperator.Contains, oInput)
          );
        }
        this.byId("idTable").getBinding("items").filter(aFilters);
      },
      onOpenDialog: function (oData,sPath) {
        let oDialog = this.byId("idDialog");
        let oModel = new JSONModel(oData);
        if (!oDialog) {
          this.loadFragment({
            name: "exam.exprogramb17.view.fragment.Dialog",
            type: "XML",
          }).then(
            function (oDialog) {
              oDialog.setModel(oModel, "items");
              oDialog.open();
            }.bind(this)
          );
        } else {
          oDialog.setModel(oModel, "items");
          oDialog.open();
        }
        // unbind(this);
        // this.setChart(sPath);
      },
      onPress: function (oEvent) {
        let oModel = this.getView().getModel();
        let sPath = oEvent.getSource().getParent().getBindingContextPath();
        this.setChart(sPath);

        oModel.read(sPath, {
          urlParameters: { $expand: "to_Item" },
          success: function (oReturn) {
            this.onOpenDialog(oReturn,sPath);
          }.bind(this),
          error: function (oError) {
            console.log(oError);
          },
        });
      },
      onClose: function (oEvent) {
        let oButton = oEvent.getSource();
        let oDialog = oButton.getParent();
        oDialog.close();
      },
      setChart: function (sPath) {
        debugger;
        let oColChart = this.getView().byId("idChart");

        let oColDataset = new sap.viz.ui5.data.FlattenedDataset({
          data: { path: sPath},
          dimensions: [
            { name: "Connid", value: "{Connid}" },
          ],
          measures: [{ name: "Seatsmax", value: "{Seatsmax}" },            
                    { name: "Seatsocc", value: "{Seatsocc}" }],
        });

        oColChart.setDataset(oColDataset);

        let oFeedItemCategory = new sap.viz.ui5.controls.common.feeds.FeedItem({
          uid: "categoryAxis",
          type: "Dimension",
          values: ["Connid"],
        });

        let oFeedItemValue = new sap.viz.ui5.controls.common.feeds.FeedItem({
          uid: "valueAxis",
          type: "Measure",
          values: ["Seatsmax","Seatsocc"],
        });

        oColChart.addFeed(oFeedItemCategory);
        oColChart.addFeed(oFeedItemValue);

        oColChart.setVizProperties({
          legendGroup: { layout: { position: "left" } },
          colorPalette: ["#5f00ff", "#ff5e00", "#ffc19e"],
        });
      },
    });
  }
);
