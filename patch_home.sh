cat << 'INNER_EOF' > home_replacement.txt
            <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
              {/* Hero Banner */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4"></div>
                <div className="relative z-10 text-right flex-1">
                  <h1 className="text-2xl md:text-3xl font-black mb-3 text-slate-800">
                    {language === "ar" ? "مرحباً بك في" : "Welcome to"}
                    <br />
                    <span className="text-indigo-800 text-3xl md:text-4xl">{language === "ar" ? "بوابة الإدارة والتشغيل الشاملة" : "Comprehensive Management Portal"}</span>
                  </h1>
                  <p className="text-slate-600 text-sm md:text-base max-w-xl ml-auto leading-relaxed font-medium">
                    {language === "ar" 
                      ? "قم بالتخصيص والتحكم الكامل في جميع أنظمة المستشفى الإدارية والتشغيلية بتصميم ذكي ومتكامل."
                      : "Fully customize and control all hospital administrative and operational systems with an integrated smart design."}
                  </p>
                  <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 mr-auto cursor-pointer">
                    <span>{language === "ar" ? "عرض النظام" : "View System"}</span>
                    <ArrowLeftRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </div>
                <div className="relative z-10 hidden md:block shrink-0">
                  <div className="w-48 h-48 bg-white/50 backdrop-blur border border-white/60 rounded-3xl shadow-xl flex items-center justify-center p-4">
                    <Database className="w-24 h-24 text-blue-500/80" />
                    <ShieldCheck className="w-16 h-16 text-emerald-500 absolute bottom-4 left-4 drop-shadow-md" />
                  </div>
                </div>
              </div>

              {/* Statistics Row */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-32 hover:border-blue-200 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{language === "ar" ? "إجمالي المستخدمين" : "Total Users"}</span>
                  </div>
                  <div className="text-right">
                    <h4 className="text-2xl font-black text-slate-800">{systemUsers.length.toLocaleString()}</h4>
                    <p className="text-[10px] text-emerald-600 font-bold flex justify-end items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" /> 12.5% {language === "ar" ? "من الشهر الماضي" : "from last month"}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-32 hover:border-emerald-200 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{language === "ar" ? "الأدوار النشطة" : "Active Roles"}</span>
                  </div>
                  <div className="text-right">
                    <h4 className="text-2xl font-black text-slate-800">{Array.from(new Set(systemUsers.map(u => u.role))).length}</h4>
                    <p className="text-[10px] text-emerald-600 font-bold flex justify-end items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" /> 8.3% {language === "ar" ? "من الشهر الماضي" : "from last month"}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-32 hover:border-purple-200 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="bg-purple-50 text-purple-600 p-2.5 rounded-xl">
                      <LayoutGrid className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{language === "ar" ? "التطبيقات النشطة" : "Active Apps"}</span>
                  </div>
                  <div className="text-right">
                    <h4 className="text-2xl font-black text-slate-800">24</h4>
                    <p className="text-[10px] text-emerald-600 font-bold flex justify-end items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" /> 4.2% {language === "ar" ? "من الشهر الماضي" : "from last month"}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-32 hover:border-orange-200 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="bg-orange-50 text-orange-600 p-2.5 rounded-xl">
                      <Activity className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{language === "ar" ? "سير العمل النشط" : "Active Workflows"}</span>
                  </div>
                  <div className="text-right">
                    <h4 className="text-2xl font-black text-slate-800">{allAvailableTemplates.length * 3}</h4>
                    <p className="text-[10px] text-rose-500 font-bold flex justify-end items-center gap-1 mt-1">
                      <ArrowLeftRight className="w-3 h-3 rotate-90" /> 2.1% {language === "ar" ? "من الشهر الماضي" : "from last month"}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-32 hover:border-pink-200 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="bg-pink-50 text-pink-600 p-2.5 rounded-xl">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{language === "ar" ? "سجلات التدقيق" : "Audit Logs"}</span>
                  </div>
                  <div className="text-right">
                    <h4 className="text-2xl font-black text-slate-800">{records.length.toLocaleString()}</h4>
                    <p className="text-[10px] text-emerald-600 font-bold flex justify-end items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" /> 15.8% {language === "ar" ? "من الشهر الماضي" : "from last month"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-4 text-right">
                  {language === "ar" ? "الوحدات الرئيسية" : "Main Modules"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
INNER_EOF
