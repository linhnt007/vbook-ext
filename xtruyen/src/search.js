load("config.js");
function execute(key, page) {
  if (!page) page = "0";
  let response = fetch(
    BASE_URL + `?s=${key}&post_type=wp-manga&m_orderby=keywords`,
  );

  if (response.ok) {
    let doc = response.html();
    let next = doc
      .select(".pagination")
      .select("a.active + a")
      .attr("href")
      .match(/page=(\d+)/);
    if (next) next = next[1];

    let data = [];
    doc.select(".search-main > .row > div").forEach((e) => {
      data.push({
        name: e.select(".widget-thumbnail a").attr("title"),
        link: e.select(".widget-thumbnail a").attr("href"),
        cover: e.select("img").attr("src").replace("thumb", "img"),
        description: e.select("span.author").text(),
        host: BASE_URL,
      });
    });

    return Response.success(data, next);
  }

  return null;
}
