/*
 *  Copyright 2012 Research In Motion Limited.
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
var Whitelist = require('../policy/whitelist').Whitelist,
    ACCEPT_RESPONSE = {setAction: "ACCEPT"},
    DENY_RESPONSE = {setAction: "DENY"},
    SUBSTITUTE_RESPONSE = {setAction: "SUBSTITUTE"},
    utils = require('../utils');

function _formMessage(url, origin, sid, body, securityOrigin, webview) {
    var tokens = url.split(utils.getURIPrefix())[1].split("/"),
        //Handle the case where the method is multi-level
        finalToken = (tokens[3] && tokens.length > 4) ? tokens.slice(3).join('/') : tokens[3];

    return {
        request : {
            params : {
                service : tokens[0],
                action : tokens[1],
                ext : tokens[2],
                method : (finalToken && finalToken.indexOf("?") >= 0) ? finalToken.split("?")[0] : finalToken,
                args : (finalToken && finalToken.indexOf("?") >= 0) ? finalToken.split("?")[1] : null
            },
            body : body,
            origin : origin,
            securityOrigin: securityOrigin

        },
        response : {
            send : function (code, data) {
                var responseText;
                if (typeof(data) === 'string') {
                    responseText = data;
                } else {
                    responseText =  JSON.stringify(data);
                }

                webview.notifyOpen(sid, code, "OK");
                webview.notifyHeaderReceived(sid, "Access-Control-Allow-Origin", "*");
                webview.notifyHeaderReceived(sid, "Access-Control-Allow-Origin", securityOrigin);
                webview.notifyHeaderReceived(sid, "Access-Control-Allow-Headers", "Content-Type");
                webview.notifyDataReceived(sid, responseText, responseText.length);
                webview.notifyDone(sid);
            }
        }
    };
}

function onNetworkResourceRequested(value) {
    var obj = JSON.parse(value),
        response,
        url = obj.url,
        body = obj.body,
        whitelist = new Whitelist(),
        server,
        message,
        sid = obj.streamId,
        origin = obj.referrer,
        isXHR = obj.targetType === "TargetIsXMLHTTPRequest",
        //Assumes its a navigation request if the target is the main frame
        isNav = obj.targetType === "TargetIsMainFrame",
        securityOrigin = obj.securityOrigin,
        hasAccess = whitelist.isAccessAllowed(url, isXHR),
        deniedMsg;

    //If the URL starts with the prefix then its a request from an API
    //In this case we will hijack and give our own response
    //Otherwise follow whitelisting rules
    if (url.match("^" + utils.getURIPrefix())) {
        server = require("../server");
        message = _formMessage(url, origin, sid, body, securityOrigin, this.webview);
        response = SUBSTITUTE_RESPONSE;
        server.handle(message.request, message.response, this.webview);
    } else {
        //Whitelisting will not prevent navigation, ONLY we will
        if (hasAccess) {
            response = ACCEPT_RESPONSE;
        } else {
            response = DENY_RESPONSE;
            url = utils.parseUri(url);
            deniedMsg = "Access to \"" + url.source + "\" not allowed";
            //Denied navigation requests are sent to the inApp browser rather than an alert
            if (isNav) {
                this.webview.uiWebView.childwebviewcontrols.open(url.source);
            } else {
                this.webview.executeJavaScript("alert('" + deniedMsg + "')");
            }
        }
    }

    if (response) {
        return JSON.stringify(response);
    }
}

function NetworkResourceRequestHandler(webview) {
    this.webview = webview;
    this.networkResourceRequestedHandler = onNetworkResourceRequested.bind(this);
}

module.exports = {
    createHandler: function (webview) {
        return new NetworkResourceRequestHandler(webview);
    }
};