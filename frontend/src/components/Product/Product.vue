<template>

    <div>
        <RouterLink class="product" :to = "`product/${product.id}`">
            <img :src="product.icon" alt="">
            <h6>{{product.name}}</h6>
        </RouterLink>
    </div>
       
    
</template>
<script>

    export default{
      props:{
        product:{
            type: Object,
            required: true
        }
      },
      computed: {
        productBackgroundStyle() {
            return {
                'background': `url(${this.product.image}) 0 0 / cover no-repeat`,
                'height': '250px',
                'width': '350px',
                
            };
        }
    }

    }
</script>
