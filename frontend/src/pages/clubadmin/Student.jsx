import React, { useState } from 'react';
import { UserPlus, User, Calendar, Phone, DollarSign, CreditCard, Clock, List, Edit2, Trash2, Eye } from 'lucide-react';

const Student = () => {
  const [showStudentList, setShowStudentList] = useState(false);
  const [students, setStudents] = useState([]);
  const [ editId , setEditId ] = useState ( null );
  const [formData, setFormData] = useState({
    studentName: '',
    sportName: '',
    batchName: '',
    joiningDate: '',
    contactNumber: '',
    amountPaid: '',
    paymentMethod: ''
  });

  const sports = ['Cricket', 'Football', 'Badminton', 'Basketball'];
  const batches = ['Morning Batch (6AM - 8AM)', 'Evening Batch (5PM - 7PM)', 'Weekend Batch (8AM - 10AM)'];
  const paymentMethods = ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking'];

  const sportColors = {
    'Cricket': 'bg-emerald-100 text-emerald-700',
    'Football': 'bg-blue-100 text-blue-700',
    'Badminton': 'bg-purple-100 text-purple-700',
    'Basketball': 'bg-orange-100 text-orange-700'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
  if (
    !formData.studentName ||
    !formData.sportName ||
    !formData.batchName ||
    !formData.joiningDate ||
    !formData.contactNumber ||
    !formData.amountPaid ||
    !formData.paymentMethod
  ) {
    alert('Please fill all required fields');
    return;
  }

  if (editId) {
    // UPDATE STUDENT
    setStudents(prev =>
      prev.map(student =>
        student.id === editId ? { ...student, ...formData } : student
      )
    );

    alert('Student updated successfully!');
    setEditId(null);
  } else {
    // ADD STUDENT
    const newStudent = {
      id: Date.now(),
      ...formData
    };

    setStudents(prev => [...prev, newStudent]);
    alert('Student added successfully!');
  }

  // Reset form
  setFormData({
    studentName: '',
    sportName: '',
    batchName: '',
    joiningDate: '',
    contactNumber: '',
    amountPaid: '',
    paymentMethod: ''
  });
};
 
 const handleEdit = (student) => {
  setFormData({
    studentName: student.studentName,
    sportName: student.sportName,
    batchName: student.batchName,
    joiningDate: student.joiningDate,
    contactNumber: student.contactNumber,
    amountPaid: student.amountPaid,
    paymentMethod: student.paymentMethod
  });

  setEditId(student.id);
  setShowStudentList(false); // Switch to form view automatically
};


  const handleClear = () => {
    setFormData({
      studentName: '',
      sportName: '',
      batchName: '',
      joiningDate: '',
      contactNumber: '',
      amountPaid: '',
      paymentMethod: ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(prev => prev.filter(student => student.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Toggle Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowStudentList(!showStudentList)}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all shadow-sm"
          >
            {showStudentList ? <UserPlus className="w-4 h-4" /> : <List className="w-4 h-4" />}
            {showStudentList ? 'Add Student' : 'View Student List'}
          </button>
        </div>

        {!showStudentList ? (
          <>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Add New Student</h1>
              </div>
              <p className="text-sm text-gray-600">Fill in the student details to enroll them in the club</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Student Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                      placeholder="Enter student full name"
                    />
                  </div>
                </div>

                {/* Sport Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sport <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="sportName"
                    value={formData.sportName}
                    onChange={handleChange}
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all bg-white"
                  >
                    <option value="">Select a sport</option>
                    {sports.map((sport) => (
                      <option key={sport} value={sport}>{sport}</option>
                    ))}
                  </select>
                </div>

                {/* Batch Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allocated Batch <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="batchName"
                      value={formData.batchName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all bg-white"
                    >
                      <option value="">Select a batch</option>
                      {batches.map((batch) => (
                        <option key={batch} value={batch}>{batch}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Joining Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Joining Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="joiningDate"
                      value={formData.joiningDate}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </div>

                {/* Amount Paid */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount Paid <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="amountPaid"
                      value={formData.amountPaid}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all bg-white"
                    >
                      <option value="">Select payment method</option>
                      {paymentMethods.map((method) => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
                >
                  Add Student
                </button>
                <button
                  onClick={handleClear}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Info Card */}
            <div className="mt-5 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Note:</span> All fields marked with <span className="text-red-500">*</span> are required. Make sure to verify the student details before submission.
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Student List Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                  <List className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Student List</h1>
              </div>
              <p className="text-sm text-gray-600">View and manage all enrolled students</p>
            </div>

            {/* Student List */}
            {students.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
                <div className="max-w-sm mx-auto">
                  <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Students Added Yet</h3>
                  <p className="text-sm text-gray-600 mb-4">Start by adding your first student to the club</p>
                  <button
                    onClick={() => setShowStudentList(false)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all inline-flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add Student
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Student Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Sport</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Batch</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Joining Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Contact</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">{student.studentName.charAt(0)}</span>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{student.studentName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${sportColors[student.sportName]}`}>
                              {student.sportName}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{student.batchName}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{student.joiningDate}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{student.contactNumber}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">₹{student.amountPaid}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{student.paymentMethod}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium gap-3">
                             <button
                                onClick={() => handleEdit(student)}
                                className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                 title="Edit"
                            >
                            <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(student.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Student Count */}
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Total Students: <span className="font-semibold text-gray-800">{students.length}</span>
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Student;