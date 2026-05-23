load("config.js");

function execute() {
  try {
    let response = fetch(BASE_URL);

    if (!response.ok) {
      return Response.error("Failed to fetch genre: HTTP " + response.code());
    }

    let doc = response.html();
    let novels = [];

    let novelItems = doc.select("li#menu-item-787939 ul.sub-menu > li");
    console.log(novelItems);

    novelItems.forEach((e) => {
      const item = e.select("a").first();

      novels.push({
        title: item.text(),
        input: BASE_URL + item.attr("href"),
        script: "gen.js",
      });
    });

    if (novels.length === 0) {
      return Response.error("No novels found in this category");
    }

    return Response.success(novels);
  } catch (error) {
    return Response.error("Exception in genre.js: " + error);
  }
}
