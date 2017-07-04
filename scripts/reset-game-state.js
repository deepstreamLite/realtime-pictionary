const ds = require('../js/services/ds')


const record = ds.record.getRecord('state').whenReady((record) => {
  record.set({})
})
