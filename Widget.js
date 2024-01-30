///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define([
  'dojo/_base/declare',
  'esri/tasks/query',
  'esri/tasks/QueryTask', 
  'dojo/dom-construct',
  'dojo/_base/array', 
  'dojo/_base/lang',
  'dojo/query',
  'dojo/on',
  'dojo/Deferred',
  'dojo/promise/all',
  'jimu/BaseWidget', 
  'esri/layers/FeatureLayer', 
  'esri/layers/MapImageLayer', 
  'esri/graphic',
  'esri/tasks/GPMessage',
  'esri/tasks/Geoprocessor',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/SimpleFillSymbol',
  'esri/Color',
  'esri/request',
  "esri/SpatialReference",
  'jimu/dijit/Report', 
  'jimu/dijit/PageUtils',
  "dojo/domReady!"
],
function(declare, Query, QueryTask, domConstruct, array, lang, query, on, Deferred, all, BaseWidget,FeatureLayer,MapImageLayer,Graphic,GPMessage, Geoprocessor,SimpleMarkerSymbol,SimpleLineSymbol,SimpleFillSymbol,Color,esriRequest,SpatialReference,Report,PageUtils) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {
    featureArray: new Array(),
    featureSet: null,
    selChgEvt: null,
    clearFeatsEvt: null,
    baseClass: 'jimu-widget-sectores-ap',
    sueeem: '',
    FeatureServer: '',
    layers: [],
    numeroServicios: 0,
    cantidadClientes: 0,
    metrosRedes: 0.00,

    postCreate: function() {
      this.inherited(arguments);
      this.eventoMapaServiciosAP();
      console.log('postCreate');
    },
    startup: function() {
      this.inherited(arguments);
      this.sueeem = this.config.sueeem
      this.FeatureServer = this.config.FeatureServer
      this.layers = this.config.layers
      console.log('startup');
    },
    onOpen: function(){
      console.log('onOpen');
      this.clear();
      this.sueeem = this.config.sueeem
      this.FeatureServer = this.config.FeatureServer
      this.layers = this.config.layers
      this.postOpenSectoresAP();
      this.getPanel().setPosition({relativeTo: "map", top: 30, right: 5, width: 420, height:800});
    },
    onClose: function(){
      console.log('onClose');
    },
    onMinimize: function(){
      console.log('onMinimize');
    },
    onMaximize: function(){
      console.log('onMaximize');
    },
    onSignIn: function(credential){
      /* jshint unused:false*/
      console.log('onSignIn');
    },
    onSignOut: function(){
      console.log('onSignOut');
    },
    postOpenSectoresAP: function(){
      var that = this;
      console.log('postOpenSectoresAP');
      extractData = that.extractData;
      radioSelect = funcionRadioSelect;
      Sectorizar = fn_Sectorizar;
      /*- formulario para Sectorizar*/
      var inlineRadio1 = document.getElementById("Radio1")
      var input1 = document.getElementById("input1")
      var inlineRadio2 = document.getElementById("Radio2")
      var input2 = document.getElementById("input2")
      var inlineRadio3 = document.getElementById("Radio3")
      var input3 = document.getElementById("input3")
      /*-*/
      var btnMostrarSector  = document.getElementById("btnMostrarSector")
      btnMostrarSector.disabled = true;
      
      function funcionRadioSelect(id){
        console.log(id);
        if(id == "Radio1") input1.placeholder = that.sueeem;
        else  {
          input1.placeholder = "";
          inlineRadio1.checked = false
        };

        if(id == "Radio2") input2.placeholder = that.sueeem;
        else  {
          input2.placeholder = "";
          inlineRadio2.checked = false
        };

        if(id == "Radio3") input3.placeholder = that.sueeem;
        else  {
          input3.placeholder = "";
          inlineRadio3.checked = false
        };
        
        if(id == "RadioA") inputA.placeholder = that.sueeem;
        else  {
          inputA.placeholder = "";
        };

        if(id == "RadioB") inputB.placeholder = that.sueeem;
        else  {
          inputB.placeholder = "";
        };

        if(id == "RadioC") inputC.placeholder = that.sueeem;
        else  {
          inputC.placeholder = "";
        };
        if(inlineRadio1.checked && input1.value){
          btnMostrarSector.disabled = false;
        }else if(inlineRadio2.checked && input2.value){
          btnMostrarSector.disabled = false;
        }else if(inlineRadio3.checked && input3.value){
          btnMostrarSector.disabled = false;
        }else{
          btnMostrarSector.disabled = true;
        }
      }
      function fn_Sectorizar(){
        that.map.graphics.clear();
        if(inlineRadio1.checked && input1.value){
          that.get_Sectorizar(input1.alt);
        }else if(inlineRadio2.checked && input2.value){
          that.get_Sectorizar(input2.alt);
        }else if(inlineRadio3.checked && input3.value){
          that.get_Sectorizar(input3.alt);
        }
      }
    },
    resumenSectorAP: function(){
      that = this;
      that.clearNode("zoneInfo");
      console.log('resumenSectorAP');

      function sector(){
        var inlineRadio1 = document.getElementById("Radio1")
        var inlineRadio2 = document.getElementById("Radio2")
        var inlineRadio3 = document.getElementById("Radio3")
        var inlineRadioA = document.getElementById("RadioA")
        var inlineRadioB = document.getElementById("RadioB")
        var inlineRadioC = document.getElementById("RadioC")

        if(inlineRadio1.checked){
          return inlineRadio1.value;
        }else if(inlineRadio2.checked){
          return inlineRadio2.value;
        }else if(inlineRadio3.checked){
          return inlineRadio3.value;
        }else if(inlineRadioA.checked){
          return inlineRadioA.value;
        }else if(inlineRadioB.checked){
          return inlineRadioB.value;
        }else if(inlineRadioC.checked){
          return inlineRadioC.value;
        }else{
          return "";
        }
      }

      ahora = that.thisNow();
      var tarjetaSectorAP  = domConstruct.create("div",  {'id':'card_ap_'.concat(ahora), 'class':'card bg-light mb-3'}, "zoneInfo");
      var cabeceraSectorAP = domConstruct.create("div",  {'id':'head_ap_'.concat(ahora), 'class':'card-header text-center'}, tarjetaSectorAP);
      var cuerpoSectorAP   = domConstruct.create("div",  {'id':'body_ap_'.concat(ahora), 'class':'card-body'}, tarjetaSectorAP);
      var pieSectorAP      = domConstruct.create("div",  {'id':'foot_ap_'.concat(ahora), 'class':'card-footer'}, tarjetaSectorAP);
      cuerpoSectorAP.style.padding = ".25rem"
      //cabecera
      cabeceraSectorAP.innerHTML = "<h5>Datos " + sector() + "</h5>";

      //datos sector
      var table = domConstruct.create("table", {'id':'tT_'.concat(ahora), 'class':'table table-condensed'}, cuerpoSectorAP);
      var tBody = domConstruct.create("tbody", {'id':'bT_'.concat(ahora), 'class':''}, table);

      //Cantidad de Servicios
      var dat = tBody.insertRow(-1);
      var name = dat.insertCell(-1);
      name.style.padding = ".1rem";
      name.innerHTML = "Número de servicios";
      var dosPunto = dat.insertCell(-1);
      dosPunto.style.padding = ".1rem";
      dosPunto.innerHTML = ":";
      var value = dat.insertCell(-1);
      value.style.padding = ".1rem";
      value.innerHTML =  this.numeroServicios;
      var end = dat.insertCell(-1);
      end.style.padding = ".1rem";
      end.innerHTML =  "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

      //Cantidad de Clientes
      var dat = tBody.insertRow(-1);
      var name = dat.insertCell(-1);
      name.style.padding = ".1rem"
      name.innerHTML = "Cantidad de clientes";
      var dosPunto = dat.insertCell(-1);
      dosPunto.style.padding = ".1rem";
      dosPunto.innerHTML = ":";
      var value = dat.insertCell(-1);
      value.style.padding = ".1rem";
      value.innerHTML =  this.cantidadClientes;
      var end = dat.insertCell(-1);
      end.style.padding = ".1rem";
      end.innerHTML =  "&nbsp;";

      //Metros lineales
      var dat = tBody.insertRow(-1);
      var name = dat.insertCell(-1);
      name.style.padding = ".1rem";
      name.innerHTML = "Metros de Red";
      var dosPunto = dat.insertCell(-1);
      dosPunto.style.padding = ".1rem";
      dosPunto.innerHTML = ":";
      var value = dat.insertCell(-1);
      value.style.padding = ".1rem";
      value.innerHTML =  this.metrosRedes.toFixed(2);
      var end = dat.insertCell(-1);
      end.style.padding = ".1rem";
      end.innerHTML =  "&nbsp;";
    },
    get_Sectorizar: function(query_str){
      var that = this;
      that.numeroServicios = 0;
      that.cantidadClientes = 0;
      that.metrosRedes = 0;
      
      var query = new Query();
      query.where = query_str;
      query.returnGeometry = true;
      query.outFields = ['*'];
      query.outSpatialReference= new SpatialReference(102100);
      that.layers.forEach(ly =>{
        var qt = new QueryTask(that.FeatureServer + ly);
        qt.execute(query, function (response) {
          response.features.forEach(ft => {
            if (ly == '501'){
              if (ft.attributes['cantidad_cliente'] > 0){
                that.numeroServicios++;
                that.cantidadClientes += ft.attributes['cantidad_cliente'];
              }
            }
            if (ly == '515'){
              var METROSLINEALES = ft.attributes.Shape__Length.toFixed(2);
              that.metrosRedes += parseFloat(METROSLINEALES)
            }
            that.resaltarAPEnMapa(ft, [255,0,255], 16);
            that.resumenSectorAP();
          })
        });
      })
      // that.resumenSectorAP();
    },
    eventoMapaServiciosAP: function(){
      that = this;
      that.own(this.setFeatsEvt = on(that.map.infoWindow, "set-features", lang.hitch(this, function(){
        that.clear()
        //enable navigation if more than one feature is selected
        if(this.map.infoWindow.features.length > 0){
          /*- formulario para direcciones*/;
          this.map.infoWindow.features.forEach(feature => {
            var layerID = feature.getLayer().id;
            if(layerID.includes('potable')||layerID.includes('POTABLE')||layerID.includes('Potable')){
              that.resaltarAPEnMapa(feature, [255,0,255], 16)
              that.selectObject(feature);
            }
          });
        } else {
          that.clear();
        }
      })));
      that.own(this.selChgEvt = on(that.map.infoWindow, "selection-change", lang.hitch(this, function (evt) {
        if(evt.target.getSelectedFeature()){
          // this.map.graphics.clear();
          // this.clear();
          console.log("selection-change\n", evt.target)
        }
      })));

      that.own(this.clearFeatsEvt = on(that.map.infoWindow, "clear-features", lang.hitch(this, function (evt) {
        if(!evt.isIntermediate){
          that.clear();
          that.postOpenSectoresAP();
        }
      })));
    },
    selectObject: function(featureSet){
      var subtitulo = document.getElementById("subtitulo");
      var nombreCapa = featureSet.getLayer().name;
      var identiCapa = featureSet.getLayer().id;
      console.log(featureSet.getLayer().id)
    
      if(identiCapa.includes('POTABLE')){
        subtitulo.innerHTML = "<h6>"+nombreCapa+"</h6>";

        var assetid = featureSet.attributes["assetid"];
        var systemsubnetwork = featureSet.attributes["systemsubnetworkname"];
        var pressuresubnetwork = featureSet.attributes["pressuresubnetworkname"];
        var isolationsubnetwork = featureSet.attributes["isolationsubnetworkname"];
        slct_UTILITY(assetid, systemsubnetwork,pressuresubnetwork, isolationsubnetwork);
        
        var codigo_sector_distribucion = featureSet.attributes["codigo_sector_distribucion"];
        var codigo_sector_presion = featureSet.attributes["codigo_sector_presion"];
        var codigo_cuartel = featureSet.attributes["codigo_cuartel"];
        slct(assetid,codigo_sector_distribucion,codigo_sector_presion, codigo_cuartel);

        document.getElementById("zoneInfo").innerHTML = "";
      } else {
        slct_UTILITY(null, null, null, null);
        slct(null, null, null, null);
        document.getElementById("zoneInfo").innerHTML = "<h6>Seleccione un objeto de Water Utility Network. . .</h6>";
        subtitulo.innerHTML = "";
      };

      function slct_UTILITY(assetid, systemsubnetwork, pressuresubnetwork, isolationsubnetwork){
        //utility
        var radioA = document.getElementById("RadioA");
        var radioB = document.getElementById("RadioB");
        var radioC = document.getElementById("RadioC");
        var inputA = document.getElementById("inputA");
        var inputB = document.getElementById("inputB");
        var inputC = document.getElementById("inputC");

        inputA.value = systemsubnetwork;
        inputA.alt = "systemsubnetworkname = '" + systemsubnetwork + "'";
        inputB.value = pressuresubnetwork;
        inputB.alt = "pressuresubnetworkname = '" + pressuresubnetwork + "'";
        inputC.value = isolationsubnetwork;
        inputC.alt = "isolationsubnetworkname = '" + isolationsubnetwork + "'";

        /*-* /
        var btnMostrarSector = document.getElementById("btnMostrarSector");

        if(radioA.checked && inputA.value){
          btnMostrarSector.disabled = false;
        }else if(radioB.checked && inputB.value){
          btnMostrarSector.disabled = false;
        }else if(radioC.checked && inputC.value){
          btnMostrarSector.disabled = false;
        }else{
          btnMostrarSector.disabled = true;
        }
        /*-*/
      }
      function slct(assetid, codigo_sector_distribucion,codigo_sector_presion, codigo_cuartel){
        //no utility
        var radio1 = document.getElementById("Radio1");
        var radio2 = document.getElementById("Radio2");
        var radio3 = document.getElementById("Radio3");
        var input1 = document.getElementById("input1");
        var input2 = document.getElementById("input2");
        var input3 = document.getElementById("input3");

        input1.value = codigo_sector_distribucion;
        input1.alt = "codigo_sector_distribucion = '" + codigo_sector_distribucion + "'";
        input2.value = codigo_sector_presion;
        input2.alt = "codigo_sector_presion = '" + codigo_sector_presion + "'";
        input3.value = codigo_cuartel;
        input3.alt = "codigo_cuartel = '" + codigo_cuartel + "'";

        var btnMostrarSector = document.getElementById("btnMostrarSector");

        if(radio1.checked && input1.value){
          btnMostrarSector.disabled = false;
        }else if(radio2.checked && input2.value){
          btnMostrarSector.disabled = false;
        }else if(radio3.checked && input3.value){
          btnMostrarSector.disabled = false;
        }else{
          btnMostrarSector.disabled = true;
        }
      }
    },
    resaltarAPEnMapa(feature, RGBA, size){
      if (feature){
        console.log("add feature in map:", feature)
        var L = RGBA.length;
        var Sector = (L > 0) ? RGBA[0] : 0;
        var G = (L > 1) ? RGBA[1] : 128; 
        var B = (L > 2) ? RGBA[2] : 224;
        var A = (L > 3) ? RGBA[3] : 0.75;
        var SIZE = (size > 0) ? size : 12;
        //pintado
        if (feature.geometry.type == "point" ||feature.geometry.type == "multiPoint") {
          //linea
          var simbologia = new SimpleMarkerSymbol(
            SimpleMarkerSymbol.STYLE_CIRCLE, 
            SIZE,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([Sector,G,B]), 4),
            new Color([Sector,G,B,A])
          );
        }
        else if (feature.geometry.type == "line" ||feature.geometry.type == "polyline") {
          var simbologia = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([Sector,G,B]), 4);
        }
        
        var graphicElemnts = new Graphic(feature.geometry, simbologia, feature.attributes);
        this.map.graphics.add(graphicElemnts);
        // var stateExtent = feature.geometry.getExtent();//.expand(5.0);
        // this.map.setExtent(stateExtent);
      };
    },
    clear : function (){
      var that = this;
      this.map.graphics.clear();
      console.clear();
      // that.clearNode("Sectorizar");
      that.clearNode("zoneInfo");
      document.getElementById("Sectorizar").style.display = "block";
      
      document.getElementById("RadioA").checked = false;
      document.getElementById("RadioB").checked = false;
      document.getElementById("RadioC").checked = false;
      document.getElementById("Radio1").checked = false;
      document.getElementById("Radio2").checked = false;
      document.getElementById("Radio3").checked = false;


      var input1 = document.getElementById("input1");
      input1.value = "";
      input1.alt = "1 = 1";
      input1.placeholder = that.sueeem;
      var input2 = document.getElementById("input2");
      input2.value = "";
      input2.alt = "1 = 1";
      input2.placeholder = that.sueeem;
      var input3 = document.getElementById("input3");
      input3.value = "";
      input3.alt = "1 = 1";
      input3.placeholder = that.sueeem;

      var inputA = document.getElementById("inputA");
      inputA.value = "";
      inputA.alt = "1 = 1";
      inputA.placeholder = that.sueeem;
      var inputB = document.getElementById("inputB");
      inputB.value = "";
      inputB.alt = "1 = 1";
      inputB.placeholder = that.sueeem;
      var inputC = document.getElementById("inputC");
      inputC.value = "";
      inputC.alt = "1 = 1";
      inputC.placeholder = that.sueeem;

      that.clearNode("subtitulo");
      this.getPanel().setPosition({relativeTo: "map", top: 30, right: 5, width: 420, height:800});
    },
    clearNode: function(nameNode) {
      var node = document.getElementById(nameNode);
      while (node.hasChildNodes()) {
        node.removeChild(node.firstChild);
      };
    },
    thisNow: function() {
      var that = this;
      var ahora = new Date(Date.now())
      var esteAño = ahora.getFullYear();
      var esteMes = ahora.getMonth() + 1;
      var esteDia = ahora.getDate();

      var valor = esteAño;
      valor += "-";
      if (esteMes < 10) valor += "0" + esteMes;
      else valor += esteMes;
      valor += "-";
      if (esteDia < 10) valor += "0" + esteDia;
      else valor += esteDia;

      return valor;
    }
  });
});