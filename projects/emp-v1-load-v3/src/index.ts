import {loadComponent} from './load'

;(async function () {
  // const comp = await loadComponent({url: `http://localhost:6001/emp.js`, scope: 'mfv3Host', module: './App'})
  const {default: comp} = await loadComponent({
    url: `https://172.29.100.170:8000/emp.js`,
    scope: 'astro_ui_zhuiwan_dating_emp_0_0_6',
    module: './MenuControl',
  })
  //   const comp = await loadComponent({
  //     url: `https://hd-activity-test.yy.com/pcyomi_widget2/emp18.js`,
  //     scope: 'pcyomi_widget_2',
  //     module: './src/shared/views/RoomInfoArea',
  //   })

  console.log('mf-v2-load-v3', comp.toString())
})()
