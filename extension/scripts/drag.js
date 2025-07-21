function initializeDrag() {
  const header = document.getElementById("drag-header");
  const widget = document.getElementById("matchmyresume-widget");
  if (!header || !widget) return () => {};

  let offsetX = 0,
    offsetY = 0,
    isDragging = false;

  const moveHandler = (e) => {
    if (!isDragging) return;
    const widget = document.getElementById("matchmyresume-widget");
    if (!widget) {
      isDragging = false;
      return;
    }
    widget.style.left = `${e.clientX - offsetX}px`;
    widget.style.top = `${e.clientY - offsetY}px`;
    widget.style.right = "auto";
    widget.style.bottom = "auto";
  };

  const upHandler = () => {
    isDragging = false;
    document.body.style.userSelect = "";
  };

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - widget.getBoundingClientRect().left;
    offsetY = e.clientY - widget.getBoundingClientRect().top;
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", moveHandler);
  document.addEventListener("mouseup", upHandler);

  function cleanup() {
    document.removeEventListener("mousemove", moveHandler);
    document.removeEventListener("mouseup", upHandler);
    if (widget) widget.remove();
  }

  const closeWidget = document.getElementById("close-widget");
  if (closeWidget) closeWidget.addEventListener("click", cleanup);

  return cleanup;
}
