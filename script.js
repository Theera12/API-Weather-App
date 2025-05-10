const form = document.getElementById("myForm");
const frontLayout= document.getElementById("frontLayout");
const result= document.getElementById("result");

const now = new Date();
const time = now.toLocaleTimeString();
document.getElementById("time").innerText=time;


//event listioner to accept form value on button clicks
form.addEventListener("submit", async(event) => {
  
  event.preventDefault();//To prevent default reloading of form by the browser
 
  //displays the front layout before submitting the form data 
  frontLayout.style.display="none";
  setTimeout(function(){
    result.style.display="flex";
  },900);
  
  //functon to get weather data from api
  await getWeather();
  
myTextInput.value="";//empties the form value and redy to accept new data
});

//function to get location
async function getLocation(){
 
  const location = myTextInput.value;
  //url from meteo weather api to get the latitude and longitude of the entered location
  const url =
    "https://geocoding-api.open-meteo.com/v1/search?name=" +
    location +
    "&count=10&language=en&format=json";
    console.log(url);
    
    try{
     const response = await fetch(url);
      const data = await response.json();
      const result =data.results[0];
      return {
        name:result.name,
        lat: result.latitude,
        long: result.longitude
      }
   } 
    
   catch(error){
     alert("Location not found");
    
    }  
      } 

// Function to get weather data
 async function getWeather () {
  
  try{
  const{lat,long,name} = await getLocation();
  console.log(lat,long,name) ;
  //url from weather api to get weather data  
  const url1 =
        "https://api.open-meteo.com/v1/forecast?latitude=" +
        lat +
        "&longitude=" +
        long +
        "&current=temperature_2m,wind_speed_10m,is_day,relative_humidity_2m,weather_code&hourly=temperature_2m,is_day,weather_code&forecast_days=1&timezone=auto";
    console.log(url1);
        fetch(url1)
    .then((respose) => respose.json())
    .then((data) => {
      //displays the current weather data
      const currentTemp = data.current.temperature_2m;
      const hum = data.current.relative_humidity_2m;
      const windSpeed = data.current.wind_speed_10m;
      var code = data.current.weather_code;
      var dayOrNight = data.current.is_day;
      document.getElementById("city").innerText = name;
      document.getElementById("temp").innerText = currentTemp + "\u00B0C";
      document.getElementById("humidity").innerText = hum + "%";
      document.getElementById("latt").innerText =
        "Latt:" + Math.floor(lat) + "\u00B0";
      document.getElementById("longg").innerText =
        "Long:" + Math.floor(long) + "\u00B0";
      document.getElementById("wind").innerText = windSpeed + "kmph";

      setWeatherIcon(code, dayOrNight);//function to set weather icon
      
      //displays the hourly weather report
      document.getElementById("hourlyReport").innerHTML='';//clears previous div
      for(var i =0; i<24 ;i++){
        var date =[]; var apiTime=[];var formattedDate =[];
         apiTime = data.hourly.time[i];
         date = new Date(apiTime);
        //To convert apitime format to general time format
         formattedDate[i] = new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          hour12: true // Use 24-hour format
        }).format(date);
        
        const hourlyDiv = document.getElementById("hourlyReport");
        const box = document.createElement("div");
        box.id ="hourlyReportBox";
        
        //displays hourly time in each div created
        const hourlyTime = document.createElement("p");
        hourlyTime.textContent = formattedDate[i];
        box.appendChild(hourlyTime);

    
        //displays an appropriate icon
        const hourlyIsDay =data.hourly.is_day[i];
        const hourlyCode =data.hourly.weather_code[i];
        const hourlyIcon =document.createElement("i");
        hourlyIcon.id="hourlySymbol";
       
        //source of hourlyCodes  is from meteo api
        if(hourlyCode ==0||hourlyCode ==1 ){
          hourlyIsDay ==1?hourlyIcon.classList.add("fa-solid","fa-sun"):   hourlyIcon.classList.add("fa-solid","fa-moon");
        }else if( hourlyCode == 2||hourlyCode ==3){
          hourlyIcon.classList.add("fa-solid","fa-cloud");
        }else if( hourlyCode ==51||hourlyCode ==53||hourlyCode ==55||hourlyCode ==56||hourlyCode ==57||hourlyCode ==61||hourlyCode ==63||hourlyCode ==65||hourlyCode ==66||hourlyCode ==67||hourlyCode ==81||hourlyCode ==82||hourlyCode==80){
          hourlyIcon.classList.add("fa-solid","fa-cloud-rain");
        }else if( hourlyCode == 71||hourlyCode ==73||hourlyCode ==75||hourlyCode ==77||hourlyCode ==85||hourlyCode ==86){
          hourlyIcon.classList.add("fa-solid","fa-snow");
        }else if( hourlyCode== 45||hourlyCode ==48){
          hourlyIcon.classList.add("fa-solid","fa-smog");
        }else if(hourlyCode == 95||hourlyCode ==96||hourlyCode ==99){
          hourlyIcon.classList.add("fa-solid","fa-bolt");
        }else{
          hourlyIcon.classList.add("fa-solid","fa-question-circle");
        }
        box.appendChild(hourlyIcon);

        
        //displays hourly temperature in each div created
        const hourlyTemp = document.createElement("p");
        hourlyTemp.textContent = data.hourly.temperature_2m[i] + "\u00B0C";
        box.appendChild(hourlyTemp);
        
        
        hourlyDiv.appendChild(box);
        
        console.log(hourlyCode);
        console.log(formattedDate[i]);
        console.log(data.hourly.temperature_2m[i]);
        console.log(data.hourly.is_day[i]);
      
    }
    
    
      console.log(data.current.weather_code);
      console.log(data.current.is_day);
      console.log(data.hourly.time[0]);
      console.log(data.hourly.temperature_2m[0]);
      
    });
  }catch{
    console.log("Oops!Error Fetching Data!! Try again later.."); 
  }
     
 }

//Function to set the weather icon
function setWeatherIcon(code, dayOrNight) {
  const iconElement = document.getElementById("iconUpdate");
  const weatherDescription = document.getElementById("skyCondition");
  iconElement.innerHTML = ""; // Clear previous icon

  // Determine the appropriate icon based on weather code and isday data
  //source of code  is from meteo api
  switch (code) {
    case 0: //clear
    case 1: // Mainly clear sky
      weatherDescription.innerText = "clear";
      iconElement.innerHTML = dayOrNight
        ? '<img width="100" height="100" src="https://img.icons8.com/keek/100/summer.png" alt="summer"/>'
        : '<img width="100" height="100" src="https://img.icons8.com/keek/100/bright-moon.png" alt="bright-moon"/>'   
      break;
    case 2: // partly clouds
    case 3: // overcast
      weatherDescription.innerText = "cloudy";
      iconElement.innerHTML = dayOrNight
        ? '<img width="100" height="100" src="https://img.icons8.com/external-justicon-flat-justicon/64/external-cloud-weather-justicon-flat-justicon.png" alt="external-cloud-weather-justicon-flat-justicon"/>'
        :'<img width="100" height="100" src="https://img.icons8.com/keek/100/cloud.png" alt="cloud"/>'
      break;
    case 51: // Light drizzle
    case 53: // Moderate dizzle
    case 55: // Heavy drizzle
    case 56: // light freezing drizzle
    case 57: // dense freezing drizzle
    case 61://slight rain
    case 63: // moderate rain
    case 65: // heavy rain
    case 66: // light freezing rain
    case 67: // Heavy freezing rain
    case 80://rain shower slight
    case 81://rain shower heavy
    case 82://rain shower violent
      weatherDescription.innerText = "rain";
      iconElement.innerHTML = dayOrNight
        ? '<img width="100" height="100" src="https://img.icons8.com/fluency/48/partly-cloudy-rain.png" alt="partly-cloudy-rain"/>'
        : '<img width="100" height="100" src="https://img.icons8.com/fluency/48/moderate-rain.png" alt="moderate-rain"/>'
      break;
    case 71: // slight snow fall
    case 73: // moderate snow fall
    case 75: // Heavy snow fall
    case 77://snow grains
    case 85://slight snow shower
    case 86://heavy snow shower
      weatherDescription.innerText = "Snow";
      iconElement.innerHTML = dayOrNight
        ? '<img width="100" height="100" src="https://img.icons8.com/keek/100/winter.png" alt="winter"/>'
        :'<img width="100" height="100" src="https://img.icons8.com/keek/100/snow.png" alt="snow"/>'
      break;
    case 45: // fog
    case 48: // rim fog
      weatherDescription.innerText = "Fog";
      iconElement.innerHTML = dayOrNight
        ?'<img width="100" height="100" src="https://img.icons8.com/fluency/48/fog-day.png" alt="fog-day"/>'
        : '<img width="100" height="100" src="https://img.icons8.com/color-glass/48/foggy-night-1.png" alt="foggy-night-1"/>'
      break;
    case 95: // Thunderstorm
    case 96: // Thunderstorm with light hail
    case 99: // Thunderstorm with heavy hail
      weatherDescription.innerText = "Thunderstorm";
      iconElement.innerHTML = dayOrNight
        ? '<img width="48" height="48" src="https://img.icons8.com/fluency/48/storm.png" alt="storm"/>'
        : '<img width="48" height="48" src="https://img.icons8.com/fluency/48/storm.png" alt="storm"/>'
      break;
    default:
      iconElement.innerHTML =
      '<img width="100" height="100" src="https://img.icons8.com/keek/100/question-mark.png" alt="question-mark"/>'
      weatherDescription.innerText = "unpredictable";
  }
}

