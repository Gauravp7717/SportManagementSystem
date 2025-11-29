import React, { useState, useMemo } from "react";
import {
  List,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  CheckSquare,
  Square,
} from "lucide-react";

/**
 * Attendance Page (Option 1)
 * - Select sport -> batch -> date
 * - Shows all students for the selected batch
 * - Mark Present / Absent for each student
 * - Submit attendance (saved to local state)
 * - View / Edit / Delete attendance records
 */

const Attendance = () => {
  // Dummy master data (replace with API later)
  const sports = ["Cricket", "Football", "Badminton", "Basketball"];

  // For demo: batches and students per sport
  const data = {
    Cricket: {
      batches: ["Morning (6-8AM)", "Evening (5-7PM)"],
      students: {
        "Morning (6-8AM)": ["Yash", "Amit", "Rohan", "Sakshi"],
        "Evening (5-7PM)": ["Vikram", "Priya", "Sneha", "Arjun"],
      },
    },
    Football: {
      batches: ["Evening (5-7PM)", "Weekend (8-10AM)"],
      students: {
        "Evening (5-7PM)": ["Rahul", "Karan", "Meera"],
        "Weekend (8-10AM)": ["Ankit", "Tanya", "Nisha", "Rohit"],
      },
    },
    Badminton: {
      batches: ["Morning (7-9AM)", "Weekend (8-10AM)"],
      students: {
        "Morning (7-9AM)": ["Simran", "Harsh", "Mansi"],
        "Weekend (8-10AM)": ["Gaurav", "Pooja", "Rekha"],
      },
    },
    Basketball: {
      batches: ["Evening (6-8PM)"],
      students: {
        "Evening (6-8PM)": ["Kunal", "Deepa", "Ishaan", "Naveen"],
      },
    },
  };

  // Attendance records state
  // record: { id, sport, batch, date: 'YYYY-MM-DD', records: [{ studentName, status }], createdAt }
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  // UI state
  const [modeViewList, setModeViewList] = useState(true); // true -> view list, false -> mark attendance (form)
  const [sport, setSport] = useState("");
  const [batch, setBatch] = useState("");
  const [date, setDate] = useState(() => {
    // default today
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });

  // temp selection of marks (student -> "Present"|"Absent")
  const [marks, setMarks] = useState([]);
  const [editId, setEditId] = useState(null); // if editing existing attendance

  // derived list of batches for selected sport
  const batchOptions = useMemo(() => (sport ? data[sport].batches : []), [sport]);

  // derived students list for selected sport+batch
  const currentStudents = useMemo(() => {
    if (!sport || !batch) return [];
    return data[sport].students[batch] || [];
  }, [sport, batch]);

  // init marks whenever students change or when creating new attendance
  const initMarksForStudents = (students) =>
    students.map((s) => ({ studentName: s, status: "Absent" }));

  // when sport/batch changes, reset marks to default Absent
  React.useEffect(() => {
    setEditId(null);
    if (currentStudents.length) {
      setMarks(initMarksForStudents(currentStudents));
    } else {
      setMarks([]);
    }
  }, [sport, batch, currentStudents.length]);

  // Helpers to toggle present/absent for a student
  const toggleStudentStatus = (studentName) => {
    setMarks((prev) => prev.map((m) => (m.studentName === studentName ? { ...m, status: m.status === "Present" ? "Absent" : "Present" } : m)));
  };

  const markAllPresent = () => {
    setMarks((prev) => prev.map((m) => ({ ...m, status: "Present" })));
  };

  const clearAll = () => {
    setMarks((prev) => prev.map((m) => ({ ...m, status: "Absent" })));
  };

  // Submit attendance (create new or update existing)
  const handleSubmitAttendance = () => {
    if (!sport || !batch || !date) {
      alert("Please select sport, batch and date.");
      return;
    }
    if (!marks.length) {
      alert("No students to mark for the selected batch.");
      return;
    }

    const payload = {
      id: editId || Date.now(),
      sport,
      batch,
      date,
      records: marks,
      createdAt: new Date().toISOString(),
    };

    if (editId) {
      setAttendanceRecords((prev) => prev.map((r) => (r.id === editId ? payload : r)));
      alert("Attendance updated.");
      setEditId(null);
    } else {
      // prevent duplicate record for same sport/batch/date
      const duplicate = attendanceRecords.find((r) => r.sport === sport && r.batch === batch && r.date === date);
      if (duplicate) {
        if (!window.confirm("An attendance record already exists for this sport/batch/date. Overwrite?")) {
          return;
        }
        setAttendanceRecords((prev) => prev.map((r) => (r.id === duplicate.id ? payload : r)));
        alert("Attendance overwritten.");
      } else {
        setAttendanceRecords((prev) => [payload, ...prev]);
        alert("Attendance saved.");
      }
    }

    // go to list view after submit
    setModeViewList(true);
  };

  // View handlers
  const handleEditRecord = (record) => {
    setModeViewList(false);
    setSport(record.sport);
    setBatch(record.batch);
    setDate(record.date);
    setMarks(record.records.map((r) => ({ ...r })));
    setEditId(record.id);
    // scroll to top for form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteRecord = (id) => {
    if (!window.confirm("Delete this attendance record?")) return;
    setAttendanceRecords((prev) => prev.filter((r) => r.id !== id));
  };

  // Filters for view list
  const [filterSport, setFilterSport] = useState("All");
  const [filterBatch, setFilterBatch] = useState("All");
  const [filterDate, setFilterDate] = useState("");

  // derived filtered records
  const filteredRecords = attendanceRecords.filter((rec) => {
    if (filterSport !== "All" && rec.sport !== filterSport) return false;
    if (filterBatch !== "All" && filterBatch && rec.batch !== filterBatch) return false;
    if (filterDate && rec.date !== filterDate) return false;
    return true;
  });

  // available batch options for selected filterSport in list filter
  const filterBatchOptions = useMemo(() => {
    if (filterSport === "All") return ["All"];
    return ["All", ...data[filterSport].batches];
  }, [filterSport]);

  // counters while marking
  const presentCount = marks.filter((m) => m.status === "Present").length;
  const absentCount = marks.length - presentCount;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Attendance</h1>
            <p className="text-sm text-gray-600">Mark daily attendance per batch and view records.</p>
          </div>
        </div>

        {/* Top controls: switch between Mark Attendance and View Records */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => { setModeViewList(false); setEditId(null); }}
              className={`px-4 py-2 text-sm rounded-lg border ${!modeViewList ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700 border-gray-300"} transition`}
            >
              Mark Attendance
            </button>

            <button
              onClick={() => setModeViewList(true)}
              className={`px-4 py-2 text-sm rounded-lg border ${modeViewList ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700 border-gray-300"} transition`}
            >
              View Records
            </button>
          </div>

          {/* Quick statistics */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Present: <span className="font-semibold text-gray-800">{presentCount}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span>Absent: <span className="font-semibold text-gray-800">{absentCount}</span></span>
            </div>
          </div>
        </div>

        {/* ======================= Form: Mark Attendance ======================= */}
        {!modeViewList && (
          <div className="bg-white border rounded-lg shadow p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Sport select */}
              <div>
                <label className="text-sm text-gray-700">Sport *</label>
                <select value={sport} onChange={(e) => { setSport(e.target.value); setBatch(""); }} className="w-full px-3 py-2 border rounded-lg mt-1 text-sm">
                  <option value="">Select Sport</option>
                  {sports.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Batch select */}
              <div>
                <label className="text-sm text-gray-700">Batch *</label>
                <select value={batch} onChange={(e) => setBatch(e.target.value)} className="w-full px-3 py-2 border rounded-lg mt-1 text-sm" disabled={!sport}>
                  <option value="">Select Batch</option>
                  {batchOptions.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="text-sm text-gray-700">Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full pl-10 pr-3 py-2 border rounded-lg mt-1 text-sm" />
                </div>
              </div>
            </div>

            {/* Students list + controls */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-800">Students</h3>
                  <span className="text-sm text-gray-500">{currentStudents.length} in batch</span>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={markAllPresent} className="px-3 py-1 text-sm rounded-lg border bg-green-50 border-green-200 text-green-700">Mark all Present</button>
                  <button onClick={clearAll} className="px-3 py-1 text-sm rounded-lg border bg-red-50 border-red-200 text-red-700">Clear</button>
                </div>
              </div>

              {!currentStudents.length ? (
                <div className="p-6 bg-gray-50 border rounded text-sm text-gray-600">Select sport & batch to show students.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {marks.map((m) => (
                    <div key={m.studentName} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-500 text-white rounded flex items-center justify-center font-medium">{m.studentName.charAt(0)}</div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">{m.studentName}</div>
                          <div className="text-xs text-gray-500">Student</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleStudentStatus(m.studentName)} className={`px-3 py-1 rounded-lg text-sm font-medium border ${m.status === "Present" ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-700 border-gray-300"}`}>
                          {m.status === "Present" ? <span className="inline-flex items-center gap-2"><CheckSquare className="w-4 h-4" /> Present</span> : <span className="inline-flex items-center gap-2"><Square className="w-4 h-4" /> Absent</span>}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3">
              <button onClick={handleSubmitAttendance} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-lg shadow">
                {editId ? "Update Attendance" : "Submit Attendance"}
              </button>
              <button onClick={() => { setSport(""); setBatch(""); setMarks([]); setEditId(null); }} className="px-4 py-2 border rounded-lg">Reset</button>
              <div className="ml-auto text-sm text-gray-600">Present: <span className="font-semibold text-gray-800">{presentCount}</span> • Absent: <span className="font-semibold text-gray-800">{absentCount}</span></div>
            </div>
          </div>
        )}

        {/* ======================= View Records ======================= */}
        {modeViewList && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white border rounded-lg p-4 flex flex-col md:flex-row gap-3 items-center">
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Sport</label>
                <select className="px-3 py-2 border rounded text-sm" value={filterSport} onChange={(e) => { setFilterSport(e.target.value); setFilterBatch("All"); }}>
                  <option value="All">All</option>
                  {sports.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Batch</label>
                <select className="px-3 py-2 border rounded text-sm" value={filterBatch} onChange={(e) => setFilterBatch(e.target.value)}>
                  {filterBatchOptions.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Date</label>
                <input type="date" className="px-3 py-2 border rounded text-sm" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button onClick={() => { setFilterSport("All"); setFilterBatch("All"); setFilterDate(""); }} className="px-3 py-2 border rounded text-sm">Clear</button>
              </div>
            </div>

            {/* Records list */}
            {filteredRecords.length === 0 ? (
              <div className="bg-white p-8 border rounded text-center text-sm text-gray-600">
                No attendance records match the filter.
              </div>
            ) : (
              <div className="bg-white border rounded-lg shadow overflow-hidden">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-left">
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Sport</th>
                      <th className="px-4 py-3 font-semibold">Batch</th>
                      <th className="px-4 py-3 font-semibold">Present</th>
                      <th className="px-4 py-3 font-semibold">Absent</th>
                      <th className="px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRecords.map(rec => {
                      const present = rec.records.filter(r => r.status === "Present").length;
                      const absent = rec.records.length - present;
                      return (
                        <tr key={rec.id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3">{rec.date}</td>
                          <td className="px-4 py-3">{rec.sport}</td>
                          <td className="px-4 py-3">{rec.batch}</td>
                          <td className="px-4 py-3">{present}</td>
                          <td className="px-4 py-3">{absent}</td>
                          <td className="px-4 py-3 flex gap-3">
                            <button onClick={() => handleEditRecord(rec)} className="text-indigo-600 hover:text-indigo-900"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteRecord(rec.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
