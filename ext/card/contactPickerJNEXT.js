/*
* Copyright 2012 Research In Motion Limited.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var _event = require("../../lib/event"),
    contactPicker;

///////////////////////////////////////////////////////////////////
// JavaScript wrapper for JNEXT plugin for connection
///////////////////////////////////////////////////////////////////

JNEXT.ContactPicker = function () {
    var self = this,
        hasInstance = false;

    self.invoke = function (options) {
        console.log("Hello I am in JNEXT invoke");
        console.log(options);
        JNEXT.invoke(self.m_id, "invoke " + JSON.stringify(options));
    };

    self.onEvent = function (strData) {
        console.log("onEvent, strData=" + strData);
        var arData = strData.split(" "),
            strEventDesc = arData[0],
            args = {},
            callbackType,
            callback;

        if (strEventDesc === "result") {
            args.result = escape(strData.split(" ").slice(2).join(" "));
            _event.trigger(arData[1], args.result);
        }
    };

    self.getId = function () {
        return self.m_id;
    };

    self.init = function () {
        if (!JNEXT.require("libcontactpicker")) {
            return false;
        }

        self.m_id = JNEXT.createObject("libcontactpicker.ContactPicker");

        if (self.m_id === "") {
            return false;
        }

        JNEXT.registerEvents(self);
    };

    self.m_id = "";

    self.getInstance = function () {
        if (!hasInstance) {
            hasInstance = true;
            self.init();
        }
        return self;
    };

};

contactPicker = new JNEXT.ContactPicker();

module.exports = {
    contactPicker: contactPicker
};
