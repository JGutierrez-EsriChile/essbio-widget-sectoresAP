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
  'jimu/BaseFeatureAction',
  'dojo/_base/array', 
  'jimu/WidgetManager'
], function(declare, BaseFeatureAction, arrayUtils, WidgetManager){
  var clazz = declare(BaseFeatureAction, {

    iconFormat: 'png',

    isFeatureSupported: function(featureSet){
      let feature = featureSet.features[0];
      var WidgetMng = WidgetManager.getInstance();
      var widgetId = this.widgetId;
      WidgetMng.loaded.forEach(thisWidget => {
        if(thisWidget.id==widgetId && (thisWidget.state=="opened" || thisWidget.state=="active")){
          thisWidget.clickMap(feature);
        };
      });
      return feature.length > 0;
    },

    onExecute: function(featureSet){
      WidgetManager.getInstance().triggerWidgetOpen(this.widgetId)
      .then(function(myWidget) {
        var vertexCount = 0;
        featureSet.features.forEach(function(f){
          f.geometry.rings.forEach(function(r){
            vertexCount += r.length;
          });
        });
      });
    }

  });
  return clazz;
});