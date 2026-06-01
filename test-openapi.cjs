async function run() {
  const openapiReqUrls = [
     'https://admin.ministylecards.com/api/openapi.json',
     'https://admin.ministylecards.com/openapi.json',
     'https://admin.ministylecards.com/api/docs-json',
     'https://admin.ministylecards.com/api-docs'
  ];
  for (const url of openapiReqUrls) {
      const res = await fetch(url);
      if (res.ok) {
         console.log("Found at", url);
         const text = await res.text();
         console.log(text.substring(0, 200));
         return;
      } else {
         console.log("Not found at", url, res.status);
      }
  }
}
run();
