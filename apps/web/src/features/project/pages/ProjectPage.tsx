import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Project Details</h1>
      <p className="text-gray-700">
        Viewing project with ID: {projectId || 'Unknown'}
      </p>
    </div>
  );
};

export default ProjectPage;
