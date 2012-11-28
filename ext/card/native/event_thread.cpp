#include <QCoreApplication>
#include <stdio.h>
#include "event_thread.hpp"
/*
EventThread::EventThread(QObject *parent) : QObject(parent)
{
}
*/
void EventThread::run()
{
    fprintf(stderr, "In EventThread::run%s\n", "");
    int argc = 0;

    QCoreApplication app(argc, 0);
    app.exec();
}
