import { useState } from "react";

export default function Dashboard() {
  const [stats] = useState({
    categories: 12,
    portfolio: 48,
    clientSpaces: 24,
  });

  console.log("Dashboard component is rendering!");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your studio.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Categories Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Categories</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.categories}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 6h6v6H4zM14 6h6v6h-6zM4 16h6v6H4zM14 16h6v6h-6z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">+2.5%</span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        {/* Portfolio Items Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Portfolio Items</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.portfolio}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 5h16v14H4zM8 11l2 2 3-3 3 3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">+12.3%</span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        {/* Client Spaces Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Client Spaces</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.clientSpaces}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5 1.343 3.5 3 3.5zM8 13c-3.866 0-7 2.239-7 5v2h10v-2c0-2.761-3.134-5-7-5zm8 0a8.96 8.96 0 00-4 .938A7.003 7.003 0 0121 20v0h-7v-2c0-1.117-.317-2.168-.862-3.062A6.99 6.99 0 0116 13z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">+8.1%</span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New portfolio item added</p>
              <p className="text-xs text-gray-500">Wedding Photography Collection</p>
            </div>
            <span className="text-xs text-gray-400">2 hours ago</span>
          </div>
          
          <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5 1.343 3.5 3 3.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New client space created</p>
              <p className="text-xs text-gray-500">Sarah & John Wedding</p>
            </div>
            <span className="text-xs text-gray-400">1 day ago</span>
          </div>
          
          <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 6h6v6H4zM14 6h6v6h-6z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Category updated</p>
              <p className="text-xs text-gray-500">Portrait Photography</p>
            </div>
            <span className="text-xs text-gray-400">3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
