load("config.js");

function execute(url, page) {
  if (!page) page = "0";
  let response = fetch(url, {
    method: "GET",
    queries: { start: page, vo: 1 },
  });

  if (response.ok) {
    let doc = response.html();

    let next = doc
      .select(".pagination")
      .select("li.active + li")
      .select("a")
      .attr("href")
      .match(/page=(\d+)/);
    if (next) next = next[1];

    let data = [];
    doc.select(".site-content >  .container > .row > div").forEach((e) => {
      data.push({
        name: e.select(".widget-thumbnail a").attr("title"),
        link: e.select(".widget-thumbnail a").attr("href"),
        cover: e.select("img").attr("src").replace("thumb", "img"),
        description: e.select(".book-author").text(),
        host: BASE_URL,
      });
    });

    return Response.success(data, next);
  }

  return null;
}
