const { clickElement } = require("./commands.js");

module.exports = {
  getRandomChairSelector: function (rows, chairsInRow) {
    let row = Math.round(Math.random() * (rows - 1)) + 1;
    let chair = Math.round(Math.random() * (chairsInRow - 1)) + 1;
    return "div:nth-child(" + row + ") > span:nth-child(" + chair + ")";
  },
  
  confirmBooking: async function (page) { // подтверждение брони, возвращение селектора от QR-кода
    await clickElement(page, "button");
    await page.waitForSelector("h2");
    await clickElement(page, "button");
    await page.waitForSelector("img");
    const imgClassName = await page.$eval("img", (el) => el.className);
    return imgClassName;
  },

  getFreeRandomChair: async function (page, rows, chairsInRow) { // выбор свободного случайного кресла
    let i, attempts = rows * chairsInRow * 3; // попытки найти свободное кресло: берем кол-во мест в зале, умноженное на 3
    for (i = 0; i < attempts; i++) {
      let row = Math.round(Math.random() * (rows - 1)) + 1;
      let chair = Math.round(Math.random() * (chairsInRow - 1)) + 1;
      let chairSelector = "div:nth-child(" + row + ") > span:nth-child(" + chair + ")";
      let className = await page.$eval(chairSelector, (el) => el.classList[2]);
      if (
        className !== "buying-scheme__chair_selected" &&
        className !== "buying-scheme__chair_taken"
      ) {
        return chairSelector;
      }
    }
    //Если цикл закончился, а свободного кресла не нашлось, то кидаем исключение
    throw new Error(
      `Сделано ${attempts} попыток - не удалось найти свободное кресло!`
    );
  },

  gotoAfterTomorrowHallOne: async function (page) { // переход на послезавтра в Зал_1
    await page.waitForSelector("h1");
    let daysOfWeek = await page.$$("a.page-nav__day"); // выбрать дату - послезавтрашнее число
    await daysOfWeek[2].click();
    await clickElement(page, "section:nth-child(1) > div:nth-child(2) > ul > li"); // выбрать Зал1
    await page.waitForSelector("p.buying__info-hall");
  },
};
