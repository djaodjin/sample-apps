# -*- Makefile -*-

-include $(buildTop)/share/dws/prefix.mk

srcDir        ?= $(realpath .)
objDir        ?= $(realpath .)/build
installTop    ?= $(VIRTUAL_ENV)
binDir        ?= $(installTop)/bin
SYSCONFDIR    := $(installTop)/etc
LOCALSTATEDIR := $(installTop)/var
CONFIG_DIR    := $(SYSCONFDIR)/$(APP_NAME)
PYTHON        := $(binDir)/python

APP_NAME      := $(notdir $(srcDir))

all::
	@echo "Nothing to be done for 'make'."


install:: install-conf


install-conf:: $(DESTDIR)$(SYSCONFDIR)/$(APP_NAME)/credentials \
          $(DESTDIR)$(SYSCONFDIR)/$(APP_NAME)/site.conf
	install -d $(DESTDIR)$(LOCALSTATEDIR)/log/gunicorn


# Implementation Note:
# We use [ -f file ] before install here such that we do not blindly erase
# already present configuration files with template ones.
$(DESTDIR)$(SYSCONFDIR)/%/site.conf: $(srcDir)/etc/site.conf
	install -d $(dir $@)
	[ -f $@ ] || \
		sed -e 's,%(LOCALSTATEDIR)s,$(LOCALSTATEDIR),' \
			-e 's,%(APP_NAME)s,$(APP_NAME),' \
			-e 's,%(SYSCONFDIR)s,$(SYSCONFDIR),' \
			-e "s,%(ADMIN_EMAIL)s,`cd $(srcDir) && git config user.email`," \
			-e "s,%(DB_NAME)s,$(notdir $(patsubst %/,%,$(dir $@)))," \
			-e "s,%(binDir)s,$(binDir)," $< > $@

$(DESTDIR)$(SYSCONFDIR)/%/credentials: $(srcDir)/etc/credentials
	install -d $(dir $@)
	[ -f $@ ] || \
		sed -e "s,\%(SECRET_KEY)s,$(if $(SECRET_KEY),$(SECRET_KEY),$(shell $(PYTHON) -c 'import sys ; from random import choice ; sys.stdout.write("".join([choice("abcdefghijklmnopqrstuvwxyz0123456789!@#$%^*-_=+") for i in range(50)]))' ))," \
			-e "s,\%(DJAODJIN_SECRET_KEY)s,$(if $(DJAODJIN_SECRET_KEY),$(DJAODJIN_SECRET_KEY),$(shell $(PYTHON) -c 'import sys ; from random import choice ; sys.stdout.write("".join([choice("abcdefghijklmnopqrstuvwxyz0123456789!@#$%^*-_=+") for i in range(50)]))' ))," \
			$< > $@


-include $(buildTop)/share/dws/suffix.mk
