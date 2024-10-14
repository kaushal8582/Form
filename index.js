const countries = document.querySelector("#countries");
const states = document.querySelector("#states");
const cities = document.querySelector("#cities");
const submitBtn = document.querySelector(".btn-submit");

let auth_token = "";

const generateToken = async () => {
  try {
    const tokenData = await fetch(
      "https://www.universal-tutorial.com/api/getaccesstoken",
      {
        headers: {
          Accept: "application/json",
          "api-token": "itqbAyefHRWdIW_siyMVBKxGAMRpzffR13w7idsyv3a7DJ4jK2Jjv-rOt4c7GJcOJfI",
          "user-email": "kaushalkumar02918@gmail.com",
        },
        method: "GET",
      }
    );

    const authToken = await tokenData.json();
    auth_token = authToken.auth_token;
  } catch (error) {
    console.log(error);
  }
};

const getCountries = async () => {
  try {
    await generateToken();

    const country = await fetch(
      "https://www.universal-tutorial.com/api/countries",
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
          Accept: "application/json",
        },
        method: "GET",
      }
    );

    const data = await country.json();
    let clutter = '<option value="">Select Country</option>';
    data.forEach((item) => {
      clutter += `<option value="${item.country_name}">${item.country_name}</option>`;
    });
    countries.innerHTML = clutter;
  } catch (error) {
    console.log(error);
  }
};

getCountries();

const getStates = async (con) => {
  try {
    const contr = await fetch(
      `https://www.universal-tutorial.com/api/states/${con}`,
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
          Accept: "application/json",
        },
        method: "GET",
      }
    );

    const data = await contr.json();
    let clutter = '<option value="">Select State</option>';
    data.forEach((item) => {
      clutter += `<option value="${item.state_name}">${item.state_name}</option>`;
    });
    states.innerHTML = clutter;
  } catch (error) {
    console.log(error);
  }
};

const getCities = async (state) => {
  try {
    const contr = await fetch(
      `https://www.universal-tutorial.com/api/cities/${state}`,
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
          Accept: "application/json",
        },
        method: "GET",
      }
    );

    const data = await contr.json();
    let clutter = '<option value="">Select city</option>';
    data.forEach((item) => {
      clutter += `<option value="${item.city_name}">${item.city_name}</option>`;
    });
    cities.innerHTML = clutter;
  } catch (error) {
    console.log(error);
  }
};

countries.addEventListener("change", async (e) => {
  await getStates(e.target.value);
});

states.addEventListener("change", async (e) => {
  await getCities(e.target.value);
});

// Function to save form data to localStorage without overwriting previous entries
const saveDataToLocalStorage = () => {
  let existingData = JSON.parse(localStorage.getItem("formData")) || [];

  const formData = {
    name: document.querySelector("#name").value,
    mobile: document.querySelector("#mobile").value,
    area: document.querySelector("#area").value,
    village: document.querySelector("#village").value,
    panchayat: document.querySelector("#panchayat").value,
    block: document.querySelector("#block").value,
    district: document.querySelector("#district").value,
    location: document.querySelector("#location").value,
    country: document.querySelector("#countries").value,
    state: document.querySelector("#states").value,
    city: document.querySelector("#cities").value,
  };

  existingData.push(formData);

  localStorage.setItem("formData", JSON.stringify(existingData));

  alert("Form data saved successfully!");
};

// Event listener for the submit button
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  saveDataToLocalStorage();
});

// Capture and Auto-Fill Form with Current Location
document.querySelector('#getLocationBtn').addEventListener('click', function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        // Call reverse geocoding API to get address
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
        .then(response => response.json())
        .then(data => {
          const address = data.address;
          document.getElementById('area').value = address.suburb || '';
          document.getElementById('village').value = address.village || '';
          document.getElementById('panchayat').value = address.hamlet || '';
          document.getElementById('block').value = address.county || '';
          document.getElementById('district').value = address.state_district || address.city_district || '';
          document.getElementById('location').value = `${address.city || address.town || ''}, ${address.state || ''}`;
        })
        .catch(error => {
          console.log("Error fetching reverse geocoding data: ", error);
        });
      },
      function(error) {
        console.error("Error getting location:", error);
      }
    );
  } else {
    alert("Geolocation is not supported by your browser");
  }
});
