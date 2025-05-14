import React from 'react';

import { useCreateSaleFormQuery } from '../hooks/useCreateSaleFormQuery';

import { FileType } from '@/hooks/useFileUploadQuery';

const CreateSalePage: React.FC = () => {
  const {
    form,
    isSubmitting,
    isUploading,
    uploadedFiles,
    submitError,
    uploadError,
    handleContentFileChange,
    handleDemoFileChange,
    handlePreviewFileChange,
    removeFile,
  } = useCreateSaleFormQuery();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create New Sale</h1>

      {(uploadError || submitError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {uploadError ?? submitError}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="max-w-md space-y-4"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          {form.Field({
            name: 'title',
            children: (field) => (
              <input
                type="text"
                id="title"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
                maxLength={100}
              />
            ),
          })}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          {form.Field({
            name: 'description',
            children: (field) => (
              <textarea
                id="description"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
                maxLength={5000}
              />
            ),
          })}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content File (Required)
          </label>
          <input
            type="file"
            onChange={handleContentFileChange}
            className="mt-1 block w-full"
            disabled={
              isUploading ||
              uploadedFiles.some((file) => file.type === FileType.SALE_CONTENT)
            }
          />
          {uploadedFiles
            .filter((file) => file.type === FileType.SALE_CONTENT)
            .map((file) => (
              <div key={file.id} className="mt-2 flex items-center">
                <span className="mr-2">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Demo File (Optional)
          </label>
          <input
            type="file"
            onChange={handleDemoFileChange}
            className="mt-1 block w-full"
            disabled={
              isUploading ||
              uploadedFiles.some((file) => file.type === FileType.SALE_DEMO)
            }
          />
          {uploadedFiles
            .filter((file) => file.type === FileType.SALE_DEMO)
            .map((file) => (
              <div key={file.id} className="mt-2 flex items-center">
                <span className="mr-2">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preview File (Optional)
          </label>
          <input
            type="file"
            onChange={handlePreviewFileChange}
            className="mt-1 block w-full"
            disabled={isUploading}
          />
          {uploadedFiles
            .filter((file) => file.type === FileType.SALE_PREVIEW)
            .map((file) => (
              <div key={file.id} className="mt-2 flex items-center">
                <span className="mr-2">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>

        <div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={isUploading || isSubmitting || form.state.isSubmitting}
          >
            {isSubmitting || form.state.isSubmitting
              ? 'Creating Sale...'
              : 'Create Sale'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSalePage;
