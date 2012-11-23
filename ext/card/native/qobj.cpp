#include <stdio.h>
#include <bb/cascades/pickers/ContactPicker>
#include <bb/cascades/pickers/ContactSelectionMode>
#include <QSet>
#include <QList>
#include "qobj.hpp"
#include "contactpicker_js.hpp"

QObj::QObj(const ContactPickerThreadInfo& info) : m_info(info)
{

}

void QObj::process()
{
    fprintf(stderr, "DEBUGQOBJ I am in process!%s\n", "");


    bb::cascades::pickers::ContactPicker *contactPicker = new bb::cascades::pickers::ContactPicker();
    contactPicker->setMode(bb::cascades::pickers::ContactSelectionMode::Multiple);
    contactPicker->setKindFilters(QSet<bb::pim::contacts::AttributeKind::Type>() << bb::pim::contacts::AttributeKind::Phone);
    //bool connected = QObject::connect(contactPicker, SIGNAL(contactsSelected(QList<int> &)), this, SLOT(onContactsSelected(QList<int> &)));
    bool connected = connect(contactPicker, SIGNAL(contactsSelected(const QList<int> &)), SLOT(onContactsSelected(const QList<int> &)));
    fprintf(stderr, "DEBUGQOBJ selected connected? %d\n", connected);
    //connected = QObject::connect(contactPicker, SIGNAL(canceled()), this, SLOT(onCanceled()));
    connected = connect(contactPicker, SIGNAL(canceled()), SLOT(onCanceled()));
    fprintf(stderr, "DEBUGQOBJ canceled connected? %d\n", connected);
    //connected = QObject::connect(contactPicker, SIGNAL(error()), this, SLOT(onError()));
    connected = connect(contactPicker, SIGNAL(error()), SLOT(onError()));
    fprintf(stderr, "DEBUGQOBJ error connected? %d\n", connected);
    contactPicker->open();

    fprintf(stderr, "DEBUGQOBJ after!%s\n", "");
    // call NotifyEvent
    //m_info.parent->NotifyEvent(EVENT_ID_DONE/*m_info.eventId*/, "{result: 123456}");

    // should delete m_info here

   // emit finished();
}

void QObj::onContactsSelected(const QList<int>& contactsSelected)
{
    fprintf(stderr, "DEBUGQOBJ onContactsSelected!%s\n", "");

    for (int i = 0; i < contactsSelected.size(); i++) {
        fprintf(stderr, "DEBUGQOBJ id: %d\n", contactsSelected[i]);
    }

    m_info.parent->NotifyEvent(EVENT_ID_DONE/*m_info.eventId*/, "{result: \"done\"}");
    emit finished();
}

void QObj::onCanceled()
{
    fprintf(stderr, "DEBUGQOBJ onCanceled!%s\n", "");
    m_info.parent->NotifyEvent(EVENT_ID_CANCEL/*m_info.eventId*/, "{result: \"cancel\"}");
    emit finished();
}

void QObj::onError()
{
    fprintf(stderr, "DEBUGQOBJ onError!%s\n", "");
    m_info.parent->NotifyEvent(EVENT_ID_ERROR/*m_info.eventId*/, "{result: \"error\"}");
    emit finished();
}