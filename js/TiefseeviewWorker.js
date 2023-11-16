"use strict";
self.addEventListener("message", async (e) => {
  let url = e.data.url;
  let scale = e.data.scale;
  let tempUrl = e.data.tempUrl;
  const imgBlob = await fetch(url).then(
    (r) => r.blob()
  );
  const img = await createImageBitmap(imgBlob);
  self.postMessage({ img, scale, tempUrl, url }, [img]);
}, false);
