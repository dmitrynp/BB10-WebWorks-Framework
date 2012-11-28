#ifndef EVENTTHREAD_JS_HPP_
#define EVENTTHREAD_JS_HPP_

#include <QThread>
#include <string>

class EventThread : public QThread
{

public:
	void run();

signals:
	void finished();

};

#endif