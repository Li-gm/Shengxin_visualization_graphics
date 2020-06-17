<template>
  <div>
    <div id="graph"></div>
  </div>
</template>

<script>
  let Plotly = require('plotly.js');
  export default {
    name: "Violin",
    data(){
      return{
        listData:[
          {
            'GROUP_SHORT':'Group_1',
            'Gene_Name':7.5161,
          },
          {
            'GROUP_SHORT':'Group_1',
            'Gene_Name':8.5161,
          },
          {
            'GROUP_SHORT':'Group_1',
            'Gene_Name':2.5161,
          },
          {
            'GROUP_SHORT':'Group_1',
            'Gene_Name':1.5161,
          },
          {
            'GROUP_SHORT':'Group_1',
            'Gene_Name':9.5161,
          },
          {
            'GROUP_SHORT':'Group_1',
            'Gene_Name':12.5161,
          },
          {
            'GROUP_SHORT':'Group_1',
            'Gene_Name':12.1,
          },
          {
            'GROUP_SHORT':'Group_1',
            'Gene_Name':7.51,
          },
          {
            'GROUP_SHORT':'Group_1',
            'Gene_Name':37.5,
          },
          {
            'GROUP_SHORT':'Group_1',
            'Gene_Name':17.2,
          },
          {
            'GROUP_SHORT':'Group_1',
            'Gene_Name':17.56,
          },

          {
            'GROUP_SHORT':'Group_2',
            'Gene_Name':7.5161,
          },
          {
            'GROUP_SHORT':'Group_2',
            'Gene_Name':8.5161,
          },
          {
            'GROUP_SHORT':'Group_2',
            'Gene_Name':12.5161,
          },
          {
            'GROUP_SHORT':'Group_2',
            'Gene_Name':1.5161,
          },
          {
            'GROUP_SHORT':'Group_2',
            'Gene_Name':19.5161,
          },
          {
            'GROUP_SHORT':'Group_2',
            'Gene_Name':12.5161,
          },
          {
            'GROUP_SHORT':'Group_2',
            'Gene_Name':12.1,
          },
          {
            'GROUP_SHORT':'Group_2',
            'Gene_Name':17.51,
          },
          {
            'GROUP_SHORT':'Group_2',
            'Gene_Name':47.5,
          },
          {
            'GROUP_SHORT':'Group_2',
            'Gene_Name':17.2,
          },
          {
            'GROUP_SHORT':'Group_2',
            'Gene_Name':17.56,
          },
        ]
      }
    },
    mounted(){
      this.initViolin(this.listData)
    },
    methods:{
      /*小提琴图插件展示*/
      initViolin(dataList){
        let rows = dataList;
        function unpack(rows, key) {
          return rows.map(function(row) { return row[key]; });
        }
        let data = [{
          type: 'violin',
          //x0: nameGroup1,
          x: unpack(rows, 'GROUP_SHORT'),
          y: unpack(rows, 'Gene_Name'),
          points: 'none',
          //hoverinfo: 'skip',//hover不显示数据信息
          box: {
            visible: true
          },
          line: {
            color: '#1f77b4',
          },
          showlegend: true,
          /*fillcolor: 'cornflowerblue',
          opacity: 0.6,*/
          meanline: {
            visible: true
          },
          transforms: [{
            type: 'groupby',
            groups: unpack(rows, 'GROUP_SHORT'),
            styles: [
              {target: 'Group_1', value: {line: {color: "#1f77b4"}}},
              {target: 'Group_2', value: {line: {color: "#ff7f0d"}}},
            ],
          }],
        }]

        let layout = {
          title: "title",
          xaxis: {
            title: {
            },
          },
          yaxis: {
            zeroline: false,
            title: {
              text: ''
            },
          },
          //height: 800
        }

        Plotly.newPlot('graph', data, layout, {showSendToCloud: false});
      },
    }
  }
</script>

<style scoped>

</style>
