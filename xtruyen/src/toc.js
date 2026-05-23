load("config.js");

function execute(url) {
  try {
    let response = fetch(url);

    if (!response.ok) {
      return Response.error("Failed to fetch TOC: HTTP " + response.code());
    }

    let doc = response.html();
    let chapters = [];
    let tmpChapter = [];

    // Look for chapter links - use specific pattern matching
    const links = doc.select("div#init-links a").forEach((e) => {
      let chapter = e.attr("href").match(/\d+(?=\D*$)/)[0];
      tmpChapter.push(chapter);
    });

    for (let i = tmpChapter[0]; i < tmpChapter[1]; i++) {
      chapters.push({
        name: `Chương ${i}`,
        url: normalizeUrl(url + `/chuong-${i}/`),
        host: BASE_URL,
      });
    }

    if (chapters.length === 0) {
      return Response.error("No chapters found");
    }

    // Look for next page button if pagination exists
    let nextPage = "";
    let nextBtn = doc.select("a.next, a[rel='next'], .pagination a.next");

    if (nextBtn && nextBtn.length > 0) {
      nextPage = normalizeUrl(nextBtn.first().attr("href"));
    }

    return Response.success(chapters, nextPage);
  } catch (error) {
    return Response.error("Exception in toc.js: " + error);
  }
}
