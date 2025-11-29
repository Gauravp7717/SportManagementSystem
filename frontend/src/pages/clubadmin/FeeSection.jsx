import React, { useState } from "react";
import {
  List,
  PlusCircle,
  Edit2,
  Trash2,
  Wallet,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const Fees = () => {
  const [showList, setShowList] = useState(false);
  const [editId, setEditId] = useState(null);

  // Dummy Students & Sports for now
  const students = ["Yash", "Amit", "Rohan", "Priya", "Sneha"];
  const sports = ["Cricket", "Football", "Badminton", "Basketball"];

  const paymentMethods = ["Cash", "UPI", "Credit Card", "Debit Card", "Net Banking"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [selectedSportFilter, setSelectedSportFilter] = useState("All");

  const [feesData, setFeesData] = useState([]);

  const [formData, setFormData] = useState({
    studentName: "",
    sportName: "",
    month: "",
    feeAmount: "",
    paidAmount: "",
    paymentMethod: "",
    paymentStatus: "Paid",
    paymentDate: "",
  });

  // Handle input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validateForm = () => {
    const {
      studentName,
      sportName,
      month,
      feeAmount,
      paidAmount,
      paymentMethod,
      paymentStatus,
      paymentDate,
    } = formData;

    return (
      studentName &&
      sportName &&
      month &&
      feeAmount &&
      paidAmount &&
      paymentMethod &&
      paymentStatus &&
      paymentDate
    );
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      alert("Please fill all fields.");
      return;
    }

    if (editId) {
      setFeesData((prev) =>
        prev.map((f) => (f.id === editId ? { ...formData, id: editId } : f))
      );
      alert("Fee record updated!");
      setEditId(null);
    } else {
      setFeesData((prev) => [...prev, { id: Date.now(), ...formData }]);
      alert("Fee added successfully!");
    }

    // Reset form
    setFormData({
      studentName: "",
      sportName: "",
      month: "",
      feeAmount: "",
      paidAmount: "",
      paymentMethod: "",
      paymentStatus: "Paid",
      paymentDate: "",
    });
  };

  const handleEdit = (rec) => {
    setFormData({ ...rec });
    setEditId(rec.id);
    setShowList(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this record?")) {
      setFeesData((prev) => prev.filter((f) => f.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Toggle Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowList(!showList)}
            className="flex items-center gap-2 bg-white border border-gray-300 
                       text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            {showList ? <PlusCircle className="w-4 h-4" /> : <List className="w-4 h-4" />}
            {showList ? "Add Fees" : "View Fees"}
          </button>
        </div>

        {/* Add / Edit Form */}
        {!showList ? (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                  <Wallet className="w-6 h-6 text-white" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {editId ? "Edit Fees" : "Add Fees"}
                  </h1>
                  <p className="text-sm text-gray-600">
                    Record and track student fee payments.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow border border-gray-200 rounded-lg p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Student */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Student *</label>
                  <input
                    type="text"
                    name="studentName"
                    list="studentsList"
                    value={formData.studentName}
                    onChange={handleChange}
                    placeholder="Search student..."
                    className="w-full px-3 py-2 border rounded-lg text-sm mt-1"
                  />

                  <datalist id="studentsList">
                    {students.map((stu) => (
                      <option key={stu} value={stu} />
                    ))}
                  </datalist>
                </div>

                {/* Sport */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Sport *</label>
                  <select
                    name="sportName"
                    value={formData.sportName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm mt-1"
                  >
                    <option value="">Select Sport</option>
                    {sports.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Month */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Month *</label>
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm mt-1"
                  >
                    <option value="">Select Month</option>
                    {months.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Fee Amount */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Fee Amount *</label>
                  <input
                    type="number"
                    name="feeAmount"
                    value={formData.feeAmount}
                    onChange={handleChange}
                    placeholder="₹"
                    className="w-full px-3 py-2 border rounded-lg text-sm mt-1"
                  />
                </div>

                {/* Paid Amount */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Paid Amount *</label>
                  <input
                    type="number"
                    name="paidAmount"
                    value={formData.paidAmount}
                    onChange={handleChange}
                    placeholder="₹"
                    className="w-full px-3 py-2 border rounded-lg text-sm mt-1"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Payment Status *</label>
                  <select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm mt-1"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Partial">Partial</option>
                  </select>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Payment Method *</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm mt-1"
                  >
                    <option value="">Choose Method</option>
                    {paymentMethods.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Payment Date */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Payment Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      name="paymentDate"
                      value={formData.paymentDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 
                            text-white px-6 py-2.5 rounded-lg shadow hover:from-indigo-600 hover:to-purple-700"
                >
                  {editId ? "Update Record" : "Add Record"}
                </button>

                <button
                  onClick={() =>
                    setFormData({
                      studentName: "",
                      sportName: "",
                      month: "",
                      feeAmount: "",
                      paidAmount: "",
                      paymentMethod: "",
                      paymentStatus: "Paid",
                      paymentDate: "",
                    })
                  }
                  className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* FEES LIST WITH SPORT FILTER TABS */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                  <List className="w-6 h-6 text-white" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Fees Records</h1>
                  <p className="text-sm text-gray-600">
                    View and manage all fee entries.
                  </p>
                </div>
              </div>

              {/* Sport Tabs */}
              <div className="flex flex-wrap gap-2 mt-4">
                {["All", ...sports].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSportFilter(s)}
                    className={`
                      px-4 py-2 text-sm rounded-lg border transition-all
                      ${
                        selectedSportFilter === s
                          ? "bg-indigo-600 text-white border-indigo-600 shadow"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* No Records */}
            {feesData.length === 0 ? (
              <div className="bg-white border shadow p-10 text-center rounded-lg">
                <h3 className="text-lg font-semibold">No Fee Records</h3>
                <p className="text-sm text-gray-600 mb-4">Start by adding a fee entry.</p>
                <button
                  onClick={() => setShowList(false)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 
                             text-white px-5 py-2 rounded-lg"
                >
                  Add Fees
                </button>
              </div>
            ) : (
              <div className="bg-white shadow border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Student</th>
                      <th className="px-4 py-3 text-left font-semibold">Sport</th>
                      <th className="px-4 py-3 text-left font-semibold">Month</th>
                      <th className="px-4 py-3 text-left font-semibold">Fee</th>
                      <th className="px-4 py-3 text-left font-semibold">Paid</th>
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                      <th className="px-4 py-3 text-left font-semibold">Date</th>
                      <th className="px-4 py-3 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {feesData
                      .filter((fee) =>
                        selectedSportFilter === "All"
                          ? true
                          : fee.sportName === selectedSportFilter
                      )
                      .map((fee) => (
                        <tr key={fee.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">{fee.studentName}</td>
                          <td className="px-4 py-3">{fee.sportName}</td>
                          <td className="px-4 py-3">{fee.month}</td>
                          <td className="px-4 py-3">₹{fee.feeAmount}</td>
                          <td className="px-4 py-3">₹{fee.paidAmount}</td>

                          <td className="px-4 py-3">
                            {fee.paymentStatus === "Paid" ? (
                              <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="w-4 h-4" /> Paid
                              </span>
                            ) : fee.paymentStatus === "Pending" ? (
                              <span className="flex items-center gap-1 text-red-600">
                                <XCircle className="w-4 h-4" /> Pending
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-yellow-600">
                                <AlertCircle className="w-4 h-4" /> Partial
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3">{fee.paymentDate}</td>

                          <td className="px-4 py-3 flex gap-3">
                            <button
                              onClick={() => handleEdit(fee)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDelete(fee.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                <div className="bg-gray-50 px-4 py-3 border-t">
                  Total Records: {
                    feesData.filter((f) =>
                      selectedSportFilter === "All"
                        ? true
                        : f.sportName === selectedSportFilter
                    ).length
                  }
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Fees;
