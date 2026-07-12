import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Filter,
  Search,
  Timer
} from "lucide-react";
import { HospitalTask, TaskStatus } from "../types";
import { syncTasks, updateTaskStatus } from "../lib/workflowService";
import { formatDistanceToNow } from "date-fns";

interface TaskCenterProps {
  userRole: string;
  userId: string;
  onTaskSelect?: (task: HospitalTask) => void;
}

export const TaskCenter: React.FC<TaskCenterProps> = ({ userRole, userId, onTaskSelect }) => {
  const [tasks, setTasks] = useState<HospitalTask[]>([]);
  const [filter, setFilter] = useState<TaskStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsubscribe = syncTasks(userRole, userId, (data) => {
      setTasks(data);
    });
    return () => unsubscribe();
  }, [userRole, userId]);

  const handleCompleteTask = async (taskId: string) => {
    try {
      await updateTaskStatus(taskId, "completed", userId);
    } catch (error) {
      console.error("Failed to complete task:", error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === "all" || task.status === filter;
    const matchesSearch = 
      task.patientMRN?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      task.titleEn?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      task.titleAr?.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "stat": return "text-red-600 bg-red-50 border-red-100";
      case "urgent": return "text-amber-600 bg-amber-50 border-amber-100";
      default: return "text-blue-600 bg-blue-50 border-blue-100";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-none">مركز المهام</h2>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Task Center</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full border border-indigo-100">
               {tasks.length} مهام نشطة
             </span>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="البحث عن مريض أو مهمة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-xl hover:bg-white transition-colors">
            <Filter className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence initial={false}>
          {filteredTasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-slate-400"
            >
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 opacity-20" />
              </div>
              <p className="text-sm font-medium">لا توجد مهام معلقة</p>
              <p className="text-xs">كل العمليات في المسار الصحيح</p>
            </motion.div>
          ) : (
            filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                onClick={() => onTaskSelect?.(task)}
              >
                {/* Priority Indicator */}
                <div className={`absolute top-0 right-0 w-1 h-full ${
                  task.priority === 'stat' ? 'bg-red-500' : 
                  task.priority === 'urgent' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />

                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                       <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight border ${getPriorityColor(task.priority)}`}>
                         {task.priority}
                       </span>
                       <span className="text-[10px] font-bold text-slate-400 tracking-wider">
                         MRN: {task.patientMRN}
                       </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-0.5">{task.titleAr}</h3>
                    <p className="text-xs text-slate-500 font-medium">{task.titleEn}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 font-medium mb-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
                    </div>
                    {task.slaMinutes && (
                      <div className="flex items-center justify-end gap-1 text-[10px] text-rose-500 font-bold">
                        <Timer className="w-3 h-3" />
                        <span>SLA: {task.slaMinutes}m</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div className="flex -space-x-1">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-600">
                      JS
                    </div>
                    <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                      +
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompleteTask(task.id);
                      }}
                      className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100 hover:bg-green-100 transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      إتمام
                    </button>
                    <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer / Stats */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
         <div className="flex items-center gap-4">
           <div className="flex items-center gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
             <span>Stat: {tasks.filter(t => t.priority === 'stat').length}</span>
           </div>
           <div className="flex items-center gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
             <span>Urgent: {tasks.filter(t => t.priority === 'urgent').length}</span>
           </div>
         </div>
         <div className="hover:text-indigo-600 cursor-pointer transition-colors">
           View All Tasks
         </div>
      </div>
    </div>
  );
};
