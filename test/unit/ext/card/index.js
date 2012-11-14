/*
 * Copyright 2011-2012 Research In Motion Limited.
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

var _apiDir = __dirname + "./../../../../ext/card/",
    _libDir = __dirname + "./../../../../lib/",
    _extDir = __dirname + "./../../../../ext/",
    mockedCamera,
    mockedFile,
    mockedCalPicker,
    mockedCalComposer,
    mockedEmailComposer,
    index,
    successCB,
    failCB;

describe("invoke.card index", function () {

    beforeEach(function () {
        mockedCamera = {
            open: jasmine.createSpy("camera.open")
        };
        mockedFile = {
            open: jasmine.createSpy("file.open")
        };
        mockedCalPicker = {
            open: jasmine.createSpy("calendarPicker.open")
        };
        mockedCalComposer = {
            open: jasmine.createSpy("calendarComposer.open")
        };
        mockedEmailComposer = {
            open: jasmine.createSpy("emailComposer.open")
        };
        GLOBAL.window = {};
        GLOBAL.window.qnx = {
            callExtensionMethod : function () {},
            webplatform: {
                getApplication: function () {
                    return {
                        cards: {
                            camera: mockedCamera,
                            file: mockedFile,
                            email: {
                                composer: mockedEmailComposer
                            },
                            calendar: {
                                picker: mockedCalPicker,
                                composer: mockedCalComposer
                            },
                        }
                    };
                }
            }
        };

        index = require(_apiDir + "index");
        successCB = jasmine.createSpy("success callback");
        failCB = jasmine.createSpy("fail callback");
    });

    afterEach(function () {
        mockedCamera = null;
        mockedCalPicker = null;
        mockedCalComposer = null;
        mockedEmailComposer = null;
        GLOBAL.window.qnx = null;
        index = null;
        successCB = null;
        failCB = null;
    });

    describe("invoke camera", function () {
        it("can invoke camera with mode", function () {
            var successCB = jasmine.createSpy(),
                mockedArgs = {
                    "mode": encodeURIComponent(JSON.stringify({mode: "photo"}))
                };

            index.invokeCamera(successCB, null, mockedArgs);
            expect(mockedCamera.open).toHaveBeenCalledWith({
                mode: "photo"
            }, jasmine.any(Function), jasmine.any(Function), jasmine.any(Function));
            expect(successCB).toHaveBeenCalled();
        });
    });
    describe("invoke file picker", function () {
        it("can invoke file picker with options", function () {
            var successCB = jasmine.createSpy(),
                mockedArgs = {
                    "mode": encodeURIComponent(JSON.stringify({options: {mode: "Picker"}}))
                };

            index.invokeCamera(successCB, null, mockedArgs);
            expect(mockedCamera.open).toHaveBeenCalledWith({
                    options: {mode: "Picker"}
                }, jasmine.any(Function), jasmine.any(Function), jasmine.any(Function));
            expect(successCB).toHaveBeenCalled();
        });
    });
    describe("invoke calendar picker", function () {
        it("can invoke calendar picker with options", function () {
            var successCB = jasmine.createSpy(),
                mockedArgs = {
                    options: encodeURIComponent(JSON.stringify({options: {filepath: "/path/to/file.vcs"}}))
                };
            index.invokeCalendarPicker(successCB, null, mockedArgs);
            expect(mockedCalPicker.open).toHaveBeenCalledWith({
                options: { filepath : "/path/to/file.vcs" }
            }, jasmine.any(Function), jasmine.any(Function), jasmine.any(Function));
            expect(successCB).toHaveBeenCalled();
        });
    });
});
