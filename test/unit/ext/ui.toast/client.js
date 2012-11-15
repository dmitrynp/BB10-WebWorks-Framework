/*
 * Copyright 2010-2011 Research In Motion Limited.
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

var root = __dirname + "/../../../../",
    apiDir = root + "ext/ui.toast/",
    client = null,
    ID = require(apiDir + "/manifest").namespace,
    danielCraig,
    mockBlackberry,
    mockedWebworks;

describe("ui.toast", function () {
    beforeEach(function () {
        //Set up mocking, no need to "spyOn" since spies are included in mock
        GLOBAL.window = GLOBAL;
        client = require(apiDir + "/client");

        danielCraig = jasmine.createSpy();

        mockedWebworks = {
            execSync: jasmine.createSpy(),
            event: {
                add: function (feature, name, callback) {
                    danielCraig();
                    return;
                }
            }
        };

        GLOBAL.window.webworks = mockedWebworks;
    });

    it("creates a simple toast", function () {
        var message = "this is a simple toast";

        client.show(message);
        expect(mockedWebworks.execSync).toHaveBeenCalledWith(ID, "show", { message: message });
    });

    it("creates a complex toast with click and dismiss handlers", function () {
        var message = "this is a complex toast",
            buttonText = "button!",
            buttonCallback = jasmine.createSpy(),
            dismissCallback = jasmine.createSpy();

        client.show(message, buttonText, buttonCallback, dismissCallback);
        expect(mockedWebworks.execSync).toHaveBeenCalledWith(ID, "show", { message: message, buttonText: buttonText });
        expect(danielCraig.callCount).toBe(2);
    });

    it("creates a complex toast with only click handler", function () {
        var message = "this is a complex toast",
            buttonText = "button!",
            buttonCallback = jasmine.createSpy();

        client.show(message, buttonText, buttonCallback, null);
        expect(mockedWebworks.execSync).toHaveBeenCalledWith(ID, "show", { message: message, buttonText: buttonText });
        expect(danielCraig.callCount).toBe(1);
    });

    it("creates a complex toast with only dismiss handler", function () {
        var message = "this is a complex toast",
            buttonText = "button!",
            dismissCallback = jasmine.createSpy();

        client.show(message, buttonText, null, dismissCallback);
        expect(mockedWebworks.execSync).toHaveBeenCalledWith(ID, "show", { message: message, buttonText: buttonText });
        expect(danielCraig.callCount).toBe(1);
    });

    it("creates a complex toast with no handlers", function () {
        var message = "this is a complex toast",
            buttonText = "button!";

        client.show(message, buttonText, null, null);
        expect(mockedWebworks.execSync).toHaveBeenCalledWith(ID, "show", { message: message, buttonText: buttonText });
        expect(danielCraig.callCount).toBe(0);
    });
});