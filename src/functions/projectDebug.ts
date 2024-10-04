function projectDebug (...text: any[]) {
  if ("localDebug" in window && window.localDebug) {
    console.log(text);
  }
}

export default projectDebug;
