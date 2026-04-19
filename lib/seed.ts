import type { SeedData } from '@/lib/types';

export const seoulSeedData: SeedData = {
  "trip": {
    "id": "seoul-2026-05",
    "title": "2026 首爾之旅",
    "destination": "首爾，韓國",
    "baseArea": "Hongdae",
    "hotel": "Maple Mansion Hongdae",
    "startDate": "2026-05-24",
    "endDate": "2026-05-31",
    "departureDate": "2026-05-24",
    "coverImage": "",
    "status": "planning"
  },
  "days": [
    {"id":"day-1","dayNumber":1,"date":"2026-05-24","title":"到埗日","district":"Hongdae","weather":{"condition":"Partly Cloudy","icon":"cloud-sun","minC":16,"maxC":23}},
    {"id":"day-2","dayNumber":2,"date":"2026-05-25","title":"Hongdae → Yeonnam → 漢江","district":"Hongdae / Yeonnam / Mangwon","weather":{"condition":"Cloudy","icon":"cloud","minC":17,"maxC":24}},
    {"id":"day-3","dayNumber":3,"date":"2026-05-26","title":"Seongsu 美感日","district":"Seongsu","weather":{"condition":"Sunny","icon":"sun","minC":18,"maxC":25}},
    {"id":"day-4","dayNumber":4,"date":"2026-05-27","title":"Bukchon → Geumdwaeji → Jung-gu 夜步","district":"Bukchon / Yaksu / Jung-gu","weather":{"condition":"Partly Cloudy","icon":"cloud-sun","minC":17,"maxC":24}},
    {"id":"day-5","dayNumber":5,"date":"2026-05-28","title":"Myeongdong → 清溪川 → N Seoul Tower","district":"Myeongdong / Jung-gu / Namsan","weather":{"condition":"Clear","icon":"sun","minC":18,"maxC":26}},
    {"id":"day-6","dayNumber":6,"date":"2026-05-29","title":"朋友晚餐日","district":"Hongdae / Yeonnam / Sinchon","weather":{"condition":"Cloudy","icon":"cloud","minC":18,"maxC":25}},
    {"id":"day-7","dayNumber":7,"date":"2026-05-30","title":"Clinic 日","district":"Hongdae / Yeonnam","weather":{"condition":"Partly Cloudy","icon":"cloud-sun","minC":17,"maxC":23}},
    {"id":"day-8","dayNumber":8,"date":"2026-05-31","title":"離境日","district":"Hongdae / Airport","weather":{"condition":"Sunny","icon":"sun","minC":18,"maxC":24}}
  ],
  "activities": [
    {"id":"a-1-1","dayId":"day-1","title":"入住 Maple Mansion Hongdae","category":"hotel","time":"17:30","place":"Maple Mansion Hongdae","note":"抵達後辦理酒店入住。","cost":0,"order":1},
    {"id":"a-1-2","dayId":"day-1","title":"晚餐：Hotel De GGOODD","category":"food","time":"18:00","place":"Hotel De GGOODD","note":"7 Donggyo-ro 46-gil, Mapo-gu；可由酒店步行前往。","cost":0,"order":2},
    {"id":"a-1-3","dayId":"day-1","title":"Hongdae 主街散步","category":"sightseeing","time":"20:00","place":"Hongdae Main Street","note":"第一晚先熟習環境、買水，感受街區氣氛。","cost":0,"order":3},
    {"id":"a-1-4","dayId":"day-1","title":"Hongdae 小巷／文具店／便利店","category":"shopping","time":"21:30","place":"Hongdae backstreets","note":"慢慢逛入小巷與不同小店。","cost":0,"order":4},
    {"id":"a-1-5","dayId":"day-1","title":"可選：Yeonnam 夜行或返回酒店","category":"other","time":"22:30","place":"Yeonnam / Hotel","note":"如果仲有精神可行去 Yeonnam 一帶，否則直接返酒店休息。","cost":0,"order":5},

    {"id":"a-2-1","dayId":"day-2","title":"Hongdae 咖啡店／輕鬆街行","category":"cafe","time":"14:00","place":"Hongdae","note":"留肚畀蒜蓉包同晚餐，唔好食太飽。","cost":0,"order":1},
    {"id":"a-2-2","dayId":"day-2","title":"Mandong Bakery Yeonnam","category":"food","time":"15:30","place":"Mandong Bakery Yeonnam","note":"買蒜蓉包；由 Hongdae 步行去 Yeonnam。","cost":0,"order":2},
    {"id":"a-2-3","dayId":"day-2","title":"Yeonnam-dong 散步","category":"sightseeing","time":"16:00","place":"Yeonnam-dong","note":"行街、揀選小店、影相；呢段唔需要再加咖啡店停留。","cost":0,"order":3},
    {"id":"a-2-4","dayId":"day-2","title":"晚餐：CAMELLO Yeonnam","category":"food","time":"19:00","place":"CAMELLO Yeonnam","note":"視乎當時位置可步行或短程的士。","cost":0,"order":4},
    {"id":"a-2-5","dayId":"day-2","title":"Mangwon 漢江公園","category":"sightseeing","time":"21:00","place":"Mangwon Hangang Park","note":"由 CAMELLO 乘的士前往；可向司機講「망원한강공원」。","cost":0,"order":5},
    {"id":"a-2-6","dayId":"day-2","title":"Saebyeok Hongdae Bar & Pub","category":"other","time":"23:15","place":"Saebyeok Hongdae Bar & Pub","note":"由漢江乘的士返 Hongdae；飲酒量保持輕鬆。","cost":0,"order":6},

    {"id":"a-3-1","dayId":"day-3","title":"Cafe Onion Seongsu","category":"cafe","time":"14:00","place":"Cafe Onion Seongsu","note":"由 Hongik Univ. Station 乘地鐵到 Seongsu Station，2號出口。","cost":0,"order":1},
    {"id":"a-3-2","dayId":"day-3","title":"EMPTY／Pop-up／選物店","category":"shopping","time":"16:30","place":"Seongsu","note":"重點係慢慢步行感受街區，而唔係密集打卡。","cost":0,"order":2},
    {"id":"a-3-3","dayId":"day-3","title":"晚餐：Seongsu Darak","category":"food","time":"19:00","place":"Seongsu Darak","note":"由 Seongsu Station 3號出口一帶步行可達。","cost":0,"order":3},
    {"id":"a-3-4","dayId":"day-3","title":"Seongsu 夜間散步","category":"sightseeing","time":"20:45","place":"Seongsu streets","note":"今日唔去 Gangnam，行程重心只放喺 Seongsu。","cost":0,"order":4},

    {"id":"a-4-1","dayId":"day-4","title":"Bukchon Hanok Village","category":"sightseeing","time":"14:00","place":"Bukchon Hanok Village","note":"由 Anguk Station 3號出口前往，節奏放慢。","cost":0,"order":1},
    {"id":"a-4-2","dayId":"day-4","title":"附近咖啡店／茶歇","category":"cafe","time":"16:00","place":"Bukchon / Anguk area","note":"去 Geumdwaeji Sikdang 前留個緩衝時間。","cost":0,"order":2},
    {"id":"a-4-3","dayId":"day-4","title":"前往 Geumdwaeji Sikdang","category":"transport","time":"16:40","place":"Yaksu Station","note":"建議約17:00到場排隊；地鐵到 Yaksu Station 2號出口。","cost":0,"order":3},
    {"id":"a-4-4","dayId":"day-4","title":"晚餐：Geumdwaeji Sikdang","category":"food","time":"17:30","place":"Geumdwaeji Sikdang","note":"實際入座時間可按排隊情況調整。","cost":0,"order":4},
    {"id":"a-4-5","dayId":"day-4","title":"Jung-gu 夜步","category":"sightseeing","time":"19:30","place":"Jung-gu","note":"如排隊太耐，可縮短此段，改為附近短程散步。","cost":0,"order":5},

    {"id":"a-5-1","dayId":"day-5","title":"Myeongdong 購物","category":"shopping","time":"14:00","place":"Myeongdong","note":"日間只食小食，留肚畀晚間行程。","cost":0,"order":1},
    {"id":"a-5-2","dayId":"day-5","title":"清溪川精華路段散步","category":"sightseeing","time":"18:00","place":"Cheonggye Plaza → Gwangtong Bridge → Supyo Bridge","note":"集中行最有氣氛嘅河段，黃昏時間最佳。","cost":0,"order":2},
    {"id":"a-5-3","dayId":"day-5","title":"前往 N Seoul Tower 巴士站","category":"transport","time":"19:00","place":"Chungmuro Station Exit 2 / Dongguk Univ. Station Exit 6","note":"乘 01A/01B 南山循環巴士；必要時可改乘的士。","cost":0,"order":3},
    {"id":"a-5-4","dayId":"day-5","title":"N Seoul Tower","category":"sightseeing","time":"19:30","place":"N Seoul Tower","note":"安排夜景時段到訪。","cost":0,"order":4},
    {"id":"a-5-5","dayId":"day-5","title":"便利店宵夜","category":"food","time":"21:30","place":"Convenience store","note":"可選拉麵、飯糰、炸物同飲品。","cost":0,"order":5},
    {"id":"a-5-6","dayId":"day-5","title":"返酒店／輕鬆夜行","category":"other","time":"22:30","place":"Hongdae / Hotel","note":"返程後可按體力決定是否再散步。","cost":0,"order":6},

    {"id":"a-6-1","dayId":"day-6","title":"Hongdae／Yeonnam／Sinchon 慢行","category":"sightseeing","time":"14:00","place":"Hongdae / Yeonnam / Sinchon","note":"因晚上同朋友食飯，日間保持彈性。","cost":0,"order":1},
    {"id":"a-6-2","dayId":"day-6","title":"咖啡店休息","category":"cafe","time":"17:30","place":"Hongdae / Yeonnam","note":"坐低休息，等晚餐時段。","cost":0,"order":2},
    {"id":"a-6-3","dayId":"day-6","title":"晚餐：Ilpyeon Deungsim Hongdae","category":"food","time":"19:00","place":"Ilpyeon Deungsim Hongdae","note":"視乎當時位置步行或短程的士前往。","cost":0,"order":3},
    {"id":"a-6-4","dayId":"day-6","title":"Hongdae 夜行／第二輪","category":"other","time":"21:30","place":"Hongdae","note":"跟朋友節奏即可，但避免飲太多。","cost":0,"order":4},

    {"id":"a-7-1","dayId":"day-7","title":"PPEUM Global Clinic Hongdae","category":"other","time":"14:00","place":"PPEUM Global Clinic Hongdae","note":"H-Cube 4F, 140 Yanghwa-ro；近 Hongik Univ. Station 9號出口。","cost":0,"order":1},
    {"id":"a-7-2","dayId":"day-7","title":"咖啡店休息","category":"cafe","time":"16:30","place":"Hongdae / Yeonnam","note":"Botox 後避免暴曬、出汗同飲酒。","cost":0,"order":2},
    {"id":"a-7-3","dayId":"day-7","title":"清淡晚餐：Donsubaek / Donsoobaek","category":"food","time":"19:00","place":"Donsubaek / Donsoobaek","note":"口味盡量清淡，避免酒精、太辣或太鹹。","cost":0,"order":3},
    {"id":"a-7-4","dayId":"day-7","title":"Hongdae／Yeonnam 輕鬆散步","category":"sightseeing","time":"20:30","place":"Hongdae / Yeonnam","note":"以舒適慢行為主。","cost":0,"order":4},
    {"id":"a-7-5","dayId":"day-7","title":"夜間咖啡店","category":"cafe","time":"23:00","place":"Hongdae / Yeonnam","note":"坐低放鬆，安靜結束當日行程。","cost":0,"order":5},
    {"id":"a-7-6","dayId":"day-7","title":"返回酒店","category":"hotel","time":"23:40","place":"Maple Mansion Hongdae","note":"返回酒店休息。","cost":0,"order":6},

    {"id":"a-8-1","dayId":"day-8","title":"Hongdae 附近早午餐","category":"food","time":"09:30","place":"Hongdae","note":"去機場前留喺附近，唔好走太遠。","cost":0,"order":1},
    {"id":"a-8-2","dayId":"day-8","title":"由酒店前往機場","category":"transport","time":"11:30","place":"Hongik Univ. Station → Airport","note":"由 Hongik Univ. Station 乘機場線前往。","cost":0,"order":2}
  ],
  "bookings": {
    "flights": [
      {
        "id": "flight-outbound",
        "tripType": "outbound",
        "routeTitle": "香港往首爾",
        "date": "2026-05-24",
        "departureTime": "09:45",
        "arrivalTime": "14:25",
        "departureAirport": "香港國際機場",
        "departureTerminal": "T1",
        "arrivalAirport": "仁川國際機場",
        "arrivalTerminal": "T1",
        "flightNumber": "UO630",
        "bookingRef": "WG7JJE",
        "duration": "3小時40分"
      },
      {
        "id": "flight-return",
        "tripType": "return",
        "routeTitle": "首爾往香港",
        "date": "2026-05-31",
        "departureTime": "15:25",
        "arrivalTime": "18:15",
        "departureAirport": "仁川國際機場",
        "departureTerminal": "T1",
        "arrivalAirport": "香港國際機場",
        "arrivalTerminal": "T1",
        "flightNumber": "UO631",
        "bookingRef": "B71Z3Z",
        "duration": "3小時50分"
      }
    ],
    "accommodation": {
      "id": "stay-maple-mansion-hongdae",
      "name": "Maple Mansion Hongdae",
      "checkInDate": "2026-05-24",
      "checkOutDate": "2026-05-31",
      "address": "11, World Cup buk-ro 6-gil, Mapo-gu, Seoul, 南韓",
      "note": "入住前可先寄放行李；退房日請預留前往機場時間。"
    },
    "clinic": {
      "id": "clinic-ppeum-hongdae",
      "clinicName": "PPEUM Global Clinic Hongdae",
      "date": "2026-05-30",
      "time": "14:00",
      "address": "4th, H-Cube building, 140 Yanghwa-ro, floor, Mapo-gu, Seoul, 南韓",
      "note": "建議提前 15 分鐘到達並攜帶護照或身分證明文件。"
    }
  },
  "prep": {
    "items": [
      {"id":"prep-doc-1","title":"Passport / 證件","category":"文件 / 財務","note":"","completed":false},
      {"id":"prep-doc-2","title":"保險","category":"文件 / 財務","note":"","completed":false},
      {"id":"prep-doc-3","title":"海外提款 / 現金","category":"文件 / 財務","note":"每日預算參考 HKD 1000","completed":false},
      {"id":"prep-doc-4","title":"鎖 / 鎖匙","category":"文件 / 財務","note":"","completed":false},
      {"id":"prep-doc-5","title":"筆","category":"文件 / 財務","note":"","completed":false},

      {"id":"prep-ele-1","title":"SIM card + 針","category":"電子 / 工具","note":"","completed":false},
      {"id":"prep-ele-2","title":"耳筒 / 喇叭","category":"電子 / 工具","note":"","completed":false},
      {"id":"prep-ele-3","title":"轉插 / 插頭 / 拖板 / 尿袋 / 電線 / HDMI","category":"電子 / 工具","note":"","completed":false},
      {"id":"prep-ele-4","title":"電腦","category":"電子 / 工具","note":"","completed":false},
      {"id":"prep-ele-5","title":"相機","category":"電子 / 工具","note":"","completed":false},
      {"id":"prep-ele-6","title":"自拍棍","category":"電子 / 工具","note":"","completed":false},
      {"id":"prep-ele-7","title":"Music / movie","category":"電子 / 工具","note":"","completed":false},
      {"id":"prep-ele-8","title":"小夜燈","category":"電子 / 工具","note":"","completed":false},

      {"id":"prep-cloth-1","title":"外套","category":"服飾 / 穿搭","note":"","completed":false},
      {"id":"prep-cloth-2","title":"訓覺衫褲","category":"服飾 / 穿搭","note":"2 日 1 套","completed":false},
      {"id":"prep-cloth-3","title":"女朋友安睡褲","category":"服飾 / 穿搭","note":"","completed":false},
      {"id":"prep-cloth-4","title":"Trousers","category":"服飾 / 穿搭","note":"2 日 1 條","completed":false},
      {"id":"prep-cloth-5","title":"Underwear / legging","category":"服飾 / 穿搭","note":"每日 1 件","completed":false},
      {"id":"prep-cloth-6","title":"襪","category":"服飾 / 穿搭","note":"每日 1 對","completed":false},
      {"id":"prep-cloth-7","title":"Clothes","category":"服飾 / 穿搭","note":"2 日 1 套","completed":false},
      {"id":"prep-cloth-8","title":"頸巾 / 耳套 / 手套 / 口罩 / 眼罩 / 頸枕","category":"服飾 / 穿搭","note":"","completed":false},
      {"id":"prep-cloth-9","title":"帽","category":"服飾 / 穿搭","note":"","completed":false},
      {"id":"prep-cloth-10","title":"泳褲","category":"服飾 / 穿搭","note":"","completed":false},
      {"id":"prep-cloth-11","title":"皮帶","category":"服飾 / 穿搭","note":"","completed":false},
      {"id":"prep-cloth-12","title":"拖鞋 / 鞋 / 室內拖","category":"服飾 / 穿搭","note":"","completed":false},

      {"id":"prep-care-1","title":"毛巾","category":"盥洗 / 個人護理","note":"","completed":false},
      {"id":"prep-care-2","title":"防曬乳液 / 凡士林 / 保濕乳液 / 潤唇膏","category":"盥洗 / 個人護理","note":"","completed":false},
      {"id":"prep-care-3","title":"Hair spray + 梳","category":"盥洗 / 個人護理","note":"","completed":false},
      {"id":"prep-care-4","title":"剪刀","category":"盥洗 / 個人護理","note":"","completed":false},
      {"id":"prep-care-5","title":"鬚刨 / 指甲鉗","category":"盥洗 / 個人護理","note":"","completed":false},
      {"id":"prep-care-6","title":"化妝 / 卸妝","category":"盥洗 / 個人護理","note":"","completed":false},
      {"id":"prep-care-7","title":"洗面 / 護膚 / 面膜 / 頭箍","category":"盥洗 / 個人護理","note":"","completed":false},
      {"id":"prep-care-8","title":"香水","category":"盥洗 / 個人護理","note":"","completed":false},
      {"id":"prep-care-9","title":"Portable stain wipe","category":"盥洗 / 個人護理","note":"","completed":false},
      {"id":"prep-care-10","title":"酒精巾","category":"盥洗 / 個人護理","note":"","completed":false},
      {"id":"prep-care-11","title":"膠布","category":"盥洗 / 個人護理","note":"","completed":false},

      {"id":"prep-med-1","title":"藥","category":"醫療 / 健康 / 私人物品","note":"","completed":false},
      {"id":"prep-med-2","title":"Supplements","category":"醫療 / 健康 / 私人物品","note":"","completed":false},
      {"id":"prep-med-3","title":"風扇 / 暖包","category":"醫療 / 健康 / 私人物品","note":"","completed":false},
      {"id":"prep-med-4","title":"Condom / KY","category":"醫療 / 健康 / 私人物品","note":"","completed":false},
      {"id":"prep-med-5","title":"糖","category":"醫療 / 健康 / 私人物品","note":"","completed":false},

      {"id":"prep-misc-1","title":"紙巾","category":"日用品 / 雜項","note":"每日 2 包","completed":false},
      {"id":"prep-misc-2","title":"垃圾袋","category":"日用品 / 雜項","note":"每 5 日 1 份","completed":false},
      {"id":"prep-misc-3","title":"環保袋","category":"日用品 / 雜項","note":"","completed":false},
      {"id":"prep-misc-4","title":"折疊傘","category":"日用品 / 雜項","note":"","completed":false},
      {"id":"prep-misc-5","title":"餐具","category":"日用品 / 雜項","note":"","completed":false},
      {"id":"prep-misc-6","title":"Board game","category":"日用品 / 雜項","note":"","completed":false}
    ],
    "reminders": [
      "Botox 後避免飲酒",
      "避免按摩注射部位",
      "避免大汗與劇烈活動",
      "保持舒適與清淡"
    ]
  },
  "shopping": {
    "items": [
      {"id":"shop-1","title":"保濕精華","category":"美妝 / 護膚","areaTag":"Olive Young","note":"比香港平先入手","completed":false},
      {"id":"shop-2","title":"韓系耳環","category":"服飾 / 配件","areaTag":"弘大","note":"找簡約銀色款","completed":false},
      {"id":"shop-3","title":"海苔脆片","category":"零食 / 食品","areaTag":"便利店","note":"","completed":false},
      {"id":"shop-4","title":"旅行收納袋","category":"生活雜貨","areaTag":"Daiso","note":"中小尺寸各一","completed":true},
      {"id":"shop-5","title":"Type-C 線","category":"電子 / 配件","areaTag":"聖水","note":"","completed":false},
      {"id":"shop-6","title":"杏仁果禮盒","category":"手信","areaTag":"明洞","note":"回程前一天再買","completed":false}
    ]
  }
};
