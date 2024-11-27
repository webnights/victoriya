<template>
    <tr class="schedule__row">
        <td class="main_col">{{person.NSL}}</td>
        <td>{{person.position}}</td>
    </tr>
  </template>
  
  <script>

  export default {
    props:{
        person:{
            type: Object,
            required: true,
        }
    },
  }
  </script>