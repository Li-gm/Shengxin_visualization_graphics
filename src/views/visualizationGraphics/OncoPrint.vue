<template>
  <div>
    <div id="oncoprint"></div>
  </div>
</template>

<script>
  const d3 = require("d3");
  const $ = require('jquery');
  let data = require('../../assets/Json/oncoPrintData.json');
  export default {
    name: "OncoPrint",
    data(){
      return{
        barColor:{
          "<=10": "#0000FF",
          "<=50": "#FFFF00",
          ">10": "#FF0000",
          ">50": "#00F5FF",
          ">60": "#FF0000",
          "Adverse": "#FF00FF",
          Favorable: "#FF0000",
          Female: "#0000FF",
          Intermediate: "#0000FF",
          M0: "#FF0000",
          M1: "#0000FF",
          M2: "#FF00FF",
          M3: "#458B00",
          M4: "#8B3A62",
          M5: "#DDA0DD",
          M6: "#EEB422",
          M7: "#FF7256",
          Male: "#FF0000",
          No_alterations: "#696969",
          inframe_mutation: "#FFB90F",
          missense_mutation: "#458B00",
          truncating_mutation: "#FF0000",
          undefined: "#696969"
        },
        reverseTitleKeyLabel:{
          "BM Blast Percentage": "bmBlastPer",
          "CEBIA Mutation": "CEBIA",
          "CEBPA Mutation": "CEBPA",
          "Chloroma": "chloroma",
          "DNMT3A Mutation": "DNMT3A",
          "Diagnosis Age": "age",
          "EVI1 Expression": "EVI1-Expression",
          "FAB": "fab",
          "FLT3-ITD Mutation": "FLT3-ITD",
          "FLT3-TKD Mutation": "FLT3-TKD",
          "IDH1 Mutation": "IDH1",
          "IDH2 Mutation": "IDH2",
          "KRAS Mutation": "KRAS",
          "NPM1 Mutation": "NPM1",
          "NRAS Mutation": "NRAS",
          "PB Blast Percentage": "pbBlastPer",
          "Risk Group": "risk",
          "Sex": "sex",
          "White Blood Cell": "wbc"
        },
        subtitleKeyLable:{
          "BM Blast Percentage": "bmBlastPer",
          "CEBIA Mutation": "CEBIA",
          "CEBPA Mutation": "CEBPA",
          "Chloroma": "chloroma",
          "DNMT3A Mutation": "DNMT3A",
          "Diagnosis Age": "age",
          "EVI1 Expression": "EVI1-Expression",
          "FAB": "fab",
          "FLT3-ITD Mutation": "FLT3-ITD",
          "FLT3-TKD Mutation": "FLT3-TKD",
          "IDH1 Mutation": "IDH1",
          "IDH2 Mutation": "IDH2",
          "KRAS Mutation": "KRAS",
          "NPM1 Mutation": "NPM1",
          "NRAS Mutation": "NRAS",
          "PB Blast Percentage": "pbBlastPer",
          "Risk Group": "risk",
          "Sex": "sex",
          "White Blood Cell": "wbc"
        },
        numberSelect:{},
      }
    },
    mounted(){
      this.initData()
    },
    methods:{
      initData(){
        this.initOncoprint(data.data,300)
      },
      initOncoprint(arr,heightNum){
        let that = this;
        // set the dimensions and margins of the graph
        var origmargin = {top: 10, right: 10, bottom: 0, left: 0},
          width = 1400,
          height = heightNum - origmargin.top - origmargin.bottom;
        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 0, bottom: 0, left: 140},
          newwidth = width - margin.left - margin.right,
          newheight = height - margin.top - margin.bottom;
        var translateLeft = {left: 0}
        // append the svg object to the body of the page
        var svg = d3.select("#oncoprint")
          .append("svg")
          .attr("width", '100%')
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform",
            "translate(" + translateLeft.left + "," + margin.top + ")");

        //Read the data
        {
          var data = arr;
          //variable展示的位置
          var g = svg.append("g")
            .attr("class", "outer-holder")
            .attr("transform", "translate(" + 150 + "," + (margin.top) + ")");//标题的偏移量

          // get unique values of models and genes
          var myGroups = d3.map(data, function(d){return d.group;}).keys()
          var myVars = d3.map(data, function(d){return d.variable;}).keys()

          // use a fixed bar height until the box is full, then compress it
          newheight = Math.min(newheight, 31 * myVars.length);
          var plotArea = g.append("g")
            .attr("clip-path", "url(#oncoprintAreaClip)");

          // update: set width and height of clippath rect
          plotArea.append("clipPath")
            .attr("id", "oncoprintAreaClip")
            .append("rect")
            .attr('width', newwidth)
            .attr('height', newheight);
          // Build X scales and axis:
          var x = d3.scaleLinear()
            .range([ 0, newwidth ])
            .domain([0, myGroups.length]);

          // Build Y scales and axis:
          var y = d3.scaleBand()
            .range([ newheight, 0 ])
            .domain(myVars)
            .padding(0.05);
          g.append("g")
            .attr("class", "y1-axis")
            .style("font-size", "1em")
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove();

          // create a context menu for the gene right-click
          d3.select("body").selectAll(".genecontext-menu").remove();
          var genemenu = d3.select("body")
            .append("div")
            .style("opacity", 0)
            .attr("class", "genecontext-menu")
            .attr("data-toggle", "modal")
            .attr("data-target", "#lollipopmodal")
            .style("background-color", "rgb(51, 51, 51, 0.9)")
            .style("color", "#FFF")
            .style("padding", "5px")
            .style("position", "absolute")
            .style("z-index", "-1");

          // show the gene context menu on right-click and feed it data
          var showgenecontext = function(d) {
            genemenu
              .html("Lollipop plot for "+ d)
              .style("opacity", 1)
              .style("z-index", "10000")
              .style("left", (d3.event.pageX + 15) + "px")
              .style("top", (d3.event.pageY - 15) + "px")
            //    .on("click", function (i) {
            //      Shiny.setInputValue("mutation-lolliplot_gene", d, {priority: "event"});
            //    })
          }

          // this selection group contains model names selected by brushing
          var selgrp = [];
          // create a context menu for the brush right-click
          d3.select("body").selectAll(".brushcontext-menu").remove();
          var brushmenu = d3.select("body")
            .append("div")
            .style("opacity", 0)
            .attr("class", "brushcontext-menu")
            .style("background-color", "rgb(51, 51, 51, 0.9)")
            .style("color", "#FFF")
            //  .style("padding", "5px")
            .style("position", "absolute")
            .style("z-index", "-1");
          // the ul container
          var brushbuttons = brushmenu.append("ul")
            .style("list-style", "none")
            .style("margin-bottom", "0px")
            .style("padding", "0px")
          var brushlist = brushbuttons.selectAll("li")
            .data(["Add selection to cart", "Replace cart with selection"])

          brushlist.exit().remove()

          brushlist.enter().append("li")
            .html(function(d) {return d;})
            .style("padding", "3px 5px")
            .attr("class", function(d, i) { return "brushitem"+i })

          // show the brush context menu on right-click
          var showbrushcontext = function(d) {
            // turn off any prior click events
            $(".brushitem0").off("click");
            $(".brushitem1").off("click");
            // un-hide the brush menu
            brushmenu
              .style("opacity", 1)
              .style("z-index", "10000")
              .style("left", (d3.event.pageX + 15) + "px")
              .style("top", (d3.event.pageY - 15) + "px");
            //    // set the click event using jQuery
            //    $(".brushitem1").click(function() {
            //      Shiny.setInputValue("mutation-oncoprintselectionreplace", selgrp, {priority: "event"})
            //    });
            //    $(".brushitem0").click(function() {
            //      Shiny.setInputValue("mutation-oncoprintselectionadd", selgrp, {priority: "event"})
            //    });
          }

          // Add links to the gene/y-axis
          g.selectAll(".y1-axis").selectAll('.tick')
            .data(myVars)
            .attr("gene", function(d) { return d })
            //  .on('click', function (d) {
            //    zoom.transform(oncoprint, d3.zoomIdentity);
            //    Shiny.setInputValue("mutation-gene_priority", d, {priority: "event"});
            //  })
            .on("contextmenu", function (d, i) {
              d3.event.preventDefault()
              showgenecontext(d)
            })
            .exit();

          // remove all tooltips
          d3.select("body").selectAll(".oncoprinttooltip").remove();
          // create a tooltip
          var tooltip = d3.select("body")
            .append("div")
            .style("opacity", 0)
            .attr("class", "oncoprinttooltip")
            .style("background-color", "rgb(51, 51, 51, 0.9)")
            .style("color", "#FFF")
            .style("padding", "5px")
            .style("position", "absolute");


          // Three functions that change the tooltip when user hover / move / leave a cell
          var mouseover = function(d) {
            tooltip
              .style("opacity", 1)
              .style("z-index", 1000)
            d3.select(this)
              .style("stroke", "black")
              .style("opacity", 1)
          }
          var mousemove = function(d) {
            let nameInfo = '';
            if(d.mutation === 'mutation'){
              nameInfo = 'Mutation'
            }else {
              nameInfo = d.variable
            }
            let labelInfo = '';
            if(that.subtitleKeyLable[d.value] !== undefined){
              labelInfo = that.subtitleKeyLable[d.value]
            }else {
              labelInfo = d.value
            }
            tooltip
              .html(`
              <table>
                <tr><td style='text-align: right'>Sample :  </td><td>${d.group}</td></tr>
                <tr><td>${nameInfo} :  </td>
                <td>${labelInfo}</td>
                </tr>
              </table>
              `)
              .style("left", (d3.event.pageX + 15) + "px")
              .style("top", (d3.event.pageY - 15) + "px")
          }
          var mouseleave = function(d) {
            tooltip
              .style("opacity", 0)
              .style("z-index", -1)
            d3.select(this)
              .style("stroke", "none")
              .style("opacity", 0.8)
          }

          // brush region under oncoprint, extends top and bottom for area to grab
          var brush = d3.brushX()
            .extent([[-10, -20], [newwidth+10, newheight+20]])
            .on("start", brushstart)
            .on("brush", brushing)
            .on("end", brushend);

          var brushgroup = g.append("g")
            .attr("class", "brushed")
            .on("contextmenu", function (d) {
              d3.event.preventDefault()
              showbrushcontext()
            })
            .call(brush);

          // zoom region exactly matches the oncoprint area
          var zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [newwidth, newheight]])
            .extent([[0, 0], [newwidth, newheight]])
            .on("zoom", zooming)
          //    .on("end", zoomend);


          // record the alterations per gene as we draw the rectangles
          var altcount = {};
          myVars.forEach(function(d) {
            altcount = {...altcount, [d]:{Amp:0,Gain:0,HetLoss:0,HomDel:0,Fusion:0,Mutation:0}};
          });

          // record the samples with alterations per gene as we draw the rectangles
          var samplecount = {};
          myVars.forEach(function(d) {
            samplecount = {...samplecount, [d]:[]};
          });


          var oncoprint = g.append("g")
            .attr("class", "oncoprint")
            .call(zoom);
          //  .on("dblclick.zoom", null)
          //  .call(brush);


          // add the primary squares
          var alterationrect = oncoprint.selectAll()
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "cna")
            .attr("x", function(d) { return x(myGroups.indexOf(d.group)); })
            .attr("y", function(d) { return y(d.variable) })
            .attr("width", function(d) { return (x(myGroups.indexOf(d.group)+0.9) - x(myGroups.indexOf(d.group))); })
            .attr("height", y.bandwidth() )
            .style("fill", function(d) {
              if(d.value in that.barColor){
                return that.barColor[d.value];
              }else if(d.mutation === "heatmap"){
                if (Number(d.value)) {
                  let offsetNum = (Number(d.value) - d.min) / d.max;
                  return d3.interpolateYlGn(offsetNum)
                }else {
                  return "#878787"
                }
              }else if(that.reverseTitleKeyLabel[d.variable] in that.numberSelect){
                for(let i = 0;i<that.numberSelect[that.reverseTitleKeyLabel[d.variable]].length;i++){
                  let varInfo = that.numberSelect[that.reverseTitleKeyLabel[d.variable]][i];
                  if(varInfo.mark === '<='){
                    if (Number(d.value) <= Number(varInfo.num)) {return that.barColor["<=" + Number(varInfo.num)]}
                  }else if(varInfo.mark === '='){
                    if (Number(d.value) === Number(varInfo.num)) {return that.barColor["=" + Number(varInfo.num)]}
                  }else if(varInfo.mark === '>='){
                    if (Number(d.value) >= Number(varInfo.num)) {return that.barColor[">=" + Number(varInfo.num)]}
                  }else {
                    return "#878787"
                  }
                }
              }else if(that.reverseTitleKeyLabel[d.variable] in that.numberDefine){
                for(let i = 0;i<that.numberDefine[that.reverseTitleKeyLabel[d.variable]].length;i++){
                  let varInfo = that.numberDefine[that.reverseTitleKeyLabel[d.variable]][i];
                  if(varInfo.mark === '<='){
                    if (Number(d.value) <= Number(varInfo.num)) {return that.barColor["<=" + Number(varInfo.num)]}
                  }else if(varInfo.mark === '>'){
                    if (Number(d.value) > Number(varInfo.num)) {return that.barColor[">" + Number(varInfo.num)]}
                  }
                }
              }else {
                return "#878787"
              }
            })
            .style("stroke-width", 2)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .exit()

          // add the mutation squares

          // this brush fn before any zooming
          function brushing() {
            selgrp = [];
            if (d3.event.sourceEvent.type === "brush") return;
            var selection = d3.event.selection;
            if (selection == null) {
              selgrp = [];
            } else {
              var x0 = Math.round(x.invert(selection[0])),
                x1 = Math.round(x.invert(selection[1]));
              // snap to boundaries
              d3.select(this).call(d3.event.target.move, [x(x0), x(x1+0.9)]);
              myGroups.forEach(function (d, i) {
                if (x0 <= i && i <= x1)
                  selgrp.push(d);
              });
            }
          }

          // clear the selectd models before the next selection
          function brushstart() {
            selgrp = [];
          }


          function zooming() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            var rescaleX = d3.event.transform.rescaleX(x);

            // confine the brush selection on zoom
            brush = d3.brushX()
              .extent([[-10, -20], [newwidth+10, newheight+20]])
              .on("start", brushstart)
              .on("brush", brushing)
              .on("end", brushend);
            brushgroup.call(brush);
            // this brush fn is used after zooming
            function brushing() {
              selgrp = [];
              if (d3.event.sourceEvent.type === "brush") return;
              var selection = d3.event.selection;
              if (selection == null) {
                selgrp = [];
              } else {
                var x0 = Math.round(rescaleX.invert(selection[0])),
                  x1 = Math.round(rescaleX.invert(selection[1]));
                // snap to boundaries
                d3.select(this).call(d3.event.target.move, [rescaleX(x0), rescaleX(x1+0.9)]);
                myGroups.forEach(function (d, i) {
                  if (x0 <= i && i <= x1)
                    selgrp.push(d);
                });
              }
            }

            // maintain brush position on zoom
            g.select(".brushed").call(brush.move, function(d) {
              if(selgrp.length) {
                var selection = d3.event.selection;
                var x0 = rescaleX(myGroups.indexOf(selgrp[0])),
                  x1 = rescaleX(myGroups.indexOf(selgrp[selgrp.length-1]));
                x0 = Math.max(x0, 0);
                x1 = Math.min(x1, newwidth);
                // snap to boundaries
                return [x0, x1];
              }
            });

            // redraw rectangles on zoom
            oncoprint.selectAll("rect.cna")
              .attr('clip-path', 'url(#oncoprintAreaClip)')
              .attr("x",function(d){ return rescaleX(myGroups.indexOf(d.group)); })
              .attr("y",function(d){ return y(d.variable); })
              .attr('width', function(d) { return (rescaleX(myGroups.indexOf(d.group)+0.9)-rescaleX(myGroups.indexOf(d.group))); })
              .attr("height", function(d) { return y.bandwidth(); })
              .style("fill", function(d) {
                if(d.value in that.barColor){
                  return that.barColor[d.value];
                }else if(d.mutation === "heatmap"){
                  if (Number(d.value)) {
                    let offsetNum = (Number(d.value) - d.min) / d.max;
                    return d3.interpolateYlGn(offsetNum)
                  }else {
                    return "#878787"
                  }
                }else if(that.reverseTitleKeyLabel[d.variable] in that.numberSelect){
                  for(let i = 0;i<that.numberSelect[that.reverseTitleKeyLabel[d.variable]].length;i++){
                    let varInfo = that.numberSelect[that.reverseTitleKeyLabel[d.variable]][i];
                    if(varInfo.mark === '<='){
                      if (Number(d.value) <= Number(varInfo.num)) {return that.barColor["<=" + Number(varInfo.num)]}
                    }else if(varInfo.mark === '='){
                      if (Number(d.value) === Number(varInfo.num)) {return that.barColor["=" + Number(varInfo.num)]}
                    }else if(varInfo.mark === '>='){
                      if (Number(d.value) >= Number(varInfo.num)) {return that.barColor[">=" + Number(varInfo.num)]}
                    }else {
                      return "#878787"
                    }
                  }
                }else if(that.reverseTitleKeyLabel[d.variable] in that.numberDefine){
                  for(let i = 0;i<that.numberDefine[that.reverseTitleKeyLabel[d.variable]].length;i++){
                    let varInfo = that.numberDefine[that.reverseTitleKeyLabel[d.variable]][i];
                    if(varInfo.mark === '<='){
                      if (Number(d.value) <= Number(varInfo.num)) {return that.barColor["<=" + Number(varInfo.num)]}
                    }else if(varInfo.mark === '>'){
                      if (Number(d.value) > Number(varInfo.num)) {return that.barColor[">" + Number(varInfo.num)]}
                    }
                  }
                }else {
                  return "#878787"
                }
              })
            oncoprint.selectAll("rect.mut")
              .attr('clip-path', 'url(#oncoprintAreaClip)')
              .attr("x",function(d){ return rescaleX(myGroups.indexOf(d.group)); })
              .attr("y",function(d){ return y(d.variable); })
              .attr('width', function(d) { return (rescaleX(myGroups.indexOf(d.group)+0.9)-rescaleX(myGroups.indexOf(d.group))); })
              .attr("height", function(d) {
                if (d.mutation == "") { return 0 }
                else { return y.bandwidth()/3 }
              })
              .attr("transform", "translate(0," + y.bandwidth()/3 + ")")
              .style("fill", function(d) {
                if (d.mutation == "") {return "#transparent"}
                else if (d.mutation.match(/Fusion/) != null) {altcount[d.variable].Fusion += 1; return "#ffc125"}
                else { altcount[d.variable].Mutation += 1; return "#169e35" }
              })

            // zoom status
            /*svg.select(".zoom-status").remove()
            svg.append("text")
              .attr("class", "zoom-status")
              .attr("x", 25)
              .attr("y", 25)
              .attr("text-anchor", "left")
              .style("font-size", "0.9em")
              .style("fill", "#333;")
              .style("max-width", newwidth/2)
              .text("Zoom: " + Math.round(rescaleX(myGroups.length-1)/newwidth*10)/10 + "x");*/
          }

          // send the brushed selection to the DOM element on zoomend --
          function brushend() {
            if (selgrp.length) {
              // don't resend on zoom
              if (d3.event.sourceEvent.type == "zoom") return;
              //      Shiny.setInputValue("mutation-brush_selection", selgrp, {priority: "event"});
            }
          }
        }
      },
    }
  }
</script>

<style scoped>

</style>
