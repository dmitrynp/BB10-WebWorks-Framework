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
var _apiDir = __dirname + "./../../../../ext/pim.calendar/",
    _libDir = __dirname + "./../../../../lib/",
    utils = require(_libDir + "utils"),
    events = require(_libDir + "event"),
    CalendarFindOptions = require(_apiDir + "CalendarFindOptions"),
    index,
    mockJnextObjId = 123;

describe("pim.calendar/index", function () {
    beforeEach(function () {
        GLOBAL.JNEXT = {
            require: jasmine.createSpy("JNEXT.require").andCallFake(function () {
                return true;
            }),
            createObject: jasmine.createSpy("JNEXT.createObject").andCallFake(function () {
                return mockJnextObjId;
            }),
            invoke: jasmine.createSpy("JNEXT.invoke"),
            registerEvents: jasmine.createSpy("JNEXT.registerEvent")
        };
        spyOn(events, "trigger");
        index = require(_apiDir + "index");
    });

    afterEach(function () {
        GLOBAL.JNEXT = null;
        index = null;
    });

    it("JNEXT require/createObject/registerEvents are called upon requiring index", function () {
        expect(JNEXT.require).toHaveBeenCalledWith("libpimcalendar");
        expect(JNEXT.createObject).toHaveBeenCalledWith("libpimcalendar.PimCalendar");
        expect(JNEXT.registerEvents).toHaveBeenCalled();
    });

    it("find - with correct permission specified", function () {
        var successCb = jasmine.createSpy(),
            failCb = jasmine.createSpy(),
            findOptions = {};

        spyOn(utils, "hasPermission").andReturn(true);
    });
});
