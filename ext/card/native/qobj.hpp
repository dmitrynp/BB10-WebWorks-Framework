#ifndef QOBJ_JS_HPP_
#define QOBJ_JS_HPP_

#include <QObject>
#include <json/value.h>
#include <string>
#include <bb/cascades/pickers/ContactPicker>

class ContactPicker;

struct ContactPickerThreadInfo {
    ContactPicker *parent;
    Json::Value *jsonObj;
    //std::string eventId;
};

class QObj : public QObject
{
	Q_OBJECT

public:
	//explicit QObj(const ContactPickerThreadInfo& info);
	explicit QObj(QObject *parent, const ContactPickerThreadInfo& info);
	virtual ~QObj() {}

public slots:
	void process();
	void onContactsSelected(const QList<int>& contactsSelected);
	void onContactSelected(int contactId);
	void onCanceled();
	void onError();
	void print();

signals:
	void finished();

private:
	ContactPickerThreadInfo m_info;
	bb::cascades::pickers::ContactPicker* m_pPicker;
};

#endif