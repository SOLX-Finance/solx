import React, { useState, useEffect } from 'react';

import { useCreateSaleForm } from '../hooks/useCreateSaleForm';

import { FileType } from '@/hooks/useFileUploadQuery';
import { cn } from '@/utils/cn';

const CATEGORIES = ['DeFi', 'AI', 'DePIN', 'Games', 'Others'];

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
    removeSelectedFile,
    getFilesByType,
    validateTitle,
    validateDescription,
    validatePrice,
    validateCollateralAmount,
  } = useCreateSaleForm();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const contentFiles = getFilesByType(FileType.SALE_CONTENT);
  const demoFiles = getFilesByType(FileType.SALE_DEMO);
  const previewFiles = getFilesByType(FileType.SALE_PREVIEW);

  // Update form categories when selectedCategories changes
  useEffect(() => {
    form.setFieldValue('categories', selectedCategories);
  }, [selectedCategories, form]);

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 max-w-4xl mx-auto">
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

      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-semibold">Create Project</h2>
          <p className="text-gray-500 mt-2">
            Once you create a project, you will not be able to change or edit it
          </p>
        </div>
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="px-10 py-3 bg-black text-white font-medium text-xl rounded-full hover:bg-gray-800 disabled:bg-gray-400"
          disabled={
            isUploading ||
            isSubmitting ||
            !form.state.canSubmit ||
            contentFiles.length === 0 ||
            !form.state.values.title ||
            !form.state.values.description ||
            form.state.values.price <= 0 ||
            form.state.values.collateralAmount <= 0
          }
        >
          {isSubmitting ? 'Creating Project...' : 'Create Project'}
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-8"
      >
        {/* Project Name Field */}
        {form.Field({
          name: 'title',
          validators: {
            onChange: ({ value }) => validateTitle(value),
            onBlur: ({ value }) => validateTitle(value),
          },
          children: (field) => (
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-lg font-normal text-black mb-2"
              >
                Project name
              </label>
              <input
                type="text"
                id="title"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className={cn(
                  'w-full px-6 py-3 rounded-full border focus:outline-none focus:ring-1 focus:ring-black',
                  field.state.meta.errors.length > 0 &&
                    field.state.meta.isTouched
                    ? 'border-red-300'
                    : 'border-gray-300',
                )}
                placeholder="Name"
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

        {/* Price Field */}
        {form.Field({
          name: 'price',
          validators: {
            onChange: ({ value }) => validatePrice(value),
            onBlur: ({ value }) => validatePrice(value),
          },
          children: (field) => (
            <div className="mb-6">
              <label
                htmlFor="price"
                className="block text-lg font-normal text-black mb-2"
              >
                Price
              </label>
              <div className="relative">
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
                  className={cn(
                    'w-full px-6 py-3 rounded-full border focus:outline-none focus:ring-1 focus:ring-black',
                    field.state.meta.errors.length > 0 &&
                      field.state.meta.isTouched
                      ? 'border-red-300'
                      : 'border-gray-300',
                  )}
                  placeholder="0"
                />
              </div>
              {field.state.meta.errors.length > 0 &&
                field.state.meta.isTouched && (
                  <div className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors[0]}
                  </div>
                )}
              <p className="mt-1 text-sm text-gray-500">
                The platform takes a 5% commission
              </p>
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
            <div className="mb-6">
              <label
                htmlFor="collateralAmount"
                className="block text-lg font-normal text-black mb-2"
              >
                Collateral Amount
              </label>
              <div className="relative">
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
                  className={cn(
                    'w-full px-6 py-3 rounded-full border focus:outline-none focus:ring-1 focus:ring-black',
                    field.state.meta.errors.length > 0 &&
                      field.state.meta.isTouched
                      ? 'border-red-300'
                      : 'border-gray-300',
                  )}
                  placeholder="0"
                />
              </div>
              {field.state.meta.errors.length > 0 &&
                field.state.meta.isTouched && (
                  <div className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors[0]}
                  </div>
                )}
              <p className="mt-1 text-sm text-gray-500">
                Amount to be held as collateral for this sale
              </p>
            </div>
          ),
        })}

        {/* Project Description Field */}
        {form.Field({
          name: 'description',
          validators: {
            onChange: ({ value }) => validateDescription(value),
            onBlur: ({ value }) => validateDescription(value),
          },
          children: (field) => (
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-lg font-normal text-black mb-2"
              >
                Project description
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  rows={5}
                  className={cn(
                    'w-full px-6 py-4 rounded-2xl border focus:outline-none focus:ring-1 focus:ring-black',
                    field.state.meta.errors.length > 0 &&
                      field.state.meta.isTouched
                      ? 'border-red-300'
                      : 'border-gray-300',
                  )}
                  placeholder="Tell about your project"
                  maxLength={1000}
                />
                <div className="absolute bottom-4 right-4 text-gray-400 text-sm">
                  {field.state.value.length}/1000
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

        {/* Categories Dropdown */}
        <div className="mb-6">
          <label className="block text-lg font-normal text-black mb-2">
            Categories
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="w-full flex justify-between items-center px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
            >
              <span>
                {selectedCategories.length > 0
                  ? selectedCategories.join(', ')
                  : 'Select categories'}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transform transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`}
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {categoryDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                {CATEGORIES.map((category) => (
                  <div
                    key={category}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    <div
                      className={`w-5 h-5 border rounded mr-2 flex items-center justify-center ${
                        selectedCategories.includes(category)
                          ? 'bg-black border-black'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedCategories.includes(category) && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 3L4.5 8.5L2 6"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content Files Upload */}
        <div className="mb-6">
          <label className="block text-lg font-normal text-black mb-2">
            Content Files *
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                document.getElementById('contentFileInput')?.click();
              }}
              className={cn(
                'w-full flex flex-col justify-center items-center py-8 px-4 border-2 border-dashed rounded-lg transition-colors duration-200',
                contentFiles.length > 0
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-black',
              )}
            >
              {contentFiles.length > 0 ? (
                <>
                  <svg
                    className="w-12 h-12 text-green-500 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-lg font-medium text-green-600">
                    ZIP file uploaded
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    {contentFiles[0].name}
                  </span>
                </>
              ) : (
                <>
                  <svg
                    className="w-12 h-12 text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <span className="text-lg font-medium">
                    Upload Content ZIP File
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    Click to browse for a ZIP archive
                  </span>
                </>
              )}
            </button>

            <input
              id="contentFileInput"
              type="file"
              onChange={handleContentFileChange}
              className="hidden"
              disabled={isUploading}
              accept=".zip,application/zip"
            />
          </div>

          {/* Display uploaded content file */}
          {contentFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between p-2 border rounded-lg bg-gray-50">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  <span className="truncate max-w-xs">
                    {contentFiles[0].name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeSelectedFile(FileType.SALE_CONTENT, 0)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          )}

          <p className="mt-2 text-sm text-gray-500">
            Upload a single ZIP archive containing all content files that buyers
            will receive.
          </p>
        </div>

        {/* Preview Images Upload */}
        <div className="mb-6">
          <label className="block text-lg font-normal text-black mb-2">
            Preview Images
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                document.getElementById('previewFileInput')?.click();
              }}
              className={cn(
                'w-full flex flex-col justify-center items-center py-8 px-4 border-2 border-dashed rounded-lg transition-colors duration-200',
                previewFiles.length > 0
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-black',
              )}
            >
              {previewFiles.length > 0 ? (
                <>
                  <svg
                    className="w-12 h-12 text-blue-500 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span className="text-lg font-medium text-blue-600">
                    {previewFiles.length} preview image(s) uploaded
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    Click to add more preview images
                  </span>
                </>
              ) : (
                <>
                  <svg
                    className="w-12 h-12 text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span className="text-lg font-medium">
                    Upload Preview Images
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    Drag and drop or click to browse
                  </span>
                </>
              )}
            </button>

            <input
              id="previewFileInput"
              type="file"
              onChange={handlePreviewFileChange}
              className="hidden"
              disabled={isUploading}
              accept="image/*"
              multiple
            />
          </div>

          {/* Display uploaded preview images with thumbnails */}
          {previewFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Uploaded Preview Images:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {previewFiles.map((file, idx) => (
                  <div key={idx} className="relative group">
                    <div className="w-full h-24 bg-gray-100 flex items-center justify-center rounded-lg border border-gray-300">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        removeSelectedFile(FileType.SALE_PREVIEW, idx)
                      }
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </button>
                    <p className="text-xs truncate mt-1">{file.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="mt-2 text-sm text-gray-500">
            Preview images will be displayed to potential buyers. Upload up to 5
            images.
          </p>
        </div>

        {/* Add Demo Toggle */}
        <div className="mb-6 flex items-center gap-5">
          <div
            className={cn(
              'w-10 h-10 rounded-lg cursor-pointer flex items-center justify-center',
              showDemo ? 'bg-purple-400' : 'border border-gray-300',
            )}
            onClick={() => setShowDemo(!showDemo)}
          >
            {showDemo && (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.6667 5L7.50001 14.1667L3.33334 10"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className="text-2xl font-semibold">Add Demo</span>
        </div>

        {/* Demo Files Upload - Only show if demo is checked */}
        {showDemo && (
          <div className="mb-6">
            <label className="block text-lg font-normal text-black mb-2">
              Demo Files
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  document.getElementById('demoFileInput')?.click();
                }}
                className={cn(
                  'w-full flex flex-col justify-center items-center py-8 px-4 border-2 border-dashed rounded-lg transition-colors duration-200',
                  demoFiles.length > 0
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 hover:border-black',
                )}
              >
                {demoFiles.length > 0 ? (
                  <>
                    <svg
                      className="w-12 h-12 text-purple-500 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span className="text-lg font-medium text-purple-600">
                      {demoFiles.length} demo file(s) uploaded
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                      Click to add more demo files
                    </span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-12 h-12 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <span className="text-lg font-medium">
                      Upload Demo Files
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                      Drag and drop or click to browse
                    </span>
                  </>
                )}
              </button>

              <input
                id="demoFileInput"
                type="file"
                onChange={handleDemoFileChange}
                className="hidden"
                disabled={isUploading}
                multiple
              />
            </div>

            {/* Display uploaded demo files */}
            {demoFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium">Uploaded Demo Files:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {demoFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-gray-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          ></path>
                        </svg>
                        <span className="truncate max-w-xs">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          removeSelectedFile(FileType.SALE_DEMO, idx)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-2 text-sm text-gray-500">
              Demo files are optional and will be available for potential buyers
              to preview.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateSaleForm;
