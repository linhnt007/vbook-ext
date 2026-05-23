function execute() {
    try {
        // Define discovery/home tabs
        return Response.success([
          {
            title: "Truyện Mới Cập Nhật",
            input: "https://xtruyen.vn/truyen/?m_orderby=latest",
            script: "gen.js",
          },
          {
            title: "Truyện Hot",
            input: "https://xtruyen.vn/truyen/?m_orderby=trending",
            script: "gen.js",
          },
          {
            title: "Truyện Nhiều Người Đọc",
            input: "https://xtruyen.vn/truyen/?m_orderby=views",
            script: "gen.js",
          },
          {
            title: "Truyện Nhiều Chương",
            input: "https://xtruyen.vn/truyen/?m_orderby=chapter-number",
            script: "gen.js",
          },
          {
            title: "Truyện Dài 500C",
            input: "https://xtruyen.vn/tag/c500/?m_orderby=views",
            script: "gen.js",
          },
        ]);
        
    } catch (error) {
        return Response.error("Exception in home.js: " + error);
    }
}
