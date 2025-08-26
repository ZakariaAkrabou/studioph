import { useMemo } from "react";
import { useGetCategoriesQuery } from "../../store/services/categoryApi.jsx";
import { useGetPortfoliosQuery } from "../../store/services/portfolioApi.jsx";
import { useGetSpacesQuery } from "../../store/services/clientSpaceApi.jsx";

export default function Dashboard() {
  const { data: categories = [], isFetching: loadingCategories } = useGetCategoriesQuery();
  const { data: portfolios = [], isFetching: loadingPortfolios } = useGetPortfoliosQuery();
  const { data: spaces = [], isFetching: loadingSpaces } = useGetSpacesQuery();

  const stats = useMemo(() => ({
    categories: categories?.length || 0,
    portfolio: portfolios?.length || 0,
    clientSpaces: spaces?.length || 0,
  }), [categories, portfolios, spaces]);

  const recentActivity = useMemo(() => {
    const actionFromDates = (createdAt, updatedAt) => {
      if (!createdAt && !updatedAt) return 'performed an action on';
      if (!updatedAt) return 'created';
      const c = new Date(createdAt || updatedAt).getTime();
      const u = new Date(updatedAt).getTime();
      return u > c + 1000 ? 'updated' : 'created';
    };

    const catActs = (categories || []).map((c) => ({
      type: 'category',
      action: actionFromDates(c.createdAt, c.updatedAt),
      target: c.name,
      date: c.updatedAt || c.createdAt,
    }));
    const portActs = (portfolios || []).map((p) => ({
      type: 'portfolio item',
      action: actionFromDates(p.createdAt, p.updatedAt),
      target: p.title,
      date: p.updatedAt || p.createdAt,
    }));
    const spaceActs = (spaces || []).map((s) => ({
      type: 'client space',
      action: actionFromDates(s.createdAt, s.updatedAt),
      target: s.name,
      date: s.updatedAt || s.createdAt,
    }));

    return [...catActs, ...portActs, ...spaceActs]
      .filter((a) => a.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  }, [categories, portfolios, spaces]);

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
              <p className="text-3xl font-bold text-gray-900 mt-2">{loadingCategories ? '—' : stats.categories}</p>
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
              <p className="text-sm font-medium text-gray-600">Portfolio Gallery</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{loadingPortfolios ? '—' : stats.portfolio}</p>
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
              <p className="text-3xl font-bold text-gray-900 mt-2">{loadingSpaces ? '—' : stats.clientSpaces}</p>
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
        <div className="space-y-3">
          {recentActivity.map((act, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${act.type.includes('portfolio') ? 'bg-blue-100' : act.type.includes('client') ? 'bg-green-100' : 'bg-purple-100'}`}>
                {act.type.includes('portfolio') && (
                  <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 5h16v14H4zM8 11l2 2 3-3 3 3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
                {act.type.includes('client') && (
                  <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5 1.343 3.5 3 3.5zM8 13c-3.866 0-7 2.239-7 5v2h10v-2c0-2.761-3.134-5-7-5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
                {!act.type.includes('portfolio') && !act.type.includes('client') && (
                  <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 6h6v6H4zM14 6h6v6h-6z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">You {act.action} a {act.type}</p>
                <p className="text-xs text-gray-500 truncate">{act.target}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(act.date).toLocaleString()}</span>
            </div>
          ))}
          {(loadingCategories || loadingPortfolios || loadingSpaces) && (
            <div className="text-sm text-gray-500">Loading activity…</div>
          )}
          {!loadingCategories && !loadingPortfolios && !loadingSpaces && recentActivity.length===0 && (
            <div className="text-sm text-gray-500">No recent activity yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
