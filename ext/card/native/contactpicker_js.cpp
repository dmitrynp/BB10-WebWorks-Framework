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

#include <json/reader.h>
#include <json/writer.h>
#include <string>
#include <QThread>
#include <QObject>
#include <QCoreApplication>
#include "contactpicker_js.hpp"
#include "qobj.hpp"
//#include "qobj.moc"

ContactPicker::ContactPicker(const std::string& id) : m_id(id)
{
}

char* onGetObjList()
{
    // Return list of classes in the object
    static char name[] = "ContactPicker";
    return name;
}

JSExt* onCreateObject(const std::string& className, const std::string& id)
{
    // Make sure we are creating the right class
    if (className != "ContactPicker") {
        return NULL;
    }

    return new ContactPicker(id);
}

std::string ContactPicker::InvokeMethod(const std::string& command)
{
    fprintf(stderr, "ContactPicker::InvokeMethod: %s\n", command.c_str());

    unsigned int index = command.find_first_of(" ");

    string strCommand;
    string jsonObject;
    Json::Value *obj;

    if (index != std::string::npos) {
        strCommand = command.substr(0, index);
        jsonObject = command.substr(index + 1, command.length());

        // Parse the JSON
        Json::Reader reader;
        obj = new Json::Value;
        bool parse = reader.parse(jsonObject, *obj);

        if (!parse) {
            fprintf(stderr, "%s", "error parsing\n");
            return "Cannot parse JSON object";
        }
    } else {
        strCommand = command;
        obj = new Json::Value;
    }

    ContactPickerThreadInfo *thread_info = new ContactPickerThreadInfo;
    thread_info->parent = this;
    thread_info->jsonObj = obj;
    //thread_info->eventId = obj->removeMember("_eventId").asString();

    //QObj* worker = new QObj(*thread_info);
    /*
    bb::cascades::pickers::ContactPicker* m_pPicker = new bb::cascades::pickers::ContactPicker();
    m_pPicker->setMode(bb::cascades::pickers::ContactSelectionMode::Single);
    m_pPicker->setKindFilters(QSet<bb::pim::contacts::AttributeKind::Type>() << bb::pim::contacts::AttributeKind::Phone);

    bool connected = QObject::connect(m_pPicker, SIGNAL(contactsSelected(const QList<int> &)), worker, SLOT(onContactsSelected(const QList<int> &)));
    fprintf(stderr, "DEBUGQOBJ selected (s) connected? %d\n", connected);

    connected = QObject::connect(m_pPicker, SIGNAL(contactSelected(int)), worker, SLOT(onContactSelected(int)));
    fprintf(stderr, "DEBUGQOBJ selected connected? %d\n", connected);

    connected = QObject::connect(m_pPicker, SIGNAL(canceled()), worker, SLOT(onCanceled()));
    fprintf(stderr, "DEBUGQOBJ canceled connected? %d\n", connected);

    connected = QObject::connect(m_pPicker, SIGNAL(error()), worker, SLOT(onError()));
    fprintf(stderr, "DEBUGQOBJ error connected? %d\n", connected);

    m_pPicker->open();
    */
    //worker->process();

    int argc = 0;
    //char* argv[];
    QCoreApplication a(argc, 0);

    // Task parented to the application so that it
    // will be deleted by the application.
    //Task *task = new Task(&a);
    QObj* worker = new QObj(&a, *thread_info);

    // This will cause the application to exit when
    // the task signals finished.    
    //QObject::connect(worker, SIGNAL(finished()), &a, SLOT(quit()));

    // This will run the task from the application event loop.
    QTimer::singleShot(0, worker, SLOT(process()));

    a.exec();

/*
    QThread* thread = new QThread;
    QObj* worker = new QObj(*thread_info);
    QObject::connect(thread, SIGNAL(started()), worker, SLOT(process()));
    //QObject::connect(worker, SIGNAL(finished()), thread, SLOT(quit()));
    //QObject::connect(worker, SIGNAL(finished()), worker, SLOT(deleteLater()));
    //QObject::connect(thread, SIGNAL(finished()), thread, SLOT(deleteLater()));
    worker->moveToThread(thread);
    thread->start();
*/
    /*
    int index = command.find_first_of(" ");

    string strCommand;
    string jsonObject;
    Json::Value *obj;

    if (index != std::string::npos) {
        strCommand = command.substr(0, index);
        jsonObject = command.substr(index + 1, command.length());

        // Parse the JSON
        Json::Reader reader;
        obj = new Json::Value;
        bool parse = reader.parse(jsonObject, *obj);

        if (!parse) {
            fprintf(stderr, "%s", "error parsing\n");
            return "Cannot parse JSON object";
        }
    } else {
        strCommand = command;
    }

    fprintf(stderr, "strCommand: %s\n", strCommand.c_str());

    if (strCommand == "find") {
        //startThread(FindThread, obj);
    } else if (strCommand == "save") {
        //startThread(SaveThread, obj);
    } else if (strCommand == "remove") {
        //startThread(RemoveThread, obj);
    } else if (strCommand == "getCalendarFolders") {
        webworks::PimCalendarQt pim_qt;
        Json::Value result = pim_qt.GetCalendarFolders();
        Json::FastWriter writer;
        std::string str = writer.write(result);
        fprintf(stderr, "Calendar Folders Result: %s", str.c_str());
        return str;
    } else if (strCommand == "getDefaultCalendarFolder") {
        webworks::PimCalendarQt pim_qt;
        Json::Value result = pim_qt.GetDefaultCalendarFolder();
        Json::FastWriter writer;
        std::string str = writer.write(result);
        return str;
    } else if (strCommand == "getTimezones") {
        webworks::PimCalendarQt pim_qt;
        Json::Value result = pim_qt.GetTimezones();
        Json::FastWriter writer;
        std::string str = writer.write(result);
        fprintf(stderr, "Timezone Result: %s", str.c_str());
        return str;
    }
    */
    return "";
}

bool ContactPicker::CanDelete()
{
    return true;
}

// Notifies JavaScript of an event
void ContactPicker::NotifyEvent(const std::string& eventId, const std::string& event)
{
    std::string eventString = m_id + " result ";
    eventString.append(eventId);
    eventString.append(" ");
    eventString.append(event);
    SendPluginEvent(eventString.c_str(), m_pContext);
}

/*
bool PimCalendar::startThread(ThreadFunc threadFunction, Json::Value *jsonObj) {
    webworks::PimCalendarThreadInfo *thread_info = new webworks::PimCalendarThreadInfo;
    thread_info->parent = this;
    thread_info->jsonObj = jsonObj;
    thread_info->eventId = jsonObj->removeMember("_eventId").asString();

    pthread_attr_t thread_attr;
    pthread_attr_init(&thread_attr);
    pthread_attr_setdetachstate(&thread_attr, PTHREAD_CREATE_DETACHED);

    pthread_t thread;
    pthread_create(&thread, &thread_attr, threadFunction, static_cast<void *>(thread_info));
    pthread_attr_destroy(&thread_attr);

    if (!thread) {
        return false;
    }

    return true;
}


// Static functions:

void* PimCalendar::FindThread(void *args)
{
    webworks::PimCalendarThreadInfo *thread_info = static_cast<webworks::PimCalendarThreadInfo *>(args);

    webworks::PimCalendarQt pim_qt;
    Json::Value result = pim_qt.Find(*(thread_info->jsonObj));

    Json::FastWriter writer;
    std::string event = writer.write(result);

    thread_info->parent->NotifyEvent(thread_info->eventId, event);
    return NULL;
}

void* PimCalendar::SaveThread(void *args)
{
    webworks::PimCalendarThreadInfo *thread_info = static_cast<webworks::PimCalendarThreadInfo *>(args);

    webworks::PimCalendarQt pim_qt;
    Json::Value result = pim_qt.Save(*(thread_info->jsonObj));

    Json::FastWriter writer;
    std::string event = writer.write(result);

    thread_info->parent->NotifyEvent(thread_info->eventId, event);
    return NULL;
}

void* PimCalendar::RemoveThread(void *args)
{
    webworks::PimCalendarThreadInfo *thread_info = static_cast<webworks::PimCalendarThreadInfo *>(args);

    webworks::PimCalendarQt pim_qt;
    Json::Value result = pim_qt.DeleteCalendarEvent(*(thread_info->jsonObj));

    Json::FastWriter writer;
    std::string event = writer.write(result);

    thread_info->parent->NotifyEvent(thread_info->eventId, event);
    return NULL;
}
*/
