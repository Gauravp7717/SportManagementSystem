import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users } from "lucide-react";

const Dashboard = () => {
  const sportsData = [
    {
      id: 1,
      name: "Cricket",
      students: 145,
      icon: "🏏",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      id: 2,
      name: "Football",
      students: 128,
      icon: "⚽",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      id: 3,
      name: "Badminton",
      students: 96,
      icon: "🏸",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      id: 4,
      name: "Basketball",
      students: 112,
      icon: "🏀",
      gradient: "from-orange-500 to-red-600",
    },
  ];

  const chartData = sportsData.map((s) => ({
    name: s.name,
    students: s.students,
  }));

  const totalStudents = sportsData.reduce(
    (sum, sport) => sum + sport.students,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Club Dashboard</h1>
          <p className="text-sm text-gray-600">
            Overview of sports participation across the club
          </p>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">
                Total Active Students
              </p>
              <p className="text-3xl font-bold text-gray-800">{totalStudents}</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-md">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Sports Cards Grid — Smaller & Cleaner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sportsData.map((sport) => (
            <div
              key={sport.id}
              className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-md transition-all"
            >
              <div
                className={`bg-gradient-to-br ${sport.gradient} px-4 py-4 flex items-center justify-between`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{sport.icon}</span>
                  <div>
                    <h3 className="text-white font-semibold text-sm">
                      {sport.name}
                    </h3>
                    <p className="text-white text-xs opacity-90">
                      Active Players
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-white text-xl font-bold">
                    {sport.students}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white  shadow p-5 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-1">
            Student Distribution
          </h2>
          <p className="text-xs text-gray-600 mb-3">
            Comparison of student enrollment across sports
          </p>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <defs>
                <linearGradient id="cricketGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#0d9488" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="footballGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient
                  id="badmintonGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#db2777" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient
                  id="basketballGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
              />
              <Tooltip />

              <Bar
                dataKey="students"
                radius={[6, 6, 0, 0]}
                shape={(props) => {
                  const colorMap = {
                    Cricket: "url(#cricketGradient)",
                    Football: "url(#footballGradient)",
                    Badminton: "url(#badmintonGradient)",
                    Basketball: "url(#basketballGradient)",
                  };

                  return <rect {...props} fill={colorMap[props.name]} />;
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
