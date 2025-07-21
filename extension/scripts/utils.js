function showToast(msg) {
  const toast = document.getElementById("toast-box");
  if (toast) {
    toast.innerText = msg;
    toast.style.display = "block";
    setTimeout(() => {
      if (toast) toast.style.display = "none";
    }, 3000);
  }
}
