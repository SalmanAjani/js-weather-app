const wrapper = document.querySelector(".wrapper"),
  inputPart = wrapper.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  weatherPart = wrapper.querySelector(".weather-part"),
  wIcon = weatherPart.querySelector("img"),
  arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", (e) => {
  // if user pressed enter button and input field is not empty
  if (e.key === "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click", () => {
  // geolocation api used to get geographical position
  if (navigator.geolocation) {
    //if browser supports geolocation api
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser does not support geolocation");
  }
});

const onSuccess = (position) => {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=409665676f8840c3644f7e5a82323c8f
`;
  fetchData();
};

const onError = (error) => {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
};

const requestApi = (city) => {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=409665676f8840c3644f7e5a82323c8f
`;
  fetchData();
};

const fetchData = () => {
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");

  fetch(api)
    .then((res) => res.json())
    .then((res) => weatherDetails(res));
};

const weatherDetails = (info) => {
  if (info.cod == "404") {
    infoTxt.classList.replace("pending", "error");
    infoTxt.innerText = `${inputField.value} is not a valid city name`;
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    console.log(id);

    if (id == 800) {
      wIcon.src = "img/sunny.png";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "img/snow.png";
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "img/cloud.png";
    } else if (id >= 500 && id <= 531) {
      wIcon.src = "img/rain.png";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "img/haze.png";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "img/storm.png";
    }

    wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
    wrapper.querySelector(".weather").innerText =
      description.charAt(0).toUpperCase() + description.slice(1);
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
    wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

    infoTxt.classList.remove("pending", "error");
    infoTxt.innerText = "";
    inputField.value = "";
    wrapper.classList.add("active");
  }
};

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
