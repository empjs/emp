<template>
<div>
<button>{{textVal||'vue2 base button'}}</button>
</div>
</template>

<<script>
export default {
  name:'Button',
  props:{
    textVal:String
  }
}
</script>