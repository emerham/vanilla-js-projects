const API_KEY = ``;
const API_URL = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}`;

class App {
    constructor(props) {
        this.props = props;
        const citiesJson = localStorage.getItem('cities');
        let cities = [];
        if (citiesJson) {
            cities = JSON.parse(citiesJson);
        }
        this.cities = cities.map(c => new City(c.name, this));
        this.render();
    }

    addCity(c) {
        this.cities.push(c);
        this.render();
        this.saveIntoStorage();
    }

    removeCity(c) {
        const index = this.cities.findIndex(city => city.name === c.name);
        this.cities.splice(index, 1);

        // this.cities.filter(city => city.name !== c.name);
        this.saveIntoStorage();
        this.render();

    }

    saveIntoStorage() {
        localStorage.setItem('cities', JSON.stringify(this.cities));
    }

    render() {
        this.props.innerHTML = '';
        this.cities.forEach(city => city.render(this.props));
    }


}

class City {
    constructor(name, app) {
        this.name = name;
        this.app = app;
    }

    async getWeather() {
        const res = await fetch(`${API_URL}&q=${this.name}`)
            .then(response => response.json());

        return res.current.temp_c;
    }

    async render(ctr) {
        const temp = await this.getWeather();
        const cityEl = document.createElement('div');
        cityEl.className = 'd-flex flex-column align-items-center city-el';
        cityEl.innerHTML = `
        <span class="city-temp">${temp} &#8451;</span>
        <span class="city-name">${this.name}</span>
        <span class="city-close"><i class="fas fa-times"></i></span>
        `;
        ctr.appendChild(cityEl);
        const close = cityEl.querySelector('.city-close');
        close.addEventListener('click', () => {
            this.app.removeCity(this)
        });
    }

    toJSON() {
        return {name: this.name};
    }
}

const app = new App(document.querySelector('.weather-locations'));
const addCityModal = document.querySelector('#addCityModal');
const bsModal = new bootstrap.Modal(addCityModal, {
    keyboard: false,
});
const saveBtn = document.querySelector('#save-city');
const input = document.querySelector('#city-name');
saveBtn.addEventListener('click', () => {
    addCity();
});
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addCity();
    }
});
addCityModal.addEventListener('shown.bs.modal', () => {
    input.focus();
});

function addCity() {
    const city = new City(input.value, app);
    app.addCity(city);
    bsModal.hide();
    input.value = '';
}
