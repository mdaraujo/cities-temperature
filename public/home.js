const columnsName = ["name", "temp", "sunrise", "sunset"];
let sortCol = "temp";
let ascending = true;

let citiesNames = new Set(["Porto", "Aveiro", "Lisbon"]);
let citiesData = [];

let barChartData = {
    labels: [],
    datasets: [
        {
            label: "Temperature ℃",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderColor: "rgb(255, 99, 132)",
            borderWidth: 1,
            data: [],
        },
    ],
};

function loadData() {
    // Reset
    const table = $("#tableBody")[0];
    table.innerHTML = "";

    barChartData.labels.length = 0;
    barChartData.datasets[0].data.length = 0;

    // Sort
    citiesData.sort((a, b) =>
        a[sortCol] > b[sortCol] ? 1 : -1
    );

    if (!ascending) citiesData.reverse();

    // Load
    citiesData.forEach((city, index) => {
        barChartData.labels.push(city.name);
        barChartData.datasets[0].data.push(city.temp);

        let row = table.insertRow();

        columnsName.forEach((column, columnIndex) => {
            let cell = row.insertCell(columnIndex);
            cell.innerHTML = city[column];
        });
    });

    window.myBar.update();
}

function requestData() {
    $("#alert").hide();

    axios
        .get("/cities/" + Array.from(citiesNames).join())
        .then(function (response) {
            citiesData.length = 0;
            citiesNames = new Set();
            for (const city of response.data) {
                if (city.valid) {
                    citiesData.push(city);
                    citiesNames.add(city.name);
                } else {
                    $("#alert").html(
                        "City name <b>" + city.name + "</b> is not valid."
                    );
                    $("#alert").show();
                }
            }
            loadData();
        })
        .catch(function (error) {
            console.log(error);
        });
}

$(function () {
    // Create Bar Chart
    const canvas = $("#barChart")[0];
    canvas.width = $(window).width();
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    window.myBar = new Chart(ctx, {
        type: "bar",
        data: barChartData,
        options: {
            responsive: true,
            legend: {
                position: "top",
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            suggestedMin: 0,
                        },
                    },
                ],
            },
        },
    });

    // Add click event on table headers to sort
    const table = $("#citiesTable")[0];
    const headers = table.querySelectorAll("th");

    [].forEach.call(headers, function (header, index) {
        header.addEventListener("click", function () {
            sortCol = columnsName[index];
            ascending = !ascending;
            loadData();
        });
    });

    // Add click event to addCityBtn
    $("#addCityBtn").on("click", function () {
        const newCity = $("#newCity").val();
        citiesNames.add(newCity);
        requestData();
    });

    // Request initial data
    requestData();
});