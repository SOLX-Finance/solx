import React from 'react';

import { useCreateSaleForm } from '../hooks/useCreateSaleForm';

import { FileType } from '@/hooks/useFileUploadQuery';

const CreateSaleForm: React.FC = () => {
  const {
    form,
    isSubmitting,
    isUploading,
    formError,
    uploadError,
    onchainError,
    successMessage,
    handleContentFileChange,
    handleDemoFileChange,
    handlePreviewFileChange,
    removeFile,
    getFilesByType,
    validateTitle,
    validateDescription,
    validatePrice,
    validateCollateralAmount,
  } = useCreateSaleForm();

  const contentFiles = getFilesByType(FileType.SALE_CONTENT);
  const demoFiles = getFilesByType(FileType.SALE_DEMO);
  const previewFiles = getFilesByType(FileType.SALE_PREVIEW);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Create New Sale</h2>

      {(formError || uploadError || onchainError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {formError || uploadError || onchainError}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        {/* Title Field */}
        {form.Field({
          name: 'title',
          validators: {
            onChange: ({ value }) => validateTitle(value),
            onBlur: ({ value }) => validateTitle(value),
          },
          children: (field) => (
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  field.state.meta.errors.length > 0 &&
                  field.state.meta.isTouched
                    ? 'border-red-300'
                    : ''
                }`}
                maxLength={100}
              />
              {field.state.meta.errors.length > 0 &&
                field.state.meta.isTouched && (
                  <div className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors[0]}
                  </div>
                )}
            </div>
          ),
        })}

        {/* Description Field */}
        {form.Field({
          name: 'description',
          validators: {
            onChange: ({ value }) => validateDescription(value),
            onBlur: ({ value }) => validateDescription(value),
          },
          children: (field) => (
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description *
              </label>
              <textarea
                id="description"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                rows={5}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  field.state.meta.errors.length > 0 &&
                  field.state.meta.isTouched
                    ? 'border-red-300'
                    : ''
                }`}
                maxLength={5000}
              />
              {field.state.meta.errors.length > 0 &&
                field.state.meta.isTouched && (
                  <div className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors[0]}
                  </div>
                )}
            </div>
          ),
        })}

        {/* Price Field */}
        {form.Field({
          name: 'price',
          validators: {
            onChange: ({ value }) => validatePrice(value),
            onBlur: ({ value }) => validatePrice(value),
          },
          children: (field) => (
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price (SOL) *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  id="price"
                  step="0.01"
                  min="0"
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(parseFloat(e.target.value))
                  }
                  onBlur={field.handleBlur}
                  className={`block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 ${
                    field.state.meta.errors.length > 0 &&
                    field.state.meta.isTouched
                      ? 'border-red-300'
                      : ''
                  }`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">SOL</span>
                </div>
              </div>
              {field.state.meta.errors.length > 0 &&
                field.state.meta.isTouched && (
                  <div className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors[0]}
                  </div>
                )}
            </div>
          ),
        })}

        {/* Collateral Amount Field */}
        {form.Field({
          name: 'collateralAmount',
          validators: {
            onChange: ({ value }) => validateCollateralAmount(value),
            onBlur: ({ value }) => validateCollateralAmount(value),
          },
          children: (field) => (
            <div>
              <label
                htmlFor="collateralAmount"
                className="block text-sm font-medium text-gray-700"
              >
                Collateral Amount (SOL) *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  id="collateralAmount"
                  step="0.01"
                  min="0"
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(parseFloat(e.target.value))
                  }
                  onBlur={field.handleBlur}
                  className={`block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 ${
                    field.state.meta.errors.length > 0 &&
                    field.state.meta.isTouched
                      ? 'border-red-300'
                      : ''
                  }`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">SOL</span>
                </div>
              </div>
              {field.state.meta.errors.length > 0 &&
                field.state.meta.isTouched && (
                  <div className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors[0]}
                  </div>
                )}
              <p className="mt-1 text-sm text-gray-500">
                This is the amount that will be locked as collateral for this
                sale.
              </p>
            </div>
          ),
        })}

        {/* Content File */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content File *
          </label>
          <input
            type="file"
            onChange={handleContentFileChange}
            className="mt-1 block w-full"
            disabled={isUploading}
          />
          {contentFiles.length > 0 && (
            <div className="mt-2 flex items-center">
              <span className="mr-2">{contentFiles[0].name}</span>
              <button
                type="button"
                onClick={() => removeFile(contentFiles[0].id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          )}
          <p className="mt-1 text-sm text-gray-500">
            This is the main content file that buyers will receive.
          </p>
        </div>

        {/* Demo File */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Demo File (Optional)
          </label>
          <input
            type="file"
            onChange={handleDemoFileChange}
            className="mt-1 block w-full"
            disabled={isUploading}
          />
          {demoFiles.length > 0 && (
            <div className="mt-2 flex items-center">
              <span className="mr-2">{demoFiles[0].name}</span>
              <button
                type="button"
                onClick={() => removeFile(demoFiles[0].id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          )}
          <p className="mt-1 text-sm text-gray-500">
            A demo version of your content that potential buyers can preview.
          </p>
        </div>

        {/* Preview Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preview Image (Optional)
          </label>
          <input
            type="file"
            onChange={handlePreviewFileChange}
            className="mt-1 block w-full"
            accept="image/*"
            disabled={isUploading}
          />
          {previewFiles.length > 0 && (
            <div className="mt-2 flex items-center">
              <span className="mr-2">{previewFiles[0].name}</span>
              <button
                type="button"
                onClick={() => removeFile(previewFiles[0].id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          )}
          <p className="mt-1 text-sm text-gray-500">
            An image that will be displayed as a preview for your sale.
          </p>
        </div>

        <div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={isUploading || isSubmitting || !form.state.canSubmit}
          >
            {isSubmitting ? 'Creating Sale...' : 'Create Sale'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSaleForm;
