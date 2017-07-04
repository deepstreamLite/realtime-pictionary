const ds = require('../js/services/ds')


const record = ds.record.getRecord('state').whenReady((record) => {
  const WORD_LIST = [
    "airplane","laptop","baseball","bicycle",
      "bomb","bowtie","cake","cowboy",
      "door","frog","hockey","horse",
      "iPad","key","bulb","lightsaber","mailman","music",
      "nature","palace","park","photograph","pirate",
      "queen","round",
      "teapot","toast"
    ];
  record.set({
    words: WORD_LIST,
    drawer: null,
    users: [],
    messages: []
  })
})
