import React, { useState, useEffect, useMemo } from "react";

// --- Mock Data ---
const mockPatients = [
  { id: 1, name: "Mukuna Kabeya", age: 23, gender: "Male", condition: "Hypertension", diagnosisCode: "I10" },
  { id: 2, name: "Paul Kabeya", age: 24, gender: "Male", condition: "Diabetes Mellitus", diagnosisCode: "E11" },
  { id: 3, name: "Miriam Kabeya", age: 22, gender: "Female", condition: "Asthma", diagnosisCode: "J45" },
  { id: 4, name: "Christian Ronald", age: 40, gender: "Male", condition: "Migraine", diagnosisCode: "G43" },
  { id: 5, name: "Lionne Mess", age: 38, gender: "Male", condition: "Hypertension", diagnosisCode: "I10" },
  { id: 6, name: "Tony Stark", age: 51, gender: "Male", condition: "Diabetes Mellitus", diagnosisCode: "E11" },
  { id: 7, name: "Peter Parker", age: 21, gender: "Male", condition: "Coronary Artery Disease", diagnosisCode: "I25" },
  { id: 8, name: "Bruce Wayne", age: 48, gender: "Male", condition: "Asthma", diagnosisCode: "J45" },
  { id: 9, name: "Carol Denvers", age: 33, gender: "Female", condition: "Hypertension", diagnosisCode: "I10" },
  { id: 10, name: "Patricia Moore", age: 22, gender: "Female", condition: "Diabetes Mellitus", diagnosisCode: "E11" },
];

// Pre-defined queries for the suggestion feature
const querySuggestions = [
  "all patients",
  "patients with hypertension",
  "patients with diabetes",
  "patients under 40",
  "patients over 60",
];

// --- Reusable Bar Chart Component ---
const SimpleBarChart = ({ data, title }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const counts = data.reduce((acc, patient) => {
      acc[patient.condition] = (acc[patient.condition] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  const maxValue = Math.max(...chartData.map((d) => d.value), 0);
  const chartHeight = 250;
  const barWidth = 60;
  const barMargin = 20;
  const chartWidth = chartData.length * (barWidth + barMargin);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      {chartData.length > 0 ? (
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 50}`} className="w-full h-auto">
          {chartData.map((d, i) => {
            const barHeight = maxValue > 0 ? (d.value / maxValue) * chartHeight : 0;
            const x = i * (barWidth + barMargin);
            const y = chartHeight - barHeight;
            return (
              <g key={d.name}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  className="fill-cyan-500 hover:fill-cyan-600 transition-colors cursor-pointer"
                />
                <text x={x + barWidth / 2} y={chartHeight + 15} textAnchor="middle" className="text-xs fill-gray-600">
                  {d.name.slice(0, 8)}
                  {d.name.length > 8 ? "..." : ""}
                </text>
                <text x={x + barWidth / 2} y={chartHeight + 30} textAnchor="middle" className="text-xs fill-gray-600">
                  {d.name.length > 8 ? d.name.slice(8, 16) : ""}
                  {d.name.length > 16 ? "..." : ""}
                </text>
                <text x={x + barWidth / 2} y={y - 5} textAnchor="middle" className="text-sm font-bold fill-gray-800">
                  {d.value}
                </text>
              </g>
            );
          })}
        </svg>
      ) : (
        <div className="flex items-center justify-center h-32 text-gray-500">
          No data to display in chart.
        </div>
      )}
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [query, setQuery] = useState("all patients");
  const [filteredPatients, setFilteredPatients] = useState(mockPatients);
  const [suggestions, setSuggestions] = useState([]);
  const [filters, setFilters] = useState({ age: "", diagnosisCode: "" });

  const uniqueDiagnosisCodes = useMemo(() => {
    const codes = new Set(mockPatients.map((p) => p.diagnosisCode));
    return ["All", ...Array.from(codes)];
  }, []);

  useEffect(() => {
    let results = [...mockPatients];

    if (query && query.toLowerCase() !== "all patients") {
      results = results.filter(
        (patient) =>
          patient.name.toLowerCase().includes(query.toLowerCase()) ||
          patient.condition.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filters.age) {
      if (filters.age === "under40") results = results.filter((p) => p.age < 40);
      else if (filters.age === "40to60") results = results.filter((p) => p.age >= 40 && p.age <= 60);
      else if (filters.age === "over60") results = results.filter((p) => p.age > 60);
    }

    if (filters.diagnosisCode && filters.diagnosisCode !== "All") {
      results = results.filter((p) => p.diagnosisCode === filters.diagnosisCode);
    }

    setFilteredPatients(results);
  }, [query, filters]);

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value) {
      setSuggestions(querySuggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase())));
    } else setSuggestions([]);
  };

  const handleSuggestionClick = (s) => {
    setQuery(s);
    setSuggestions([]);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ age: "", diagnosisCode: "" });
    setQuery("all patients");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Health on <span className="text-cyan-500">FHIR</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Intelligent healthcare data visualization and patient management system powered by FHIR standards
          </p>
        </header>

        {/* Search & Filters Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Search & Filter Patients</h2>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search */}
            <div className="relative lg:col-span-1">
              <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
                Natural Language Query
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  value={query}
                  onChange={handleQueryChange}
                  placeholder="e.g., 'patients with diabetes'"
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {suggestions.length > 0 && (
                <ul className="absolute z-20 w-full bg-white border-2 border-gray-200 rounded-xl mt-2 shadow-xl max-h-60 overflow-y-auto">
                  {suggestions.map((s, i) => (
                    <li
                      key={i}
                      onClick={() => handleSuggestionClick(s)}
                      className="px-4 py-3 cursor-pointer hover:bg-cyan-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 flex items-center"
                    >
                      <svg className="w-4 h-4 text-cyan-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Age Filter */}
            <div className="lg:col-span-1">
              <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                Age Range
              </label>
              <select
                id="age"
                name="age"
                value={filters.age}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              >
                <option value="">All Ages</option>
                <option value="under40">Under 40</option>
                <option value="40to60">40 - 60</option>
                <option value="over60">Over 60</option>
              </select>
            </div>

            {/* Diagnosis Filter */}
            <div className="lg:col-span-1">
              <label htmlFor="diagnosisCode" className="block text-sm font-semibold text-gray-700 mb-2">
                Diagnosis Code
              </label>
              <select
                id="diagnosisCode"
                name="diagnosisCode"
                value={filters.diagnosisCode}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              >
                {uniqueDiagnosisCodes.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-lg font-semibold">
                  {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} found
                </span>
              </div>
              <div className="text-sm opacity-90">
                Total: {mockPatients.length} patients
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mb-8">
          <SimpleBarChart data={filteredPatients} title="Distribution by Medical Condition" />
        </div>

        {/* Patient Details Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-3 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Patient Details
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Age</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Condition</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((p, index) => (
                    <tr key={p.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {p.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{p.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {p.age} years
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          p.gender === 'Male' ? 'bg-indigo-100 text-indigo-800' : 'bg-pink-100 text-pink-800'
                        }`}>
                          {p.gender}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {p.condition}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-gray-100 text-gray-800">
                          {p.diagnosisCode}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No patients found</h3>
                        <p className="text-gray-500 mb-4">
                          No patients match the current query and filters.
                        </p>
                        <button
                          onClick={clearFilters}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-200"
                        >
                          Clear filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}