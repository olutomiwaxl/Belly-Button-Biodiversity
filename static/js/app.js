
function buildMetadata(sample) {
 
// Use d3 to select the panel with id of `#sample-metadata`
  var metadataSample = d3.select("#sample-metadata");
  
// Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(data =>{
    metadataSample.html('');
    console.log(Object.entries(data));
     // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key ,value]) =>{
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata. 
      metadataSample
      .append('p').text(`${key} : ${value}`)
      .append('hr')
    });
  })
}


function buildCharts(sample) {
   // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then( data =>{
     // @TODO: Build a Pie Chart
    let labels = data.otu_ids.slice(0,10);
    let values = data.sample_values.slice(0,10);
    let hover = data.otu_labels.slice(0,10);
    let trace = [{
      values : values,
      labels : labels,
      hovertext : hover,
      type : 'pie'
    }];
    let layout = {
      title : "Pie Chart"
    };

    var data1 = [trace];
    Plotly.newPlot('pie', data1, layout, {responsive:true});
   // @TODO: Build a Bubble Chart using the sample data
  let x_axis = data.otu_ids;
  let y_axis = data.sample_values;
  let markersize = data.sample_values;
  let markercolors = data.otu_ids;
  let textvalues = data.otu_labels

  let trace2 = [{
    x : x_axis,
    y : y_axis,
    mode : 'markers',
    type : 'scatter' 
  }]
  let layout2 = {
    title : " Scatter Plot ",
    xaxis : {
      title : 'OTU IDs',
    },
    yaxis : {
      title : 'Sample Values',
    }
  }
  var data2 = [trace2]
  Plotly.newPlot('bubble', data2, layout2, {responsive: true})
  });   
  console.log(values)
}

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
