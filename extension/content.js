(function () {
  // Create widget
  createWidget();

  // Initialize utilities
  const toast = showToast;

  // Initialize modules
  initializeAuth(toast);
  initializeResume(toast);
  initializeAnalyze(toast);
  const observer = initializeJobDescription();
  const cleanupDrag = initializeDrag();

  // Cleanup on widget close
  const closeWidget = document.getElementById("close-widget");
  if (closeWidget) {
    closeWidget.addEventListener("click", () => {
      observer.disconnect();
      cleanupDrag();
    });
  }
})();
