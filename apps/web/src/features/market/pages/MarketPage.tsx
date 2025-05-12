import React from 'react';
import { Link } from 'react-router-dom';

const MarketPage = () => {
  // Mock data for projects
  const projects = [
    { id: '1', name: 'Project 1', description: 'This is project 1' },
    { id: '2', name: 'Project 2', description: 'This is project 2' },
    { id: '3', name: 'Project 3', description: 'This is project 3' },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Market</h1>
        <Link
          to="/projects/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Create Project
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <Link
              to={`/projects/${project.id}`}
              className="text-indigo-600 hover:text-indigo-800"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketPage;
