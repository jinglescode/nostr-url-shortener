export async function checkUrlWebRiskSafe(url: string) {
  try {
    const res = await fetch(
      `https://webrisk.googleapis.com/v1/uris:search?threatTypes=MALWARE&threatTypes=SOCIAL_ENGINEERING&threatTypes=UNWANTED_SOFTWARE&threatTypes=SOCIAL_ENGINEERING_EXTENDED_COVERAGE&key=${process.env.NEXT_PUBLIC_WEBRISKAPI}&uri=${url}`
    );

    const data = await res.json();

    if (Object.keys(data).length === 0) {
      return true;
    }

    console.log("data", data);
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}
