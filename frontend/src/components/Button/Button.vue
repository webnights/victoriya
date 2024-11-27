<template>
    <button :type = "type">{{content}}</button>
</template>
<script>
    export default{
        props:{
            content:{
                type: String,
                required: true
            },
            type:{
                type: String,
                required: true,
            }
        }
    }
</script>
