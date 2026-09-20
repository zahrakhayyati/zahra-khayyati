export default async function handler(req, res) {
  const requested = Array.isArray(req.query.path) ? req.query.path[0] : req.query.path;

  if (
    !requested ||
    (!requested.startsWith("/assets/") &&
      requested !== "/Sahar-Khayyati-Portfolio.pdf")
  ) {
    res.status(400).send("Invalid file");
    return;
  }

  const origin =
    "https://sahar-khayyati-architecture.sahar-khayyati.chatgpt.site";

  try {
    const upstream = await fetch(origin + requested);

    if (!upstream.ok) {
      res.status(upstream.status).send("File unavailable");
      return;
    }

    const body = Buffer.from(await upstream.arrayBuffer());
    res.setHeader(
      "Content-Type",
      upstream.headers.get("content-type") || "application/octet-stream"
    );
    res.setHeader(
      "Cache-Control",
      "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000"
    );
    res.status(200).send(body);
  } catch {
    res.status(502).send("Upstream unavailable");
  }
}
