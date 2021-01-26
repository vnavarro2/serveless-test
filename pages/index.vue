<template>
  <div class="container">
    <div>
      <h3 class="title">
        Exchange Rate for {{base}}/{{currency}} at {{date}}
      </h3>

      <div class="controls">        
        <select v-model="base" @change="onBaseChange($event)">
          <option disabled value="">Please select one</option>
          <option v-for="rate in rates" :key="rate.currency">
            {{ rate.currency }}
          </option>
        </select>        
        <span> / </span>
        <select v-model="currency">
          <option disabled value="">Please select one</option>
          <option v-for="rate in rates" :key="rate.currency">
            {{ rate.currency }}
          </option>
        </select>
      </div>
        
      <div class="change">
        {{ change }} 
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      base: 'EUR',
      currency: 'USD',
      rates: [],      
      date: '',
    }
  },
  computed: {
    change: function () {
      // compute change
      const change = this.rates.find(r => r.currency === this.currency)
      return `1 ${this.base} = ${change ? change.rate : ''} ${this.currency}`
    }
  },
  async asyncData({ params, $http }) {
    const data = await $http.$get(`/.netlify/functions/load-exchange-data?base=EUR`)
    const date = data.date
    const rates = Object.keys(data.rates).map(key => {
      return {currency: key, rate: data.rates[key]}
    })
    // actually push the 1:1 base/currency rate
    rates.push({ currency: data.base, rate: 1})
  
    return { date, rates }
  },
  methods: {
    onBaseChange(event) {
      fetch(`/.netlify/functions/load-exchange-data?base=${event.target.value}`)
        .then(response => response.json())
        .then(data => {
          this.date = data.date
          this.rates = Object.keys(data.rates).map(key => {
            return {currency: key, rate: data.rates[key]}
          })
          if (!this.rates.find(r => r.currency === data.base)) {
            // actually push the 1:1 base/currency rate
            this.rates.push({ currency: data.base, rate: 1})
          }
          // console.log('we have new rates for', data.base)
        })
        .catch(error => {
          console.error('Error fetching exchange data', error)
        })
    },
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.controls {
  padding-top: 20px;
}
.change {
  padding-top: 20px;
}
</style>
