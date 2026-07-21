cat << 'INNER_EOF' > header_replacement.txt
        {/* Top Header Bar - Highly Advanced Glassmorphism */}
        <header
          className={`no-print sticky top-0 h-14 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 z-40 text-right transition-all ${(gatewaySystem as string) === "his" ? "hidden" : ""}`}
        >
          <div className="flex items-center gap-4 h-full">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <div className="hidden sm:block w-64 md:w-80 lg:w-96">
              <WSDGlobalSearch language={language} systemUsers={systemUsers} allAvailableTemplates={allAvailableTemplates} setActiveTab={setActiveTab} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 sm:gap-3 w-full sm:w-auto h-full">
            <button className="p-1.5 sm:p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors hidden sm:block">
              <Sun className="w-4 h-4" />
            </button>

            {/* Smart Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsBellOpen(!isBellOpen)}
                className="relative p-1.5 sm:p-2 bg-white hover:bg-slate-50 text-slate-500 hover:text-indigo-600 rounded-full transition cursor-pointer flex items-center justify-center"
              >
                <Bell
                  className={`h-4.5 w-4.5 transition-colors ${notifications.some((n) => !n.read) ? "animate-bounce text-pink-600" : ""}`}
                />
                {(() => {
                  const visibleUnread = notifications.filter((notif) => {
                    if (notif.read) return false;
                    if (
                      !notif.userId ||
                      notif.userId === "all" ||
                      notif.userId === currentUser.id
                    )
                      return true;
                    if (
                      notif.userId === "admin" &&
                      (currentUser?.role === "admin" ||
                        currentUser?.role === "it")
                    )
                      return true;
                    if (
                      notif.userId === "supervisor" &&
                      [
                        "admin",
                        "it",
                        "head_nurse",
                        "nursing_director",
                        "supervisor",
                        "quality",
                      ]?.includes(currentUser?.role)
                    )
                      return true;
                    if (
                      notif.userId === "director" &&
                      [
                        "admin",
                        "it",
                        "nursing_director",
                        "president",
                        "medical_director",
                      ]?.includes(currentUser?.role)
                    )
                      return true;
                    return false;
                  });
                  return (
                    visibleUnread.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full text-[9px] w-4.5 h-4.5 flex items-center justify-center font-black shadow-sm">
                        {visibleUnread.length}
                      </span>
                    )
                  );
                })()}
              </button>

              {isBellOpen && (
                <div className="absolute ltr:right-0 rtl:left-0 mt-2 w-[285px] xs:w-[320px] sm:w-[360px] max-w-[calc(100vw-32px)] bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden transition-all duration-200 ltr:origin-top-right rtl:origin-top-left flex flex-col max-h-[420px]">
                  <div className="px-4 py-3 bg-slate-50/5 backdrop-blur-md border-b border-slate-200/50 flex items-center justify-between">
                    <h4 className="text-[11px] font-black text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      {language === "ar"
                        ? "تنبيهات الذكاء الاستباقي"
                        : "Proactive Alerts"}
                    </h4>
                    {notifications.some((n) => !n.read) && (
                      <button
                        onClick={() => {
                          const marked = notifications.map((n) => ({
                            ...n,
                            read: true,
                          }));
                          setNotifications(marked);
                          saveSetting("baheya_notifications", marked);
                        }}
                        className="text-[9px] text-indigo-600 hover:text-indigo-800 font-extrabold"
                      >
                        {language === "ar" ? "مقروء" : "Read all"}
                      </button>
                    )}
                  </div>
                  <div className="overflow-y-auto divide-y divide-slate-100 flex-1 max-h-64 custom-scrollbar">
                    {(() => {
                      const visibleNotifs = notifications.filter((notif) => {
                        if (
                          !notif.userId ||
                          notif.userId === "all" ||
                          notif.userId === currentUser.id
                        )
                          return true;
                        if (
                          notif.userId === "admin" &&
                          (currentUser?.role === "admin" ||
                            currentUser?.role === "it")
                        )
                          return true;
                        if (
                          notif.userId === "supervisor" &&
                          [
                            "admin",
                            "it",
                            "head_nurse",
                            "nursing_director",
                            "supervisor",
                            "quality",
                          ]?.includes(currentUser?.role)
                        )
                          return true;
                        if (
                          notif.userId === "director" &&
                          [
                            "admin",
                            "it",
                            "nursing_director",
                            "president",
                            "medical_director",
                          ]?.includes(currentUser?.role)
                        )
                          return true;
                        return false;
                      });

                      if (visibleNotifs.length === 0) {
                        return (
                          <div className="p-8 text-center text-slate-400 text-xs">
                            {language === "ar"
                              ? "لا توجد تنبيهات جديدة"
                              : "No new notifications"}
                          </div>
                        );
                      }

                      return visibleNotifs
                        .slice()
                        .reverse()
                        .map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              setSelectedNotificationForModal(notif);
                              setIsBellOpen(false);
                            }}
                            className={`p-3 hover:bg-slate-50 transition cursor-pointer text-right flex gap-3 items-start ${!notif.read ? "bg-indigo-50/30" : ""}`}
                          >
                            <div className="mt-1 shrink-0">
                              {notif.type === "alert" ? (
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                              ) : notif.type === "success" ? (
                                <div className="h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center">
                                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                </div>
                              ) : (
                                <div className="h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center">
                                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h5
                                className={`text-[10px] font-bold ${!notif.read ? "text-slate-800" : "text-slate-600"}`}
                              >
                                {language === "ar"
                                  ? notif.titleAr
                                  : notif.titleEn}
                              </h5>
                              <p className="text-[9px] text-slate-500 line-clamp-1 mt-0.5">
                                {language === "ar"
                                  ? notif.messageAr
                                  : notif.messageEn}
                              </p>
                              <span className="text-[8px] text-slate-400 mt-1 block">
                                {new Date(notif.timestamp).toLocaleString(
                                  language === "ar" ? "ar-EG" : "en-US",
                                )}
                              </span>
                            </div>
                          </div>
                        ));
                    })()}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
              className="flex items-center gap-1.5 px-2 py-1.5 text-slate-500 hover:text-slate-700 rounded-full text-[11px] font-bold transition-colors cursor-pointer"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:block">{language === "ar" ? "English" : "العربية"}</span>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            {/* User Profile */}
            <div className="flex items-center gap-2 px-1 sm:px-2 py-1 group cursor-pointer">
              <img src={currentUser.avatar || "https://ui-avatars.com/api/?name=" + currentUser.nameEn + "&background=0D8ABC&color=fff"} alt="User" className="w-8 h-8 rounded-full shadow-sm border border-slate-200" />
              <div className="hidden sm:block text-left rtl:text-right">
                 <p className="text-[11px] font-black text-slate-800 leading-none mb-1">{language === 'ar' ? currentUser.nameAr : currentUser.nameEn}</p>
                 <p className="text-[9px] text-slate-500 leading-none">{currentUser.role.replace('_', ' ').toUpperCase()}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block transition-transform group-hover:rotate-180" />
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 ml-1 rtl:ml-0 rtl:mr-1 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 rounded-lg text-[11px] font-bold transition-colors shadow-sm"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:block">{language === "ar" ? "تسجيل الخروج" : "Logout"}</span>
            </button>

          </div>
        </header>
INNER_EOF
