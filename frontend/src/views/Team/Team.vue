<template>
    <section class="schedule">
        <div class="container">
            <div class="schedule__inner">
                <h2 class="title">Способы оплаты</h2>
                <table>
                    <thead>
                        <tr>
                            <td style="text-align: center;">Способ оплаты</td>
                            <td  >Описание</td>
                        </tr>
                    </thead>
                    <tbody>
                        <TeamItem v-for="(person, index) in team" :key = "index" :person="person"/>
                    </tbody>
                </table>
            </div>
        </div>
    </section>
  </template>
  
  <script>
    import axios from "axios";
    import TeamItem from "/src/components/TeamItem/TeamItem.vue";
    export default {
      components: {
        TeamItem,
      },
      data() {
        return {
          team: [],
        };
      },
      methods: {
        async getTeam() {
          try {
            const response = await axios.get("http://localhost:3000/schedules");
            this.team = response.data;
            console.log(this.team);
          } catch (error) {
            console.log(
              error,
              "Произошла ошибка при попытке взятия данных из таблицы Расписания"
            );
          }
        },
      },
      mounted() {
        this.getTeam();
      },
    };
    </script>