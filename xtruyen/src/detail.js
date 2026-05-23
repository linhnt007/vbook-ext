load("config.js");

function execute(url) {
  try {
    // Normalize URL first
    url = normalizeUrl(url);

    let response = fetch(url);

    if (!response.ok) {
      return Response.error("Failed to fetch page: HTTP " + response.code());
    }

    let doc = response.html();

    // Extract novel information
    let name = doc.select("h1").first();
    if (!name) {
      return Response.error("Novel name not found");
    }
    name = cleanText(name.text());

    // Find the cover image
    let cover = getBestCoverImage(doc);

    // If cover not found in main content, search more broadly
    if (!cover) {
      let coverImg = doc.select("img[src*='img.xtruyen.vn']").first();
      if (coverImg) {
        cover = filterCoverImage(coverImg.attr("src"));
      }
    }

    // Extract author - try multiple selectors
    let author = "";
    let authorDiv = doc.select("div.author-content").first();
    if (authorDiv) {
      author = cleanText(authorDiv.text());
    }

    // Extract description
    let description = doc.select(".summary__content").first();
    let descHtml = description ? cleanHtml(description.html()) : "";
    if (!descHtml) {
      let pTag = doc.select("p").first();
      if (pTag) {
        descHtml = cleanHtml(pTag.html());
      }
    }

    // Extract genres/categories
    let genres = [];
    doc.select("div.genres-content a").forEach((e) => {
      genres.push({
        title: e.text(),
        input: e.attr("href"),
        script: "gen.js",
      });
    });

    let statusText = doc
      .select(
        "div.summary_content .post-content > :last-child > .summary-content > div",
      )
      .first()
      .text();
    let ongoing = statusText != "Hoàn thành";

    // Build response
    return Response.success({
      name: name,
      cover: cover,
      author: author,
      description: descHtml,
      genres: genres,
      ongoing: ongoing,
      host: BASE_URL,
    });
  } catch (error) {
    return Response.error("Exception in detail.js: " + error);
  }
}
