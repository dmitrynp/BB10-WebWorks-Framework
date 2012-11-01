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

var CalenderEventFilter = function (properties) {
    this.substring = properties && properties.substring ? properties.substring : "";
    this.folders = properties && properties.folders ? properties.folders : null;
    this.start = properties && properties.start ? properties.start : null;
    this.end = properties && properties.end ? properties.end : null;
    this.expandRecurring = properties && properties.expandRecurring ? properties.expandRecurring : false;
};

module.exports = CalenderEventFilter;
