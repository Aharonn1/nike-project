// ======================================================
// קובץ AppConfig.ts המתוקן - גרסת CloudFront סופית
// ======================================================

const isProduction = true;

// 1. הכתובת המאובטחת דרך CloudFront
// שים לב: אין צורך ב-HTTP או בפורט 4050 כי ה-CloudFront מטפל בזה!
const PROD_URL = "https://www.shoes-shop-pro.com/api/";
const DEV_URL = `http://localhost:4050/api/`;

// 2. הכתובת הדינמית
const BASE_URL = isProduction ? PROD_URL : DEV_URL;

// 3. כתובת לקבצים סטטיים (תמונות)
// בייצור, אנחנו פונים לאותו דומיין מאובטח
const STATIC_URL_ROOT = isProduction
  ? "https://www.shoes-shop-pro.com/"
  : "http://localhost:4050/";

class Config {
  // נתיבי מידע ועדכונים
  updatePrice = BASE_URL + "mySales/";
  usersForAdmin = BASE_URL + "usersForAdmin/";
  updateSize = BASE_URL + "mySupply/";
  mySupplyUrl = BASE_URL + "mySupply/";
  shoesUrl = BASE_URL + "shoes/";
  graphsUrl = BASE_URL + "graphs/";
  creditCardFormUrl = BASE_URL + "creditCardForm/";
  commentsUrl = BASE_URL + "comments/";
  repeatOrders = BASE_URL + "repeatOrders/";
  ordersPerMonth = BASE_URL + "ordersPerMonth/";

  // נתיבי משתמשים ומוצרים
  shoesUsersUrl = BASE_URL + "shoesUsers/";
  shoesUsersUrl2 = BASE_URL + "shoesUsers2/";
  shoesUsersFavoriteUrl = BASE_URL + "shoesUsers/favorite/";
  favoriteUrl = BASE_URL + "favorite/";
  sizeUrl = BASE_URL + "shoesUsers/sizes";
  shoeSizeUrl = BASE_URL + "shoesUsers1/";
  favoriteUserUrl = BASE_URL + "myFavorites/";
  shoesUsersUrl1 = BASE_URL + "shoesUsers/";
  myAccount = BASE_URL + "myAccount/";
  usersUrl = BASE_URL + "users/";

  // הזמנות
  ordersUrl = BASE_URL + "orders/";
  orders3Url = BASE_URL + "orders3/";
  ordersUserUrl = BASE_URL + "ordersUsers/";
  ordersUserUrl3 = BASE_URL + "ordersUsers3/";

  // קטגוריות וסטטיסטיקה
  categoryshoesUrl = BASE_URL + "categoryshoes/";
  tableTeamWinsUrl = BASE_URL + "totalWins/";
  shoesByCategory = BASE_URL + "shoes-per-category/";

  // נתיבי אוטנטיקציה
  registerUrl = BASE_URL + "auth/register";
  loginUrl = BASE_URL + "auth/login";

  // נתיבים סטטיים / AI
  askProductUrl = BASE_URL + "ask-product";
  globalSearchUrl = BASE_URL + "search";

  // במקום מה שיש עכשיו, תנסה את הנתיב הישיר שהשרת מכיר:
  imagesUrl = BASE_URL + "images/";
  shoesImagesUsersUrl = BASE_URL + "shoesUsers/images/";

  adminAlertsUrl = BASE_URL + "admin/alerts";
  adminReturnsUrl = BASE_URL + "admin/returns";
  adminLaggingUrl = BASE_URL + "admin/lagging";
}

const appConfig = new Config();
export default appConfig;
