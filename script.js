async function searchCountry(countryName) {
    const spinner = document.getElementById("loading-spinner");
    const borderSection = document.getElementById("bordering-countries");
    const errorMessage = document.getElementById("error-message");

    try {
        // Show loading spinner
        spinner.classList.remove("hidden");
        errorMessage.textContent = "";
        document.getElementById("country-info").innerHTML = "";
        borderSection.innerHTML = "";

        //Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok){
            throw new Error("Country not found");
        }
        const data = await response.json();
        const country = data[0];

        //Update DOM
        document.getElementById('country-info').innerHTML = `
        <h2>${country.name.common}</h2>
        <p><strong>Capital:</strong> ${country.capital[0]}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <img src="${country.flags.svg}" alt="${country.name.common} flag">
    `;

    //Fetch bordering countries
        if (!country.borders) {
            borderSection.innerHTML = "<p>No bordering countries</p>";
        } else {
            for (let code of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                borderSection.innerHTML += `
                        <p>${borderCountry.name.common}</p>
                        <img src="${borderCountry.flags.svg}" width="80">
                `;
            }
        }

        
    } catch (error) {
        // Show error message
        errorMessage.textContent = error.message;
    } finally {
        // Hide loading spinner
        spinner.classList.add("hidden");
    }
}

document.getElementById("search-btn").addEventListener("click", () => {
    const country = document.getElementById("country-input").value;
    searchCountry(country);
});