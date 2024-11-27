<template>
  <section class="hero">
    <div class="container">
      <h1 class="title">О нас</h1>
      <div class="hero__inner">
        <div class="hero__content">
          <p>
            <strong>Туристическая фирма «Виктория» </strong>открылось в 2006
            году. За годы работы мы сформировали огромную, имеющую мало аналогов
            среди отечественных турфирм, базу частных коттеджей, турбаз,
            пансионатов, санаториев и отелей Подмосковья, Карелии, Селигера,
            Ленинградской области, Крыма и Краснодарского Края. <br /><br />
            Мы популяризуем отдых в России: будь то коммерческий туризм,
            активный, спортивный или «дикий». Мы призываем полюбить природу
            нашей страны, ее культурное и духовное наследие. Нашим другом и
            деловым партнером является Востоков Игорь Евгеньевич - президент
            Туристско-спортивного Союза России, и в том числе, благодаря ему
            (его рассказам о регионах России и огромному опыту спортивного,
            пешего и прочего организованного некоммерческого туризма), у нас
            есть возможность всячески рекламировать туристический потенциал
            нашей Родины от первого лица. На страницах данного сайта мы
            разместили подробную фотогалерею и текстовую информацию о Золотом
            Кольце России, Пскове, Казани, Санкт-Петербурге и Алтае. Но в наших
            планах «раскрыть» перед вами все регионы России.
            <br /><br />
            C 2011 года мы оформляем шенгеские визы в
            <em>Италию, Испанию, Грецию, Францию и Германию</em>. Также мы
            оформляем туристические и бизнес визы в Болгарию, а также визы для
            владельцев недвижимости.
            <br />
            У нас в базе множество предложений по горным лыжам в России: отели
            Домбая, Красной Поляны и Приэльбрусья (поляны Азау и Чегет). На
            Дальнем Востоке страны и в Сибири мы предлагаем активные туры по
            Алтаю, Байкалу, Сахалину, Камчатке и Курильским островам.
          </p>
          <RouterLink to="/products">
            <Button :content="'Посмотреть туры'" :type="'button'" />
          </RouterLink>
        </div>
        <Carousel :tourism = "tourism"/>
      </div>
    </div>
  </section>
</template>
<script>
import Button from "/src/components/Button/Button.vue";
import Carousel from "/src/components/Carousel/Carousel.vue";
export default {
  components: { Button, Carousel },
  methods: {
    scrollToBuses() {
      const busesSection = document.querySelector(".products");
      if (busesSection) {
        busesSection.scrollIntoView({ behavior: "smooth", alignToTop: true });
      }
    },
  },
  data() {
    return {
      tourism: [
        { id: 1, image: "/src/assets/images/buses_carousel/slider1.png" },
        { id: 2, image: "/src/assets/images/buses_carousel/slider2.png" },
        { id: 3, image: "/src/assets/images/buses_carousel/slider3.png" },
        { id: 4, image: "/src/assets/images/buses_carousel/slider4.png" },
      ],
    };
  },
};
</script>
