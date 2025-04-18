export async function sendToJD(url: string, title: string) {
  fetch("http://localhost:8297/addLink", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(":DmFHH9SuSgytH437FgGW")}`,
    },
    body: JSON.stringify({
      url,
      packageName: title,
      forcePackageName: true,
    }),
  });
}
