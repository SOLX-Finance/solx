/**
 * Downloads a file directly rather than opening it in a new tab
 * @param url The URL of the file to download
 * @param fileName Optional name for the downloaded file
 */
export const downloadFile = (url: string, fileName?: string): void => {
  // Create a temporary anchor element
  const link = document.createElement('a');
  link.href = url;

  // Set download attribute to force download instead of navigation
  link.setAttribute('download', fileName || '');
  link.setAttribute('target', '_blank');
  link.style.display = 'none';

  // Add to DOM, click it, and remove it
  document.body.appendChild(link);
  link.click();

  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
  }, 100);
};
