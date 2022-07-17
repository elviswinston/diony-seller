paypal.use(["login"], function (login) {
  login.render({
    appid:
      "AbBtPsXwZ03V1Bb6sH1X5E01jIuTW5Nj4p9KIGTFHtovDYLUWlZBGBh38Ek7-56lp9UeyIBAlZU4Km5W",
    authend: "sandbox",
    scopes: "openid email https://uri.paypal.com/services/paypalattributes",
    containerid: "lippButton",
    responseType: "code",
    locale: "vi-vn",
    buttonType: "LWP",
    buttonShape: "pill",
    buttonSize: "lg",
    fullPage: "true",
    returnurl: "https://google.com",
  });
});
