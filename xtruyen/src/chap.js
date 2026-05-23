load('config.js');

function execute(url) {
  try {
    var browser = Engine.newBrowser(); // Khởi tạo browser
    browser.setUserAgent(UserAgent.android());
    var doc = browser.launch(url, 2000);
    browser.close();

    let html = doc.select("#chapter-reading-content").html();

    return Response.success(cleanHtml(html));
  } catch (error) {
    return Response.error("Exception in chap.js: " + error);
  }
}
