//extract the json data from the json file samples
d3.json("../../samples.json").then((data) => {
    console.log(data);
    var wfreq= data.metadata.map(data => data.wfreq);
    console.log(`The washing frequency is ${wfreq}.`);
    var samples = data.samples.filter(samples => samples.id.toString() === id)[0];
    console.log(samples);
    //slice for top 10
    var sample_values = samples.sample_values.slice(0, 10).reverse();
    var top_otu_ids = samples.otu_ids.slice(0, 10).reverse();
    var otu_id = top_otu_ids.map(data => "otu " + data);
    console.log(`The otu ids are ${otu_id}.`);
    var labels = samples.otu_labels.slice(0, 10);
    console.log(`Sample values are ${sample_values}.`);
    console.log(`ID Values are ${top_otu_ids}.`);

    //trace and layout for graphing bar
    var trace = {
        x: sample_values,
        y: otu_id,
        text: labels,
        marker: {
            color: "blue"},
            type: "bar",
            orientation: "h"
    };

    var data = [trace];
    var layout = {
        title: "OTU"
    };

    Plotly.newPlot("bar", data, layout);

    //trace and layout for bubble chart
    var trace2 = {
        x: samples.otu_ids,
        y: samples.sample_values,
        mode: "markers",
        marker: {
            size: samples.sample_values,
            color: samples.otu_ids
        },
        type: "bubble",
        text: samples.otu_labels
    };

    var bubbleLayout = {
        xaxis: {title: "otu_id"},
        height: 500,
        width: 1000
    };
    var data2 = [trace2];

    Plotly.newPlot("bubble", data2, bubbleLayout);

    //gauge chart https://plotly.com/javascript/gauge-charts/ *Source*
});

//metadata grabbing
function getData(id) {
    d3.json("../../samples.json").then((data) => {
        var metadata = data.metadata;
        console.log(metadata);
        var got = metadata.filter(metadata => metadata.id.toString() === id)[0];
        var demographic = d3.select("#sample-metadata");
        demographic.html("");
        Object.entires(got).forEach((key) => {
            demographic.append("h5").text(key[0] + ":" + key[1] + "\n");
        });
    });
};

//needs to be called optionChanged to match index file
function optionChanged(id) {
    getData(id);
    getPlot(id);
};

//load a default
function init() {
    var dropdown = d3.select("#selDataset");
    d3.json("../../samples.json").then((data) => {
        console.log(data);
        data.names.forEach(function (name) {
            dropdown.append("option").text(name).property("value");
        });
        getData(data.names[0]);
        getPlot(data.names[0]);
    });
};

init();

