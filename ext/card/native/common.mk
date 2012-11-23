ifndef QCONFIG
QCONFIG=qconfig.mk
endif
include $(QCONFIG)

NAME=contactpicker
PLUGIN=yes
UTILS=yes

include ../../../../meta.mk
WEBWORKS_DIR=$(PROJECT_ROOT)/../../..

#SRCS+=contactpicker_js.cpp \
#      qobj.cpp

#include $(MKFILES_ROOT)/qtargets.mk
include $(MKFILES_ROOT)/qt-targets.mk

#LIBS+=bbpim bbcascadespickers QtCore