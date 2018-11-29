function buildMetadata(sample) {
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(response) {
    // clearing any existing metadata
    d3.select("#sample-metadata").html("");
    Object.entries(response).forEach(([key, value]) => {
      d3.select("#sample-metadata").append("p").text(`${key}: ${value}`);
    });
    // console.log(response.size);
    // for (var i = 0; i < response.size; i++) {
      // d3.select("#sample-metadata").append("p").text("hi"); 
      // d3.select("#sample-metadata").append("p").text(Object.entries(response)[i]); 
    // }
  });
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

}; 

function buildCharts(sample) {
  var url = `/samples/${sample}`;
  d3.json(url).then(function(response) {
    var otu_ids = response["otu_ids"]; 
    var sample_otu_ids = otu_ids.slice(0, 10);
    var values = response["sample_values"];
    var sample_values = values.slice(0, 10);
    var text = response["otu_labels"]; 
    // var sample_text = text.slice(0, 10); 
    // console.log(otu_ids);

    var trace1 = {
      labels: otu_ids,
      values: sample_values, 
      hovertext: text,
      type: 'pie'
    }; 
    var data1 = [trace1];
    var layout1 = {
      title: "Belly Button Diversity Pie Chart"
    };

    var trace2 = {
      x: otu_ids, 
      y: values, 
      mode: 'markers',
      marker: {
        size: values, 
        color: otu_ids, 
      },
      text: text, 
      type: 'scatter'
    };
    var data2 = [trace2];
    var layout2 = {
      title: 'Belly Button Diversity Bubble Chart',
      showlegend: false,
      height: 750,
      width: 750
    };

    Plotly.newPlot("pie", data1, layout1);
    Plotly.newPlot("bubble", data2, layout2);
  });
}; 

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
