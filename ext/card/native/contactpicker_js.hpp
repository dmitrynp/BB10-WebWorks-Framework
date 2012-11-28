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

#ifndef CONTACT_PICKER_JS_HPP_
#define CONTACT_PICKER_JS_HPP_

#include <json/value.h>
#include <string>
#include <QCoreApplication>
#include <QThread>
#include <plugin.h>
#include "event_thread.hpp"

#define EVENT_ID_DONE "invokeContactPicker.doneEventId"
#define EVENT_ID_CANCEL "invokeContactPicker.cancelEventId"
#define EVENT_ID_ERROR "invokeContactPicker.errorEventId"

class ContactPicker : public JSExt
{
public:
    explicit ContactPicker(const std::string& id);
    virtual ~ContactPicker() {}
    virtual std::string InvokeMethod(const std::string& command);
    virtual bool CanDelete();
    void NotifyEvent(const std::string& eventId, const std::string& event);

private:
    std::string m_id;
    EventThread m_eventThread;
};

#endif // CONTACT_PICKER_JS_HPP_
