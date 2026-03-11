"use client";

import { useState, useEffect, useCallback } from "react";
import { BiUserCheck, BiTime, BiUserX, BiLoaderAlt, BiPlus, BiRefresh } from "react-icons/bi";

type AttendanceRecord = {
  _id: string;
  student_id: { _id: string; full_name: string; email: string; profile_photo?: string };
  status: "present" | "absent" | "late";
  marked_at: string;
};

export default function AttendanceList({ classId, isTeacher }: { classId: string, isTeacher: boolean }) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Custom student adding state for teacher
  const [addingStudent, setAddingStudent] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [newStudentId, setNewStudentId] = useState("");
  const [newStatus, setNewStatus] = useState<"present" | "absent" | "late">("absent");

  const fetchAttendance = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const res = await fetch(`/api/virtual-classes/${classId}/attendance`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data.attendance || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoader) setLoading(false);
    }
  }, [classId]);

  const fetchAllStudents = async () => {
    if (!isTeacher) return;
    try {
      const res = await fetch("/api/users?role=student");
      if (res.ok) {
        const data = await res.json();
        setStudents(data.users || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAttendance(true);
    const interval = setInterval(() => fetchAttendance(false), 10000);
    return () => clearInterval(interval);
  }, [fetchAttendance]);

  const handleStatusChange = async (studentId: string, status: "present" | "absent" | "late") => {
    if (!isTeacher) return;
    setUpdatingId(studentId);
    try {
      const res = await fetch(`/api/virtual-classes/${classId}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, status })
      });
      if (res.ok) fetchAttendance();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddStudent = async () => {
    if (!newStudentId || !isTeacher) return;
    setLoading(true);
    await handleStatusChange(newStudentId, newStatus);
    setAddingStudent(false);
    setNewStudentId("");
  };

  if (loading && records.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 border-l border-zinc-800 bg-zinc-950">
        <BiLoaderAlt className="w-6 h-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  const presentCount = records.filter(r => r.status === "present").length;
  const lateCount = records.filter(r => r.status === "late").length;

  return (
    <div className="flex-1 flex flex-col h-full border-l border-zinc-800 bg-zinc-950">
      <div className="flex-none p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-start justify-between">
        <div>
          <h3 className="font-bold text-white mb-2">Attendance List</h3>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md">
              <BiUserCheck /> {presentCount} Present
            </span>
            <span className="flex items-center gap-1.5 text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-md">
               <BiTime /> {lateCount} Late
            </span>
          </div>
        </div>
        <button 
          onClick={() => fetchAttendance(true)} 
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
          title="Refresh List"
        >
          <BiRefresh className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {records.length === 0 ? (
          <div className="text-center text-zinc-500 text-sm mt-10">No students recorded yet.</div>
        ) : (
          records.map(record => (
            <div key={record._id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-white truncate">{record.student_id?.full_name || "Unknown User"}</span>
                <span className="text-xs text-zinc-500 truncate">{record.student_id?.email}</span>
              </div>
              
              {isTeacher ? (
                <div className="flex items-center gap-1 shrink-0 ml-3">
                  <button 
                    disabled={updatingId === record.student_id._id}
                    onClick={() => handleStatusChange(record.student_id._id, "present")}
                    className={`p-1.5 rounded-lg transition ${record.status === "present" ? "bg-emerald-500/20 text-emerald-500" : "text-zinc-500 hover:bg-zinc-800"}`}
                    title="Present"
                  ><BiUserCheck className="w-4 h-4" /></button>
                  <button 
                    disabled={updatingId === record.student_id._id}
                    onClick={() => handleStatusChange(record.student_id._id, "late")}
                    className={`p-1.5 rounded-lg transition ${record.status === "late" ? "bg-orange-500/20 text-orange-500" : "text-zinc-500 hover:bg-zinc-800"}`}
                    title="Late"
                  ><BiTime className="w-4 h-4" /></button>
                  <button 
                     disabled={updatingId === record.student_id._id}
                    onClick={() => handleStatusChange(record.student_id._id, "absent")}
                    className={`p-1.5 rounded-lg transition ${record.status === "absent" ? "bg-red-500/20 text-red-500" : "text-zinc-500 hover:bg-zinc-800"}`}
                    title="Absent"
                  ><BiUserX className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="shrink-0 ml-3">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    record.status === "present" ? "bg-emerald-500/20 text-emerald-500" : 
                    record.status === "late" ? "bg-orange-500/20 text-orange-500" : "bg-red-500/20 text-red-500"
                  }`}>{record.status}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {isTeacher && (
        <div className="flex-none p-4 border-t border-zinc-800 bg-zinc-900/50">
          {!addingStudent ? (
            <button 
              onClick={() => { setAddingStudent(true); fetchAllStudents(); }}
              className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
            >
              <BiPlus /> Manually Add Student
            </button>
          ) : (
            <div className="space-y-3 bg-zinc-950 p-3 rounded-lg border border-zinc-800">
               <select 
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={newStudentId}
                  onChange={e => setNewStudentId(e.target.value)}
                >
                  <option value="" disabled>Select Student</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>{s.full_name} ({s.email})</option>
                  ))}
               </select>

               <div className="flex gap-2">
                 <select 
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as any)}
                 >
                    <option value="absent">Absent</option>
                    <option value="present">Present</option>
                    <option value="late">Late</option>
                 </select>
                 <button 
                    onClick={handleAddStudent}
                    disabled={!newStudentId}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition"
                 >Add</button>
                 <button 
                    onClick={() => { setAddingStudent(false); setNewStudentId(""); }}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm transition"
                 >Cancel</button>
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
