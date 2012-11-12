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
 
var _self = {},
    _ID = require("./manifest.json").namespace,
    _displayPictureEventId = "bbm.self.displayPicture",
    _profileBoxAddItemEventId = "bbm.self.profilebox.addItem",
    _profileBoxRemoveItemEventId = "bbm.self.profilebox.removeItem",
    _profileBoxRegisterIconEventId = "bbm.self.profilebox.registerIcon",
    _profileBoxGetItemIconEventId = "bbm.self.profilebox.getItemIcon";

_self.self = {};
_self.self.profilebox = {};
_self.users = {};

function getFieldValue(field) {
    var value;

    try {
        value = window.webworks.execSync(_ID, field);
    } catch (e) {
        console.error(e);
    }

    return value;
}

function defineGetter(obj, field) {
    Object.defineProperty(obj, field.split("/")[1], {
        get: function () {
            return getFieldValue(field);
        }
    });
}

function createEventHandler(onSuccess, onError, eventId) {
    var callback;

    callback = function (data) {
        if (data) {
            if (data.error) {
                if (onError && typeof onError === "function") {
                    onError(data);
                }
            } else {
                if (onSuccess && typeof onSuccess === "function") {
                    onSuccess(data.result);
                }
            }
        }
    };
    
    if (!window.webworks.event.isOn(eventId)) {
        window.webworks.event.once(_ID, eventId, callback);
    }
}

_self.register = function (options) {
    var args = { "options" : options };
    return window.webworks.execAsync(_ID, "register", args);
};

defineGetter(_self.self, "self/appVersion");
defineGetter(_self.self, "self/bbmsdkVersion");
defineGetter(_self.self, "self/displayName");
defineGetter(_self.self, "self/handle");
defineGetter(_self.self, "self/personalMessage");
defineGetter(_self.self, "self/ppid");
defineGetter(_self.self, "self/status");
defineGetter(_self.self, "self/statusMessage");

_self.self.getDisplayPicture = function (success, error) {
    var args = { "eventId" : _displayPictureEventId };
    createEventHandler(success, error, _displayPictureEventId);
    return window.webworks.execAsync(_ID, "self/getDisplayPicture", args);
};

_self.self.setStatus = function (status, statusMessage) {
    var args = { "status" : status, "statusMessage" : statusMessage };
    return window.webworks.execAsync(_ID, "self/setStatus", args);
};

_self.self.setPersonalMessage = function (personalMessage) {
    var args = { "personalMessage" : personalMessage };
    return window.webworks.execAsync(_ID, "self/setPersonalMessage", args);
};

_self.self.setDisplayPicture = function (displayPicture) {
    var args = { "displayPicture" : displayPicture };
    return window.webworks.execAsync(_ID, "self/setDisplayPicture", args);
};

_self.self.profilebox.addItem = function (options, callback) {
    var args = { "options" : options, "eventId" : _profileBoxAddItemEventId };
    createEventHandler(callback, _profileBoxAddItemEventId);
    return window.webworks.execAsync(_ID, "self/profilebox/addItem", args);
};

_self.self.profilebox.removeItem = function (options, callback) {
    var args = { "options" : options, "eventId" : _profileBoxRemoveItemEventId };
    createEventHandler(callback, _profileBoxRemoveItemEventId);
    return window.webworks.execAsync(_ID, "self/profilebox/removeItem", args); 
};

_self.self.profilebox.clearItems = function () {
    return window.webworks.execAsync(_ID, "self/profilebox/clearItems"); 
};

_self.self.profilebox.registerIcon = function (options, callback) {
    var args = { "options" : options, "eventId" : _profileBoxRegisterIconEventId };
    createEventHandler(callback, _profileBoxRegisterIconEventId);
    return window.webworks.execAsync(_ID, "self/profilebox/registerIcon", args); 
};

_self.self.profilebox.getItemIcon = function (options, callback) {
    var args = { "options" : options, "eventId" : _profileBoxGetItemIconEventId };
    return window.webworks.execAsync(_ID, "self/profilebox/getItemIcon", args); 
};

_self.users.inviteToDownload = function () {
    return window.webworks.execAsync(_ID, "users/inviteToDownload");
};

window.webworks.execSync(_ID, "registerEvents", null);

module.exports = _self;

