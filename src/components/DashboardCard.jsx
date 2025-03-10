import React from "react";
import { Link } from "react-router-dom";

export function DashboardCard({ title, count, icon: Icon, path, color, bgColor }) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-1">{count}</h3>
        </div>
        <div className={`p-3 rounded-full ${bgColor || 'bg-gray-100'}`}>
          <Icon sx={{ fontSize: 24, color: color.replace("hover:", "") }} />
        </div>
      </div>
      <Link
        to={path}
        className={`mt-4 inline-block text-sm font-medium ${color.replace("hover:", "")} hover:underline`}
      >
        View All →
      </Link>
    </div>
  );
}